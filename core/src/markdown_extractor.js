/**
 * @file markdown_extractor.js
 * @description Zero-dependency HTML to Clean Markdown Extractor for AI Agent RAG and LLM ingest.
 * Strips tracking scripts, CSS, and navigation clutter, preserving core article content.
 * Part of 1nsharma-labs/browser-os
 */

export class MarkdownExtractor {
  /**
   * Converts HTML text into clean Markdown.
   * @param {string} html - Raw HTML
   * @returns {Object} Clean markdown and metadata
   */
  extract(html) {
    if (!html || typeof html !== 'string') {
      return { title: '', markdown: '', wordCount: 0 };
    }

    // Extract title
    const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // Strip non-content blocks
    let content = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

    // Convert code blocks
    content = content.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (m, code) => {
      return `\n\`\`\`\n${code.replace(/<[^>]+>/g, '')}\n\`\`\`\n`;
    });
    content = content.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

    // Convert Headings
    content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
    content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
    content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
    content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');

    // Convert Links
    content = content.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (m, href, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      return cleanText ? `[${cleanText}](${href})` : '';
    });

    // Convert Bold and Italic
    content = content.replace(/<(b|strong)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**');
    content = content.replace(/<(i|em)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*');

    // Convert Lists
    content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');

    // Convert Paragraphs and line breaks
    content = content.replace(/<br\s*\/?>/gi, '\n');
    content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

    // Strip remaining tags
    content = content.replace(/<[^>]+>/g, '');

    // Decode standard entities
    content = content
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');

    // Clean whitespace
    const markdown = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n')
      .trim();

    const words = markdown.length > 0 ? markdown.split(/\s+/) : [];

    return {
      title,
      wordCount: words.length,
      markdown
    };
  }
}
