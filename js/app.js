// ═══════════════════════════════════════════════════════════════
// ⚡ BUSINESS LEADERS LINKEDIN ENGINE — Main App
// Apple-style "Remote Control" interface
// 2 modes, 1 button. The complexity is in the engine.
// ═══════════════════════════════════════════════════════════════

import {
    PILLARS, FRAMEWORKS, CTAS, AUTHORITY_LINES, CAMPAIGN_ARC,
    WEEKLY_SCHEDULE, MOTORSPORT_BRIDGES, VISUAL_TYPES,
    getActiveCTAs, getRotatingCTA, resetCTARotation,
    getRotatingAuthority, resetAuthorityRotation,
    getRotatingMotorsportBridge, resetMotorsportBridgeRotation,
    getWeeklyPillars, getWeeklyFrameworks, getWeeklyCTAs,
    getRandomPillar, getRandomFramework,
    getSeasonalContext
} from './content-engine.js';

import {
    generateTopics, generatePost, generatePosts, regeneratePost, generateImagePrompt,
    generateVideoScript, generateShortsScript, storeUsedArticles, storeUsedHooks,
    generateEmail, renderEmailHTML, callClaude, callGeminiWithSearch
} from './ai-service.js?v=20260313a';

import {
    createManusSlideTask, checkManusTaskStatus,
    createHeyGenVideo, checkHeyGenStatus,
    createCanvaPostImage
} from './production-pipeline.js';

import { dispatchEmail } from './ghl-email.js';

import {
    NEUROCHEMICALS, FLOW_COCKTAIL, WEEKLY_VIDEO_SCHEDULE, VIDEO_TOPICS,
    getChemical, getTopicsForChemical
} from './neurochemistry.js';

import {
    getScheduleDates, exportCSV, buildCSVString, downloadPostTxt, copyToClipboard
} from './scheduler.js';

import { loadSettings, renderSettingsPage } from './settings.js';

import {
    REVIEW_STATS, QUOTED_HOOKS, OBJECTION_KILLERS, CAROUSEL_CONCEPTS,
    REVIEW_AUTHORITY_LINES, TRUSTPILOT_REVIEWS, GOOGLE_REVIEWS,
    getReviewRequestTemplate
} from './review-bank.js';


// ─── App State ────────────────────────────────────────────────
const state = {
    currentPage: 'weekly',
    stories: [],    // Raw story cards from AI research
    topics: [],     // Structured topics with pillars/frameworks assigned
    posts: [],      // Generated posts
    doneData: {},   // Confirmed post outputs: { [index]: { emailHTML, videoScript, cleanVideoTXT, shortsScript, shortsTXT } }
    weeklyPillars: [],
    weeklyFrameworks: [],
    weeklyCTAs: [],
    weeklyAuthorities: [],
    weeklyMotorsportBridges: [],
    seasonalContext: null
};

const STORAGE_KEY = 'businessLinkedIn_session';

// ─── Auto-Save / Restore ──────────────────────────────────────
function saveSession() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            stories: state.stories,
            topics: state.topics,
            posts: state.posts,
            doneData: state.doneData,
            weeklyPillars: state.weeklyPillars,
            weeklyFrameworks: state.weeklyFrameworks,
            weeklyCTAs: state.weeklyCTAs,
            weeklyAuthorities: state.weeklyAuthorities,
            weeklyMotorsportBridges: state.weeklyMotorsportBridges,
            seasonalContext: state.seasonalContext,
            timestamp: Date.now()
        }));
    } catch (e) { console.warn('Save failed:', e); }
}

function restoreSession() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!saved) return;

        // Expire sessions older than 3 days
        if (saved.timestamp && Date.now() - saved.timestamp > 3 * 86400000) {
            localStorage.removeItem(STORAGE_KEY);
            return;
        }

        Object.assign(state, {
            stories: saved.stories || [],
            topics: saved.topics || [],
            posts: saved.posts || [],
            doneData: saved.doneData || {},
            weeklyPillars: saved.weeklyPillars || [],
            weeklyFrameworks: saved.weeklyFrameworks || [],
            weeklyCTAs: saved.weeklyCTAs || [],
            weeklyAuthorities: saved.weeklyAuthorities || [],
            weeklyMotorsportBridges: saved.weeklyMotorsportBridges || [],
            seasonalContext: saved.seasonalContext || null
        });

        // Restore UI state
        if (state.posts.length > 0) {
            renderStoryCards();
            renderPosts();
            showContainer('posts-container');
        } else if (state.stories.length > 0) {
            renderStoryCards();
            showContainer('stories-container');
        }
    } catch (e) { console.warn('Restore failed:', e); }
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    state.stories = [];
    state.topics = [];
    state.posts = [];
    state.doneData = {};
    state.weeklyPillars = [];
    state.weeklyFrameworks = [];
    state.weeklyCTAs = [];
    state.weeklyAuthorities = [];
    state.weeklyMotorsportBridges = [];

    // Reset UI
    document.getElementById('stories-container')?.classList.add('hidden');
    document.getElementById('posts-container')?.classList.add('hidden');
    showToast('Session cleared — ready for a fresh week!', 'success');
}


// ─── Initialise ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWeeklyMode();
    initSinglePost();
    renderSettingsPage();
    checkSeasonalContext();
    restoreSession();
});


// ─── Utility: Escape HTML ─────────────────────────────────────
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// ─── Parse Video Script into Per-Slide Sections ──────────────
function parseVideoSlides(rawScript) {
    if (!rawScript) return [];
    const scriptMatch = rawScript.match(/=== VIDEO SCRIPT ===\s*([\s\S]*?)(?:=== SLIDE DECK|$)/i);
    const narration = (scriptMatch?.[1] || rawScript).trim();

    const slidePatterns = [
        { label: 'Hook', icon: '🎯', timing: '0-5s', slide: 1, regex: /(?:^|\n)\s*HOOK\s*(?:\([^)]*\))?\s*:\s*([\s\S]*?)(?=\n\s*(?:SCENARIO|THE SCIENCE|THE COST|THE BRIDGE|CTA)\s*(?:\(|:)|$)/i },
        { label: 'Scenario', icon: '🎬', timing: '5-15s', slide: 2, regex: /(?:^|\n)\s*SCENARIO\s*(?:\([^)]*\))?\s*:\s*([\s\S]*?)(?=\n\s*(?:THE SCIENCE|THE COST|THE BRIDGE|CTA)\s*(?:\(|:)|$)/i },
        { label: 'The Science', icon: '🧪', timing: '15-35s', slide: 3, regex: /(?:^|\n)\s*THE SCIENCE\s*(?:\([^)]*\))?\s*:\s*([\s\S]*?)(?=\n\s*(?:THE COST|THE BRIDGE|CTA)\s*(?:\(|:)|$)/i },
        { label: 'The Cost', icon: '📊', timing: '35-45s', slide: 4, regex: /(?:^|\n)\s*THE COST\s*(?:\([^)]*\))?\s*:\s*([\s\S]*?)(?=\n\s*(?:THE BRIDGE|CTA)\s*(?:\(|:)|$)/i },
        { label: 'The Bridge', icon: '🌉', timing: '45-55s', slide: 5, regex: /(?:^|\n)\s*THE BRIDGE\s*(?:\([^)]*\))?\s*:\s*([\s\S]*?)(?=\n\s*CTA\s*(?:\(|:)|$)/i },
        { label: 'CTA', icon: '📢', timing: '55-60s', slide: 6, regex: /(?:^|\n)\s*CTA\s*(?:\([^)]*\))?\s*:\s*([\s\S]*?)$/i }
    ];

    const slides = [];
    for (const p of slidePatterns) {
        const match = narration.match(p.regex);
        if (match && match[1]?.trim()) {
            slides.push({ label: p.label, icon: p.icon, timing: p.timing, slide: p.slide, content: match[1].replace(/^\[|\]$/g, '').trim() });
        }
    }
    return slides;
}

// ─── Parse 30s Shorts Script into Per-Slide Sections ─────────
function parseShortsSlides(rawScript) {
    if (!rawScript) return [];
    const scriptMatch = rawScript.match(/=== SHORTS SCRIPT[^=]*===\s*([\s\S]*?)(?:=== SHORTS SLIDE|$)/i);
    const narration = (scriptMatch?.[1] || rawScript).trim();

    const slidePatterns = [
        { label: 'Hook', icon: '🎯', timing: '0-5s', slide: 1, regex: /(?:^|\n)\s*HOOK\s*(?:\([^)]*\))?\s*(?:\|\s*Slide\s*\d+\s*)?\s*:\s*([\s\S]*?)(?=\n\s*(?:THE INSIGHT|THE PROOF|CTA)\s*(?:\(|\|)|$)/i },
        { label: 'The Insight', icon: '🧪', timing: '5-18s', slide: 2, regex: /(?:^|\n)\s*THE INSIGHT\s*(?:\([^)]*\))?\s*(?:\|\s*Slide\s*\d+\s*)?\s*:\s*([\s\S]*?)(?=\n\s*(?:THE PROOF|CTA)\s*(?:\(|\|)|$)/i },
        { label: 'The Proof', icon: '📊', timing: '18-25s', slide: 3, regex: /(?:^|\n)\s*THE PROOF\s*(?:\([^)]*\))?\s*(?:\|\s*Slide\s*\d+\s*)?\s*:\s*([\s\S]*?)(?=\n\s*CTA\s*(?:\(|\|)|$)/i },
        { label: 'CTA', icon: '📢', timing: '25-30s', slide: 4, regex: /(?:^|\n)\s*CTA\s*(?:\([^)]*\))?\s*(?:\|\s*Slide\s*\d+\s*)?\s*:\s*([\s\S]*?)$/i }
    ];

    const slides = [];
    for (const p of slidePatterns) {
        const match = narration.match(p.regex);
        if (match && match[1]?.trim()) {
            let content = match[1].trim();
            const voiceMatch = content.match(/Voice:\s*([\s\S]*?)(?=\n\s*On screen:|$)/i);
            if (voiceMatch) { content = voiceMatch[1].trim(); }
            else { content = content.replace(/^On screen:.*$/gim, '').replace(/^Voice:\s*/gim, '').trim(); }
            slides.push({ label: p.label, icon: p.icon, timing: p.timing, slide: p.slide, content: content.replace(/^\[|\]$/g, '').trim() });
        }
    }
    return slides;
}

// ─── Render Slide Boxes with Individual Copy Buttons ─────────
function renderSlideBoxes(slides, idPrefix, accentColor = '#00BFA5') {
    if (!slides || slides.length === 0) return '<div style="color:var(--text-muted);font-size:0.75rem;padding:0.5rem;">Parsing slides...</div>';
    return slides.map(s => `
        <div class="slide-box" style="margin-bottom:0.5rem;border:1px solid ${accentColor}22;border-radius:6px;overflow:hidden;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:0.3rem 0.6rem;background:${accentColor}0D;">
                <div style="display:flex;align-items:center;gap:0.35rem;">
                    <span style="font-size:0.7rem;">${s.icon}</span>
                    <span style="font-size:0.68rem;font-weight:700;color:${accentColor};">Slide ${s.slide}: ${s.label}</span>
                    <span style="font-size:0.55rem;padding:0.1rem 0.35rem;background:${accentColor}15;color:${accentColor};border-radius:3px;font-weight:600;">${s.timing}</span>
                </div>
                <button class="post-action-btn" onclick="navigator.clipboard.writeText(this.closest('.slide-box').querySelector('.slide-content').textContent.trim());window.showToast('Slide ${s.slide} copied!','success');" style="font-size:0.62rem;color:${accentColor};padding:0.15rem 0.4rem;">📋 Copy</button>
            </div>
            <div class="slide-content" style="padding:0.5rem 0.6rem;font-size:0.78rem;line-height:1.55;color:var(--text-primary);white-space:pre-wrap;background:rgba(0,0,0,0.15);cursor:text;user-select:all;">${escapeHtml(s.content)}</div>
        </div>
    `).join('');
}


// ─── Toast System ─────────────────────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
window.showToast = showToast;


// ─── Navigation (2 modes + settings) ──────────────────────────
function initNavigation() {
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', () => switchPage(link.dataset.page));
    });
}

function switchPage(page) {
    state.currentPage = page;
    document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${page}"]`)?.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const pageMap = { weekly: 'weekly-page', single: 'single-page', settings: 'settings-page' };
    document.getElementById(pageMap[page])?.classList.add('active');
}


// ─── Status Indicator ─────────────────────────────────────────
function setStatus(text, busy = false) {
    const dot = document.getElementById('status-dot');
    const label = document.getElementById('status-text');
    if (label) label.textContent = text;
    if (dot) dot.className = `status-dot ${busy ? 'busy' : ''}`;
}


// ─── UI Helpers ───────────────────────────────────────────────
function showContainer(id) {
    ['stories-container', 'posts-container'].forEach(cid => {
        document.getElementById(cid)?.classList.add('hidden');
    });
    document.getElementById(id)?.classList.remove('hidden');
}


// ─── Seasonal Context Check ──────────────────────────────────
function checkSeasonalContext() {
    state.seasonalContext = getSeasonalContext();
    // No championship calendar for Business app
}

// ─── Article Preview Popup ───────────────────────────────────────
function openArticleModal(url, title) {
    const decodedUrl = decodeURIComponent(url);
    const w = 900, h = 700;
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 2;
    window.open(decodedUrl, '_blank', `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);
}


// ═══════════════════════════════════════════════════════════════
// MODE 1: THIS WEEK'S 7
// ═══════════════════════════════════════════════════════════════

function initWeeklyMode() {
    document.getElementById('find-stories-btn')?.addEventListener('click', handleFindStories);
    document.getElementById('write-all-btn')?.addEventListener('click', handleWriteAll);
    document.getElementById('export-csv-btn')?.addEventListener('click', handleExportCSV);
    document.getElementById('copy-csv-btn')?.addEventListener('click', handleCopyCSV);
    document.getElementById('generate-emails-btn')?.addEventListener('click', handleGenerateAllEmails);
    document.getElementById('clear-session-btn')?.addEventListener('click', clearSession);

    // Delegated click handler for article preview popups
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('.article-preview-link');
        if (link) {
            e.preventDefault();
            e.stopPropagation();
            const url = link.dataset.url || '';
            const title = link.dataset.title || '';
            if (url) {
                openArticleModal(url, title);
            } else {
                showToast('No article URL available for this story.', 'info');
            }
        }
    });
}


// ─── Step 1: Find Stories (3-Step Verified Pipeline) ──────────
async function handleFindStories() {
    const settings = loadSettings();
    if (!settings.geminiApiKey) {
        showToast('Please add your Gemini API key in Settings ⚙️ first.', 'error');
        return;
    }

    const btn = document.getElementById('find-stories-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    // Progress callback for 3-step pipeline
    const onProgress = (step, message) => {
        const stepIcons = { step1: '🔍', step2: '📥', step3: '🧠' };
        const stepLabels = { step1: 'Step 1/3', step2: 'Step 2/3', step3: 'Step 3/3' };
        setStatus(`${stepIcons[step] || '⚡'} ${stepLabels[step] || ''}: ${message}`, true);
        showToast(`${stepLabels[step]}: ${message}`, 'info');
    };

    try {
        // AI decides all the assignments
        state.weeklyPillars = getWeeklyPillars();
        state.weeklyFrameworks = getWeeklyFrameworks();
        resetCTARotation();
        resetAuthorityRotation();
        resetMotorsportBridgeRotation();
        state.weeklyCTAs = getWeeklyCTAs();
        state.weeklyAuthorities = state.weeklyPillars.map(() => getRotatingAuthority());
        state.weeklyMotorsportBridges = state.weeklyPillars.map(() => getRotatingMotorsportBridge());

        // 3-Step Verified Pipeline: Search → Fetch → Generate
        state.topics = await generateTopics(
            state.weeklyPillars,
            state.seasonalContext,
            settings.geminiApiKey,
            onProgress
        );

        // Store articles for deduplication
        storeUsedArticles(state.topics);

        // Build story cards from topics + auto-assigned metadata
        state.stories = state.topics.map((topic, i) => ({
            ...topic,
            pillar: state.weeklyPillars[i],
            framework: state.weeklyFrameworks[i],
            cta: state.weeklyCTAs[i],
            chemical: assignChemical(topic, state.weeklyPillars[i]),
            postType: state.weeklyFrameworks[i]?.name || 'Familiar'
        }));

        // Count verified vs unverified
        const verifiedCount = state.topics.filter(t => t.verifiedSource).length;

        renderStoryCards();
        showContainer('stories-container');
        saveSession();
        showToast(`7 stories found! ${verifiedCount}/7 have verified source URLs. Tap any to generate, or Write All 7.`, 'success');
    } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
        console.error(err);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}


// ─── Assign neurochemical to a story based on pillar/topic ────
const CHEM_DATA = {
    'hidden-cost': { name: 'Cortisol', icon: '🔴', color: '#e84444', id: 'cortisol' },
    'brain-breakthrough': { name: 'Dopamine', icon: '🟡', color: '#ffd43b', id: 'dopamine' },
    'human-achievement': { name: 'Serotonin', icon: '🟢', color: '#69db7c', id: 'serotonin' },
    'camino-data': { name: 'Dopamine', icon: '🟡', color: '#ffd43b', id: 'dopamine' },
    'positive-edge': { name: 'Endorphins', icon: '🟣', color: '#9775fa', id: 'endorphins' },
    'the-tool': { name: 'Norepinephrine', icon: '⚡', color: '#4488FF', id: 'flow-cocktail' },
    'winning-ways': { name: 'Serotonin', icon: '🟢', color: '#69db7c', id: 'serotonin' }
};

function assignChemical(topic, pillar) {
    return CHEM_DATA[pillar?.id] || { name: 'Dopamine', icon: '🟡', color: '#ffd43b', id: 'dopamine' };
}


// ─── Render Story Cards ──────────────────────────────────────
function renderStoryCards() {
    const container = document.getElementById('stories-list');
    const meta = document.getElementById('stories-meta');
    if (!container) return;

    const chemicals = [...new Set(state.stories.map(s => s.chemical?.name))].filter(Boolean);
    if (meta) {
        meta.textContent = `${state.stories.length} stories found · ${chemicals.length} neurochemicals`;
    }

    container.innerHTML = state.stories.map((story, i) => {
        const chem = story.chemical || {};
        const articleTitle = story.sourceArticle || '';
        const articleUrl = story.articleUrl || story.sourceUrl || '';
        const sourceDomain = articleUrl ? (() => { try { return new URL(articleUrl).hostname.replace('www.', ''); } catch { return ''; } })() : '';
        const urlMatch = story.urlMatchMethod || (articleUrl ? 'gemini-direct' : 'unverified');
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        const matchBadges = {
            'verified-fetch': { label: '✅ Verified', color: '#2EA043', tip: 'Article URL confirmed — content fetched and verified from the real source' },
            'proprietary-data': { label: '📊 Proprietary', color: '#4dabf7', tip: 'Camino Coaching proprietary data — no external URL needed' },
            'gemini-direct': { label: '✅ Direct', color: '#2EA043', tip: 'URL provided directly by Gemini search' },
            'domain-match': { label: '🔗 Domain', color: '#00BFA5', tip: 'URL matched by domain name in source' },
            'title-match': { label: '🔍 Keywords', color: '#DAA520', tip: 'URL matched by title keywords' },
            'best-guess': { label: '🟡 Best Guess', color: '#E8912A', tip: 'Best available URL — verify before using' },
            'unresolved': { label: '🔴 Unresolved', color: '#E84444', tip: 'URL could not be resolved from redirect' },
            'unverified': { label: '⚠️ No URL', color: '#E84444', tip: 'No URL could be matched from search results' }
        };
        const badge = matchBadges[urlMatch] || matchBadges['unverified'];

        const groundingTitle = story.groundingTitle || '';
        const titleMismatch = groundingTitle && articleTitle &&
            groundingTitle.toLowerCase().replace(/[^a-z0-9]/g, '') !== articleTitle.toLowerCase().replace(/[^a-z0-9]/g, '');

        const summaryText = story.summary || (story.talkingPoints?.length ? story.talkingPoints.join('. ') + '.' : '');

        return `
      <div class="story-card" data-index="${i}">
        <div class="story-card-tags">
          <span class="story-tag chemical" style="background:${chem.color}15;color:${chem.color};border:1px solid ${chem.color}30;">
            ${chem.icon || '🧪'} ${chem.name || 'Dopamine'}
          </span>
          <span class="story-tag post-type">
            ${story.framework?.icon || '📌'} ${story.postType || 'Familiar'}
          </span>
          <span class="story-tag pillar" style="color:${story.pillar?.color || '#888'};">
            ${story.pillar?.icon || ''} ${story.pillar?.name || ''}
          </span>
          <span style="font-size:0.62rem;color:var(--text-muted);margin-left:auto;">${dayNames[i] || `Day ${i + 1}`}</span>
        </div>
        <div class="story-card-body" style="padding:0.6rem 0.8rem;">
          <h3 class="story-headline" style="margin:0 0 0.5rem;font-size:0.95rem;line-height:1.3;">${escapeHtml(story.headline || story.topic || '')}</h3>

          <div style="margin-bottom:0.35rem;">
            <span style="font-size:0.68rem;font-weight:700;color:var(--neuro-teal);letter-spacing:0.5px;">ARTICLE:</span>
            <span style="font-size:0.75rem;color:var(--text-primary);margin-left:0.3rem;">${escapeHtml(articleTitle || groundingTitle || 'No article title')}</span>
          </div>

          <div style="margin-bottom:0.35rem;display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
            <span style="font-size:0.68rem;font-weight:700;color:var(--neuro-teal);letter-spacing:0.5px;">URL:</span>
            ${articleUrl
                ? `<a href="${escapeHtml(articleUrl)}" target="_blank" rel="noopener" style="font-size:0.7rem;color:var(--neuro-teal);word-break:break-all;text-decoration:underline;" onclick="event.stopPropagation();">${escapeHtml(articleUrl.length > 70 ? articleUrl.substring(0, 70) + '...' : articleUrl)}</a>`
                : `<span style="font-size:0.7rem;color:var(--text-muted);font-style:italic;">No URL found</span>`}
            <span style="font-size:0.58rem;padding:0.1rem 0.3rem;border-radius:3px;background:${badge.color}18;color:${badge.color};border:1px solid ${badge.color}30;font-weight:600;" title="${badge.tip}">${badge.label}</span>
          </div>

          ${titleMismatch ? `
          <div style="margin-bottom:0.35rem;padding:0.25rem 0.5rem;background:rgba(232,145,42,0.08);border-radius:4px;border-left:2px solid #E8912A;">
            <span style="font-size:0.62rem;color:#E8912A;font-weight:700;">🔍 REAL TITLE:</span>
            <span style="font-size:0.68rem;color:var(--text-secondary);font-style:italic;margin-left:0.2rem;">${escapeHtml(groundingTitle)}</span>
          </div>` : ''}

          ${story.source ? `
          <div style="margin-bottom:0.35rem;">
            <span style="font-size:0.68rem;font-weight:700;color:var(--neuro-teal);letter-spacing:0.5px;">SOURCE:</span>
            <span style="font-size:0.72rem;color:var(--text-secondary);margin-left:0.3rem;">${escapeHtml(story.source)}</span>
          </div>` : (sourceDomain ? `
          <div style="margin-bottom:0.35rem;">
            <span style="font-size:0.68rem;font-weight:700;color:var(--neuro-teal);letter-spacing:0.5px;">SOURCE:</span>
            <span style="font-size:0.72rem;color:var(--text-secondary);margin-left:0.3rem;">${escapeHtml(sourceDomain)}</span>
          </div>` : '')}

          ${summaryText ? `
          <div style="margin-bottom:0.35rem;">
            <span style="font-size:0.68rem;font-weight:700;color:var(--neuro-teal);letter-spacing:0.5px;">SUMMARY:</span>
            <p style="font-size:0.72rem;color:var(--text-secondary);line-height:1.5;margin:0.15rem 0 0;">${escapeHtml(summaryText)}</p>
          </div>` : ''}

          ${story.killerDataPoint ? `
          <div style="margin-bottom:0.35rem;padding:0.3rem 0.5rem;background:rgba(218,165,32,0.08);border-radius:4px;border-left:2px solid var(--gold);">
            <span style="font-size:0.68rem;font-weight:700;color:var(--gold);letter-spacing:0.5px;">📊 KILLER DATA POINT:</span>
            <p style="font-size:0.72rem;color:var(--gold);line-height:1.4;margin:0.15rem 0 0;font-weight:600;">"${escapeHtml(story.killerDataPoint)}"</p>
          </div>` : ''}

          ${story.businessRelevance ? `
          <div style="margin-bottom:0.2rem;padding:0.3rem 0.5rem;background:rgba(0,191,165,0.06);border-radius:4px;border-left:2px solid var(--neuro-teal);">
            <span style="font-size:0.68rem;font-weight:700;color:var(--neuro-teal);letter-spacing:0.5px;">💼 BUSINESS RELEVANCE:</span>
            <p style="font-size:0.72rem;color:var(--text-secondary);line-height:1.4;margin:0.15rem 0 0;font-style:italic;">${escapeHtml(story.businessRelevance)}</p>
          </div>` : ''}

          ${story.mechanism ? `
          <div style="margin-top:0.2rem;">
            <span style="font-size:0.62rem;color:var(--text-muted);">🧠 ${escapeHtml(story.mechanism)}</span>
          </div>` : ''}
        </div>

        <div class="story-card-actions">
          <button class="story-generate-btn" onclick="window.appActions.regenerateStory(${i})" style="font-size:0.7rem;padding:0.3rem 0.6rem;background:none;border:1px solid var(--border);color:var(--text-muted);" title="Find a different story for this slot">
            🔄 Swap
          </button>
          <button class="story-generate-btn" onclick="window.appActions.generateStory(${i})">
            Generate →
          </button>
        </div>
      </div>
    `;
    }).join('');
}


// ─── Write All 7 ──────────────────────────────────────────────
async function handleWriteAll() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) {
        showToast('Please add your Claude API key in Settings ⚙️ first.', 'error');
        return;
    }

    const btn = document.getElementById('write-all-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('✍️ Writing all 7 posts with Claude...', true);

    try {
        const campaignDays = state.topics.map((_, i) => i < CAMPAIGN_ARC.length ? CAMPAIGN_ARC[i] : null);

        state.posts = await generatePosts(state.topics, {
            pillars: state.weeklyPillars,
            frameworks: state.weeklyFrameworks,
            ctas: state.weeklyCTAs,
            authorityLines: state.weeklyAuthorities,
            motorsportBridges: state.weeklyMotorsportBridges,
            apiKey: settings.claudeApiKey,
            campaignDays
        });

        storeUsedHooks(state.posts);
        renderPosts();
        showContainer('posts-container');
        saveSession();
        showToast('All 7 posts ready! Review and export below.', 'success');
    } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
        console.error(err);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}


// ─── Render Posts ─────────────────────────────────────────────
function renderPosts() {
    const container = document.getElementById('posts-grid');
    if (!container) return;

    const dates = getScheduleDates(state.posts.length);

    container.innerHTML = state.posts.map((post, i) => {
        const date = dates[i];
        const wordCount = (post.content || '').split(/\s+/).filter(w => w).length;

        let postContent = post.content || '';
        const linkedInMatch = postContent.match(/=== LINKEDIN POST ===\s*([\s\S]*?)(?:=== IMAGE TEXT ===|$)/);
        if (linkedInMatch) postContent = linkedInMatch[1].trim();

        const chem = state.stories[i]?.chemical || {};
        const isConfirmed = post.confirmed || false;
        const isEditing = post.editing || false;
        const topic = state.topics[i] || post.topic || {};
        const sourceArticle = topic.sourceArticle || topic.source || '';
        const articleUrl = topic.articleUrl || '';

        return `
      <div class="post-card ${isConfirmed ? 'post-confirmed' : ''}" id="post-card-${i}" data-index="${i}">
        <div class="post-card-header">
          <div class="post-card-header-left">
            <span class="post-number">${i + 1}</span>
            <span class="story-tag chemical" style="background:${chem.color}15;color:${chem.color};border:1px solid ${chem.color}30;">
              ${chem.icon || '🧪'} ${chem.name || ''}
            </span>
            <span class="pillar-badge" style="border: 1px solid ${post.pillar.color}30; color: ${post.pillar.color};">
              ${post.pillar.icon} ${post.pillar.name}
            </span>
            <span class="framework-badge">${post.framework.icon} ${post.framework.name}</span>
          </div>
          <div class="post-card-header-right">
            <span class="schedule-info">${date.dayName} ${date.dateString}</span>
          </div>
        </div>

        ${sourceArticle ? `
        <div class="source-article-bar" style="padding:0.4rem 1.25rem;background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.72rem;display:flex;align-items:center;gap:0.4rem;">
          <span style="color:var(--text-muted);">📰 Source:</span>
          ${articleUrl
                    ? `<a href="${escapeHtml(articleUrl)}" target="_blank" style="color:var(--accent);text-decoration:none;font-weight:600;">${escapeHtml(sourceArticle)}</a>`
                    : `<span style="color:var(--text-secondary);font-weight:600;">${escapeHtml(sourceArticle)}</span>`
                }
        </div>` : ''}

        ${isEditing
                ? `<textarea class="post-edit-area" id="post-edit-${i}" rows="14" style="width:100%;padding:1rem 1.25rem;background:#0D1117;border:none;border-top:1px solid rgba(0,191,165,0.2);border-bottom:1px solid rgba(0,191,165,0.2);color:var(--text-primary);font-family:var(--font);font-size:0.85rem;line-height:1.65;resize:vertical;outline:none;">${escapeHtml(postContent)}</textarea>`
                : `<div class="post-content" id="post-content-${i}">${escapeHtml(postContent)}</div>`
            }

        <div class="post-card-footer">
          <div class="post-meta">
            <span class="word-count">${wordCount} words</span>
            ${isConfirmed ? '<span style="color:var(--green);font-size:0.7rem;font-weight:600;">✅ Confirmed</span>' : ''}
          </div>
          <div class="post-actions">
            ${!isConfirmed ? `
              <button class="post-action-btn" onclick="window.appActions.copyPost(${i})">📋 Copy</button>
              <button class="post-action-btn" onclick="window.appActions.regenPost(${i})">🔄 Regen</button>
              ${isEditing
                    ? `<button class="post-action-btn" onclick="window.appActions.saveEdit(${i})" style="color:var(--neuro-teal);font-weight:700;">💾 Save</button>
                   <button class="post-action-btn" onclick="window.appActions.cancelEdit(${i})">✕ Cancel</button>`
                    : `<button class="post-action-btn" onclick="window.appActions.editPost(${i})" style="color:var(--text-muted);">✏️ Edit</button>`
                }
              <button class="post-action-btn" onclick="window.appActions.confirmPost(${i})" style="background:rgba(46,160,67,0.12);color:var(--green,#2EA043);border:1px solid rgba(46,160,67,0.2);border-radius:6px;font-weight:700;">✅ Confirm</button>
            ` : `
              <button class="post-action-btn" onclick="window.appActions.copyPost(${i})">📋 Copy LinkedIn</button>
              <button class="post-action-btn" onclick="window.appActions.unconfirmPost(${i})" style="color:var(--text-muted);font-size:0.65rem;">↩ Edit</button>
            `}
          </div>
        </div>

        ${isConfirmed ? `
          <div style="padding:0.5rem 1.25rem;background:rgba(0,191,165,0.04);border-top:1px solid rgba(0,191,165,0.1);">
            <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
              <span style="font-size:0.68rem;color:var(--text-muted);font-weight:600;">🚀 NEXT:</span>
              <a href="https://manus.im/app/project/9SDGQdQC5wMtzPWss5vc4K" target="_blank" rel="noopener" style="font-size:0.72rem;padding:0.25rem 0.6rem;background:rgba(0,191,165,0.12);color:var(--neuro-teal,#00BFA5);border:1px solid rgba(0,191,165,0.3);border-radius:5px;text-decoration:none;font-weight:700;">🎨 Manus Slides</a>
              <a href="https://app.heygen.com/avatar/ppt-to-video" target="_blank" rel="noopener" style="font-size:0.72rem;padding:0.25rem 0.6rem;background:rgba(218,165,32,0.12);color:var(--gold,#DAA520);border:1px solid rgba(218,165,32,0.3);border-radius:5px;text-decoration:none;font-weight:700;">🎬 HeyGen Video</a>
              <a href="https://app.gohighlevel.com/v2/location/vdgR8teGuIgHPMPzbQkK/marketing/social-planner" target="_blank" rel="noopener" style="font-size:0.72rem;padding:0.25rem 0.6rem;background:rgba(46,160,67,0.12);color:var(--green,#2EA043);border:1px solid rgba(46,160,67,0.3);border-radius:5px;text-decoration:none;font-weight:700;">📱 GHL Planner</a>
              <a href="https://app.usegoplus.com/location/C03hMrgoj4FLALDMqpWr/emails/create/69ae8a72a971f31b0e6df1c3/builder" target="_blank" rel="noopener" style="font-size:0.72rem;padding:0.25rem 0.6rem;background:rgba(139,92,246,0.12);color:#8B5CF6;border:1px solid rgba(139,92,246,0.3);border-radius:5px;text-decoration:none;font-weight:700;">📧 GHL Email</a>
            </div>
            ${topic.articleUrl ? `
            <div style="margin-top:0.4rem;display:flex;align-items:center;gap:0.4rem;">
              <span style="font-size:0.65rem;color:var(--text-muted);">🔗 Source for Manus:</span>
              <a href="${escapeHtml(topic.articleUrl)}" target="_blank" style="font-size:0.65rem;color:var(--accent);text-decoration:none;max-width:350px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;">${escapeHtml(topic.articleUrl)}</a>
              <button class="post-action-btn" onclick="navigator.clipboard.writeText('${escapeHtml(topic.articleUrl)}');window.showToast && window.showToast('URL copied!','success')" style="font-size:0.62rem;">📋</button>
            </div>` : ''}
          </div>
        ` : ''}

        ${isConfirmed ? renderProductionKit(post, i) : ''}
      </div>
    `;
    }).join('');
}

// ─── Production Kit (Email + Video + Shorts) ─────────────────
function renderProductionKit(post, index) {
    return `
    <div class="production-kit" id="production-kit-${index}">
      ${post.emailHTML ? renderInlineEmail(post, index) : `<div id="email-slot-${index}" class="production-slot"><span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Generating email HTML...</div>`}
      ${post.videoNarration ? renderInlineVideo(post, index) : `<div id="video-slot-${index}" class="production-slot"><span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Generating video script...</div>`}
      ${post.shortsNarration ? renderInlineShorts(post, index) : `<div id="shorts-slot-${index}" class="production-slot"><span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Generating 30s shorts script...</div>`}
    </div>`;
}

// ─── Facebook + Instagram Inline ──────────────────────────────
function renderInlinePlatforms(post, index) {
    return `
    <div class="production-slot" id="platforms-slot-${index}">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
            <span style="font-weight:700;font-size:0.78rem;color:#1877F2;">📘 Facebook</span>
            <button class="post-action-btn" onclick="window.appActions.copyFacebook(${index})" style="color:#1877F2;font-size:0.7rem;">📋 Copy</button>
          </div>
          <div style="background:#0D1117;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:0.65rem;max-height:200px;overflow-y:auto;">
            <pre style="white-space:pre-wrap;font-size:0.75rem;line-height:1.5;color:var(--text-secondary);font-family:var(--font);margin:0;">${escapeHtml(post.facebook || '')}</pre>
          </div>
        </div>
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
            <span style="font-weight:700;font-size:0.78rem;color:#E1306C;">📸 Instagram</span>
            <button class="post-action-btn" onclick="window.appActions.copyInstagram(${index})" style="color:#E1306C;font-size:0.7rem;">📋 Copy</button>
          </div>
          <div style="background:#0D1117;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:0.65rem;max-height:200px;overflow-y:auto;">
            <pre style="white-space:pre-wrap;font-size:0.75rem;line-height:1.5;color:var(--text-secondary);font-family:var(--font);margin:0;">${escapeHtml(post.instagram || '')}</pre>
          </div>
        </div>
      </div>
    </div>`;
}

// ─── Inline Email Render ──────────────────────────────────────
function renderInlineEmail(post, index) {
    // For srcdoc, we only need to escape double-quotes (for the attribute), NOT HTML tags
    const srcdocHtml = (post.emailHTML || '').replace(/"/g, '&quot;');

    return `
    <div class="production-slot" id="email-slot-${index}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
        <span style="font-weight:700;font-size:0.8rem;color:var(--gold,#DAA520);">📧 Email HTML</span>
        <div style="display:flex;gap:0.35rem;">
          <button class="post-action-btn" onclick="window.appActions.copyEmailHTML(${index})" style="color:var(--gold);">📋 Copy HTML</button>
          <button class="post-action-btn" onclick="window.appActions.copyEmailSubject(${index})">📝 Subject</button>
          <button class="post-action-btn" onclick="window.appActions.previewEmail(${index})">👁️ Preview</button>
        </div>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.4rem;">Subject: <strong style="color:var(--gold);">${escapeHtml(post.emailSubject || '')}</strong></div>
      <div style="border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;background:white;">
        <iframe id="email-frame-${index}" style="width:100%;height:400px;border:none;" srcdoc="${srcdocHtml}"></iframe>
      </div>
    </div>`;
}

// ─── Parse video script into slide sections ──────────────────
function parseVideoSections(post) {
    const raw = post.videoScriptRaw || post.videoNarration || '';
    // Extract the VIDEO SCRIPT block
    const scriptMatch = raw.match(/=== VIDEO SCRIPT ===\s*([\s\S]*?)(?:=== SLIDE DECK BRIEF|=== HEYGEN|=== SOCIAL|$)/i);
    const scriptBlock = scriptMatch ? scriptMatch[1] : raw;

    const sectionDefs = [
        { key: 'hook', label: 'Slide 1 — Hook', timing: '0-5s', color: '#FF6B6B', icon: '🎯' },
        { key: 'scenario', label: 'Slide 2 — Scenario', timing: '5-15s', color: '#DAA520', icon: '🎬' },
        { key: 'science', label: 'Slide 3 — The Science', timing: '15-35s', color: '#00BFA5', icon: '🧠' },
        { key: 'cost', label: 'Slide 4 — The Cost', timing: '35-45s', color: '#E8912A', icon: '📊' },
        { key: 'bridge', label: 'Slide 5 — The Bridge', timing: '45-55s', color: '#8B5CF6', icon: '🌉' },
        { key: 'cta', label: 'Slide 6 — CTA', timing: '55-60s', color: '#2EA043', icon: '📣' }
    ];

    // Match patterns like "HOOK (0-5s):", "THE SCIENCE (15-35s):", "SCENARIO:"
    const sectionPatterns = [
        /HOOK\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i,
        /SCENARIO\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i,
        /THE SCIENCE\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i,
        /THE COST\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i,
        /THE BRIDGE\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i,
        /CTA\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i
    ];

    const sections = [];
    for (let i = 0; i < sectionPatterns.length; i++) {
        const startMatch = scriptBlock.match(sectionPatterns[i]);
        if (!startMatch) continue;

        const startIdx = scriptBlock.indexOf(startMatch[0]) + startMatch[0].length;
        // Find the next section start
        let endIdx = scriptBlock.length;
        for (let j = i + 1; j < sectionPatterns.length; j++) {
            const nextMatch = scriptBlock.match(sectionPatterns[j]);
            if (nextMatch) {
                const nextIdx = scriptBlock.indexOf(nextMatch[0]);
                if (nextIdx > startIdx) { endIdx = nextIdx; break; }
            }
        }

        const text = scriptBlock.substring(startIdx, endIdx)
            .replace(/^\[|\]$/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        if (text) {
            sections.push({ ...sectionDefs[i], text });
        }
    }

    // Fallback: if nothing parsed, return the whole narration as one section
    if (sections.length === 0 && post.videoNarration) {
        sections.push({ key: 'full', label: 'Full Script', timing: '0-60s', color: '#00BFA5', icon: '🎬', text: post.videoNarration });
    }

    return sections;
}

// ─── Inline Video Render (slide-by-slide) ─────────────────────
function renderInlineVideo(post, index) {
    const sections = parseVideoSections(post);

    const slideBoxes = sections.map((s, si) => `
        <div style="margin-bottom:0.5rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.25rem;">
            <span style="font-size:0.72rem;font-weight:700;color:${s.color};">${s.icon} ${s.label} <span style="opacity:0.5;font-weight:400;">(${s.timing})</span></span>
            <button class="post-action-btn" onclick="navigator.clipboard.writeText(document.getElementById('video-slide-${index}-${si}').textContent);window.showToast('${s.label} copied!','success')" style="font-size:0.65rem;color:${s.color};">📋 Copy</button>
          </div>
          <div style="background:#0D1117;border:1px solid ${s.color}20;border-left:3px solid ${s.color};border-radius:6px;padding:0.5rem 0.65rem;">
            <pre id="video-slide-${index}-${si}" style="white-space:pre-wrap;font-size:0.78rem;line-height:1.55;color:var(--text-primary);font-family:var(--font);margin:0;">${escapeHtml(s.text)}</pre>
          </div>
        </div>
    `).join('');

    return `
    <div class="production-slot" id="video-slot-${index}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
        <span style="font-weight:700;font-size:0.8rem;color:var(--neuro-teal,#00BFA5);">🎬 Video Script — Slide by Slide</span>
        <div style="display:flex;gap:0.35rem;">
          <button class="post-action-btn" onclick="window.appActions.copyVideoNarration(${index})" style="color:var(--neuro-teal);">📋 Copy Full Script</button>
          <button class="post-action-btn" onclick="window.appActions.copyManusPrompt(${index})">📊 Manus Prompt</button>
        </div>
      </div>
      <div style="font-size:0.62rem;color:var(--text-muted);margin-bottom:0.5rem;">Each box = one HeyGen slide. Copy each narration section individually, or use "Copy Full Script" for the complete narration.</div>
      ${slideBoxes}
    </div>`;
}

// ─── Parse shorts script into 4 slide sections ───────────────
function parseShortsSections(post) {
    const raw = post.shortsScriptRaw || post.shortsNarration || '';
    const scriptMatch = raw.match(/=== SHORTS SCRIPT[^=]*===\s*([\s\S]*?)(?:=== SHORTS SLIDE|=== LOOP|$)/i);
    const scriptBlock = scriptMatch ? scriptMatch[1] : raw;

    const sectionDefs = [
        { key: 'hook', label: 'Slide 1 — Hook', timing: '0-5s', color: '#FF6B6B', icon: '🎯' },
        { key: 'insight', label: 'Slide 2 — The Insight', timing: '5-18s', color: '#00BFA5', icon: '🧠' },
        { key: 'proof', label: 'Slide 3 — The Proof', timing: '18-25s', color: '#DAA520', icon: '📊' },
        { key: 'cta', label: 'Slide 4 — CTA', timing: '25-30s', color: '#2EA043', icon: '📣' }
    ];

    const sectionPatterns = [
        /HOOK\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i,
        /THE INSIGHT\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i,
        /THE PROOF\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i,
        /CTA\s*(?:\([^)]*\))?\s*(?:\|[^:]*)?:\s*/i
    ];

    const sections = [];
    for (let i = 0; i < sectionPatterns.length; i++) {
        const startMatch = scriptBlock.match(sectionPatterns[i]);
        if (!startMatch) continue;
        const startIdx = scriptBlock.indexOf(startMatch[0]) + startMatch[0].length;
        let endIdx = scriptBlock.length;
        for (let j = i + 1; j < sectionPatterns.length; j++) {
            const nextMatch = scriptBlock.match(sectionPatterns[j]);
            if (nextMatch) {
                const nextIdx = scriptBlock.indexOf(nextMatch[0]);
                if (nextIdx > startIdx) { endIdx = nextIdx; break; }
            }
        }
        const text = scriptBlock.substring(startIdx, endIdx).replace(/^\[|\]$/g, '').replace(/\n{3,}/g, '\n\n').trim();
        if (text) sections.push({ ...sectionDefs[i], text });
    }

    if (sections.length === 0 && post.shortsNarration) {
        sections.push({ key: 'full', label: 'Full Shorts Script', timing: '0-30s', color: '#FF6B6B', icon: '⚡', text: post.shortsNarration });
    }
    return sections;
}

// ─── Inline Shorts Render (slide-by-slide) ────────────────────
function renderInlineShorts(post, index) {
    const sections = parseShortsSections(post);

    const slideBoxes = sections.map((s, si) => `
        <div style="margin-bottom:0.5rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.25rem;">
            <span style="font-size:0.72rem;font-weight:700;color:${s.color};">${s.icon} ${s.label} <span style="opacity:0.5;font-weight:400;">(${s.timing})</span></span>
            <button class="post-action-btn" onclick="navigator.clipboard.writeText(document.getElementById('shorts-slide-${index}-${si}').textContent);window.showToast('${s.label} copied!','success')" style="font-size:0.65rem;color:${s.color};">📋 Copy</button>
          </div>
          <div style="background:#0D1117;border:1px solid ${s.color}20;border-left:3px solid ${s.color};border-radius:6px;padding:0.5rem 0.65rem;">
            <pre id="shorts-slide-${index}-${si}" style="white-space:pre-wrap;font-size:0.78rem;line-height:1.55;color:var(--text-primary);font-family:var(--font);margin:0;">${escapeHtml(s.text)}</pre>
          </div>
        </div>
    `).join('');

    return `
    <div class="production-slot" id="shorts-slot-${index}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
        <span style="font-weight:700;font-size:0.8rem;color:#FF6B6B;">⚡ Shorts Script — Slide by Slide</span>
        <div style="display:flex;gap:0.35rem;">
          <button class="post-action-btn" onclick="window.appActions.copyShortsScript(${index})" style="color:#FF6B6B;">📋 Copy Full</button>
          <button class="post-action-btn" onclick="window.appActions.copyShortsBrief(${index})">📊 Full Brief</button>
        </div>
      </div>
      <div style="font-size:0.6rem;color:var(--text-muted);margin-bottom:0.35rem;">4 slides · 75-85 words · Loop-engineered · 1.5s hook window</div>
      ${post.shortsLoopNote ? `<div style="margin-bottom:0.5rem;padding:0.35rem 0.6rem;background:rgba(255,107,107,0.06);border-radius:5px;border-left:2px solid #FF6B6B;font-size:0.68rem;color:var(--text-muted);">🔄 <strong>Loop:</strong> ${escapeHtml(post.shortsLoopNote)}</div>` : ''}
      ${slideBoxes}
    </div>`;
}


// ─── Post Actions ─────────────────────────────────────────────
window.appActions = {
    copyPost(index) {
        const post = state.posts[index];
        if (post) { copyToClipboard(post.content); showToast('Post copied!', 'success'); }
    },

    downloadPost(index) {
        const post = state.posts[index];
        if (post) { downloadPostTxt(post, index); showToast('Downloaded!', 'success'); }
    },

    async regenPost(index) {
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }

        setStatus(`Regenerating post ${index + 1}...`, true);
        try {
            const topic = state.topics[index];
            const content = await regeneratePost({
                topic,
                pillar: state.weeklyPillars[index],
                framework: state.weeklyFrameworks[index],
                cta: state.weeklyCTAs[index],
                authorityLine: state.weeklyAuthorities[index],
                motorsportBridge: state.weeklyMotorsportBridges[index],
                apiKey: settings.claudeApiKey
            });
            state.posts[index].content = content;
            renderPosts();
            saveSession();
            showToast(`Post ${index + 1} regenerated!`, 'success');
        } catch (err) {
            showToast(`Regen error: ${err.message}`, 'error');
        } finally { setStatus('Ready'); }
    },

    async generateEmailForPost(index) {
        const post = state.posts[index];
        if (!post) return;
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed for emails.', 'error'); return; }

        setStatus('Generating email...', true);
        try {
            const emailData = await generateEmail({
                postContent: post.content,
                topic: post.topic || state.topics[index],
                pillar: post.pillar,
                cta: post.cta,
                apiKey: settings.claudeApiKey
            });
            const emailHTML = renderEmailHTML(emailData);
            showEmailModal(emailData, emailHTML, index);
            showToast(`Email generated for post ${index + 1}!`, 'success');
        } catch (err) {
            showToast(`Email error: ${err.message}`, 'error');
        } finally { setStatus('Ready'); }
    },

    async generateStory(index) {
        const story = state.stories[index];
        if (!story) return;
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }

        // Show loading on the card
        const card = document.querySelector(`.story-card[data-index="${index}"]`);
        if (card) {
            card.querySelector('.story-card-actions').innerHTML = `
                <span style="color:var(--neuro-teal);font-size:0.75rem;font-weight:600;">⏳ Writing...</span>
            `;
        }

        setStatus(`Writing post for story ${index + 1}...`, true);
        try {
            const content = await generatePost({
                topic: story,
                pillar: story.pillar,
                framework: story.framework,
                cta: story.cta,
                authorityLine: state.weeklyAuthorities[index] || getRotatingAuthority(),
                motorsportBridge: state.weeklyMotorsportBridges[index] || getRotatingMotorsportBridge(),
                apiKey: settings.claudeApiKey
            });

            // Add to posts array at this index
            if (!state.posts[index]) {
                state.posts[index] = {
                    id: `post-${Date.now()}-${index}`,
                    content,
                    pillar: story.pillar,
                    framework: story.framework,
                    cta: story.cta,
                    topic: state.topics[index],
                    imageUrl: '',
                    edited: false
                };
            } else {
                state.posts[index].content = content;
            }

            saveSession();
            showToast(`Post ${index + 1} generated!`, 'success');

            // If all posts are generated, show full posts view
            if (state.posts.filter(Boolean).length === state.stories.length) {
                renderPosts();
                showContainer('posts-container');
            } else {
                // Show the generated post inline below the story card
                if (card) {
                    card.querySelector('.story-card-actions').innerHTML = `
                        <span style="color:var(--green);font-size:0.75rem;font-weight:600;">✅ Generated</span>
                        <button class="story-generate-btn" onclick="window.appActions.toggleInlinePost(${index})" style="font-size:0.72rem;padding:0.3rem 0.75rem;">👁️ View Post</button>
                    `;
                    card.style.borderColor = 'rgba(46,160,67,0.3)';

                    // Render the inline post preview below the story card
                    this.renderInlinePost(index, card);
                }
            }
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
            if (card) {
                card.querySelector('.story-card-actions').innerHTML = `
                    <button class="story-generate-btn" onclick="window.appActions.generateStory(${index})">🔄 Retry</button>
                `;
            }
        } finally { setStatus('Ready'); }
    },

    // ─── Render Inline Post Preview Below Story Card ─────────────
    renderInlinePost(index, card) {
        const post = state.posts[index];
        if (!post) return;

        const existingPreview = document.getElementById(`inline-post-${index}`);
        if (existingPreview) existingPreview.remove();

        const story = state.stories[index] || {};
        const articleTitle = story.sourceArticle || story.source || '';
        const articleLink = story.articleUrl || story.sourceUrl || '';
        const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length;
        const isConfirmed = state.doneData?.[index]?.confirmed;

        const div = document.createElement('div');
        div.id = `inline-post-${index}`;
        div.style.cssText = `margin:0.5rem 0 1rem;border:1px solid ${isConfirmed ? 'rgba(0,191,165,0.3)' : 'rgba(0,191,165,0.2)'};border-radius:8px;background:var(--card);overflow:hidden;${isConfirmed ? 'border-left:3px solid var(--neuro-teal);' : ''}`;

        div.innerHTML = `
            <!-- Source Article Bar -->
            ${articleTitle ? `
            <div style="padding:0.5rem 1rem;background:rgba(0,191,165,0.05);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:0.5rem;">
                <span style="font-size:0.72rem;font-weight:600;color:var(--neuro-teal);">📰</span>
                <span style="font-size:0.72rem;color:var(--text-secondary);flex:1;">${escapeHtml(articleTitle)}</span>
                ${articleLink ? `<a href="${escapeHtml(articleLink)}" target="_blank" rel="noopener" style="font-size:0.68rem;color:var(--neuro-teal);text-decoration:none;">👁️ Read</a>` : '<span style="font-size:0.68rem;color:var(--text-muted);">No link</span>'}
            </div>` : ''}

            <!-- Caption Header -->
            <div style="padding:0.4rem 1rem 0;display:flex;align-items:center;gap:0.5rem;">
                <span style="font-size:0.72rem;font-weight:700;color:var(--neuro-teal);">📝 LinkedIn Post</span>
                <span style="font-size:0.68rem;color:var(--text-muted);">(edit before confirming)</span>
            </div>

            <!-- Read-only Caption -->
            <div id="inline-post-content-${index}" style="padding:0.5rem 1rem 0.75rem;font-size:0.82rem;line-height:1.6;color:var(--text-primary);white-space:pre-wrap;max-height:300px;overflow-y:auto;">${escapeHtml(post.content || '')}</div>

            <!-- Edit Textarea (hidden until Edit clicked) -->
            <div id="inline-edit-area-${index}" style="display:none;padding:0.5rem 1rem;">
                <textarea id="inline-edit-caption-${index}" style="width:100%;min-height:140px;background:var(--bg);color:var(--text-primary);border:1px solid var(--border);border-radius:6px;padding:0.5rem;font-size:0.8rem;line-height:1.5;resize:vertical;font-family:var(--font);">${escapeHtml(post.content || '')}</textarea>
            </div>

            <!-- Action Bar -->
            <div id="inline-actions-${index}" style="padding:0.5rem 1rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:0.7rem;color:var(--text-muted);">${wordCount} words</span>
                <div style="display:flex;gap:0.3rem;align-items:center;">
                    <span id="inline-status-${index}" style="font-size:0.7rem;font-weight:600;margin-right:0.3rem;"></span>
                    ${isConfirmed ? `<span style="font-size:0.7rem;color:var(--green);font-weight:600;">✅ Confirmed</span>` : `
                    <button id="inline-edit-btn-${index}" class="post-action-btn" onclick="window.appActions.inlineEdit(${index})" style="font-size:0.72rem;color:var(--gold);">✏️ Edit</button>
                    <button id="inline-confirm-btn-${index}" class="post-action-btn" onclick="window.appActions.inlineConfirm(${index})" style="font-size:0.72rem;color:#0A1628;background:var(--neuro-teal);padding:0.3rem 0.7rem;border-radius:4px;font-weight:700;">✅ Confirm → Generate Scripts</button>
                    `}
                    <button class="post-action-btn" onclick="window.appActions.copyInlinePost(${index})" style="font-size:0.72rem;">📋 Copy</button>
                </div>
            </div>

            <!-- Generated Output Panels (shown after Confirm) -->
            <div id="inline-output-${index}" style="display:${isConfirmed ? 'block' : 'none'};">
                <!-- Email HTML -->
                <div style="border-top:1px solid var(--border);padding:0.75rem 1rem;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
                        <span style="font-size:0.78rem;font-weight:700;color:var(--neuro-teal);">📧 Email HTML</span>
                        <div style="display:flex;gap:0.3rem;">
                            <button class="post-action-btn" onclick="window.appActions.copyInlineEmail(${index})" style="font-size:0.7rem;">📋 Copy HTML</button>
                            <button class="post-action-btn" onclick="window.appActions.previewInlineEmail(${index})" style="font-size:0.7rem;">👁️ Preview</button>
                        </div>
                    </div>
                    <pre id="inline-email-code-${index}" style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:0.5rem;font-size:0.7rem;max-height:150px;overflow-y:auto;white-space:pre-wrap;color:var(--text-secondary);">${isConfirmed ? escapeHtml(state.doneData[index]?.emailHTML || 'Loading...') : 'Generating on confirm...'}</pre>
                </div>

                <!-- Video Script (45-60s) — Per Slide -->
                <div style="border-top:1px solid var(--border);padding:0.75rem 1rem;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
                        <span style="font-size:0.78rem;font-weight:700;color:var(--gold);">🎬 Video Script (45-60s) — Per Slide</span>
                        <div style="display:flex;gap:0.3rem;">
                            <button class="post-action-btn" onclick="window.appActions.copyInlineVideo(${index})" style="font-size:0.7rem;">📋 Copy All</button>
                        </div>
                    </div>
                    <div style="font-size:0.58rem;color:var(--text-muted);margin-bottom:0.4rem;">6 slides · Copy each slide for HeyGen narration</div>
                    <div id="inline-video-slides-${index}">${isConfirmed && state.doneData[index]?.videoSlides ? renderSlideBoxes(state.doneData[index].videoSlides, `ivs-${index}`, '#DAA520') : '<div style="color:var(--text-muted);font-size:0.75rem;padding:0.5rem;">Generating on confirm...</div>'}</div>
                </div>

                <!-- Shorts Script (30s Playbook) — Per Slide -->
                <div style="border-top:1px solid var(--border);padding:0.75rem 1rem;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
                        <span style="font-size:0.78rem;font-weight:700;color:#FF6B6B;">⚡ Shorts (30s Playbook) — Per Slide</span>
                        <div style="display:flex;gap:0.3rem;">
                            <button class="post-action-btn" onclick="window.appActions.copyInlineShorts(${index})" style="font-size:0.7rem;">📋 Copy All</button>
                        </div>
                    </div>
                    <div style="font-size:0.58rem;color:var(--text-muted);margin-bottom:0.4rem;">4 slides · 75-85 words · Loop-engineered</div>
                    <div id="inline-shorts-slides-${index}">${isConfirmed && state.doneData[index]?.shortsSlides ? renderSlideBoxes(state.doneData[index].shortsSlides, `iss-${index}`, '#FF6B6B') : '<div style="color:var(--text-muted);font-size:0.75rem;padding:0.5rem;">Generating on confirm...</div>'}</div>
                </div>

                <!-- Quick Launch Links -->
                <div style="border-top:1px solid var(--border);padding:0.6rem 1rem;">
                    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
                        <span style="font-size:0.68rem;font-weight:700;color:var(--text-muted);margin-right:0.2rem;">🚀 LAUNCH:</span>
                        <a href="https://manus.im" target="_blank" rel="noopener" style="font-size:0.68rem;padding:0.2rem 0.5rem;background:rgba(0,191,165,0.1);color:var(--neuro-teal);border:1px solid rgba(0,191,165,0.25);border-radius:4px;text-decoration:none;font-weight:600;" title="Create slide deck in Manus">🎨 Manus</a>
                        <a href="https://app.heygen.com/avatar/ppt-to-video" target="_blank" rel="noopener" style="font-size:0.68rem;padding:0.2rem 0.5rem;background:rgba(218,165,32,0.1);color:var(--gold);border:1px solid rgba(218,165,32,0.25);border-radius:4px;text-decoration:none;font-weight:600;" title="Upload slides + script to HeyGen">🎬 HeyGen</a>
                        <a href="https://app.gohighlevel.com/v2/location/vdgR8teGuIgHPMPzbQkK/marketing/social-planner" target="_blank" rel="noopener" style="font-size:0.68rem;padding:0.2rem 0.5rem;background:rgba(46,160,67,0.1);color:var(--green);border:1px solid rgba(46,160,67,0.25);border-radius:4px;text-decoration:none;font-weight:600;" title="Schedule in GHL Social Planner">📱 GHL Planner</a>
                    </div>
                </div>

                <!-- Source URL for Manus -->
                ${articleLink ? `
                <div style="border-top:1px solid var(--border);padding:0.5rem 1rem;display:flex;align-items:center;gap:0.5rem;">
                    <span style="font-size:0.68rem;color:var(--neuro-teal);font-weight:600;">🔗 Source for Manus:</span>
                    <span style="font-size:0.68rem;color:var(--text-secondary);flex:1;word-break:break-all;">${escapeHtml(articleLink)}</span>
                    <button class="post-action-btn" onclick="navigator.clipboard.writeText('${escapeHtml(articleLink)}');window.showToast('Source URL copied!','success')" style="font-size:0.66rem;">📋</button>
                </div>` : ''}
            </div>
        `;

        card.after(div);
    },

    toggleInlinePost(index) {
        const existing = document.getElementById(`inline-post-${index}`);
        if (existing) { existing.remove(); return; }
        const card = document.querySelector(`.story-card[data-index="${index}"]`);
        if (card) this.renderInlinePost(index, card);
    },

    // Copy the full post content
    copyInlinePost(index) {
        const post = state.posts[index];
        if (post) { copyToClipboard(post.content); showToast('Post copied!', 'success'); }
    },

    // Edit: show textarea, hide read-only
    inlineEdit(index) {
        const readOnly = document.getElementById(`inline-post-content-${index}`);
        const editArea = document.getElementById(`inline-edit-area-${index}`);
        const editBtn = document.getElementById(`inline-edit-btn-${index}`);
        const confirmBtn = document.getElementById(`inline-confirm-btn-${index}`);
        const status = document.getElementById(`inline-status-${index}`);

        if (readOnly) readOnly.style.display = 'none';
        if (editArea) editArea.style.display = 'block';
        if (editBtn) editBtn.style.display = 'none';
        if (confirmBtn) confirmBtn.style.display = 'inline-flex';
        if (status) { status.textContent = '✏️ Editing'; status.style.color = 'var(--gold)'; }

        showToast('Edit the post, then click ✅ Confirm', 'info');
    },

    // Confirm: save edits → generate Email + Video Script + Shorts Script
    async inlineConfirm(index) {
        const editCaption = document.getElementById(`inline-edit-caption-${index}`);
        const readOnly = document.getElementById(`inline-post-content-${index}`);
        const editArea = document.getElementById(`inline-edit-area-${index}`);
        const editBtn = document.getElementById(`inline-edit-btn-${index}`);
        const confirmBtn = document.getElementById(`inline-confirm-btn-${index}`);
        const status = document.getElementById(`inline-status-${index}`);
        const outputPanel = document.getElementById(`inline-output-${index}`);
        const inlineDiv = document.getElementById(`inline-post-${index}`);

        // Save the edited content
        const captionText = editCaption?.value || state.posts[index]?.content || '';
        state.posts[index].content = captionText;

        // Update read-only view
        if (readOnly) { readOnly.textContent = captionText; readOnly.style.display = 'block'; }

        // Hide edit, show generating state
        if (editArea) editArea.style.display = 'none';
        if (editBtn) editBtn.style.display = 'none';
        if (confirmBtn) confirmBtn.style.display = 'none';
        if (status) { status.textContent = '⏳ Generating...'; status.style.color = 'var(--neuro-teal)'; }
        if (outputPanel) outputPanel.style.display = 'block';
        if (inlineDiv) inlineDiv.style.borderLeft = '3px solid var(--neuro-teal)';

        saveSession();

        // Generate Email + Video + Shorts in parallel
        const post = state.posts[index];
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }

        const chemData = CHEM_DATA[post.pillar?.id] || { id: 'dopamine', icon: '🧪', name: 'Dopamine' };
        const story = state.stories[index] || state.topics[index] || {};
        const topic = post.topic?.headline || post.topic || state.topics[index]?.headline || 'Leadership performance';

        setStatus(`⏳ Generating email + video + shorts for story ${index + 1}...`, true);

        const [emailResult, videoResult, shortsResult] = await Promise.allSettled([
            // Email HTML
            (async () => {
                const emailData = await generateEmail({
                    postContent: captionText,
                    topic: post.topic || state.topics[index],
                    pillar: post.pillar,
                    cta: post.cta,
                    apiKey: settings.claudeApiKey
                });
                return { emailData, emailHTML: renderEmailHTML(emailData, post.pillar) };
            })(),
            // Main video script (45-60s)
            (async () => {
                return await generateVideoScript({
                    topic,
                    chemicalId: chemData.id,
                    videoLength: '45-60s',
                    platform: 'LinkedIn Video',
                    outputFormat: '9:16',
                    apiKey: settings.claudeApiKey,
                    sourceArticle: story.sourceArticle || story.source || '',
                    articleUrl: story.articleUrl || story.sourceUrl || '',
                    talkingPoints: story.talkingPoints || [],
                    emotionalHook: story.emotionalHook || '',
                    mechanism: story.mechanism || '',
                    businessRelevance: story.businessRelevance || '',
                    postContent: captionText
                });
            })(),
            // Shorts script (30s — Playbook-compliant)
            (async () => {
                return await generateShortsScript({
                    topic,
                    chemicalId: chemData.id,
                    sourceArticle: story.sourceArticle || story.source || '',
                    articleUrl: story.articleUrl || story.sourceUrl || '',
                    mechanism: story.mechanism || '',
                    businessRelevance: story.businessRelevance || '',
                    killerDataPoint: story.killerDataPoint || '',
                    talkingPoints: story.talkingPoints || [],
                    postContent: captionText,
                    apiKey: settings.claudeApiKey
                });
            })()
        ]);

        // Handle results
        if (!state.doneData) state.doneData = {};
        if (!state.doneData[index]) state.doneData[index] = {};
        state.doneData[index].confirmed = true;

        // Email
        const emailCodeEl = document.getElementById(`inline-email-code-${index}`);
        if (emailResult.status === 'fulfilled') {
            const { emailData, emailHTML } = emailResult.value;
            state.doneData[index].emailHTML = emailHTML;
            state.doneData[index].emailData = emailData;
            if (emailCodeEl) emailCodeEl.textContent = emailHTML;
        } else {
            if (emailCodeEl) emailCodeEl.textContent = `Error: ${emailResult.reason?.message || 'Failed'}`;
        }

        // Video (45-60s) — parse into slides
        const videoSlidesEl = document.getElementById(`inline-video-slides-${index}`);
        if (videoResult.status === 'fulfilled') {
            const fullScript = videoResult.value;
            const scriptMatch = fullScript.match(/=== VIDEO SCRIPT ===\s*([\s\S]*?)(?:=== SLIDE DECK|$)/i);
            const rawNarration = (scriptMatch?.[1] || fullScript).trim();
            const cleanTXT = rawNarration
                .replace(/^(?:HOOK|SCENARIO|THE SCIENCE|THE COST|THE BRIDGE|CTA)\s*(?:\([^)]*\))?\s*:\s*/gim, '')
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            state.doneData[index].videoScript = fullScript;
            state.doneData[index].cleanVideoTXT = cleanTXT;

            const videoSlides = parseVideoSlides(fullScript);
            state.doneData[index].videoSlides = videoSlides;
            if (videoSlidesEl) videoSlidesEl.innerHTML = renderSlideBoxes(videoSlides, `ivs-${index}`, '#DAA520');
        } else {
            if (videoSlidesEl) videoSlidesEl.innerHTML = `<div style="color:#FF6B6B;font-size:0.75rem;">Error: ${videoResult.reason?.message || 'Failed'}</div>`;
        }

        // Shorts (30s) — parse into slides
        const shortsSlidesEl = document.getElementById(`inline-shorts-slides-${index}`);
        if (shortsResult.status === 'fulfilled') {
            const fullShorts = shortsResult.value;
            const shortsScriptMatch = fullShorts.match(/=== SHORTS SCRIPT[^=]*===\s*([\s\S]*?)(?:=== SHORTS SLIDE|$)/i);
            const rawShorts = (shortsScriptMatch?.[1] || fullShorts).trim();
            const cleanShorts = rawShorts
                .replace(/^(?:HOOK|THE INSIGHT|THE PROOF|CTA)\s*(?:\([^)]*\))?\s*(?:\|\s*Slide\s*\d+\s*)?\s*:\s*/gim, '')
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            state.doneData[index].shortsScript = fullShorts;
            state.doneData[index].shortsTXT = cleanShorts;

            const shortsSlides = parseShortsSlides(fullShorts);
            state.doneData[index].shortsSlides = shortsSlides;
            if (shortsSlidesEl) shortsSlidesEl.innerHTML = renderSlideBoxes(shortsSlides, `iss-${index}`, '#FF6B6B');
        } else {
            if (shortsSlidesEl) shortsSlidesEl.innerHTML = `<div style="color:#FF6B6B;font-size:0.75rem;">Error: ${shortsResult.reason?.message || 'Failed'}</div>`;
        }

        saveSession();
        if (status) { status.textContent = '✅ Confirmed'; status.style.color = 'var(--green)'; }
        setStatus('Ready');
        showToast(`✅ Story ${index + 1} confirmed — email + video + shorts ready!`, 'success');
    },

    // Copy handlers for inline post
    copyInlineEmail(index) {
        const html = state.doneData?.[index]?.emailHTML;
        if (html) { copyToClipboard(html); showToast('Email HTML copied — paste into GHL!', 'success'); }
        else { showToast('Confirm the post first.', 'info'); }
    },

    previewInlineEmail(index) {
        const html = state.doneData?.[index]?.emailHTML;
        if (html) { const w = window.open('', '_blank', 'width=640,height=800'); w.document.write(html); w.document.close(); }
        else { showToast('Confirm the post first.', 'info'); }
    },

    copyInlineVideo(index) {
        const txt = state.doneData?.[index]?.cleanVideoTXT;
        if (txt) { copyToClipboard(txt); showToast('Video script copied — send to HeyGen!', 'success'); }
        else { showToast('Confirm the post first.', 'info'); }
    },

    copyInlineShorts(index) {
        const txt = state.doneData?.[index]?.shortsTXT;
        if (txt) { copyToClipboard(txt); showToast('Shorts script copied — send to HeyGen!', 'success'); }
        else { showToast('Confirm the post first.', 'info'); }
    },

    async generateVideoForPost(index) {
        const post = state.posts[index];
        if (!post) { showToast('Generate the post first.', 'error'); return; }
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }

        setStatus('🎬 Generating video script...', true);
        showToast('Creating video script...', 'info');

        try {
            // Get chemicalId from the post's pillar
            const chemData = CHEM_DATA[post.pillar?.id] || { id: 'dopamine' };

            // Pass the FULL topic object — source article is the backbone of the video
            const fullTopic = state.topics[index] || post.topic || {};

            const script = await generateVideoScript({
                topic: fullTopic,
                chemicalId: chemData.id,
                pillar: post.pillar,
                postContent: post.content,
                videoLength: '45-60s',
                platform: 'LinkedIn Video',
                outputFormat: '9:16',
                apiKey: settings.claudeApiKey
            });

            showVideoModal(script, index, chemData, settings);
            showToast(`Video script generated for post ${index + 1}!`, 'success');
        } catch (err) {
            showToast(`Video error: ${err.message}`, 'error');
            console.error(err);
        } finally { setStatus('Ready'); }
    },

    // ─── Edit / Confirm workflow ──────────────────────────────────
    editPost(index) {
        const post = state.posts[index];
        if (!post) return;
        post.editing = true;
        renderPosts();
        // Focus the textarea
        setTimeout(() => {
            const textarea = document.getElementById(`post-edit-${index}`);
            if (textarea) { textarea.focus(); textarea.selectionStart = textarea.value.length; }
        }, 50);
    },

    saveEdit(index) {
        const post = state.posts[index];
        if (!post) return;
        const textarea = document.getElementById(`post-edit-${index}`);
        if (textarea) {
            post.content = textarea.value;
        }
        post.editing = false;
        saveSession();
        renderPosts();
        showToast(`Post ${index + 1} updated!`, 'success');
    },

    cancelEdit(index) {
        const post = state.posts[index];
        if (!post) return;
        post.editing = false;
        renderPosts();
    },

    async confirmPost(index) {
        const post = state.posts[index];
        if (!post) return;

        // If still editing, save first
        if (post.editing) {
            const textarea = document.getElementById(`post-edit-${index}`);
            if (textarea) post.content = textarea.value;
            post.editing = false;
        }

        post.confirmed = true;
        saveSession();
        renderPosts();

        const settings = loadSettings();
        if (!settings.claudeApiKey) {
            showToast('Claude API key needed.', 'error');
            return;
        }

        const chemData = CHEM_DATA[post.pillar?.id] || { id: 'dopamine' };
        const fullTopic = state.topics[index] || post.topic || {};

        setStatus(`📧🎬 Post ${index + 1}: Generating email, video, shorts...`, true);

        const promises = [];

        // 2. Email HTML
        if (!post.emailHTML) {
            promises.push(
                generateEmail({
                    postContent: post.content,
                    topic: post.topic || state.topics[index],
                    pillar: post.pillar,
                    cta: post.cta,
                    apiKey: settings.claudeApiKey
                }).then(emailData => {
                    post.emailSubject = emailData.subject || '';
                    post.emailHTML = renderEmailHTML(emailData, post.pillar);
                    post.emailData = emailData;
                    const slot = document.getElementById(`email-slot-${index}`);
                    if (slot) slot.outerHTML = renderInlineEmail(post, index);
                }).catch(err => {
                    const slot = document.getElementById(`email-slot-${index}`);
                    if (slot) slot.innerHTML = `<span style="color:#e84444;font-size:0.75rem;">❌ Email error: ${err.message}</span>`;
                })
            );
        }

        // 3. Video narration
        if (!post.videoNarration) {
            promises.push(
                generateVideoScript({
                    topic: fullTopic,
                    chemicalId: chemData.id,
                    pillar: post.pillar,
                    postContent: post.content,
                    videoLength: '45-60s',
                    platform: 'LinkedIn Video',
                    outputFormat: '9:16',
                    apiKey: settings.claudeApiKey
                }).then(script => {
                    post.videoScriptRaw = script;
                    const videoScriptMatch = script.match(/=== VIDEO SCRIPT ===\s*([\s\S]*?)(?:=== SLIDE DECK BRIEF|$)/i);
                    let narration = '';
                    if (videoScriptMatch) {
                        narration = videoScriptMatch[1]
                            .replace(/^[A-Z\s]+([\(\[][\d\w\-–\s]+[\)\]])?:\s*/gm, '')
                            .replace(/\n{3,}/g, '\n\n')
                            .trim();
                    } else {
                        narration = script
                            .replace(/=== [A-Z\s]+ ===/g, '')
                            .replace(/^(HOOK|SCENARIO|THE SCIENCE|THE COST|THE BRIDGE|CTA|Slide \d+)[^:]*:\s*/gm, '')
                            .replace(/\n{3,}/g, '\n\n')
                            .trim();
                    }
                    post.videoNarration = narration;
                    const slideMatch = script.match(/=== SLIDE DECK BRIEF[\s\S]*?(?====|$)/i);
                    post.manusSlidesBrief = slideMatch ? slideMatch[0].trim() : '';
                    const slot = document.getElementById(`video-slot-${index}`);
                    if (slot) slot.outerHTML = renderInlineVideo(post, index);
                }).catch(err => {
                    const slot = document.getElementById(`video-slot-${index}`);
                    if (slot) slot.innerHTML = `<span style="color:#e84444;font-size:0.75rem;">❌ Video error: ${err.message}</span>`;
                })
            );
        }

        // 4. Shorts script (30s Playbook)
        if (!post.shortsNarration) {
            promises.push(
                generateShortsScript({
                    topic: fullTopic,
                    chemicalId: chemData.id,
                    sourceArticle: fullTopic.sourceArticle || '',
                    articleUrl: fullTopic.articleUrl || '',
                    mechanism: fullTopic.mechanism || '',
                    businessRelevance: fullTopic.businessRelevance || '',
                    killerDataPoint: fullTopic.killerDataPoint || '',
                    talkingPoints: fullTopic.talkingPoints || [],
                    postContent: post.content,
                    apiKey: settings.claudeApiKey
                }).then(script => {
                    post.shortsScriptRaw = script;
                    // Parse narration
                    const shortsMatch = script.match(/=== SHORTS SCRIPT[^=]*===\s*([\s\S]*?)(?:=== SHORTS SLIDE|$)/i);
                    const rawShorts = (shortsMatch?.[1] || script).trim();
                    const cleanShorts = rawShorts
                        .replace(/^(?:HOOK|THE INSIGHT|THE PROOF|CTA)\s*(?:\([^)]*\))?\s*(?:\|\s*Slide\s*\d+\s*)?:\s*/gim, '')
                        .replace(/^On screen:.*$/gim, '')
                        .replace(/^Voice:\s*/gim, '')
                        .replace(/\n{3,}/g, '\n\n')
                        .trim();
                    post.shortsNarration = cleanShorts;
                    // Parse loop note
                    const loopMatch = script.match(/=== LOOP (?:ENGINEERING|NOTE)[^=]*===\s*([\s\S]*?)(?:===|$)/i);
                    post.shortsLoopNote = loopMatch ? loopMatch[1].trim() : '';
                    const slot = document.getElementById(`shorts-slot-${index}`);
                    if (slot) slot.outerHTML = renderInlineShorts(post, index);
                }).catch(err => {
                    const slot = document.getElementById(`shorts-slot-${index}`);
                    if (slot) slot.innerHTML = `<span style="color:#e84444;font-size:0.75rem;">❌ Shorts error: ${err.message}</span>`;
                })
            );
        }

        await Promise.all(promises);
        saveSession();
        setStatus('Ready');
        showToast(`Post ${index + 1}: all outputs ready! LinkedIn, Email, Video, Shorts.`, 'success');
    },

    unconfirmPost(index) {
        const post = state.posts[index];
        if (!post) return;
        post.confirmed = false;
        renderPosts();
        saveSession();
    },

    async swapStory(index) {
        // Delegate to regenerateStory (enhanced version)
        return this.regenerateStory(index);
    },

    // Regenerate a single story without affecting the rest (Rider-style)
    async regenerateStory(index) {
        const settings = loadSettings();
        if (!settings.geminiApiKey) { showToast('Gemini API key needed.', 'error'); return; }

        const card = document.querySelector(`.story-card[data-index="${index}"]`);
        if (card) {
            const actionsEl = card.querySelector('.story-card-actions');
            if (actionsEl) actionsEl.innerHTML = `<span style="color:var(--neuro-teal);font-size:0.75rem;font-weight:600;">🔄 Finding new story...</span>`;
            card.style.opacity = '0.6';
        }

        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const pillar = state.weeklyPillars[index];
        const slot = WEEKLY_SCHEDULE[index];
        const existingHeadlines = state.stories.map(s => s.headline || s.topic || '').filter(Boolean);

        setStatus(`🔄 Finding replacement story for ${dayNames[index] || `Day ${index + 1}`}...`, true);

        try {
            const prompt = `Search the web for 1 NEW story from the last 7-30 days for a business leadership mental performance coach's LinkedIn.

SLOT: ${dayNames[index] || `Day ${index + 1}`}: ${slot?.contentType || pillar?.name || 'Leadership Performance'} — ${slot?.dayBrief || pillar?.description || ''}
SEARCH FOCUS: ${slot?.searchFocus || 'leadership mental performance neuroscience'}

DO NOT use any of these stories (already in use):
${existingHeadlines.map(h => `- ${h}`).join('\n')}

SEARCH SOURCES: Harvard Business Review, McKinsey Quarterly, Financial Times, The Economist, Nature, Science, Stanford GSB, MIT Sloan, Wall Street Journal, Forbes, Wired, TED, BBC World, neuroscience journals, sports psychology studies, biohacking research.
NO YOUTUBE — only written articles.

CRITICAL URL RULE: The "articleUrl" MUST be a real, working URL from the Google Search results you received. Do NOT invent URLs. If you cannot find one, set articleUrl to "".

Return a JSON array with exactly 1 object:
[{
    "headline": "Compelling headline connecting the story to leadership mental performance",
    "sourceArticle": "Article title — Publication",
    "articleUrl": "REAL URL from search results",
    "source": "Publication name | Date published",
    "summary": "3 sentences describing the key finding",
    "talkingPoints": ["Point 1", "Point 2", "Point 3"],
    "killerDataPoint": "Specific number, percentage, or direct quote",
    "emotionalHook": "What should the business leader feel?",
    "mechanism": "Neuroscience mechanism",
    "businessRelevance": "One sentence connecting to business leadership",
    "contentBrief": "Type of post"
}]

Return ONLY the JSON array.`;

            const result = await callGeminiWithSearch(prompt, settings.geminiApiKey, true);
            const newStory = Array.isArray(result) ? result[0] : result;

            if (newStory) {
                // Preserve the pillar/framework/cta from the old story
                const oldStory = state.stories[index];
                state.topics[index] = newStory;
                state.stories[index] = {
                    ...newStory,
                    pillar: oldStory.pillar,
                    framework: oldStory.framework,
                    cta: oldStory.cta,
                    chemical: oldStory.chemical,
                    postType: oldStory.postType,
                    angle: newStory.emotionalHook || newStory.businessRelevance || ''
                };

                // Clear any generated post for this slot
                if (state.posts[index]) state.posts[index] = null;

                saveSession();
                renderStoryCards();
                showToast(`🔄 Story ${index + 1} swapped!`, 'success');
            } else {
                showToast('Could not find a replacement story. Try again.', 'error');
            }
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
            if (card) {
                card.style.opacity = '1';
                const actionsEl = card.querySelector('.story-card-actions');
                if (actionsEl) actionsEl.innerHTML = `
                    <button class="story-generate-btn" onclick="window.appActions.regenerateStory(${index})" style="font-size:0.7rem;padding:0.3rem 0.6rem;background:none;border:1px solid var(--border);color:var(--text-muted);">🔄 Swap</button>
                    <button class="story-generate-btn" onclick="window.appActions.generateStory(${index})">Generate →</button>
                `;
            }
        } finally { setStatus('Ready'); }
    },

    // Preview email in new window
    previewEmail(index) {
        const post = state.posts[index];
        if (post?.emailHTML) {
            const w = window.open('', '_blank', 'width=640,height=800');
            w.document.write(post.emailHTML);
            w.document.close();
        } else { showToast('Confirm the post first to generate the email.', 'info'); }
    },

    // ─── Copy helpers ───────────────────────────────────────────
    copyEmailHTML(index) {
        const post = state.posts[index];
        if (post?.emailHTML) { copyToClipboard(post.emailHTML); showToast('Email HTML copied!', 'success'); }
    },

    copyEmailSubject(index) {
        const post = state.posts[index];
        if (post?.emailSubject) { copyToClipboard(post.emailSubject); showToast('Email subject copied!', 'success'); }
    },

    copyVideoNarration(index) {
        const post = state.posts[index];
        if (post?.videoNarration) { copyToClipboard(post.videoNarration); showToast('Video narration copied!', 'success'); }
    },

    copyFacebook(index) {
        const post = state.posts[index];
        if (post?.facebook) { copyToClipboard(post.facebook); showToast('Facebook post copied!', 'success'); }
    },

    copyInstagram(index) {
        const post = state.posts[index];
        if (post?.instagram) { copyToClipboard(post.instagram); showToast('Instagram caption copied!', 'success'); }
    },

    copyManusPrompt(index) {
        const post = state.posts[index];
        if (!post) return;
        const chemData = CHEM_DATA[post.pillar?.id] || { id: 'dopamine', name: 'Dopamine', icon: '🟡' };
        const brief = post.manusSlidesBrief || '';
        const topic = state.topics[index] || post.topic || {};
        const sourceArticle = topic.sourceArticle || topic.source || '';
        const articleUrl = topic.articleUrl || '';
        const headline = topic.headline || '';
        const talkingPoints = topic.talkingPoints || [];
        const mechanism = topic.mechanism || '';

        const prompt = `Create a professional 9:16 slide deck for a 45-60 second LinkedIn video.

BRAND: Camino Coaching — Craig Muirhead
CHEMICAL: ${chemData.icon} ${chemData.name}

SOURCE ARTICLE (the slides must reference this story):
- Headline: ${headline || sourceArticle}
${articleUrl ? `- URL: ${articleUrl}` : ''}
${talkingPoints.length > 0 ? `- Key findings: ${talkingPoints.join(' | ')}` : ''}
${mechanism ? `- Brain mechanism: ${mechanism}` : ''}

DESIGN SPECS:
- Format: 9:16 (1080x1920px) — vertical for LinkedIn/Reels
- Background: Deep navy (#0A1628) with subtle gradient
- Primary accent: Teal (#00BFA5) for chemical names and key data
- Secondary accent: Gold (#DAA520) for CTA elements
- Font: Inter or similar clean sans-serif
- Style: Premium, data-driven, dark executive aesthetic
- Each slide should have minimal text (max 15 words) — the avatar narrates over it

${brief}

ADDITIONAL NOTES:
- Slide 1 should reference the source article's hook (person, study, or finding)
- Slide 2 should present the article's key data point or story
- Slide 3 names the brain chemical in teal with one-line description
- Data slides should feature ONE large number with a short label below
- CTA slide needs the assessment URL clearly visible: caminocoaching.co.uk/leader-assessment
- End card: "Camino Coaching" branding + "⭐ 4.9/5 · 85 five-star reviews"
- Export as PowerPoint (.pptx) format for HeyGen PPT-to-Video upload`;

        copyToClipboard(prompt);
        showToast('Manus prompt copied (includes source article)!', 'success');
    },

    // Shorts copy handlers
    copyShortsScript(index) {
        const post = state.posts[index];
        if (post?.shortsNarration) { copyToClipboard(post.shortsNarration); showToast('Shorts script copied — paste into HeyGen!', 'success'); }
        else { showToast('Confirm the post first to generate shorts.', 'info'); }
    },

    copyShortsBrief(index) {
        const post = state.posts[index];
        if (post?.shortsScriptRaw) { copyToClipboard(post.shortsScriptRaw); showToast('Full shorts brief copied — includes Manus slides!', 'success'); }
        else { showToast('Confirm the post first.', 'info'); }
    },

    clearSession() { clearSession(); }
};


// ─── Video Script Modal (Manual Workflow) ───────────────────────
// Workflow: Copy Manus prompt → Manus creates slides → Download slides
//           → Upload to HeyGen PPT-to-Video → Paste pure narration → Generate video
//           → Download video → Upload to GHL planner
function showVideoModal(script, postIndex, chemData, settings) {
    const existing = document.getElementById('video-modal');
    if (existing) existing.remove();

    // ─── Parse script into separate outputs ───────────────────
    // 1. Extract SLIDE DECK BRIEF section (for Manus)
    const slideMatch = script.match(/=== SLIDE DECK BRIEF[\s\S]*?(?====|$)/i);
    const slideDeckBrief = slideMatch ? slideMatch[0].trim() : '';

    // 2. Extract pure narration (strip section headers, timestamps, slide notes, HeyGen notes)
    const videoScriptMatch = script.match(/=== VIDEO SCRIPT ===\s*([\s\S]*?)(?:=== SLIDE DECK BRIEF|$)/i);
    let pureNarration = '';
    if (videoScriptMatch) {
        pureNarration = videoScriptMatch[1]
            // Remove section headers like "HOOK (0-5s):" or "THE SCIENCE (15-35s):"
            .replace(/^[A-Z\s]+([\(\[][\d\w\-–\s]+[\)\]])?:\s*/gm, '')
            // Remove empty lines left behind
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    } else {
        // Fallback: try to strip all section markers from the full script
        pureNarration = script
            .replace(/=== [A-Z\s]+ ===/g, '')
            .replace(/^(HOOK|SCENARIO|THE SCIENCE|THE COST|THE BRIDGE|CTA|Slide \d+)[^:]*:\s*/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    // 3. Build the Manus prompt (full context for creating the slide deck)
    const manusPrompt = `Create a professional 9:16 slide deck for a 45-60 second LinkedIn video.

BRAND: Camino Coaching — Craig Muirhead
TOPIC: Post ${postIndex + 1}
CHEMICAL: ${chemData.icon} ${chemData.name}

DESIGN SPECS:
- Format: 9:16 (1080x1920px) — vertical for LinkedIn/Reels
- Background: Deep navy (#0A1628) with subtle gradient
- Primary accent: Teal (#00BFA5) for chemical names and key data
- Secondary accent: Gold (#DAA520) for CTA elements
- Font: Inter or similar clean sans-serif
- Style: Premium, data-driven, dark executive aesthetic
- Each slide should have minimal text (max 15 words) — the avatar narrates over it
- Include subtle geometric/neuroscience-themed background elements

${slideDeckBrief}

ADDITIONAL NOTES:
- Slide 1 should be bold and scroll-stopping (large text, high contrast)
- Data slides should feature ONE large number with a short label below
- CTA slide needs the assessment URL clearly visible: caminocoaching.co.uk/leader-assessment
- End card: "Camino Coaching" branding + "⭐ 4.9/5 · 85 five-star reviews"
- Export as PowerPoint (.pptx) format for HeyGen PPT-to-Video upload`;

    // 4. Extract social caption if present
    const captionMatch = script.match(/=== SOCIAL CAPTION ===\s*([\s\S]*?)(?:===|$)/i);
    const socialCaption = captionMatch ? captionMatch[1].trim() : '';

    // ─── Build the modal UI ──────────────────────────────────
    const modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:820px;">
        <div class="modal-header">
          <div>
            <h3 style="margin:0;font-size:1.1rem;">🎬 Video Production Kit</h3>
            <span style="font-size:0.75rem;color:var(--text-muted);">Post ${postIndex + 1} · ${chemData.icon} ${chemData.name} · Manual workflow: Manus → HeyGen → GHL</span>
          </div>
          <button class="modal-close" onclick="document.getElementById('video-modal').remove()">&times;</button>
        </div>
        <div class="modal-body" style="max-height:65vh;overflow-y:auto;">

          <!-- STEP 1: Manus Slide Deck -->
          <div style="margin-bottom:1.5rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="background:var(--accent);color:#0A1628;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.75rem;">1</span>
                <span style="font-weight:700;font-size:0.9rem;">📊 Manus Slide Deck Prompt</span>
              </div>
              <div style="display:flex;gap:0.4rem;">
                <button id="video-copy-manus" style="padding:0.35rem 0.75rem;background:var(--neuro-teal);color:#0A1628;border:none;border-radius:6px;font-weight:700;font-size:0.75rem;cursor:pointer;">📋 Copy Prompt</button>
                <a href="https://manus.im" target="_blank" style="padding:0.35rem 0.75rem;background:rgba(255,255,255,0.08);color:var(--text-primary);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:0.75rem;text-decoration:none;display:inline-flex;align-items:center;">🔗 Open Manus</a>
              </div>
            </div>
            <div style="background:#0D1117;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:1rem;max-height:200px;overflow-y:auto;">
              <pre id="manus-prompt-text" style="white-space:pre-wrap;font-size:0.78rem;line-height:1.55;color:var(--text-secondary);font-family:var(--font);margin:0;">${escapeHtml(manusPrompt)}</pre>
            </div>
            <p style="font-size:0.68rem;color:var(--text-muted);margin-top:0.4rem;">Copy this prompt → paste into Manus → download the .pptx slide deck</p>
          </div>

          <!-- STEP 2: HeyGen Narration Script -->
          <div style="margin-bottom:1.5rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="background:var(--accent);color:#0A1628;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.75rem;">2</span>
                <span style="font-weight:700;font-size:0.9rem;">🎙️ HeyGen Narration Script</span>
                <span style="font-size:0.65rem;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:0.15rem 0.5rem;border-radius:var(--r-full);">Pure text — no headers</span>
              </div>
              <div style="display:flex;gap:0.4rem;">
                <button id="video-copy-narration" style="padding:0.35rem 0.75rem;background:var(--neuro-teal);color:#0A1628;border:none;border-radius:6px;font-weight:700;font-size:0.75rem;cursor:pointer;">📋 Copy Script</button>
                <a href="https://app.heygen.com/avatar/ppt-to-video" target="_blank" style="padding:0.35rem 0.75rem;background:rgba(218,165,32,0.12);color:var(--gold);border:1px solid rgba(218,165,32,0.3);border-radius:6px;font-size:0.75rem;text-decoration:none;display:inline-flex;align-items:center;font-weight:600;">🎬 Open HeyGen PPT→Video</a>
              </div>
            </div>
            <div style="background:#0D1117;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:1rem;max-height:200px;overflow-y:auto;">
              <pre id="narration-text" style="white-space:pre-wrap;font-size:0.82rem;line-height:1.65;color:var(--text-primary);font-family:var(--font);margin:0;">${escapeHtml(pureNarration)}</pre>
            </div>
            <p style="font-size:0.68rem;color:var(--text-muted);margin-top:0.4rem;">Upload the .pptx to HeyGen PPT-to-Video → paste this script as narration → generate video</p>
          </div>

          ${socialCaption ? `
          <!-- STEP 3: LinkedIn Caption -->
          <div style="margin-bottom:1rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="background:var(--accent);color:#0A1628;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.75rem;">3</span>
                <span style="font-weight:700;font-size:0.9rem;">💼 LinkedIn Caption</span>
              </div>
              <button id="video-copy-caption" style="padding:0.35rem 0.75rem;background:rgba(255,255,255,0.08);color:var(--text-primary);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:0.75rem;cursor:pointer;">📋 Copy Caption</button>
            </div>
            <div style="background:#0D1117;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:1rem;">
              <pre id="caption-text" style="white-space:pre-wrap;font-size:0.8rem;line-height:1.55;color:var(--text-secondary);font-family:var(--font);margin:0;">${escapeHtml(socialCaption)}</pre>
            </div>
            <p style="font-size:0.68rem;color:var(--text-muted);margin-top:0.4rem;">Post this caption alongside the video on LinkedIn via GHL Social Planner</p>
          </div>
          ` : ''}

          <!-- Full Raw Script (collapsed) -->
          <details style="margin-top:0.5rem;">
            <summary style="font-size:0.75rem;color:var(--text-muted);cursor:pointer;padding:0.4rem 0;">📄 View full raw script (all sections)</summary>
            <div style="background:#0D1117;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:1rem;margin-top:0.5rem;max-height:300px;overflow-y:auto;">
              <pre style="white-space:pre-wrap;font-size:0.75rem;line-height:1.5;color:var(--text-muted);font-family:var(--font);margin:0;">${escapeHtml(script)}</pre>
            </div>
          </details>
        </div>

        <div class="modal-footer" style="display:flex;gap:0.5rem;flex-wrap:wrap;padding:0.75rem 1.5rem;border-top:1px solid var(--border);align-items:center;">
          <span style="font-size:0.7rem;color:var(--text-muted);">Workflow: Copy Manus prompt → Create slides → Upload to HeyGen PPT-to-Video → Paste narration → Upload video to GHL</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    // ─── Button handlers ──────────────────────────────────────
    document.getElementById('video-copy-manus').addEventListener('click', () => {
        copyToClipboard(manusPrompt);
        showToast('Manus slide deck prompt copied!', 'success');
        document.getElementById('video-copy-manus').textContent = '✅ Copied!';
        setTimeout(() => { document.getElementById('video-copy-manus').textContent = '📋 Copy Prompt'; }, 2000);
    });

    document.getElementById('video-copy-narration').addEventListener('click', () => {
        copyToClipboard(pureNarration);
        showToast('HeyGen narration script copied! (pure text, no headers)', 'success');
        document.getElementById('video-copy-narration').textContent = '✅ Copied!';
        setTimeout(() => { document.getElementById('video-copy-narration').textContent = '📋 Copy Script'; }, 2000);
    });

    if (socialCaption) {
        document.getElementById('video-copy-caption')?.addEventListener('click', () => {
            copyToClipboard(socialCaption);
            showToast('LinkedIn caption copied!', 'success');
        });
    }
}


// ═══════════════════════════════════════════════════════════════
// MODE 2: SINGLE POST
// ═══════════════════════════════════════════════════════════════

function initSinglePost() {
    document.getElementById('generate-single-btn')?.addEventListener('click', handleGenerateSingle);
}

async function handleGenerateSingle() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) {
        showToast('Please add your Claude API key in Settings ⚙️ first.', 'error');
        return;
    }

    const input = document.getElementById('single-input')?.value.trim();
    if (!input) {
        showToast('Type or paste something — a link, a topic, or describe a leadership insight.', 'error');
        return;
    }

    // AI decides everything
    const pillar = getRandomPillar();
    const framework = getRandomFramework();
    const cta = getRotatingCTA();
    const authorityLine = getRotatingAuthority();
    const motorsportBridge = getRotatingMotorsportBridge();

    const btn = document.getElementById('generate-single-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('⚡ Generating LinkedIn post...', true);

    const resultContainer = document.getElementById('single-result');
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
        <div class="empty-state">
            <span class="spinner" style="width:32px;height:32px;border-width:3px;"></span>
            <p style="margin-top:1rem;">Generating your LinkedIn post...</p>
        </div>
    `;

    try {
        const content = await generatePost({
            topic: input,
            pillar,
            framework,
            cta,
            authorityLine,
            motorsportBridge,
            apiKey: settings.claudeApiKey,
        });

        const post = { id: `single-${Date.now()}`, content, pillar, framework, cta, topic: { headline: input }, imageUrl: '', edited: false };
        const wordCount = content.split(/\s+/).filter(w => w).length;
        const chem = assignChemical(null, pillar);

        resultContainer.innerHTML = `
      <div class="post-card">
        <div class="post-card-header">
          <div class="post-card-header-left">
            <span class="story-tag chemical" style="background:${chem.color}15;color:${chem.color};border:1px solid ${chem.color}30;">
              ${chem.icon} ${chem.name}
            </span>
            <span class="pillar-badge" style="border: 1px solid ${pillar.color}30; color: ${pillar.color};">
              ${pillar.icon} ${pillar.name}
            </span>
            <span class="framework-badge">${framework.icon} ${framework.name}</span>
            <span class="framework-badge">🎯 ${cta.shortName}</span>
          </div>
          <span class="word-count">${wordCount} words</span>
        </div>
        <div class="post-content" id="single-post-content">${escapeHtml(content)}</div>
        <div class="post-card-footer">
          <div class="post-meta"><span class="word-count">${wordCount} words</span></div>
          <div class="post-actions">
            <button class="post-action-btn" id="single-copy-btn">📋 Copy</button>
            <button class="post-action-btn" id="single-download-btn">💾 .txt</button>
          </div>
        </div>
      </div>
    `;

        document.getElementById('single-copy-btn')?.addEventListener('click', () => {
            copyToClipboard(post.content);
            showToast('Post copied!', 'success');
        });

        document.getElementById('single-download-btn')?.addEventListener('click', () => {
            downloadPostTxt(post, 0);
            showToast('Downloaded!', 'success');
        });

        showToast('LinkedIn post generated!', 'success');
    } catch (err) {
        resultContainer.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">⚠️</span>
        <p>Failed to generate: ${err.message}</p>
      </div>
    `;
        showToast(`Error: ${err.message}`, 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}


// ═══════════════════════════════════════════════════════════════
// EMAIL GENERATION
// ═══════════════════════════════════════════════════════════════

function showEmailModal(emailData, emailHTML, postIndex) {
    document.getElementById('email-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'email-modal';
    modal.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;
        background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;
        padding:1rem;backdrop-filter:blur(4px);
    `;

    modal.innerHTML = `
        <div style="background:var(--bg-secondary,#161B22);border:1px solid rgba(255,255,255,0.08);border-radius:12px;max-width:720px;width:100%;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.06);">
                <div>
                    <div style="font-weight:700;font-size:0.95rem;color:var(--text-primary,#F0F6FC);">📧 Email — Post ${postIndex + 1}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted,#8B949E);margin-top:2px;">Subject: <strong style="color:var(--gold,#DAA520);">${escapeHtml(emailData.subject)}</strong></div>
                </div>
                <button onclick="document.getElementById('email-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;">✕</button>
            </div>
            <div style="flex:1;overflow-y:auto;padding:1rem 1.25rem;">
                <div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;">
                    <button id="email-copy-html-btn" style="padding:0.5rem 1rem;background:var(--neuro-teal,#00BFA5);color:#0A1628;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;">📋 Copy HTML</button>
                    <button id="email-download-btn" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.08);color:var(--text-primary);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:0.8rem;cursor:pointer;">💾 Download</button>
                    <button id="email-copy-subject-btn" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.08);color:var(--text-primary);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:0.8rem;cursor:pointer;">📝 Subject</button>
                    <button id="email-send-ghl-btn" style="padding:0.5rem 1rem;background:var(--gold,#DAA520);color:#0A1628;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;">🚀 Send via GHL</button>
                </div>

                <div id="ghl-send-form" style="display:none;margin-bottom:1rem;padding:0.75rem;background:rgba(218,165,32,0.06);border:1px solid rgba(218,165,32,0.15);border-radius:8px;">
                    <label style="font-size:0.75rem;font-weight:600;color:var(--gold);display:block;margin-bottom:0.4rem;">Recipient Email</label>
                    <div style="display:flex;gap:0.5rem;">
                        <input type="email" id="ghl-recipient-email" class="form-input" placeholder="leader@example.com" style="flex:1;font-size:0.8rem;padding:0.4rem 0.6rem;" />
                        <input type="text" id="ghl-recipient-name" class="form-input" placeholder="Name (optional)" style="width:140px;font-size:0.8rem;padding:0.4rem 0.6rem;" />
                        <button id="ghl-send-confirm-btn" style="padding:0.4rem 1rem;background:var(--green,#2EA043);color:white;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;white-space:nowrap;">✉️ Send</button>
                    </div>
                    <div id="ghl-send-status" style="font-size:0.7rem;color:var(--text-muted);margin-top:0.4rem;"></div>
                </div>

                <div style="border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;background:#0D1117;">
                    <iframe id="email-preview-frame" style="width:100%;height:500px;border:none;"></iframe>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const iframe = document.getElementById('email-preview-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(emailHTML);
    iframeDoc.close();

    // Button handlers
    document.getElementById('email-copy-html-btn').addEventListener('click', () => {
        copyToClipboard(emailHTML);
        showToast('HTML copied!', 'success');
    });

    document.getElementById('email-download-btn').addEventListener('click', () => {
        const blob = new Blob([emailHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-post-${postIndex + 1}.html`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Email downloaded!', 'success');
    });

    document.getElementById('email-copy-subject-btn').addEventListener('click', () => {
        copyToClipboard(emailData.subject);
        showToast('Subject copied!', 'success');
    });

    document.getElementById('email-send-ghl-btn').addEventListener('click', () => {
        const form = document.getElementById('ghl-send-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        if (form.style.display === 'block') document.getElementById('ghl-recipient-email')?.focus();
    });

    document.getElementById('ghl-send-confirm-btn').addEventListener('click', async () => {
        const recipientEmail = document.getElementById('ghl-recipient-email')?.value?.trim();
        const recipientName = document.getElementById('ghl-recipient-name')?.value?.trim();
        const statusEl = document.getElementById('ghl-send-status');

        if (!recipientEmail || !recipientEmail.includes('@')) {
            statusEl.innerHTML = '<span style="color:var(--accent);">Enter a valid email address.</span>';
            return;
        }

        const settings = loadSettings();
        if (!settings.ghlToken) {
            statusEl.innerHTML = '<span style="color:var(--accent);">GHL token not configured. Go to Settings.</span>';
            return;
        }

        statusEl.innerHTML = '<span style="color:var(--gold);">⏳ Sending...</span>';
        document.getElementById('ghl-send-confirm-btn').disabled = true;

        try {
            const result = await dispatchEmail({
                recipientEmail,
                recipientName: recipientName || '',
                subject: emailData.subject,
                html: emailHTML,
                tags: ['nurture-email', 'business-linkedin-engine']
            });
            statusEl.innerHTML = `<span style="color:var(--green);">✅ Sent! Contact: ${result.contactId} ${result.isNewContact ? '(new)' : '(existing)'}</span>`;
            showToast(`Email sent to ${recipientEmail}!`, 'success');
        } catch (err) {
            statusEl.innerHTML = `<span style="color:var(--accent);">❌ ${err.message}</span>`;
        } finally {
            document.getElementById('ghl-send-confirm-btn').disabled = false;
        }
    });

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}


// ─── Bulk Email Generation ────────────────────────────────────
async function handleGenerateAllEmails() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }
    if (state.posts.length === 0) { showToast('No posts to email.', 'error'); return; }

    setStatus('📧 Generating emails for all posts...', true);
    const results = [];

    for (let i = 0; i < state.posts.length; i++) {
        try {
            setStatus(`📧 Generating email ${i + 1}/${state.posts.length}...`, true);
            const emailData = await generateEmail({
                postContent: state.posts[i].content,
                topic: state.posts[i].topic || state.topics[i],
                pillar: state.posts[i].pillar,
                cta: state.posts[i].cta,
                apiKey: settings.claudeApiKey
            });
            const emailHTML = renderEmailHTML(emailData);

            const blob = new Blob([emailHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `email-post-${i + 1}.html`;
            a.click();
            URL.revokeObjectURL(url);
            results.push({ index: i, success: true });
        } catch (err) {
            results.push({ index: i, success: false, error: err.message });
        }
    }

    const successCount = results.filter(r => r.success).length;
    showToast(`${successCount}/${state.posts.length} emails generated and downloaded!`, 'success');
    setStatus('Ready');
}


// ─── Export CSV ────────────────────────────────────────────────
function handleExportCSV() {
    if (state.posts.length === 0) { showToast('No posts to export.', 'error'); return; }
    const dates = getScheduleDates(state.posts.length);
    const filename = exportCSV(state.posts, dates);
    showToast(`Exported ${state.posts.length} posts to ${filename}`, 'success');
}

function handleCopyCSV() {
    if (state.posts.length === 0) { showToast('No posts to copy.', 'error'); return; }
    const dates = getScheduleDates(state.posts.length);
    const csvString = buildCSVString(state.posts, dates);
    copyToClipboard(csvString);
    showToast(`CSV for ${state.posts.length} posts copied!`, 'success');
}
