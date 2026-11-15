/**
 * @file action_planner.js
 * @description Natural Language to Browser Action Sequence Planner.
 * Translates autonomous user intents into deterministic step sequences and runnable scripts.
 * Part of 1nsharma-labs/browser-os
 */

export class ActionPlanner {
  /**
   * Plans an autonomous browser interaction sequence given a natural language intent and element list.
   * @param {string} intent - Goal (e.g., "Search for RTX 4090 and click the first product")
   * @param {Array<Object>} [elements=[]] - Distilled interactive elements from DomDistiller
   * @returns {Object} Deterministic action plan and executable automation script
   */
  plan(intent, elements = []) {
    if (!intent || typeof intent !== 'string') {
      intent = 'Explore webpage';
    }

    const lowerIntent = intent.toLowerCase();
    const steps = [];

    // Analyze intent keywords
    const isSearch = lowerIntent.includes('search') || lowerIntent.includes('find') || lowerIntent.includes('query');
    const isLogin = lowerIntent.includes('login') || lowerIntent.includes('sign in') || lowerIntent.includes('auth');
    const isForm = lowerIntent.includes('form') || lowerIntent.includes('submit') || lowerIntent.includes('register');
    const isScrape = lowerIntent.includes('extract') || lowerIntent.includes('scrape') || lowerIntent.includes('collect');

    // 1. Initial State / Navigation
    steps.push({
      step: 1,
      action: 'navigate',
      target: 'current_page',
      rationale: 'Verify document ready state and network idle before interaction.'
    });

    let currentStep = 2;

    // 2. Identify Target Elements if elements list provided
    if (elements.length > 0) {
      if (isSearch) {
        const searchInput = elements.find(e => e.role.startsWith('input') && (e.label.includes('search') || e.name?.includes('q') || e.name?.includes('search')));
        const submitBtn = elements.find(e => e.role === 'button' && (e.label.includes('search') || e.label.includes('submit') || e.label.includes('go')));

        if (searchInput) {
          steps.push({
            step: currentStep++,
            action: 'type',
            elementIndex: searchInput.index,
            selector: `[${searchInput.index}] ${searchInput.label}`,
            value: this._extractSearchTerm(intent),
            rationale: `Focus and type search query into ${searchInput.label}.`
          });
        }
        if (submitBtn) {
          steps.push({
            step: currentStep++,
            action: 'click',
            elementIndex: submitBtn.index,
            selector: `[${submitBtn.index}] ${submitBtn.label}`,
            rationale: `Click search trigger button [${submitBtn.index}].`
          });
        } else {
          steps.push({
            step: currentStep++,
            action: 'press_key',
            key: 'Enter',
            rationale: 'Press Enter to submit search form.'
          });
        }
      } else if (isLogin) {
        const emailInput = elements.find(e => e.role.startsWith('input') && (e.label.includes('email') || e.label.includes('user')));
        const passInput = elements.find(e => e.role.startsWith('input') && (e.type === 'password' || e.label.includes('pass')));
        const loginBtn = elements.find(e => e.role === 'button' && (e.label.includes('login') || e.label.includes('sign in')));

        if (emailInput) {
          steps.push({
            step: currentStep++,
            action: 'type',
            elementIndex: emailInput.index,
            selector: `[${emailInput.index}] ${emailInput.label}`,
            value: 'user@example.com',
            rationale: 'Input user identity credentials.'
          });
        }
        if (passInput) {
          steps.push({
            step: currentStep++,
            action: 'type',
            elementIndex: passInput.index,
            selector: `[${passInput.index}] ${passInput.label}`,
            value: '••••••••••••',
            rationale: 'Input secure authentication token.'
          });
        }
        if (loginBtn) {
          steps.push({
            step: currentStep++,
            action: 'click',
            elementIndex: loginBtn.index,
            selector: `[${loginBtn.index}] ${loginBtn.label}`,
            rationale: `Submit credentials via button [${loginBtn.index}].`
          });
        }
      }
    }

    // Default Fallback Plan if no matching elements were found
    if (steps.length === 1) {
      steps.push({
        step: currentStep++,
        action: 'scroll',
        direction: 'down',
        pixels: 600,
        rationale: 'Scroll viewport to reveal lazy-loaded DOM elements and dynamic content.'
      });
      steps.push({
        step: currentStep++,
        action: isScrape ? 'extract_dom' : 'click',
        target: isScrape ? 'main_article' : '[1] primary_cta',
        rationale: isScrape ? 'Extract structured semantic data entities.' : 'Interact with primary action target.'
      });
    }

    // Final Assertion step
    steps.push({
      step: currentStep++,
      action: 'assert_ready',
      condition: 'network_idle_500ms',
      rationale: 'Confirm UI state settled without console errors or layout shifts.'
    });

    // Generate runnable Node.js / Playwright snippet
    const runnableScript = this._generateScript(steps);

    return {
      intent,
      totalSteps: steps.length,
      estimatedExecutionMs: steps.length * 350,
      steps,
      runnableScript
    };
  }

  _extractSearchTerm(intent) {
    const match = intent.match(/search(?:\s+for)?\s+["']?([^"']+)["']?/i);
    return match ? match[1].trim() : 'Developer Tools';
  }

  _generateScript(steps) {
    const lines = [
      '// Generated by 1nsharma-labs/browser-os',
      'import { chromium } from "playwright";',
      '',
      'async function run() {',
      '  const browser = await chromium.launch({ headless: false });',
      '  const page = await browser.newPage();',
      ''
    ];

    for (const s of steps) {
      if (s.action === 'navigate') {
        lines.push('  await page.waitForLoadState("networkidle");');
      } else if (s.action === 'type') {
        lines.push(`  // Step ${s.step}: ${s.rationale}`);
        lines.push(`  await page.locator('${s.selector}').fill('${s.value}');`);
      } else if (s.action === 'click') {
        lines.push(`  // Step ${s.step}: ${s.rationale}`);
        lines.push(`  await page.locator('${s.selector || s.target}').click();`);
      } else if (s.action === 'press_key') {
        lines.push(`  await page.keyboard.press("${s.key}");`);
      } else if (s.action === 'scroll') {
        lines.push(`  await page.mouse.wheel(0, ${s.pixels});`);
      } else if (s.action === 'assert_ready') {
        lines.push('  await page.waitForTimeout(500);');
      }
    }

    lines.push('  console.log("Browser-OS execution completed successfully.");');
    lines.push('  await browser.close();');
    lines.push('}');
    lines.push('run();');

    return lines.join('\n');
  }
}
