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
    generateVideoScript, adaptPostForPlatforms, storeUsedArticles, storeUsedHooks,
    generateEmail, renderEmailHTML
} from './ai-service.js';

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
}


// ─── Step 1: Find Stories ─────────────────────────────────────
async function handleFindStories() {
    const settings = loadSettings();
    if (!settings.geminiApiKey) {
        showToast('Please add your Gemini API key in Settings ⚙️ first.', 'error');
        return;
    }

    const btn = document.getElementById('find-stories-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('🔍 Searching the web for leadership stories...', true);

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

        // Generate topics via Gemini web search
        state.topics = await generateTopics(
            state.weeklyPillars,
            state.seasonalContext,
            settings.geminiApiKey
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

        renderStoryCards();
        showContainer('stories-container');
        saveSession();
        showToast('7 stories found! Tap any to generate, or Write All 7.', 'success');
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
        const source = story.sourceUrl
            ? new URL(story.sourceUrl).hostname.replace('www.', '')
            : story.source || '';

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
        </div>
        <div class="story-card-body">
          <h3 class="story-headline">${escapeHtml(story.headline || story.topic || '')}</h3>
          ${story.angle ? `<p class="story-angle">${escapeHtml(story.angle)}</p>` : ''}
          <div class="story-source">${escapeHtml(source)}</div>
        </div>
        <div class="story-card-actions">
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
              <button class="post-action-btn" onclick="window.appActions.copyPost(${i})">📋 LinkedIn</button>
              <button class="post-action-btn" onclick="window.appActions.copyFacebook(${i})" style="color:#1877F2;">📋 Facebook</button>
              <button class="post-action-btn" onclick="window.appActions.copyInstagram(${i})" style="color:#E1306C;">📋 Instagram</button>
              <button class="post-action-btn" onclick="window.appActions.unconfirmPost(${i})" style="color:var(--text-muted);font-size:0.65rem;">↩ Edit</button>
            `}
          </div>
        </div>

        ${isConfirmed ? renderProductionKit(post, i) : ''}
      </div>
    `;
    }).join('');
}

// ─── Production Kit (FB + IG + Email + Video) ─────────────────
function renderProductionKit(post, index) {
    return `
    <div class="production-kit" id="production-kit-${index}">
      ${post.facebook ? renderInlinePlatforms(post, index) : `<div id="platforms-slot-${index}" class="production-slot"><span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Generating Facebook + Instagram versions...</div>`}
      ${post.emailHTML ? renderInlineEmail(post, index) : `<div id="email-slot-${index}" class="production-slot"><span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Generating email HTML...</div>`}
      ${post.videoNarration ? renderInlineVideo(post, index) : `<div id="video-slot-${index}" class="production-slot"><span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Generating video script...</div>`}
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
    return `
    <div class="production-slot" id="email-slot-${index}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
        <span style="font-weight:700;font-size:0.8rem;color:var(--gold,#DAA520);">📧 Email HTML</span>
        <div style="display:flex;gap:0.35rem;">
          <button class="post-action-btn" onclick="window.appActions.copyEmailHTML(${index})" style="color:var(--gold);">📋 Copy HTML</button>
          <button class="post-action-btn" onclick="window.appActions.copyEmailSubject(${index})">📝 Subject</button>
        </div>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.4rem;">Subject: <strong style="color:var(--gold);">${escapeHtml(post.emailSubject || '')}</strong></div>
      <div style="border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;background:#0D1117;">
        <iframe id="email-frame-${index}" style="width:100%;height:320px;border:none;" srcdoc="${escapeHtml(post.emailHTML || '')}"></iframe>
      </div>
    </div>`;
}

// ─── Inline Video Narration Render ────────────────────────────
function renderInlineVideo(post, index) {
    return `
    <div class="production-slot" id="video-slot-${index}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
        <span style="font-weight:700;font-size:0.8rem;color:var(--neuro-teal,#00BFA5);">🎬 Video Narration Script</span>
        <div style="display:flex;gap:0.35rem;">
          <button class="post-action-btn" onclick="window.appActions.copyVideoNarration(${index})" style="color:var(--neuro-teal);">📋 Copy Script</button>
          <button class="post-action-btn" onclick="window.appActions.copyManusPrompt(${index})">📊 Manus Prompt</button>
        </div>
      </div>
      <div style="font-size:0.65rem;color:var(--text-muted);margin-bottom:0.4rem;">Pure narration — no headers or timings. Paste directly into HeyGen.</div>
      <div style="background:#0D1117;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:0.75rem;max-height:250px;overflow-y:auto;">
        <pre id="narration-${index}" style="white-space:pre-wrap;font-size:0.8rem;line-height:1.6;color:var(--text-primary);font-family:var(--font);margin:0;">${escapeHtml(post.videoNarration || '')}</pre>
      </div>
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

        setStatus(`Writing post for story ${index + 1}...`, true);
        try {
            const content = await generatePost({
                topic: story.headline || story.topic,
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

            // If all posts are generated, show posts view
            if (state.posts.filter(Boolean).length === state.stories.length) {
                renderPosts();
                showContainer('posts-container');
            } else {
                // Show inline preview on the story card
                const card = document.querySelector(`.story-card[data-index="${index}"]`);
                if (card) {
                    card.querySelector('.story-card-actions').innerHTML = `
                        <span style="color:var(--green);font-size:0.75rem;font-weight:600;">✅ Generated</span>
                    `;
                    card.style.borderColor = 'rgba(46,160,67,0.3)';
                }
            }
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally { setStatus('Ready'); }
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

        setStatus(`📧🎬 Post ${index + 1}: Generating FB, IG, email, video...`, true);

        const promises = [];

        // 1. Facebook + Instagram versions
        if (!post.facebook) {
            promises.push(
                adaptPostForPlatforms({
                    postContent: post.content,
                    pillar: post.pillar,
                    cta: post.cta,
                    apiKey: settings.claudeApiKey
                }).then(platforms => {
                    post.facebook = platforms.facebook;
                    post.instagram = platforms.instagram;
                    const slot = document.getElementById(`platforms-slot-${index}`);
                    if (slot) slot.outerHTML = renderInlinePlatforms(post, index);
                }).catch(err => {
                    const slot = document.getElementById(`platforms-slot-${index}`);
                    if (slot) slot.innerHTML = `<span style="color:#e84444;font-size:0.75rem;">❌ Platform error: ${err.message}</span>`;
                })
            );
        }

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

        await Promise.all(promises);
        saveSession();
        setStatus('Ready');
        showToast(`Post ${index + 1}: all outputs ready! LinkedIn, Facebook, Instagram, Email, Video.`, 'success');
    },

    unconfirmPost(index) {
        const post = state.posts[index];
        if (!post) return;
        post.confirmed = false;
        renderPosts();
        saveSession();
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

        const prompt = `Create a professional 9:16 slide deck for a 45-60 second LinkedIn video.

BRAND: Camino Coaching — Craig Muirhead
TOPIC: Post ${index + 1}
CHEMICAL: ${chemData.icon} ${chemData.name}

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
- Slide 1 should be bold and scroll-stopping (large text, high contrast)
- Data slides should feature ONE large number with a short label below
- CTA slide needs the assessment URL clearly visible: caminocoaching.co.uk/leader-assessment
- End card: "Camino Coaching" branding + "⭐ 4.9/5 · 85 five-star reviews"
- Export as PowerPoint (.pptx) format for HeyGen PPT-to-Video upload`;

        copyToClipboard(prompt);
        showToast('Manus slide deck prompt copied!', 'success');
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
