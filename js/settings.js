// ═══════════════════════════════════════════════════════════════
// ⚡ BUSINESS LEADERS LINKEDIN ENGINE — Settings Manager
// LocalStorage persistence for API keys, preferences
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'business-linkedin-engine-settings';

// ─── Live Error Log (global interceptor) ─────────────────────
const _appLog = [];
const MAX_LOG_ENTRIES = 200;

function addLogEntry(level, ...args) {
  const msg = args.map(a => {
    if (a instanceof Error) return `${a.message}\n${a.stack || ''}`;
    if (typeof a === 'object') try { return JSON.stringify(a, null, 2); } catch { return String(a); }
    return String(a);
  }).join(' ');
  _appLog.push({ time: new Date(), level, msg });
  if (_appLog.length > MAX_LOG_ENTRIES) _appLog.splice(0, _appLog.length - MAX_LOG_ENTRIES);
  // Live-update the log panel if visible
  const logEl = document.getElementById('live-log-content');
  const counterEl = document.getElementById('log-error-count');
  if (logEl) {
    const entry = formatLogEntry(_appLog[_appLog.length - 1]);
    logEl.insertAdjacentHTML('beforeend', entry);
    logEl.scrollTop = logEl.scrollHeight;
  }
  if (counterEl) {
    const errCount = _appLog.filter(e => e.level === 'error').length;
    counterEl.textContent = errCount > 0 ? `${errCount} error${errCount > 1 ? 's' : ''}` : 'No errors';
    counterEl.style.color = errCount > 0 ? '#e84444' : 'var(--green, #2EA043)';
  }
}

function formatLogEntry(entry) {
  const timeStr = entry.time.toLocaleTimeString('en-GB', { hour12: false });
  const colors = { error: '#e84444', warn: '#DAA520', info: '#00BFA5', log: '#8B949E' };
  const icons = { error: '❌', warn: '⚠️', info: 'ℹ️', log: '📝' };
  const color = colors[entry.level] || colors.log;
  const icon = icons[entry.level] || icons.log;
  const escapedMsg = entry.msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<div style="padding:0.25rem 0;border-bottom:1px solid rgba(255,255,255,0.03);font-size:0.72rem;line-height:1.45;">
        <span style="color:${color};font-weight:700;">${icon} ${timeStr}</span>
        <span style="color:${color};margin-left:0.3rem;opacity:0.7;font-size:0.62rem;text-transform:uppercase;">[${entry.level}]</span>
        <pre style="margin:0.1rem 0 0;white-space:pre-wrap;word-break:break-word;color:${color === '#8B949E' ? 'var(--text-secondary)' : color};font-family:var(--font);font-size:0.72rem;">${escapedMsg}</pre>
    </div>`;
}

// Install interceptor ONCE
if (!window.__appLogInstalled) {
  window.__appLogInstalled = true;
  const origError = console.error;
  const origWarn = console.warn;
  console.error = function (...args) { addLogEntry('error', ...args); origError.apply(console, args); };
  console.warn = function (...args) { addLogEntry('warn', ...args); origWarn.apply(console, args); };
  window.addEventListener('unhandledrejection', (e) => {
    addLogEntry('error', 'Unhandled Promise Rejection:', e.reason?.message || e.reason || 'Unknown error');
  });
  window.addEventListener('error', (e) => {
    addLogEntry('error', `${e.message} (${e.filename}:${e.lineno})`);
  });
  addLogEntry('info', 'App started — log interceptor active.');
}

// Public API for other modules to push to log
export function appLog(level, ...args) { addLogEntry(level, ...args); }
export function getAppLog() { return _appLog; }

const DEFAULT_SETTINGS = {
  geminiApiKey: '',
  claudeApiKey: '',
  heygenApiKey: '',
  heygenAvatarId: '',
  heygenVoiceId: '',
  manusApiKey: '',
  canvaApiToken: '',
  canvaPostTemplateId: '',
  ghlToken: '',
  ghlLocationId: '',
  ghlEmailFrom: '',
  publishMethod: 'csv',
  linkedinGroups: [
    { name: 'CEOs & Founders Network', url: '', enabled: true },
    { name: 'Leadership & Mental Performance', url: '', enabled: true },
    { name: 'Business Growth & Strategy', url: '', enabled: true }
  ],
  postLength: 'medium',
  brandName: 'Camino Coaching',
  assessmentUrl: 'https://caminocoaching.co.uk/leader-assessment',
  blueprintUrl: 'https://academy.caminocoaching.co.uk/executive-flow-blueprint/order/'
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
      <p class="page-subtitle">Configure your API keys, assessment links, and publishing preferences</p>
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
            <label for="gemini-key">🔍 Gemini API Key <span style="font-size:0.7rem;color:var(--neuro-teal);">(Research — Google Search Grounding)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="gemini-key" class="form-input" 
                     value="${settings.geminiApiKey}" 
                     placeholder="AIza..." />
              <button class="btn-icon toggle-visibility" data-target="gemini-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Searches live Google for fresh articles every week. Get yours at aistudio.google.com</span>
          </div>

          <div class="form-group">
            <label for="claude-key">✍️ Claude API Key <span style="font-size:0.7rem;color:var(--purple);">(Writing — Craig's Voice)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="claude-key" class="form-input" 
                     value="${settings.claudeApiKey}" 
                     placeholder="sk-ant-..." />
              <button class="btn-icon toggle-visibility" data-target="claude-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Writes all posts and video scripts in Craig's voice. Get yours at console.anthropic.com</span>
          </div>

          <div class="form-group">
            <label for="heygen-key">🎬 HeyGen API Key <span style="font-size:0.7rem;color:var(--gold);">(Video Production — AI Avatar)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="heygen-key" class="form-input" 
                     value="${settings.heygenApiKey}" 
                     placeholder="Enter HeyGen API key..." />
              <button class="btn-icon toggle-visibility" data-target="heygen-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">For automated video generation with your AI avatar. Get yours at app.heygen.com/settings</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div class="form-group">
              <label for="heygen-avatar">HeyGen Avatar ID</label>
              <input type="text" id="heygen-avatar" class="form-input"
                     value="${settings.heygenAvatarId}" placeholder="e.g. josh_lite3_20230714" />
              <span class="form-hint">Your avatar's ID from HeyGen dashboard</span>
            </div>
            <div class="form-group">
              <label for="heygen-voice">HeyGen Voice ID</label>
              <input type="text" id="heygen-voice" class="form-input"
                     value="${settings.heygenVoiceId}" placeholder="e.g. 1bd001e7e50f421d891986aed6e1" />
              <span class="form-hint">Your voice clone or selected voice ID</span>
            </div>
          </div>

          <div class="form-group">
            <label for="manus-key">🎨 Manus API Key <span style="font-size:0.7rem;color:var(--purple);">(Slide Deck Generation)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="manus-key" class="form-input"
                     value="${settings.manusApiKey}"
                     placeholder="Enter Manus API key..." />
              <button class="btn-icon toggle-visibility" data-target="manus-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Auto-generates slide decks from video script briefs. Get yours at manus.im/settings</span>
          </div>

          <div class="form-group">
            <label for="canva-token">🖼️ Canva API Token <span style="font-size:0.7rem;color:var(--blue);">(Post Image Autofill)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="canva-token" class="form-input"
                     value="${settings.canvaApiToken}"
                     placeholder="Enter Canva API token..." />
              <button class="btn-icon toggle-visibility" data-target="canva-token" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Auto-fills brand templates with post content. Set up at canva.dev</span>
          </div>
          <div class="form-group">
            <label for="canva-template">Canva Post Template ID</label>
            <input type="text" id="canva-template" class="form-input"
                   value="${settings.canvaPostTemplateId}" placeholder="DAGx..." />
            <span class="form-hint">ID of your Canva brand template for post images (found in Canva template URL)</span>
          </div>
        </div>
      </div>

      <!-- Lead Magnet / Assessment Links -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">🎯</span>
          <h2>Assessment & Funnel URLs</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="assessment-url">🏆 Winning Formula Assessment (PRIMARY CTA)</label>
            <input type="text" id="assessment-url" class="form-input"
                   value="${settings.assessmentUrl}"
                   placeholder="https://caminocoaching.co.uk/leader-assessment" />
            <span class="form-hint">✅ ScoreApp assessment — 25 questions, 3 minutes, instant report — Used in all CTAs</span>
          </div>
          <div class="form-group">
            <label for="blueprint-url">📘 Executive Flow Blueprint (Free Training)</label>
            <input type="text" id="blueprint-url" class="form-input"
                   value="${settings.blueprintUrl}"
                   placeholder="https://academy.caminocoaching.co.uk/executive-flow-blueprint/order/" />
            <span class="form-hint">3-day free training — Opens 3x/year (Jan, May, Sep) — Bridge from assessment to strategy call</span>
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
            <label for="ghl-token">🔑 GHL Private Integration Token <span style="font-size:0.7rem;color:var(--green);">(API v2 — Bearer Auth)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="ghl-token" class="form-input"
                     value="${settings.ghlToken}"
                     placeholder="Enter your GHL Private Integration token..." />
              <button class="btn-icon toggle-visibility" data-target="ghl-token" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Required for direct email dispatch. Agency Settings → Private Integrations → ensure conversations/message.write + contacts.write scopes</span>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div class="form-group">
              <label for="ghl-location">Location ID</label>
              <input type="text" id="ghl-location" class="form-input"
                     value="${settings.ghlLocationId}"
                     placeholder="e.g. vdgR8teGuIgHPMPzbQkK" />
              <span class="form-hint">Sub-account ID for contact upsert</span>
            </div>
            <div class="form-group">
              <label for="ghl-email-from">Verified Sender Email</label>
              <input type="email" id="ghl-email-from" class="form-input"
                     value="${settings.ghlEmailFrom}"
                     placeholder="e.g. craig@caminocoaching.co.uk" />
              <span class="form-hint">Must be from your LC Email dedicated domain</span>
            </div>
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
                       placeholder="Group URL" data-index="${i}" />
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
              <option value="short" ${settings.postLength === 'short' ? 'selected' : ''}>Short (100-200 words)</option>
              <option value="medium" ${settings.postLength === 'medium' ? 'selected' : ''}>Medium (200-350 words)</option>
              <option value="long" ${settings.postLength === 'long' ? 'selected' : ''}>Long (350-500 words)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Live Error Log -->
      <div class="settings-card full-width">
        <div class="settings-card-header">
          <span class="settings-icon">📋</span>
          <h2>Live Activity Log</h2>
          <span id="log-error-count" style="font-size:0.72rem;font-weight:700;margin-left:auto;">No errors</span>
        </div>
        <div class="settings-card-body" style="padding:0;">
          <div style="display:flex;gap:0.4rem;padding:0.5rem 0.75rem;border-bottom:1px solid rgba(255,255,255,0.06);">
            <button id="log-clear-btn" style="padding:0.3rem 0.6rem;background:rgba(232,68,68,0.1);color:#e84444;border:1px solid rgba(232,68,68,0.2);border-radius:5px;font-size:0.68rem;font-weight:600;cursor:pointer;">🗑 Clear</button>
            <button id="log-copy-btn" style="padding:0.3rem 0.6rem;background:rgba(0,191,165,0.1);color:var(--neuro-teal);border:1px solid rgba(0,191,165,0.2);border-radius:5px;font-size:0.68rem;font-weight:600;cursor:pointer;">📋 Copy All</button>
            <span style="font-size:0.62rem;color:var(--text-muted);margin-left:auto;align-self:center;">Captures errors, warnings, and API failures in real-time</span>
          </div>
          <div id="live-log-content" style="max-height:320px;overflow-y:auto;padding:0.5rem 0.75rem;background:#0A0E14;border-radius:0 0 8px 8px;font-family:var(--font);">
            ${_appLog.length > 0 ? _appLog.map(e => formatLogEntry(e)).join('') : '<div style="padding:1rem;text-align:center;color:var(--text-muted);font-size:0.75rem;">No log entries yet. Errors and API failures will appear here automatically.</div>'}
          </div>
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

  attachSettingsListeners(settings);
  attachLogListeners();
}

// ─── Log Panel Listeners ─────────────────────────────────────
function attachLogListeners() {
  document.getElementById('log-clear-btn')?.addEventListener('click', () => {
    _appLog.length = 0;
    const logEl = document.getElementById('live-log-content');
    if (logEl) logEl.innerHTML = '<div style="padding:1rem;text-align:center;color:var(--text-muted);font-size:0.75rem;">Log cleared.</div>';
    const counterEl = document.getElementById('log-error-count');
    if (counterEl) { counterEl.textContent = 'No errors'; counterEl.style.color = 'var(--green, #2EA043)'; }
    showToast('Log cleared.', 'success');
  });

  document.getElementById('log-copy-btn')?.addEventListener('click', () => {
    const text = _appLog.map(e => {
      const t = e.time.toLocaleTimeString('en-GB', { hour12: false });
      return `[${t}] [${e.level.toUpperCase()}] ${e.msg}`;
    }).join('\n');
    navigator.clipboard.writeText(text || 'No log entries.');
    showToast('Log copied to clipboard!', 'success');
  });

  // Update error count on render
  const counterEl = document.getElementById('log-error-count');
  if (counterEl) {
    const errCount = _appLog.filter(e => e.level === 'error').length;
    counterEl.textContent = errCount > 0 ? `${errCount} error${errCount > 1 ? 's' : ''}` : 'No errors';
    counterEl.style.color = errCount > 0 ? '#e84444' : 'var(--green, #2EA043)';
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
               placeholder="Group URL" data-index="${index}" />
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
    geminiApiKey: (document.getElementById('gemini-key')?.value || '').trim(),
    claudeApiKey: (document.getElementById('claude-key')?.value || '').trim(),
    heygenApiKey: (document.getElementById('heygen-key')?.value || '').trim(),
    heygenAvatarId: (document.getElementById('heygen-avatar')?.value || '').trim(),
    heygenVoiceId: (document.getElementById('heygen-voice')?.value || '').trim(),
    manusApiKey: (document.getElementById('manus-key')?.value || '').trim(),
    canvaApiToken: (document.getElementById('canva-token')?.value || '').trim(),
    canvaPostTemplateId: (document.getElementById('canva-template')?.value || '').trim(),
    ghlToken: (document.getElementById('ghl-token')?.value || '').trim(),
    ghlLocationId: (document.getElementById('ghl-location')?.value || '').trim(),
    ghlEmailFrom: (document.getElementById('ghl-email-from')?.value || '').trim(),
    publishMethod: document.querySelector('input[name="publish-method"]:checked')?.value || 'csv',
    linkedinGroups: groups,
    brandName: document.getElementById('brand-name')?.value || 'Camino Coaching',
    postLength: document.getElementById('post-length')?.value || 'medium',
    assessmentUrl: document.getElementById('assessment-url')?.value || '',
    blueprintUrl: document.getElementById('blueprint-url')?.value || ''
  };
}

// ─── Toast Helper ────────────────────────────────────────────
function showToast(message, type = 'info') {
  const event = new CustomEvent('show-toast', { detail: { message, type } });
  document.dispatchEvent(event);
}
