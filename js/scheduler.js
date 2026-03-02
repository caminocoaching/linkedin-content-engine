// ═══════════════════════════════════════════════════════════════
// ⚡ BUSINESS LEADERS LINKEDIN ENGINE — Scheduler
// CSV export and GHL Social Planner integration
// LinkedIn-optimised posting times for business leaders
// ═══════════════════════════════════════════════════════════════

// ─── Generate Schedule Dates ──────────────────────────────────
// LinkedIn optimal: Tue-Thu 08:00-10:00, Mon/Fri 07:30, Weekend 09:30
export function getScheduleDates(count = 7, startDate = null) {
    const dates = [];
    const start = startDate ? new Date(startDate) : new Date();

    if (!startDate) {
        start.setDate(start.getDate() + 1);
    }

    start.setHours(0, 0, 0, 0);

    let current = new Date(start);

    while (dates.length < count) {
        const day = current.getDay(); // 0=Sun, 6=Sat
        const isWeekend = day === 0 || day === 6;
        const isMidweek = day >= 2 && day <= 4; // Tue, Wed, Thu

        const scheduled = new Date(current);
        if (isWeekend) {
            scheduled.setHours(9, 30, 0, 0);
        } else if (isMidweek) {
            scheduled.setHours(8, 0, 0, 0);
        } else {
            scheduled.setHours(7, 30, 0, 0);
        }

        dates.push({
            date: new Date(scheduled),
            dayName: scheduled.toLocaleDateString('en-GB', { weekday: 'long' }),
            dateString: scheduled.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            timeString: isWeekend ? '09:30' : (isMidweek ? '08:00' : '07:30'),
            isWeekend
        });

        current.setDate(current.getDate() + 1);
    }

    return dates;
}

// ─── Format Date for GHL ──────────────────────────────────────
function formatGHLDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

// ─── Format Date Display ─────────────────────────────────────
function formatDisplayDate(date) {
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// ─── Export CSV for GHL Social Planner ────────────────────────
export function exportCSV(posts, dates) {
    const headers = ['postAtSpecificTime (YYYY-MM-DD HH:mm:ss)', 'content', 'link (OGmetaUrl)', 'imageUrls', 'gifUrl', 'videoUrls'];

    const rows = posts.map((post, i) => {
        const date = dates[i]?.date || new Date();
        return [
            formatGHLDate(date),
            `"${(post.content || '').replace(/"/g, '""')}"`,
            '',
            post.imageUrl || '',
            '',
            ''
        ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    const now = new Date();
    const filename = `linkedin-posts-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;

    try {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 1000);
    } catch (e) {
        console.warn('Blob download failed, using data URI fallback:', e);
        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        window.open(dataUri, '_blank');
    }

    return filename;
}

// ─── Build CSV String (for clipboard copy) ────────────────────
export function buildCSVString(posts, dates) {
    const headers = ['postAtSpecificTime (YYYY-MM-DD HH:mm:ss)', 'content', 'link (OGmetaUrl)', 'imageUrls', 'gifUrl', 'videoUrls'];

    const rows = posts.map((post, i) => {
        const date = dates[i]?.date || new Date();
        return [
            formatGHLDate(date),
            `"${(post.content || '').replace(/"/g, '""')}"`,
            '',
            post.imageUrl || '',
            '',
            ''
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}

// ─── Download Single Post as .txt ─────────────────────────────
export function downloadPostTxt(post, index = 0) {
    const content = post.content || '';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const pillarSlug = (post.pillar?.id || 'post').replace(/\s+/g, '-');
    link.href = url;
    link.download = `linkedin-${pillarSlug}-${index + 1}.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 1000);
}

// ─── Copy Post to Clipboard ──────────────────────────────────
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

// ─── GHL API Scheduling (placeholder) ─────────────────────────
export async function scheduleToGHL(posts, dates, ghlToken, locationId) {
    if (!ghlToken) {
        throw new Error('GHL Private Integration token not configured. Go to Settings.');
    }
    if (!locationId) {
        throw new Error('GHL Location ID not configured. Go to Settings.');
    }

    const results = [];

    for (let i = 0; i < posts.length; i++) {
        try {
            const response = await fetch(`https://services.leadconnectorhq.com/social-media-posting/post`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ghlToken}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify({
                    locationId: locationId,
                    type: 'post',
                    status: 'scheduled',
                    scheduledAt: formatGHLDate(dates[i].date),
                    accounts: ['linkedin'],
                    summary: posts[i].content,
                    media: posts[i].imageUrl ? [{ url: posts[i].imageUrl, type: 'image' }] : []
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `GHL API error: ${response.status}`);
            }

            results.push({ index: i, success: true });
        } catch (err) {
            results.push({ index: i, success: false, error: err.message });
        }
    }

    return results;
}
