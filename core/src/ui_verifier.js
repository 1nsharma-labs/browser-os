/**
 * @file ui_verifier.js
 * @description ProofShot UI & Accessibility Self-Verification Engine for Autonomous Agents.
 * Audits webpages and generated HTML components for a11y, broken links, and form safety.
 * Part of 1nsharma-labs/browser-os
 */

export class UIVerifier {
  /**
   * Verifies HTML code or frontend components for critical UX, accessibility, and form issues.
   * @param {string} html - HTML string to audit
   * @returns {Object} ProofShot UI Health Audit
   */
  verify(html) {
    if (!html || typeof html !== 'string') {
      return { score: 100, issues: [], status: 'Clean' };
    }

    const issues = [];

    // 1. Check Images missing alt attributes
    const imgWithoutAlt = html.match(/<img\b(?![^>]*\balt=)[^>]*>/gi);
    if (imgWithoutAlt) {
      issues.push({
        severity: 'warning',
        category: 'accessibility',
        message: `Found ${imgWithoutAlt.length} image(s) missing 'alt' descriptive text.`,
        fix: 'Add meaningful alt attributes to all visual img tags.'
      });
    }

    // 2. Check Empty Buttons or Icon-only buttons missing aria-label
    const emptyButtons = html.match(/<button\b(?![^>]*\baria-label=)[^>]*>\s*(?:<svg[\s\S]*?<\/svg>|<i[\s\S]*?<\/i>|\s*)<\/button>/gi);
    if (emptyButtons) {
      issues.push({
        severity: 'error',
        category: 'accessibility',
        message: `Found ${emptyButtons.length} icon-only button(s) missing aria-label.`,
        fix: 'Add aria-label="Action Name" to icon buttons so screen readers and AI agents can identify them.'
      });
    }

    // 3. Check Dead / Dummy Link Selectors (href="#" or href="javascript:void(0)")
    const deadLinks = html.match(/<a\b[^>]*href=["'](?:#|javascript:void\(0\);?)["'][^>]*>/gi);
    if (deadLinks) {
      issues.push({
        severity: 'warning',
        category: 'navigation',
        message: `Found ${deadLinks.length} placeholder link(s) (href="#" or javascript:void(0)).`,
        fix: 'Replace dead links with valid URLs or semantic <button> elements if triggering JS actions.'
      });
    }

    // 4. Form inputs without labels or aria-labels
    const unlabelledInputs = html.match(/<input\b(?![^>]*\b(?:aria-label|id|name)=)[^>]*>/gi);
    if (unlabelledInputs) {
      issues.push({
        severity: 'error',
        category: 'forms',
        message: `Found ${unlabelledInputs.length} input field(s) without name, id, or aria-label.`,
        fix: 'Ensure all input fields have associated <label> or name attributes for autonomous fill.'
      });
    }

    // 5. Fixed Width Breakout Risks (e.g. width: 1200px or inline fixed width causing mobile horizontal scroll)
    const fixedWidths = html.match(/style=["'][^"']*width:\s*(?:1[0-9]{3}|[2-9][0-9]{3})px/gi);
    if (fixedWidths) {
      issues.push({
        severity: 'warning',
        category: 'responsive',
        message: `Detected ${fixedWidths.length} hardcoded large pixel widths exceeding standard mobile viewports.`,
        fix: 'Use responsive percentage (e.g. max-width: 100%) or flex/grid layouts.'
      });
    }

    // Scoring
    let penalty = 0;
    for (const issue of issues) {
      penalty += issue.severity === 'error' ? 20 : 10;
    }
    const score = Math.max(25, 100 - penalty);

    return {
      score,
      status: score >= 90 ? 'Production Ready (A+)' : (score >= 70 ? 'Minor Issues Detected' : 'Requires Critical Fixes'),
      issueCount: issues.length,
      issues
    };
  }
}
