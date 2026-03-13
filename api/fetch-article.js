// Vercel Serverless Function — Fetches article content from a URL
// Extracts headline, key text, metadata from the target page.
// Runs SERVER-SIDE to bypass CORS restrictions.

export const config = { runtime: 'edge' };

export default async function handler(req) {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!targetUrl) {
        return new Response(
            JSON.stringify({ error: 'url parameter required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(targetUrl, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-GB,en;q=0.9',
            }
        });
        clearTimeout(timeoutId);

        const finalUrl = response.url || targetUrl;
        const contentType = response.headers.get('content-type') || '';

        if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
            return new Response(
                JSON.stringify({
                    url: finalUrl,
                    title: '',
                    content: '',
                    error: 'Not an HTML page',
                    contentType
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const html = await response.text();

        // Extract key metadata from the HTML
        const title = extractFirst(html, [
            /<title[^>]*>([\s\S]*?)<\/title>/i,
            /<meta\s+property="og:title"\s+content="([^"]+)"/i,
            /<meta\s+name="og:title"\s+content="([^"]+)"/i,
            /<h1[^>]*>([\s\S]*?)<\/h1>/i,
        ]);

        const description = extractFirst(html, [
            /<meta\s+property="og:description"\s+content="([^"]+)"/i,
            /<meta\s+name="description"\s+content="([^"]+)"/i,
            /<meta\s+name="twitter:description"\s+content="([^"]+)"/i,
        ]);

        const author = extractFirst(html, [
            /<meta\s+name="author"\s+content="([^"]+)"/i,
            /<meta\s+property="article:author"\s+content="([^"]+)"/i,
            /class="author[^"]*"[^>]*>([^<]+)</i,
            /"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i,
        ]);

        const publishDate = extractFirst(html, [
            /<meta\s+property="article:published_time"\s+content="([^"]+)"/i,
            /<time[^>]+datetime="([^"]+)"/i,
            /"datePublished"\s*:\s*"([^"]+)"/i,
        ]);

        const siteName = extractFirst(html, [
            /<meta\s+property="og:site_name"\s+content="([^"]+)"/i,
        ]);

        // Extract article body text (simplified extraction)
        let bodyText = extractArticleBody(html);

        // Truncate to reasonable size (first ~3000 chars of article text)
        if (bodyText.length > 3000) {
            bodyText = bodyText.substring(0, 3000) + '...';
        }

        return new Response(
            JSON.stringify({
                url: finalUrl,
                title: cleanText(title),
                description: cleanText(description),
                author: cleanText(author),
                publishDate: publishDate || '',
                siteName: cleanText(siteName),
                content: bodyText,
                fetchedAt: new Date().toISOString()
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (e) {
        return new Response(
            JSON.stringify({
                url: targetUrl,
                error: e.name === 'AbortError' ? 'Request timed out' : e.message,
                title: '',
                content: ''
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
}

function extractFirst(html, patterns) {
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]?.trim()) return match[1].trim();
    }
    return '';
}

function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractArticleBody(html) {
    // Remove script, style, nav, header, footer, aside tags
    let cleaned = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<aside[\s\S]*?<\/aside>/gi, '')
        .replace(/<form[\s\S]*?<\/form>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '');

    // Try to find <article> tag first
    const articleMatch = cleaned.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
        cleaned = articleMatch[1];
    }

    // Extract text from paragraph tags
    const paragraphs = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    while ((match = pRegex.exec(cleaned)) !== null) {
        const text = cleanText(match[1]);
        // Filter out very short paragraphs (navigation, ads, etc.)
        if (text.length > 40) {
            paragraphs.push(text);
        }
    }

    if (paragraphs.length > 0) {
        return paragraphs.join('\n\n');
    }

    // Fallback: strip all tags and return cleaned text
    return cleanText(cleaned).substring(0, 3000);
}
