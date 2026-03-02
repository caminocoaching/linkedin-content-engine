// ═══════════════════════════════════════════════════════════════
// ⭐ REVIEW SCANNER — Weekly Trustpilot Review Monitor
// Scans for fresh reviews, mines language patterns, surfaces
// new client stories for the content engine.
// ═══════════════════════════════════════════════════════════════

const REVIEW_STORAGE_KEY = 'camino-review-scanner';
const TRUSTPILOT_URL = 'https://uk.trustpilot.com/review/caminocoaching.co.uk';
const SCAN_INTERVAL_DAYS = 7;

// ─── Storage ─────────────────────────────────────────────────
function loadReviewData() {
    try {
        const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.warn('Failed to load review data:', e);
    }
    return {
        lastScanDate: null,
        totalReviews: 84,
        reviewTitles: [],       // Array of known review titles (dedup key)
        newReviews: [],         // Unprocessed new reviews
        approvedPatterns: [],   // Patterns Craig has approved
        scanHistory: []         // Log of scans
    };
}

function saveReviewData(data) {
    try {
        localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save review data:', e);
    }
}

// ─── Check if scan is due ────────────────────────────────────
export function isScanDue() {
    const data = loadReviewData();
    if (!data.lastScanDate) return true;
    const lastScan = new Date(data.lastScanDate);
    const now = new Date();
    const daysSince = (now - lastScan) / (1000 * 60 * 60 * 24);
    return daysSince >= SCAN_INTERVAL_DAYS;
}

export function getLastScanInfo() {
    const data = loadReviewData();
    return {
        lastScanDate: data.lastScanDate,
        totalReviews: data.totalReviews,
        newReviewCount: data.newReviews.length,
        scanHistory: data.scanHistory,
        isDue: isScanDue()
    };
}

export function getNewReviews() {
    const data = loadReviewData();
    return data.newReviews || [];
}

export function getApprovedPatterns() {
    const data = loadReviewData();
    return data.approvedPatterns || [];
}

// ─── Scan Trustpilot via OpenAI Web Search ───────────────────
export async function scanForNewReviews(apiKey) {
    if (!apiKey) {
        throw new Error('OpenAI API key required for review scanning.');
    }

    const data = loadReviewData();
    const knownTitles = data.reviewTitles || [];

    const prompt = `Go to ${TRUSTPILOT_URL} and extract ALL reviews from the first 2 pages.

For each review, extract:
1. reviewerName: The reviewer's display name
2. reviewTitle: The review headline/title
3. reviewText: The full review text (complete, not truncated)
4. country: The reviewer's country code (e.g. GB, US, NZ)
5. rating: The star rating (likely all 5-star)

IMPORTANT: Extract EVERY review you can find across pages 1 and 2 (up to 40 reviews). Be thorough.

Return a JSON object:
{
  "totalReviewCount": <number shown on the page as total>,
  "reviews": [
    {
      "reviewerName": "Name",
      "reviewTitle": "Title of review",
      "reviewText": "Full review text...",
      "country": "GB",
      "rating": 5
    }
  ]
}

Return ONLY the JSON object. No explanation.`;

    try {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                tools: [{ type: 'web_search_preview' }],
                input: prompt
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `API returned ${response.status}`);
        }

        const result = await response.json();

        // Extract text content from responses API
        let content = '';
        if (result.output && Array.isArray(result.output)) {
            for (const item of result.output) {
                if (item.type === 'message' && item.content) {
                    for (const part of item.content) {
                        if (part.type === 'output_text') {
                            content += part.text;
                        }
                    }
                }
            }
        }

        content = content.trim();
        if (!content) throw new Error('No response content from review scan.');

        // Parse JSON from response
        let parsed;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
        } catch (e) {
            throw new Error('Failed to parse review scan results.');
        }

        const scannedReviews = parsed.reviews || [];
        const newTotalCount = parsed.totalReviewCount || scannedReviews.length;

        // Find new reviews by comparing titles
        const freshReviews = scannedReviews.filter(review => {
            const title = review.reviewTitle?.trim().toLowerCase();
            return title && !knownTitles.includes(title);
        });

        // Update stored data
        const allTitles = [
            ...knownTitles,
            ...freshReviews.map(r => r.reviewTitle?.trim().toLowerCase())
        ];

        // Also add any scanned reviews we haven't seen
        const existingSet = new Set(knownTitles);
        for (const review of scannedReviews) {
            const title = review.reviewTitle?.trim().toLowerCase();
            if (title && !existingSet.has(title)) {
                existingSet.add(title);
            }
        }

        data.lastScanDate = new Date().toISOString();
        data.totalReviews = newTotalCount;
        data.reviewTitles = [...existingSet];
        data.newReviews = [...(data.newReviews || []), ...freshReviews];
        data.scanHistory.push({
            date: new Date().toISOString(),
            totalFound: scannedReviews.length,
            newFound: freshReviews.length,
            totalOnPlatform: newTotalCount
        });

        // Keep only last 20 scan history entries
        if (data.scanHistory.length > 20) {
            data.scanHistory = data.scanHistory.slice(-20);
        }

        saveReviewData(data);

        return {
            totalScanned: scannedReviews.length,
            newFound: freshReviews.length,
            freshReviews,
            totalOnPlatform: newTotalCount
        };

    } catch (err) {
        // Log the failed scan attempt
        data.scanHistory.push({
            date: new Date().toISOString(),
            error: err.message,
            totalFound: 0,
            newFound: 0
        });
        saveReviewData(data);
        throw err;
    }
}

// ─── Mine a new review for language patterns via AI ──────────
export async function mineReviewForPatterns(review, apiKey) {
    if (!apiKey) throw new Error('OpenAI API key required.');

    const prompt = `Analyse this client review and extract a language pattern for use in LinkedIn content creation for business leaders.

REVIEWER: ${review.reviewerName} (${review.country})
TITLE: ${review.reviewTitle}
REVIEW: ${review.reviewText}

Extract:
1. pattern: A 2-4 word name for the thought pattern (e.g. "False Attribution", "Breakthrough After Plateau")
2. clientPhrase: The most powerful sentence from the review (exact or near-exact quote)
3. businessMirror: Rewrite that insight as if speaking to a CEO/founder/C-suite executive about their business performance. Keep the emotional structure but change the context from motorsport to business.
4. useFor: One sentence describing which type of LinkedIn post this pattern is best suited for.
5. caseStudySetup: If this review contains enough detail for an anonymised case study, write a 1-2 sentence setup (no names, changed details). Otherwise null.
6. caseStudyTransformation: The transformation part of the case study. Otherwise null.
7. caseStudyBridge: The business bridge for the case study. Otherwise null.

Return a JSON object:
{
  "pattern": "...",
  "clientPhrase": "...",
  "businessMirror": "...",
  "useFor": "...",
  "caseStudySetup": "..." or null,
  "caseStudyTransformation": "..." or null,
  "caseStudyBridge": "..." or null
}

Return ONLY the JSON object.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.4,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API returned ${response.status}`);
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || '';

    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error('Failed to parse mined pattern.');
    }
}

// ─── Approve a new review pattern ────────────────────────────
export function approveReviewPattern(reviewIndex, pattern) {
    const data = loadReviewData();
    if (!data.newReviews[reviewIndex]) return false;

    const review = data.newReviews[reviewIndex];

    data.approvedPatterns.push({
        id: `pattern-${Date.now()}`,
        pattern: pattern.pattern,
        clientPhrase: pattern.clientPhrase,
        businessMirror: pattern.businessMirror,
        useFor: pattern.useFor,
        source: review.reviewerName,
        approvedDate: new Date().toISOString(),
        caseStudy: pattern.caseStudySetup ? {
            setup: pattern.caseStudySetup,
            transformation: pattern.caseStudyTransformation,
            businessBridge: pattern.caseStudyBridge
        } : null
    });

    // Remove from new reviews
    data.newReviews.splice(reviewIndex, 1);
    saveReviewData(data);
    return true;
}

// ─── Dismiss a new review (mark as seen, not useful) ─────────
export function dismissReview(reviewIndex) {
    const data = loadReviewData();
    if (data.newReviews[reviewIndex]) {
        data.newReviews.splice(reviewIndex, 1);
        saveReviewData(data);
    }
}

// ─── Seed initial review titles (so first scan doesn't flag all as new) ──
export function seedKnownReviews() {
    const data = loadReviewData();
    if (data.reviewTitles.length > 0) return; // Already seeded

    // These are the review titles we already scraped and processed
    data.reviewTitles = [
        "getting your mind ready to compete is priceless",
        "brillant so far",
        "i've been working with camino coaching…",
        "this is the real deal",
        "camino coaching guided me through the…",
        "each step of the module was easy to…",
        "camino coaching's high performance flow course is phenomenal",
        "camino coaching is awesome!",
        "incredible platform",
        "camino coaching is a game changer",
        "excellent material and delivered in an …",
        "i've been in this company for over 2…",
        "camino coaching",
        "helps a lot to focus on small things…",
        "craig taught me to be the better version of me",
        "its not just race day! wining is built not bought.",
        "not having fun at the track any more?",
        "i had the pleasure of meeting craig two…",
        "a great course",
        "really enjoyed working with craig…",
        "craig was very up to date on if i was i…",
        "it's been amazing!",
        "great experience",
        "simply stated camino coaching…",
        "transformed my way of thinking",
        "camino coaching is a great program and…",
        "excellent - next level information",
        "craig is always available to take a…",
        "superb mindset coaching",
        "the best investment",
        "really well structured course",
        "prepare yourself for your track day",
        "pleasure to work with and very professional",
        "great what the course done for my lad…",
        "excellent course all round!",
        "this course is great and well worth the…",
        "great training",
        "there's a saying that racing is 90%…",
        "transformational.",
        "a brilliant course if your serious…",
        "i have recently completed the…",
        "performance principles has made my…",
        "great course - improve your performance!",
        "camino coaching for racers who want to be better",
        "the right tools for racing success",
        "performance principles 3.0",
        "great course to do to push your racing…",
        "the performance principles course from…",
        "really enjoyed the course",
        "professional coaching- highly recommend",
        "massively beneficial",
        "the most valuable investment!",
        "performance principles changed my approach",
        "really helpful and make you think…",
        "a real performance upgrade",
        "craig provides the missing link we always hear about, but no one ever really addresses...",
        "life changing course",
        "unlocking parts of my brain to help me…",
        "we know that the brain has got way more…"
    ];
    data.lastScanDate = new Date().toISOString();
    data.totalReviews = 84;
    saveReviewData(data);
}
