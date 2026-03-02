// ═══════════════════════════════════════════════════════════════
// ⚡ BUSINESS LEADERS LINKEDIN ENGINE — Settings Manager
// LocalStorage persistence for API keys, preferences
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'business-linkedin-engine-settings';

import {
  isScanDue, getLastScanInfo, getNewReviews, getApprovedPatterns,
  scanForNewReviews, mineReviewForPatterns, approveReviewPattern,
  dismissReview, seedKnownReviews
} from './review-scanner.js';

const DEFAULT_SETTINGS = {
  openaiApiKey: '',
  ghlToken: '',
  ghlLocationId: '',
  publishMethod: 'csv',
  aiModel: 'gpt-4o-mini',
  linkedinGroups: [
    { name: 'CEO & Founder Network', url: '', enabled: true },
    { name: 'Leadership Performance', url: '', enabled: true },
    { name: 'Executive Coaching', url: '', enabled: true }
  ],
  postLength: 'medium',
  brandName: 'Camino Coaching',
  winningFormulaUrl: ''
};

// ─── Load Settings ────────────────────────────────────────────
export function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

// ─── Save Settings ────────────────────────────────────────────
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
}

// ─── Get Single Setting ──────────────────────────────────────
export function getSetting(key) {
  const settings = loadSettings();
  return settings[key];
}

// ─── Update Single Setting ───────────────────────────────────
export function updateSetting(key, value) {
  const settings = loadSettings();
  settings[key] = value;
  return saveSettings(settings);
}

// ─── Render Settings Page ────────────────────────────────────
export function renderSettingsPage() {
  const settings = loadSettings();
  const container = document.getElementById('settings-page');

  container.innerHTML = `
    <div class="page-header">
      <h1>⚙️ Settings</h1>
      <p class="page-subtitle">Configure your API keys, Winning Formula assessment link, and publishing preferences</p>
    </div>

    <div class="settings-grid">
      <!-- API Keys -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">🔑</span>
          <h2>API Keys</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="openai-key">OpenAI API Key</label>
            <div class="input-with-toggle">
              <input type="password" id="openai-key" class="form-input" 
                     value="${settings.openaiApiKey}" 
                     placeholder="sk-..." />
              <button class="btn-icon toggle-visibility" data-target="openai-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Required for content generation. Get yours at platform.openai.com</span>
          </div>

          <div class="form-group">
            <label for="ai-model">AI Model</label>
            <select id="ai-model" class="form-select">
              <option value="gpt-4o" ${settings.aiModel === 'gpt-4o' ? 'selected' : ''}>GPT-4o (Best Quality — low rate limits)</option>
              <option value="gpt-4o-mini" ${settings.aiModel === 'gpt-4o-mini' ? 'selected' : ''}>GPT-4o Mini (Recommended — fast & reliable)</option>
              <option value="gpt-4-turbo" ${settings.aiModel === 'gpt-4-turbo' ? 'selected' : ''}>GPT-4 Turbo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Winning Formula Assessment -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">🎯</span>
          <h2>Winning Formula Assessment</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="winning-formula-url">Assessment URL (ScoreApp)</label>
            <input type="text" id="winning-formula-url" class="form-input"
                   value="${settings.winningFormulaUrl}"
                   placeholder="https://your-scoreapp-url.com" />
            <span class="form-hint">The link to your Winning Formula leadership assessment. This will replace [LINK] in CTAs.</span>
          </div>
        </div>
      </div>

      <!-- GHL Integration -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">📡</span>
          <h2>GHL Integration</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="ghl-token">GHL Private Integration Token</label>
            <div class="input-with-toggle">
              <input type="password" id="ghl-token" class="form-input"
                     value="${settings.ghlToken}"
                     placeholder="Enter your GHL token..." />
              <button class="btn-icon toggle-visibility" data-target="ghl-token" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Optional — needed for direct GHL API scheduling</span>
          </div>

          <div class="form-group">
            <label for="ghl-location">GHL Location ID</label>
            <input type="text" id="ghl-location" class="form-input"
                   value="${settings.ghlLocationId}"
                   placeholder="Enter your location ID..." />
          </div>

          <div class="form-group">
            <label for="publish-method">Publishing Method</label>
            <div class="radio-group">
              <label class="radio-option ${settings.publishMethod === 'csv' ? 'active' : ''}">
                <input type="radio" name="publish-method" value="csv" 
                       ${settings.publishMethod === 'csv' ? 'checked' : ''} />
                <span class="radio-label">
                  <span class="radio-title">📄 CSV Export</span>
                  <span class="radio-desc">Download CSV for manual upload to GHL Social Planner</span>
                </span>
              </label>
              <label class="radio-option ${settings.publishMethod === 'ghl-api' ? 'active' : ''}">
                <input type="radio" name="publish-method" value="ghl-api"
                       ${settings.publishMethod === 'ghl-api' ? 'checked' : ''} />
                <span class="radio-label">
                  <span class="radio-title">🚀 GHL API Direct</span>
                  <span class="radio-desc">Schedule directly via GHL API (requires token above)</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- LinkedIn Groups -->
      <div class="settings-card full-width">
        <div class="settings-card-header">
          <span class="settings-icon">💼</span>
          <h2>LinkedIn Audience Groups</h2>
          <button class="btn-sm btn-accent" id="add-group-btn">+ Add Group</button>
        </div>
        <div class="settings-card-body">
          <div id="groups-list" class="groups-list">
            ${settings.linkedinGroups.map((group, i) => `
              <div class="group-item" data-index="${i}">
                <label class="toggle-switch">
                  <input type="checkbox" ${group.enabled ? 'checked' : ''} class="group-toggle" data-index="${i}" />
                  <span class="toggle-slider"></span>
                </label>
                <input type="text" class="form-input group-name" value="${group.name}" 
                       placeholder="Group name" data-index="${i}" />
                <input type="text" class="form-input group-url" value="${group.url}" 
                       placeholder="LinkedIn group URL" data-index="${i}" />
                <button class="btn-icon btn-danger remove-group" data-index="${i}" title="Remove">✕</button>
              </div>
            `).join('')}
          </div>
          <p class="form-hint">Target LinkedIn groups for cross-posting</p>
        </div>
      </div>

      <!-- Brand -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">🎨</span>
          <h2>Brand Settings</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="brand-name">Brand Name</label>
            <input type="text" id="brand-name" class="form-input"
                   value="${settings.brandName}" placeholder="Your brand name" />
          </div>
          <div class="form-group">
            <label for="post-length">Default Post Length</label>
            <select id="post-length" class="form-select">
              <option value="short" ${settings.postLength === 'short' ? 'selected' : ''}>Short (150-200 words)</option>
              <option value="medium" ${settings.postLength === 'medium' ? 'selected' : ''}>Medium (200-350 words)</option>
              <option value="long" ${settings.postLength === 'long' ? 'selected' : ''}>Long (350-500 words)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Review Scanner -->
      <div class="settings-card full-width">
        <div class="settings-card-header">
          <span class="settings-icon">⭐</span>
          <h2>Review Scanner</h2>
          <span id="review-scan-badge" class="badge" style="margin-left:auto;"></span>
        </div>
        <div class="settings-card-body">
          <div id="review-scanner-status" style="margin-bottom:0.8rem;"></div>
          <div style="display:flex;gap:0.8rem;align-items:center;flex-wrap:wrap;">
            <button class="btn btn-secondary" id="scan-reviews-btn" style="min-width:160px;">
              <span class="btn-icon-left">🔍</span> Scan Trustpilot
            </button>
            <a href="https://uk.trustpilot.com/review/caminocoaching.co.uk" target="_blank" 
               style="font-size:0.75rem;color:var(--blue);text-decoration:none;">View on Trustpilot ↗</a>
          </div>
          <div id="new-reviews-container" style="margin-top:1rem;"></div>
          <div id="approved-patterns-container" style="margin-top:1rem;"></div>
        </div>
      </div>
    </div>

    <div class="settings-actions">
      <button class="btn btn-primary btn-lg" id="save-settings-btn">
        <span class="btn-icon-left">💾</span> Save Settings
      </button>
      <span class="save-status" id="save-status"></span>
    </div>
  `;

  // Seed known reviews on first load
  seedKnownReviews();

  attachSettingsListeners(settings);
  renderReviewScanner();
}

// ─── Review Scanner UI ───────────────────────────────────────
function renderReviewScanner() {
  const scanInfo = getLastScanInfo();
  const newReviews = getNewReviews();
  const approved = getApprovedPatterns();
  const statusEl = document.getElementById('review-scanner-status');
  const badgeEl = document.getElementById('review-scan-badge');
  const newContainer = document.getElementById('new-reviews-container');
  const approvedContainer = document.getElementById('approved-patterns-container');

  if (!statusEl) return;

  // Status line
  if (scanInfo.lastScanDate) {
    const lastDate = new Date(scanInfo.lastScanDate);
    const daysSince = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
    const dueClass = scanInfo.isDue ? 'color:var(--accent);font-weight:600;' : 'color:var(--green);';
    statusEl.innerHTML = `
            <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;font-size:0.8rem;">
                <span style="color:var(--text-secondary);">Last scan: <strong>${lastDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
                <span style="${dueClass}">${scanInfo.isDue ? '⚠️ Scan overdue' : `✅ ${daysSince}d ago`}</span>
                <span style="color:var(--text-muted);">📝 ${scanInfo.totalReviews} total reviews on Trustpilot</span>
            </div>
        `;
  } else {
    statusEl.innerHTML = `<span style="font-size:0.8rem;color:var(--text-muted);">No scans yet — click Scan Trustpilot to check for reviews</span>`;
  }

  // Badge
  if (newReviews.length > 0) {
    badgeEl.textContent = `${newReviews.length} new`;
    badgeEl.style.cssText = 'margin-left:auto;background:rgba(255,107,53,0.15);color:#ff6b35;padding:0.15rem 0.5rem;border-radius:999px;font-size:0.7rem;font-weight:600;';
  } else if (scanInfo.isDue) {
    badgeEl.textContent = 'Scan due';
    badgeEl.style.cssText = 'margin-left:auto;background:rgba(255,68,68,0.1);color:var(--accent);padding:0.15rem 0.5rem;border-radius:999px;font-size:0.7rem;';
  } else {
    badgeEl.textContent = 'Up to date';
    badgeEl.style.cssText = 'margin-left:auto;background:rgba(16,185,129,0.1);color:var(--green);padding:0.15rem 0.5rem;border-radius:999px;font-size:0.7rem;';
  }

  // New reviews
  if (newReviews.length > 0) {
    newContainer.innerHTML = `
            <div style="font-size:0.78rem;font-weight:600;color:var(--text-primary);margin-bottom:0.5rem;">🆕 New Reviews Found (${newReviews.length})</div>
            ${newReviews.map((review, i) => `
                <div class="new-review-card" data-index="${i}" style="padding:0.6rem 0.8rem;margin-bottom:0.5rem;background:rgba(255,107,53,0.05);border:1px solid rgba(255,107,53,0.15);border-radius:var(--r-sm);font-size:0.75rem;">
                    <div style="display:flex;justify-content:space-between;align-items:start;gap:0.5rem;">
                        <div style="flex:1;">
                            <strong style="color:var(--text-primary);">${escapeHtml(review.reviewTitle || '')}</strong>
                            <span style="color:var(--text-muted);margin-left:0.4rem;">— ${escapeHtml(review.reviewerName || '')} (${review.country || ''})</span>
                            <div style="color:var(--text-secondary);margin-top:0.3rem;line-height:1.4;">${escapeHtml((review.reviewText || '').substring(0, 200))}${(review.reviewText || '').length > 200 ? '...' : ''}</div>
                        </div>
                        <div style="display:flex;gap:0.3rem;flex-shrink:0;">
                            <button class="btn btn-sm btn-secondary mine-review-btn" data-index="${i}" style="font-size:0.65rem;padding:0.2rem 0.5rem;">🔬 Mine Pattern</button>
                            <button class="btn btn-sm dismiss-review-btn" data-index="${i}" style="font-size:0.65rem;padding:0.2rem 0.4rem;background:transparent;color:var(--text-muted);border:1px solid rgba(255,255,255,0.08);">✕</button>
                        </div>
                    </div>
                    <div class="mined-pattern-result" id="mined-result-${i}" style="display:none;margin-top:0.5rem;padding:0.5rem;background:rgba(105,219,124,0.06);border:1px solid rgba(105,219,124,0.15);border-radius:var(--r-xs);"></div>
                </div>
            `).join('')}
        `;

    // Attach mine/dismiss handlers
    newContainer.querySelectorAll('.mine-review-btn').forEach(btn => {
      btn.addEventListener('click', () => handleMineReview(parseInt(btn.dataset.index)));
    });
    newContainer.querySelectorAll('.dismiss-review-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dismissReview(parseInt(btn.dataset.index));
        renderReviewScanner();
        showToast('Review dismissed', 'info');
      });
    });
  } else {
    newContainer.innerHTML = '';
  }

  // Approved patterns
  if (approved.length > 0) {
    approvedContainer.innerHTML = `
            <div style="font-size:0.78rem;font-weight:600;color:var(--green);margin-bottom:0.4rem;">✅ Approved Language Patterns (${approved.length})</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
                ${approved.map(p => `<span style="padding:0.15rem 0.5rem;background:rgba(105,219,124,0.08);color:var(--green);border-radius:999px;font-size:0.68rem;font-weight:500;">${escapeHtml(p.pattern)}</span>`).join('')}
            </div>
        `;
  } else {
    approvedContainer.innerHTML = '';
  }
}

async function handleMineReview(index) {
  const settings = loadSettings();
  if (!settings.openaiApiKey) {
    showToast('Add your OpenAI API key first.', 'error');
    return;
  }

  const reviews = getNewReviews();
  const review = reviews[index];
  if (!review) return;

  const resultEl = document.getElementById(`mined-result-${index}`);
  const btn = document.querySelector(`.mine-review-btn[data-index="${index}"]`);
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Mining...'; }
  if (resultEl) { resultEl.style.display = 'block'; resultEl.innerHTML = '<span style="color:var(--text-muted);font-size:0.72rem;">🔬 AI is analysing this review for language patterns...</span>'; }

  try {
    const pattern = await mineReviewForPatterns(review, settings.openaiApiKey);

    if (resultEl) {
      resultEl.innerHTML = `
                <div style="font-size:0.72rem;">
                    <div style="margin-bottom:0.3rem;"><strong style="color:var(--green);">Pattern:</strong> <span style="color:var(--text-primary);font-weight:600;">${escapeHtml(pattern.pattern)}</span></div>
                    <div style="margin-bottom:0.3rem;"><strong style="color:var(--blue);">Client phrase:</strong> <span style="color:var(--text-secondary);">"${escapeHtml(pattern.clientPhrase)}"</span></div>
                    <div style="margin-bottom:0.3rem;"><strong style="color:#ff6b35;">Business mirror:</strong> <span style="color:var(--text-secondary);">"${escapeHtml(pattern.businessMirror)}"</span></div>
                    ${pattern.caseStudySetup ? `<div style="margin-bottom:0.3rem;"><strong style="color:var(--purple);">📖 Case study:</strong> <span style="color:var(--text-muted);">${escapeHtml(pattern.caseStudySetup)}</span></div>` : ''}
                    <div style="display:flex;gap:0.4rem;margin-top:0.4rem;">
                        <button class="btn btn-sm approve-pattern-btn" data-index="${index}" style="font-size:0.65rem;padding:0.2rem 0.6rem;background:var(--green);color:#000;font-weight:600;">✅ Approve</button>
                        <button class="btn btn-sm skip-pattern-btn" data-index="${index}" style="font-size:0.65rem;padding:0.2rem 0.5rem;background:transparent;color:var(--text-muted);border:1px solid rgba(255,255,255,0.08);">Skip</button>
                    </div>
                </div>
            `;

      // Store the pattern temporarily on the button for approval
      resultEl.querySelector('.approve-pattern-btn')?.addEventListener('click', () => {
        approveReviewPattern(index, pattern);
        renderReviewScanner();
        showToast(`"${pattern.pattern}" added to language bank!`, 'success');
      });
      resultEl.querySelector('.skip-pattern-btn')?.addEventListener('click', () => {
        resultEl.style.display = 'none';
        if (btn) { btn.disabled = false; btn.textContent = '🔬 Mine Pattern'; }
      });
    }
  } catch (err) {
    if (resultEl) {
      resultEl.innerHTML = `<span style="color:var(--accent);font-size:0.72rem;">❌ ${escapeHtml(err.message)}</span>`;
    }
    if (btn) { btn.disabled = false; btn.textContent = '🔬 Mine Pattern'; }
  }
}

// ─── Attach Settings Event Listeners ─────────────────────────
function attachSettingsListeners(settings) {
  document.getElementById('save-settings-btn')?.addEventListener('click', () => {
    const updated = gatherSettingsFromForm();
    if (saveSettings(updated)) {
      const status = document.getElementById('save-status');
      status.textContent = '✅ Settings saved!';
      status.classList.add('visible');
      setTimeout(() => status.classList.remove('visible'), 2000);
      showToast('Settings saved successfully', 'success');
    }
  });

  // Review Scanner
  document.getElementById('scan-reviews-btn')?.addEventListener('click', async () => {
    const settings = loadSettings();
    if (!settings.openaiApiKey) {
      showToast('Add your OpenAI API key first.', 'error');
      return;
    }
    const btn = document.getElementById('scan-reviews-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:0.4rem;"></span> Scanning...';
    try {
      const result = await scanForNewReviews(settings.openaiApiKey);
      renderReviewScanner();
      if (result.newFound > 0) {
        showToast(`Found ${result.newFound} new review${result.newFound > 1 ? 's' : ''}! Mine them for language patterns.`, 'success');
      } else {
        showToast(`Scan complete. ${result.totalScanned} reviews checked, no new ones found.`, 'info');
      }
    } catch (err) {
      showToast(`Scan failed: ${err.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span class="btn-icon-left">🔍</span> Scan Trustpilot';
    }
  });

  document.querySelectorAll('.toggle-visibility').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.querySelector('.eye-icon').textContent = input.type === 'password' ? '👁️' : '🙈';
      }
    });
  });

  document.querySelectorAll('.radio-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('active'));
      radio.closest('.radio-option').classList.add('active');
    });
  });

  document.getElementById('add-group-btn')?.addEventListener('click', () => {
    const list = document.getElementById('groups-list');
    const index = list.children.length;
    const html = `
      <div class="group-item" data-index="${index}">
        <label class="toggle-switch">
          <input type="checkbox" checked class="group-toggle" data-index="${index}" />
          <span class="toggle-slider"></span>
        </label>
        <input type="text" class="form-input group-name" value="" 
               placeholder="Group name" data-index="${index}" />
        <input type="text" class="form-input group-url" value="" 
               placeholder="LinkedIn group URL" data-index="${index}" />
        <button class="btn-icon btn-danger remove-group" data-index="${index}" title="Remove">✕</button>
      </div>
    `;
    list.insertAdjacentHTML('beforeend', html);

    list.lastElementChild.querySelector('.remove-group').addEventListener('click', (e) => {
      e.target.closest('.group-item').remove();
    });
  });

  document.querySelectorAll('.remove-group').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.group-item').remove();
    });
  });
}

// ─── Gather Settings From Form ───────────────────────────────
function gatherSettingsFromForm() {
  const groups = [];
  document.querySelectorAll('.group-item').forEach(item => {
    groups.push({
      name: item.querySelector('.group-name')?.value || '',
      url: item.querySelector('.group-url')?.value || '',
      enabled: item.querySelector('.group-toggle')?.checked || false
    });
  });

  return {
    openaiApiKey: document.getElementById('openai-key')?.value || '',
    ghlToken: document.getElementById('ghl-token')?.value || '',
    ghlLocationId: document.getElementById('ghl-location')?.value || '',
    publishMethod: document.querySelector('input[name="publish-method"]:checked')?.value || 'csv',
    aiModel: document.getElementById('ai-model')?.value || 'gpt-4o-mini',
    linkedinGroups: groups,
    brandName: document.getElementById('brand-name')?.value || 'Camino Coaching',
    postLength: document.getElementById('post-length')?.value || 'medium',
    winningFormulaUrl: document.getElementById('winning-formula-url')?.value || ''
  };
}

// ─── Toast Helper ────────────────────────────────────────────
function showToast(message, type = 'info') {
  const event = new CustomEvent('show-toast', { detail: { message, type } });
  document.dispatchEvent(event);
}

// ─── Escape HTML Helper ──────────────────────────────────────
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
