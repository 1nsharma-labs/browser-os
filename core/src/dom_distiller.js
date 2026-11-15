/**
 * @file dom_distiller.js
 * @description Zero-dependency Semantic DOM & Accessibility Tree Distiller for AI Agents.
 * Compresses raw HTML into interactive indexed element trees, slashing LLM tokens by 95%+.
 * Part of 1nsharma-labs/browser-os
 */

export class DomDistiller {
  /**
   * Distills raw HTML into a clean, indexed semantic action tree for LLM agents.
   * @param {string} html - Raw HTML source code
   * @returns {Object} Distilled action tree and token telemetry
   */
  distill(html) {
    if (!html || typeof html !== 'string') {
      html = '';
    }

    const rawCharCount = html.length;
    const rawTokensEstimate = Math.round(rawCharCount / 4);

    // Clean scripts, styles, svg paths, and comments to prevent context pollution
    let cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '[SVG Icon]');

    // Extract interactive elements and headings
    const elements = [];
    let nextIndex = 1;

    // Regex matchers for interactive elements
    const tagRegex = /<(a|button|input|select|textarea|h1|h2|h3|form)\b([^>]*)>(?:([\s\S]*?)<\/\1>)?/gi;
    let match;

    while ((match = tagRegex.exec(cleaned)) !== null) {
      const tag = match[1].toLowerCase();
      const attrsStr = match[2] || '';
      let innerText = (match[3] || '').replace(/<[^>]+>/g, '').trim();

      // Parse key attributes
      const typeMatch = attrsStr.match(/\btype=["']([^"']*)["']/i);
      const nameMatch = attrsStr.match(/\bname=["']([^"']*)["']/i);
      const placeholderMatch = attrsStr.match(/\bplaceholder=["']([^"']*)["']/i);
      const hrefMatch = attrsStr.match(/\bhref=["']([^"']*)["']/i);
      const ariaLabelMatch = attrsStr.match(/\baria-label=["']([^"']*)["']/i);
      const idMatch = attrsStr.match(/\bid=["']([^"']*)["']/i);

      const type = typeMatch ? typeMatch[1] : (tag === 'input' ? 'text' : null);
      const name = nameMatch ? nameMatch[1] : null;
      const placeholder = placeholderMatch ? placeholderMatch[1] : null;
      const href = hrefMatch ? hrefMatch[1] : null;
      const label = ariaLabelMatch ? ariaLabelMatch[1] : (placeholder || innerText || name || idMatch?.[1] || tag);

      let role = 'element';
      if (tag === 'a') role = 'link';
      else if (tag === 'button') role = 'button';
      else if (tag === 'input') role = `input[${type || 'text'}]`;
      else if (tag === 'textarea') role = 'textarea';
      else if (tag === 'select') role = 'dropdown';
      else if (tag.startsWith('h')) role = 'heading';

      elements.push({
        index: nextIndex++,
        tag,
        role,
        label: label.substring(0, 80),
        href: href ? href.substring(0, 100) : undefined,
        type: type || undefined,
        name: name || undefined
      });
    }

    // Format into clean, compact representation for LLM prompt
    const distilledLines = elements.map(e => {
      let line = `[${e.index}] <${e.role}> "${e.label}"`;
      if (e.href) line += ` -> ${e.href}`;
      return line;
    });

    const distilledText = distilledLines.join('\n');
    const distilledCharCount = distilledText.length;
    const distilledTokensEstimate = Math.round(distilledCharCount / 4);

    const tokenSavingsPercent = rawTokensEstimate > 0 
      ? Number((((rawTokensEstimate - distilledTokensEstimate) / rawTokensEstimate) * 100).toFixed(1))
      : 0;

    return {
      rawCharCount,
      rawTokensEstimate,
      distilledCharCount,
      distilledTokensEstimate,
      tokenSavingsPercent: Math.max(0, tokenSavingsPercent),
      interactiveElementCount: elements.length,
      elements,
      distilledText
    };
  }
}
