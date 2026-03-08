// ═══════════════════════════════════════════════════════════════
// ⚡ BUSINESS LEADERS LINKEDIN ENGINE — AI Service
// Gemini (Research) + Claude (Writing) + HeyGen (Video)
// LinkedIn posts for Business Leaders & CEOs
// CTA: Free Winning Formula Assessment
// ═══════════════════════════════════════════════════════════════

import {
    PILLARS, FRAMEWORKS, CTAS, AUTHORITY_LINES, LEXICON, MECHANISMS,
    MOTORSPORT_BRIDGES, CASE_STUDIES, LEADER_INSIGHTS, HOOKS,
    WINNING_FORMULA_PILLARS, FUNNEL, WEEKLY_SCHEDULE, CAMPAIGN_ARC,
    VISUAL_TYPES, NEUROCHEMICAL_REFERENCE,
    getSeasonalContext
} from './content-engine.js';

import {
    REVIEW_STATS, QUOTED_HOOKS, OBJECTION_KILLERS, REVIEW_AUTHORITY_LINES,
    getHookForPillar, formatQuotedHook, getReviewAuthorityLine
} from './review-bank.js';

import {
    NEUROCHEMICALS, FLOW_COCKTAIL, VIDEO_SCRIPT_TEMPLATE, SLIDE_DECK_SPECS,
    HEYGEN_SPECS, WEEKLY_VIDEO_SCHEDULE, VIDEO_TOPICS,
    getChemical, buildVideoScriptContext
} from './neurochemistry.js';

// ─── Master System Prompt (Business Leaders LinkedIn) ────────
// Source: AI_Content_Engine_Business_Leaders.docx — Data-Driven Operational Brief
const SYSTEM_PROMPT = `You are Craig Muirhead's LinkedIn content strategist. You generate daily LinkedIn posts for business leaders and CEOs that deliver genuine value and include an unrelated CTA to the Winning Formula Assessment.

# ABOUT CRAIG MUIRHEAD & CAMINO COACHING
- 59-year-old flow performance coach based in Mallorca, Spain
- 25 years in corporate management (BMW Dubai, Swiss private equity, business ownership across 4 industries)
- 10 seasons embedded in elite motorsport paddocks (MotoGP, WorldSBK, BSB, Moto3, MotoE, F1, F4, GB3) — applies the mental performance principles from sport to business
- Proprietary 'In The Zone' app: 2,358 debriefs, 100+ circuits worldwide, 60 months of data
- Real data: 808 personal bests, 438 podiums, 159 race wins tracked
- 4.9/5 across 85 reviews (100% five-star)
- Works with CEOs, founders, and senior leaders running £1M-£50M businesses
- Authority: pattern recognition and data analysis from elite sport, applied to business performance
- Has worked with riders in MotoGP, BSB, and World Championships — uses these stories as BRIDGES to business insights
- IMPORTANT: Rotate credibility claims. NEVER use the same stat in every post.

# TARGET AUDIENCE
Craig's LinkedIn audience is business leaders, CEOs, and founders:
- CEOs and MDs running £1M-£50M businesses
- Founders scaling from startup to mature operations
- Senior leaders in corporate environments (VP, C-suite, directors)
- Entrepreneurs who have hit a performance plateau
- Business leaders who suspect they are operating below their cognitive potential
- Leaders who are overworked, always-on, and burning out
- Age range: 35-60, male and female
- UK and Europe primarily, also global
- They make 35,000+ decisions per day
- They spend more time firefighting than strategising

# PLATFORM: LINKEDIN
- Professional tone but NOT corporate jargon
- Long-form text posts perform best (200-400 words + CTA)
- Optimise for DWELL TIME and SAVES (drives LinkedIn algorithm)
- Document/carousel posts get highest engagement
- No hashtag spam — use 3-5 targeted tags maximum
- First line is the hook — must stop the scroll

# THE 7 CONTENT PILLARS
1. HIDDEN COST — The cost, risk, or damage of a specific leadership behaviour. ONE problem post per week maximum.
2. BRAIN BREAKTHROUGH — Positive neuroscience discovery that opens new possibilities. Wonder, not warning.
3. HUMAN ACHIEVEMENT — Famous founders, athletes, leaders with neuroscience-backed explanations of their greatness.
4. CAMINO DATA INSIGHT — Proprietary data from 2,358 debriefs applied to business. Nobody else has this data.
5. THE POSITIVE EDGE — Research showing what high performers DO differently. Lead with possibility.
6. THE TOOL — One specific, actionable technique backed by data. Give the tool, hold back the full system.
7. WINNING WAYS — Household names whose specific habits can be explained through neuroscience for business application.

# THE WINNING POST FORMULA (5-Step Architecture)
## Step 1: THE HOOK (First Line)
This is the ONLY line that matters for reach. Proven hook patterns:
- Research/Data Hook: "They tracked 2,358 performance sessions over 60 months..."
- Celebrity Bridge Hook: "[Famous person] does something before every high-pressure moment that most CEOs would dismiss..."
- Relatable Pain Hook: "You are in back-to-back meetings. By 3pm your brain physically cannot process one more decision..."
- Provocative Challenge Hook: "The most expensive habit in corporate leadership costs nothing and happens 56 times per day..."
- Motorsport Bridge Hook: "In Formula 1, pit crews make 80 decisions in 2.4 seconds. They do not think harder. They think less. The parallel to your boardroom is exact."

## Step 2: THE PROBLEM (Next 2-3 Sentences)
Ground it in a SPECIFIC business scenario. Use job titles, meeting contexts, decision moments. Never generic.

## Step 3: THE NEUROSCIENCE (Core Teaching)
Explain WHY this happens in the brain. Reference the mechanism (cortisol, dopamine, prefrontal cortex, cognitive load). Use plain language. Cite data where possible. WOW not HOW: reveal the what and the why, NEVER the specific fix.

## Step 4: THE BRIDGE (Connection to Leader)
Show how this pattern appears at every level. Reference real results or anonymised client patterns. Make the reader feel seen. Use motorsport as the BRIDGE — connect something from the racing world to the business world.

## Step 5: THE CTA
Separated from value content by a line break and visual separator (··). "Oh, by the way" energy. CTA is ALWAYS unrelated to the post topic. Links to the Winning Formula Assessment.

# VOICE & TONE (Mandatory Rules — Non-Negotiable)
- UK English spelling throughout (colour, analyse, programme, favourite)
- Warm, direct, confident. Like a trusted advisor talking to a peer.
- Never preachy. Never motivational-poster language. Never "you have got this" or "believe in yourself."
- Data-led and evidence-based. Every claim backed by numbers or named examples.
- Slightly provocative. Challenge assumptions. Make the reader question what they think they know.
- MOTORSPORT BRIDGES: Use motorsport as a BRIDGE to business insights. This is the unique differentiator. The reader should think "wait, that racing insight applies to MY boardroom."
- NEVER use em dashes, en dashes, or GPT-style formatting in post body.
- NEVER use ** or any markdown formatting in post body.
- No emojis in the value section. Occasional use in CTA is acceptable.
- No bullet point symbols in post body.
- Short paragraphs (1-2 sentences), mobile-first formatting.
- Post length: 200-400 words value content + CTA.
- First line is the hook. Must stop the scroll with a SPECIFIC data point or dramatic scenario.

# WEEKLY CONTENT BALANCE
The weekly mix is rebalanced to feel energising, not diagnostic:
- Monday: HIDDEN COST (Scary) — ONE problem post. The cost of a specific leadership behaviour.
- Tuesday: BRAIN BREAKTHROUGH (Strange) — Neuroscience discovery. Wonder, possibility.
- Wednesday: HUMAN ACHIEVEMENT (Familiar) — Famous figure + neuroscience. Aspiration.
- Thursday: CAMINO DATA INSIGHT (Strange/Sexy) — Proprietary data. Credibility.
- Friday: THE POSITIVE EDGE (Sexy) — What high performers do differently. Desire.
- Saturday: THE TOOL (Free Value) — One actionable technique. Empowerment.
- Sunday: WINNING WAYS (Familiar) — Household name + neuroscience. Confidence.
Balance: 1 pain/cost (Mon), 6 positive/possibility.

# CONTENT RULES
- WOW not HOW: Reveal what the problem is and why it happens (neuroscience). NEVER give the specific fix or methodology.
- Never use generic coaching language: "mindset shift", "unlock your potential", "be your best self", "level up".
- Every post must reference a specific business scenario (meeting type, decision context, time of day, energy level).
- Use real data: 2,358 debriefs, 808 PBs, 438 podiums, 159 wins, 155 racers, 100+ circuits, 60 months, 4.9/5 across 85 reviews.
- ROTATE credibility claims. Never use the same stat in consecutive posts.

# THE CTA — WINNING FORMULA ASSESSMENT
Primary CTA: "Oh, by the way. I have built a free leadership performance assessment that scores you across the 5 pillars elite performers use to stay in flow under pressure. 25 questions. 3 minutes. Instant personalised report. → Take the Winning Formula assessment here: https://caminocoaching.co.uk/leader-assessment"
The 5 pillars: Clarity Under Pressure, Focus & Flow, Execution Rhythm, Feedback & Debrief Loops, Influence & Culture.

# FUNNEL CONTEXT
LinkedIn Post > Winning Formula Assessment (25 questions, 3 minutes, instant report) > Executive Flow Blueprint (3-day free training, 3x/year) > Championship Strategy Call (free, 45 min, 1-on-1) > P1 Programme (£4,000, 43% close rate)
TARGET: 10 people into the free training per month.

# REVIEW CONTENT PLAYBOOK RULES
- NEVER post a review as the entire content of a post. Reviews without a teaching hook get buried.
- NEVER fabricate, paraphrase, or embellish a review. Use exact quotes or do not quote at all.
- NEVER use more than one review quote per post.
- Use review quotes in the CTA bridge section to pre-handle objections naturally.
- Trustpilot link: https://uk.trustpilot.com/review/caminocoaching.co.uk

# CONTENT THE AI MUST NEVER CREATE (Dead Zone Rules)
- Self-promotional announcements without value
- Testimonial-only posts without a teaching hook
- Follow-up or sequence posts that assume the reader saw yesterday's content
- Generic motivational content that could apply to any coach
- Posts about the programme, pricing, or logistics
- Pure neuroscience explainers without a business-specific anchor

# LINKEDIN 2026 BEST PRACTICES
## High-Value Signals
DWELL TIME: Write for 30+ seconds of reading. Deep insight, not surface advice.
SAVES: Content that leaders bookmark. Specific data, actionable takeaways.
COMMENTS: End with questions that require multi-sentence replies, not yes/no.
Short paragraphs, line breaks, mobile-optimised formatting.
First line is the hook. Must stop the scroll with a SPECIFIC data point.

## Low-Value Signals (avoid these)
NEVER: "Like if you agree" / "Share with someone" / "Tag a friend" / "Follow for more"
NEVER: Generic motivation or "you can do it" energy`;


// ─── Generate Article Topics with Web Search (Weekly Wizard Step 1) ──
export async function generateTopics(pillars, seasonalContext, apiKey) {

    const daySlots = WEEKLY_SCHEDULE.map((slot, i) => {
        return `${slot.day}: ${slot.contentType} — ${slot.dayBrief}\nSEARCH FOCUS: ${slot.searchFocus}\nSEARCH MANDATE: ${slot.searchMandate}`;
    });

    const seasonNote = seasonalContext
        ? `Season context: ${seasonalContext.season} — ${seasonalContext.context}`
        : '';

    const prompt = `Search the web for 7 stories from the last 7-30 days for a business leadership mental performance coach's LinkedIn. The audience is CEOs, founders, and senior leaders running £1M-£50M businesses.

TARGET SOURCES: Harvard Business Review, McKinsey Quarterly, Financial Times, The Economist, Nature, Science, Stanford GSB, MIT Sloan, Wall Street Journal, Forbes, Wired, TED, BBC World.
ALSO WELCOME: Neuroscience journals, sports psychology studies, biohacking research, sleep science, performance technology, elite athlete stories.

WEARABLE TECH & BIOMETRICS (actively search these):
- WHOOP: HRV studies, strain tracking, recovery science, sleep coaching data, CEO/founder performance case studies, Whoop Journal correlations
- OURA RING: Sleep architecture research, readiness scores, circadian rhythm insights, temperature tracking, executive health studies
- APPLE WATCH: Health feature innovations, heart rate variability research, mindfulness features, blood oxygen studies, fall detection/safety data, executive wellness programmes
- GARMIN: Body Battery energy monitoring, stress tracking, training load data, endurance athlete insights that bridge to executive stamina, advanced sleep/HRV metrics
- GOPRO: Peak performance documentation, flow state capture in extreme sport, first-person perspective training, adventure athlete mental preparation
- GENERAL WEARABLES: Any new study linking wearable biometric data to cognitive performance, decision quality, leadership stamina, or executive burnout prevention

${seasonNote}

Find one story for each slot:
${daySlots.map((d, i) => `${i + 1}. ${d}`).join('\n\n')}

RULES:
- Every headline must connect to the MENTAL PERFORMANCE or NEUROCHEMISTRY side of leadership
- Use BUSINESS language: CEO, boardroom, strategic decision, quarterly review, board meeting, executive team, founder, scaling
- Related topics are welcome: neuroscience, peak performance, biometrics (HRV, EEG, wearables, sleep tracking), elite sport (as a BRIDGE to business), technology, brain science
- WEARABLE DATA stories are HIGHLY VALUED: new studies from Whoop, Oura, Apple Watch, Garmin showing how biometric tracking improves decision-making, recovery, sleep, or prevents burnout in leaders
- At least 1 story per week should reference wearable tech, health tracking data, or biometric research where possible
- At least 2 stories should include SPECIFIC data points or research findings
- MOTORSPORT BRIDGES: Where relevant, use motorsport as a bridge to business (e.g., "F1 pit crews make 80 decisions in 2.4 seconds — here is the boardroom parallel"). F1 drivers use biometric wearables extensively — this is a natural bridge topic.
- Thursday MUST use Craig's proprietary data (2,358 debriefs, 808 PBs, etc.) — do NOT search externally for this slot

Return a JSON array with 7 objects:
[
  {
    "pillarId": "${pillars[0]?.id || 'hidden-cost'}",
    "headline": "Compelling headline connecting the story to leadership mental performance",
    "sourceArticle": "Article title — Publication",
    "articleUrl": "URL",
    "talkingPoints": ["Point 1", "Point 2", "Point 3"],
    "emotionalHook": "What should the business leader feel?",
    "mechanism": "Neuroscience mechanism or brain chemical referenced",
    "businessRelevance": "One sentence connecting to business leadership",
    "contentBrief": "Type of post"
  }
]

Return ONLY the JSON array with exactly 7 items.`;

    return await callGeminiWithSearch(prompt, apiKey, true);
}


// ─── Generate a Single Post ──────────────────────────────────
export async function generatePost({ topic, pillar, framework, cta, authorityLine, motorsportBridge, apiKey, campaignDay = null, scheduleDay = null }) {

    const campaignNote = campaignDay
        ? `\nCAMPAIGN POSITION: This is ${campaignDay.day} — Purpose: ${campaignDay.purpose}. Target emotion: ${campaignDay.emotion}. Word count: ${campaignDay.wordCount}.`
        : '';

    // Visual format guidance from schedule
    const vf = scheduleDay?.visualType ? VISUAL_TYPES[scheduleDay.visualType] : null;
    const platformNote = scheduleDay
        ? `\nCONTENT TYPE: ${scheduleDay.contentType}
POST FORMAT: ${scheduleDay.postFormat}
VISUAL TYPE: ${scheduleDay.visualType}
${vf ? `VISUAL GUIDANCE: ${vf.name} — ${vf.description}\nIMAGE NOTE: ${vf.guidance}` : ''}`
        : '';

    // Chemical context
    const chemNote = scheduleDay?.primaryChemical && scheduleDay.primaryChemical !== 'match' && scheduleDay.primaryChemical !== 'rotate'
        ? `\nPRIMARY CHEMICAL: ${scheduleDay.primaryChemical} — Reference this brain chemical in the neuroscience section. Name it explicitly.`
        : scheduleDay?.primaryChemical === 'match'
            ? '\nCHEMICAL: Match the chemical to the topic. Name the most relevant brain chemical explicitly in the post.'
            : '\nCHEMICAL: Rotate through the 6 chemicals (cortisol, dopamine, serotonin, oxytocin, testosterone, endorphins). Name one explicitly.';

    const prompt = `Write a LinkedIn post for Craig Muirhead / Camino Coaching using these parameters:

CONTENT PILLAR: ${pillar.name} — ${pillar.description}
${pillar.dataPoints ? `DATA POINTS: ${pillar.dataPoints}` : ''}
${pillar.angles ? `ANGLES: ${pillar.angles.join(', ')}` : ''}
FRAMEWORK: ${framework.name} — ${framework.hookStyle}
TOPIC / ANGLE: ${typeof topic === 'string' ? topic : topic.headline || topic}
${topic.talkingPoints ? `KEY POINTS: ${topic.talkingPoints.join(', ')}` : ''}
${topic.mechanism ? `MECHANISM TO REFERENCE: ${topic.mechanism}` : ''}
${topic.sourceArticle ? `SOURCE ARTICLE: ${topic.sourceArticle}` : ''}
${topic.businessRelevance ? `BUSINESS RELEVANCE: ${topic.businessRelevance}` : ''}
${platformNote}
${chemNote}

AUTHORITY LINE TO WEAVE IN NATURALLY:
"${authorityLine}"

${motorsportBridge ? `MOTORSPORT BRIDGE TO WEAVE IN:\n"${motorsportBridge}"` : ''}

${(() => {
            const reviewHook = getHookForPillar(pillar.id);
            if (reviewHook) {
                return `OPTIONAL REVIEW HOOK (use if it fits naturally, approximately 1 in 4 posts):
Reviewer: ${reviewHook.reviewer} (${reviewHook.country}, ${reviewHook.date})
Quote: "${reviewHook.quote}"
Hook angle: ${reviewHook.hookAngle}
`;
            }
            return '';
        })()}
OBJECTION-KILLING REVIEW OPTION (use naturally in CTA bridge section if relevant):
"${OBJECTION_KILLERS.triedEverything[Math.floor(Math.random() * OBJECTION_KILLERS.triedEverything.length)].quote}" - ${OBJECTION_KILLERS.triedEverything[Math.floor(Math.random() * OBJECTION_KILLERS.triedEverything.length)].reviewer}

REVIEW AUTHORITY ANCHOR (can be added to CTA section for reinforcement):
${getReviewAuthorityLine()}

CTA TO APPEND (after ·· separator, completely unrelated to post body):
${cta.ctaTemplate}
${campaignNote}

THE 5-STEP WINNING FORMULA (follow this architecture):
1. HOOK (First Line): Start with a specific data point, research finding, or dramatic business scenario. This is the ONLY line that matters for reach.
2. PROBLEM (Next 2-3 sentences): Ground it in a SPECIFIC business scenario. Use job titles, meeting contexts, decision moments. Never generic.
3. NEUROSCIENCE (Core Teaching): Explain WHY this happens in the brain. Reference the mechanism and name the chemical. Use plain language. Cite data. WOW not HOW.
4. BRIDGE (Connection to Leader): Show how this pattern appears at every level. Use a motorsport bridge where natural. Make the reader feel seen.
5. CTA (Separated): After ·· separator. "Oh, by the way" or "Completely unrelated" or "PS". "With or without you" energy.

RULES (Business Leaders LinkedIn format):
- UK English spelling throughout (colour, analyse, programme, favourite)
- WOW not HOW: Reveal the problem and why it happens. NEVER give the specific fix or methodology.
- Every post must reference a specific business scenario (meeting type, decision context, time of day, energy level)
- Use real data: 2,358 debriefs, 808 PBs, 438 podiums, 159 wins, 155 racers, 100+ circuits, 60 months, 4.9/5 across 85 reviews
- NAME the brain chemical explicitly (cortisol, dopamine, serotonin, oxytocin, testosterone, endorphins)
- MOTORSPORT BRIDGE: Where natural, use a racing analogy to make the business point land harder
- NEVER use em dashes or en dashes. Use commas or full stops instead.
- NEVER use ** or bullet symbols in the post body
- No emojis in the value section. Occasional use in CTA is acceptable.
- NEVER use generic coaching language: "mindset shift", "unlock your potential", "be your best self", "level up"
- Short paragraphs (1-2 sentences), mobile-first formatting
- End with an engagement question that drives comments ("When was the last time you noticed this?")

LINKEDIN VERSION:
- 200-400 words value content + CTA
- Long-form text. Optimise for DWELL TIME and SAVES.
- Direct link to Winning Formula assessment in CTA.
- Include 3-5 professional hashtags at the end (#Leadership #CEO #MentalPerformance #FlowState #ExecutiveCoaching)

DEAD ZONE RULES (never create these):
- No self-promotional announcements without value
- No testimonial-only posts without a teaching hook
- No sequence posts that assume the reader saw yesterday's content
- No generic motivational content that could apply to any coach
- No pure neuroscience explainers without a business-specific anchor

Format your response as:
=== LINKEDIN POST ===
[LinkedIn post text here]

=== IMAGE TEXT ===
[Suggest 1-2 lines of text for the image (max 12 words). This is for a bold data card visual. Use the hook data point or most powerful stat from the post.]`;

    return await callClaude(prompt, apiKey, false);
}

// ─── Generate Multiple Posts in Parallel ──────────────────────
export async function generatePosts(topics, config) {
    const { pillars, frameworks, ctas, authorityLines, motorsportBridges, apiKey, campaignDays } = config;

    const promises = topics.map((topic, i) => {
        return generatePost({
            topic,
            pillar: pillars[i],
            framework: frameworks[i],
            cta: ctas[i],
            authorityLine: authorityLines[i],
            motorsportBridge: motorsportBridges ? motorsportBridges[i] : null,
            apiKey,
            campaignDay: campaignDays ? campaignDays[i] : null,
            scheduleDay: WEEKLY_SCHEDULE[i] || null
        });
    });

    const results = await Promise.allSettled(promises);

    return results.map((result, i) => ({
        id: `post-${Date.now()}-${i}`,
        content: result.status === 'fulfilled' ? result.value : `Error generating post: ${result.reason}`,
        pillar: pillars[i],
        framework: frameworks[i],
        cta: ctas[i],
        authorityLine: authorityLines[i],
        motorsportBridge: motorsportBridges ? motorsportBridges[i] : null,
        topic: topics[i],
        status: result.status,
        imageUrl: '',
        edited: false,
        campaignDay: campaignDays ? campaignDays[i] : null
    }));
}

// ─── Regenerate a Single Post ─────────────────────────────────
export async function regeneratePost(post, apiKey) {
    const newContent = await generatePost({
        topic: post.topic,
        pillar: post.pillar,
        framework: post.framework,
        cta: post.cta,
        authorityLine: post.authorityLine,
        motorsportBridge: post.motorsportBridge,
        apiKey,
        campaignDay: post.campaignDay
    });
    return { ...post, content: newContent, edited: false };
}

// ─── Generate Video Script with Source Article as Backbone ────
// The video script MUST reference the same source article as the text post.
// Formula: Article hook → Named example → Brain chemistry explains why → Bridge to Camino data → CTA
export async function generateVideoScript({ topic, chemicalId, pillar, postContent, videoLength = '45-60s', platform = 'LinkedIn Video', outputFormat = '9:16', apiKey }) {

    const chemContext = buildVideoScriptContext(chemicalId, typeof topic === 'string' ? topic : topic.headline || topic);

    // Extract the source article data from the full topic object
    const sourceArticle = topic?.sourceArticle || '';
    const articleUrl = topic?.articleUrl || '';
    const headline = topic?.headline || (typeof topic === 'string' ? topic : 'Leadership mental performance');
    const talkingPoints = topic?.talkingPoints || [];
    const mechanism = topic?.mechanism || '';
    const businessRelevance = topic?.businessRelevance || '';
    const emotionalHook = topic?.emotionalHook || '';
    const pillarName = pillar?.name || '';
    const pillarDesc = pillar?.description || '';

    const prompt = `You are Craig Muirhead's video content strategist. Write a complete video script for a ${videoLength} HeyGen avatar video.

CRITICAL RULE — THE SOURCE ARTICLE IS THE BACKBONE OF THIS VIDEO:
The video script MUST reference the same source article as the text post. The article provides the hook. It is the borrowed authority. It is the reason the viewer stops scrolling. The formula that generated 19,217 reach:
1. HOOK: Open with the article's most compelling finding or the named person/study from the article
2. SCENARIO: Use the article's story to paint the picture — name the person, the study, the specific finding
3. SCIENCE: The neurochemistry layer EXPLAINS why the article's example works — this is Craig's unique interpretation
4. BRIDGE: Connect the article's insight to Camino Coaching data (2,358 debriefs) and the viewer's experience
5. CTA: Low-pressure, unrelated to the topic

The article is NOT optional background. It is the opening frame of the video. Third-party authority first, Craig's expertise second, the CTA last.

SOURCE ARTICLE TO BUILD THE VIDEO AROUND:
- Headline: ${headline}
- Article: ${sourceArticle}
${articleUrl ? `- URL: ${articleUrl}` : ''}
${talkingPoints.length > 0 ? `- Key findings: ${talkingPoints.join(' | ')}` : ''}
${mechanism ? `- Brain mechanism: ${mechanism}` : ''}
${businessRelevance ? `- Business relevance: ${businessRelevance}` : ''}
${emotionalHook ? `- Target emotion: ${emotionalHook}` : ''}

CONTENT PILLAR: ${pillarName} — ${pillarDesc}

${postContent ? `THE TEXT POST (for alignment — the video must tell the same story through the same article):\n${postContent.substring(0, 800)}\n` : ''}

PRODUCTION CONTEXT:
- This video uses AI avatar (Craig's likeness) narrating over a Manus slide deck
- Platform: ${platform}
- Output format: ${outputFormat}
- Target length: ${videoLength}

${chemContext}

RULES:
- The HOOK must name the article's subject (the person, study, or finding) in the first sentence
- The SCENARIO must use at least one named example FROM the article in the first 15 seconds
- The neurochemical layer EXPLAINS the science behind the article's story — it does not replace it
- UK English spelling throughout (colour, analyse, programme, favourite)
- Use BUSINESS language: CEO, boardroom, strategic decision, quarterly review, board meeting, executive team, founder, scaling
- Use MOTORSPORT BRIDGES where natural: connect the article's findings to both racing and business
- Write numbers out in full text for voice synthesis (e.g., "two thousand three hundred and fifty eight" not "2,358")
- WOW not HOW: Reveal the chemical and what it does. NEVER give the specific fix or programme methodology
- Warm, direct, confident tone. Like a trusted advisor talking to a peer.
- Keep each section tight. This is a ${videoLength} video, not an essay.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

=== VIDEO SCRIPT ===
HOOK (0-5s):
[Open with the article's most compelling data point or named person. One sentence. This becomes the text overlay on Slide 1. The viewer must think "I need to hear this."]

SCENARIO (5-15s):
[Use the article's story. Name the person, the study, the specific finding. Then pivot: "Now think about your last [business scenario]." Make the leader feel the parallel.]

THE SCIENCE (15-35s):
[Name the chemical. Explain WHY the article's example works through neuroscience. One clear mechanism. This is Craig's unique interpretation — nobody else is connecting this article to this brain chemical.]

THE COST (35-45s):
[Quantify the impact. Use data from the article AND from Craig's debriefs. Decision quality, revenue, team performance. The gap between knowing and doing.]

THE BRIDGE (45-55s):
[Connect the article's insight to Camino Coaching data. "After two thousand two hundred and forty nine performance debriefs, the pattern is identical." Tease the solution. Never give the fix.]

CTA (55-60s):
[Casual, low-pressure. Winning Formula Assessment. "Oh, by the way" energy. Completely unrelated to the article topic.]

=== SLIDE DECK BRIEF (FOR MANUS) ===
Slide 1 — Hook: [Bold text referencing the article's subject. Max 15 words.]
Slide 2 — The Story: [Key image/text from the article's finding. Max 15 words.]
Slide 3 — The Chemical: [Chemical name in teal. One-line description.]
Slide 4 — The Mechanism: [2-3 short bullet points of how it manifests in business.]
Slide 5 — The Data: [One big stat from the article OR from Craig's data. Large number + short label.]
Slide 6 — The Bridge: [Teaser line connecting the article to the viewer's experience.]
Slide 7 — CTA: [Free Winning Formula Assessment + URL: caminocoaching.co.uk/leader-assessment]
Slide 8 — End Card: [Camino Coaching branding. 4.9 Trustpilot · 120 five-star reviews.]

=== HEYGEN NOTES ===
[Avatar position, gesture suggestions, pace notes for this specific video.]

=== SOCIAL CAPTION ===
[A short LinkedIn caption to post alongside the video. Reference the article. 50-100 words. Include CTA and 3-5 hashtags.]`;

    return await callClaude(prompt, apiKey, false);
}

// ─── Content Deduplication Storage ────────────────────────────────────────
const DEDUP_ARTICLES_KEY = 'business-linkedin-used-articles';
const DEDUP_HOOKS_KEY = 'business-linkedin-used-hooks';

function getUsedArticleUrls() {
    try {
        return JSON.parse(localStorage.getItem(DEDUP_ARTICLES_KEY) || '[]');
    } catch { return []; }
}

export function storeUsedArticles(topics) {
    const existing = getUsedArticleUrls();
    const newUrls = topics
        .filter(t => t.articleUrl)
        .map(t => ({ url: t.articleUrl, headline: t.headline, date: new Date().toISOString() }));
    const combined = [...existing, ...newUrls].slice(-60);
    localStorage.setItem(DEDUP_ARTICLES_KEY, JSON.stringify(combined));
}

function getUsedHooks() {
    try {
        return JSON.parse(localStorage.getItem(DEDUP_HOOKS_KEY) || '[]');
    } catch { return []; }
}

export function storeUsedHooks(posts) {
    const existing = getUsedHooks();
    const newHooks = posts
        .filter(p => p.content)
        .map(p => (p.content || '').split('\n')[0]);
    const combined = [...existing, ...newHooks].slice(-30);
    localStorage.setItem(DEDUP_HOOKS_KEY, JSON.stringify(combined));
}

function buildDeduplicationContext() {
    const usedUrls = getUsedArticleUrls();
    const usedHooks = getUsedHooks();
    let ctx = '';
    if (usedUrls.length > 0) {
        ctx += `\n\nDEDUPLICATION — DO NOT return any article from these previously used URLs:\n${usedUrls.map(a => a.url).join('\n')}\n`;
    }
    if (usedHooks.length > 0) {
        ctx += `\n\nDEDUPLICATION — DO NOT repeat or closely paraphrase these previously used hooks:\n${usedHooks.join('\n')}\n`;
    }
    return ctx;
}

// ─── Claude API Call (Anthropic) — Content Writing ──────────────────
async function callClaude(prompt, apiKey, parseJson = true) {
    if (!apiKey) {
        throw new Error('Claude API key not configured. Go to Settings to add your key.');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.85
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text?.trim();

    if (!content) {
        throw new Error('No content returned from Claude API.');
    }

    if (parseJson) {
        try {
            // Try to extract JSON array first (for topics, posts)
            const arrayMatch = content.match(/\[[\s\S]*\]/);
            if (arrayMatch) return JSON.parse(arrayMatch[0]);

            // Try to extract JSON object (for emails, single responses)
            const objectMatch = content.match(/\{[\s\S]*\}/);
            if (objectMatch) return JSON.parse(objectMatch[0]);

            // Try raw parse
            return JSON.parse(content);
        } catch (e) {
            throw new Error('Failed to parse Claude response as JSON. Please try again.');
        }
    }

    return content;
}

// ─── Gemini API Call with Google Search Grounding — Research ────
async function callGeminiWithSearch(prompt, apiKey, parseJson = true) {
    if (!apiKey) {
        throw new Error('Gemini API key not configured. Go to Settings to add your key.');
    }

    const dedupPrompt = prompt + buildDeduplicationContext();

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: dedupPrompt }] }],
                tools: [{ google_search: {} }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 8192
                }
            })
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Gemini] Raw response:', JSON.stringify(data).substring(0, 500));

    let content = '';
    if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            if (part.text) content += part.text;
        }
    }

    // Strip markdown code fences if present
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    if (!content) {
        const blockReason = data.candidates?.[0]?.finishReason;
        const safetyRatings = data.candidates?.[0]?.safetyRatings;
        console.error('[Gemini] No content. Finish reason:', blockReason, 'Safety:', safetyRatings);
        throw new Error(`No content from Gemini (reason: ${blockReason || 'unknown'}). Try again.`);
    }

    console.log('[Gemini] Parsed content preview:', content.substring(0, 200));

    if (parseJson) {
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
        } catch (e) {
            console.error('[Gemini] JSON parse failed. Content:', content.substring(0, 500));
            throw new Error('Failed to parse Gemini response as JSON. Try again.');
        }
    }

    return content;
}

// ─── HeyGen Video Generation API ─────────────────────────────────────
export async function generateHeyGenVideo({ script, avatarId, voiceId, apiKey }) {
    if (!apiKey) {
        throw new Error('HeyGen API key not configured. Go to Settings to add your key.');
    }

    // Parse the script sections into scenes
    const sections = ['HOOK', 'SCENARIO', 'THE SCIENCE', 'THE COST', 'THE BRIDGE', 'CTA'];
    const scenes = sections.map((section, i) => {
        const regex = new RegExp(`${section}[^:]*:\\\\s*([\\\\s\\\\S]*?)(?=${sections[i + 1] ? sections[i + 1] : '==='}|$)`);
        const match = script.match(regex);
        const text = (match?.[1] || '').trim();
        return {
            scene_type: 'talking_photo',
            character: {
                type: 'avatar',
                avatar_id: avatarId || 'default',
                voice: { type: 'text', voice_id: voiceId || 'default', input_text: text }
            },
            background: { type: 'color', value: '#0A1628' }
        };
    }).filter(s => s.character.voice.input_text);

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey
        },
        body: JSON.stringify({
            video_inputs: scenes,
            dimension: { width: 1080, height: 1920 }
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HeyGen API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.video_id || data.video_id;
}

// ─── HeyGen Video Status Check ───────────────────────────────────────
export async function checkHeyGenVideoStatus(videoId, apiKey) {
    const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
        headers: { 'X-Api-Key': apiKey }
    });

    if (!response.ok) {
        throw new Error(`HeyGen status check failed: ${response.status}`);
    }

    const data = await response.json();
    return {
        status: data.data?.status || 'unknown',
        videoUrl: data.data?.video_url || null,
        thumbnailUrl: data.data?.thumbnail_url || null
    };
}

// ─── Generate Email Copy (Claude) ─────────────────────────────
export async function generateEmail({ topic, pillar, cta, postContent, apiKey }) {
    const prompt = `You are Craig Muirhead, writing a short nurture email to your list of business leaders and CEOs.

TOPIC: ${topic?.headline || topic || 'Mental performance in business leadership'}
PILLAR: ${pillar?.name || 'Mental Performance'} — ${pillar?.description || ''}
CTA: ${cta?.name || 'Winning Formula Assessment'} — Trigger: Take the free assessment

${postContent ? `RELATED SOCIAL POST (for context — do NOT copy this word-for-word, use it as inspiration for the email angle):\n${postContent.substring(0, 500)}\n` : ''}

Write a SHORT nurture email. This is NOT a newsletter — it's a punchy, personal email from Craig.

RULES:
- UK English throughout
- Use business leadership language (not motorcycle-specific, but motorsport BRIDGES are welcome)
- WOW not HOW: reveal the problem and neuroscience, NEVER the methodology
- Maximum 200 words body (short, punchy, value-dense)
- Write like you're talking to a trusted peer — direct, no fluff
- Include a specific business scenario or data point
- End with a clear CTA that links to the Winning Formula Assessment

OUTPUT FORMAT (return as JSON):
{
  "subject": "Email subject line (max 50 chars, curiosity-driven, lowercase feel)",
  "preheader": "Preview text (max 80 chars, complements subject)",
  "hook": "Opening line — punchy, scenario-based, stops the scroll (1-2 sentences)",
  "problem": "The problem/neuroscience angle (2-3 sentences, include a data point or stat)",
  "bridge": "The 'what if' bridge — teases the solution without giving it away (1-2 sentences)",
  "ctaText": "CTA button text (max 5 words, action-oriented)",
  "ctaUrl": "${cta?.url || 'https://caminocoaching.co.uk/leader-assessment'}",
  "signoff": "Short sign-off line before the name (1 sentence, personal)"
}

Return ONLY the JSON object. No markdown, no code fences.`;

    const result = await callClaude(prompt, apiKey, true);

    if (Array.isArray(result)) {
        return result[0];
    }
    return result;
}

// ─── Render Email as GHL-Compatible HTML ─────────────────────
export function renderEmailHTML(emailData, pillar) {
    const {
        subject = 'Something for your Monday...',
        preheader = '',
        hook = '',
        problem = '',
        bridge = '',
        ctaText = 'Take the Free Assessment',
        ctaUrl = 'https://caminocoaching.co.uk/leader-assessment',
        signoff = 'Speak soon'
    } = emailData;

    const pillarColor = pillar?.color || '#00BFA5';

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${subject}</title>
<!--[if !mso]><!-->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
</style>
<!--<![endif]-->
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 0; background-color: #0D1117; font-family: 'Inter', Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { display: block; outline: none; text-decoration: none; border: 0; }
  a { color: #00BFA5; text-decoration: none; }
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; padding: 0 16px !important; }
    .content { padding: 28px 20px !important; }
    .cta-btn { display: block !important; text-align: center !important; }
    h1 { font-size: 22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#0D1117;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>

<!-- Wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1117;">
<tr><td align="center" style="padding:24px 0;">

<!-- Container -->
<table role="presentation" class="container" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

<!-- Header Bar -->
<tr><td style="padding:0 0 2px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:linear-gradient(90deg,${pillarColor},#00BFA5);height:4px;border-radius:4px 4px 0 0;"></td>
    </tr>
  </table>
</td></tr>

<!-- Main Content Card -->
<tr><td class="content" style="background-color:#0A1628;padding:36px 32px;border-radius:0 0 8px 8px;">

  <!-- Logo/Brand -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <span style="font-size:13px;font-weight:700;color:#00BFA5;letter-spacing:1.5px;text-transform:uppercase;">CAMINO COACHING</span>
    </td></tr>
  </table>

  <!-- Hook -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:28px 0 0 0;">
      <h1 style="font-size:24px;font-weight:700;color:#F0F6FC;line-height:1.3;margin:0;">${hook}</h1>
    </td></tr>
  </table>

  <!-- Problem/Science -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 0 0 0;">
      <p style="font-size:15px;line-height:1.65;color:#B0BAC5;margin:0;">${problem}</p>
    </td></tr>
  </table>

  <!-- Bridge -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 0 0 0;">
      <p style="font-size:15px;line-height:1.65;color:#D1D5DB;font-weight:600;margin:0;font-style:italic;">${bridge}</p>
    </td></tr>
  </table>

  <!-- CTA Button -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:28px 0 0 0;" align="center">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td class="cta-btn" style="background-color:#00BFA5;border-radius:6px;padding:14px 32px;">
          <a href="${ctaUrl}" target="_blank" style="color:#0A1628;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;letter-spacing:0.5px;">${ctaText}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>

  <!-- Sign-off -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:28px 0 0 0;border-top:1px solid rgba(255,255,255,0.06);margin-top:28px;">
      <p style="font-size:14px;line-height:1.5;color:#8B949E;margin:0 0 4px 0;">${signoff}</p>
      <p style="font-size:14px;font-weight:700;color:#F0F6FC;margin:0;">Craig Muirhead</p>
      <p style="font-size:12px;color:#00BFA5;margin:2px 0 0 0;">Camino Coaching — Leadership Mental Performance</p>
    </td></tr>
  </table>

</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 0 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:12px 0;">
      <p style="font-size:11px;color:#484F58;margin:0;">
        You're receiving this because you signed up for leadership performance insights.
        <br><a href="{{unsubscribe_link}}" style="color:#484F58;text-decoration:underline;">Unsubscribe</a> · <a href="{{preferences_link}}" style="color:#484F58;text-decoration:underline;">Email preferences</a>
      </p>
      <p style="font-size:11px;color:#30363D;margin:8px 0 0 0;">
        © ${new Date().getFullYear()} Camino Coaching · caminocoaching.co.uk
      </p>
    </td></tr>
  </table>
</td></tr>

</table>
<!-- /Container -->

</td></tr>
</table>
<!-- /Wrapper -->

</body>
</html>`;
}

// ─── Generate Image Prompt ───────────────────────────────────
export function generateImagePrompt(post) {
    return `Create a professional, editorial-quality business leadership photograph for a LinkedIn post about "${post.pillar.name}".
    Style: Photorealistic, shot on Canon EOS R5, 85mm f/1.4 lens, shallow depth of field, natural lighting, 8K resolution.
    Setting: Modern office, boardroom, executive suite, contemporary workspace — authentic professional environment.
    Theme: ${post.pillar.description}.
    Mood: Professional, strategic, high-performance. The leadership experience.
    No text overlay. No watermark. No logos. No writing on image. No identifiable faces.
    Square format (1:1) for social media.`;
}
