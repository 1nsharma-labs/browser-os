/**
 * @file test_browser.js
 * @description Automated test suite for 1nsharma-labs/browser-os.
 * Validates DOM distiller, markdown extractor, action planner, UI verifier, 2046 crawler, and MCP tools.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { DomDistiller } from '../core/src/dom_distiller.js';
import { MarkdownExtractor } from '../core/src/markdown_extractor.js';
import { ActionPlanner } from '../core/src/action_planner.js';
import { UIVerifier } from '../core/src/ui_verifier.js';
import { NeuralCrawler2046 } from '../core/src/neural_crawler_2046.js';
import { MCPServer } from '../core/src/mcp.js';

describe('Browser-OS Core Suite', () => {
  const sampleHtml = `
    <html>
      <head><title>Test Store</title></head>
      <body>
        <header>
          <a href="/home">Home</a>
          <input type="text" name="q" placeholder="Search devices">
          <button type="submit">Search</button>
        </header>
        <main>
          <h1>Flagship GPU</h1>
          <button id="buy-now">Buy Now</button>
        </main>
      </body>
    </html>
  `;

  test('DomDistiller extracts indexed interactive elements and saves tokens', () => {
    const distiller = new DomDistiller();
    const result = distiller.distill(sampleHtml);

    assert.ok(result.interactiveElementCount >= 3, 'Should extract at least link, input, buttons');
    assert.ok(result.tokenSavingsPercent > 40, 'Token savings should be substantial');
    assert.strictEqual(result.elements[0].index, 1);
    assert.ok(result.distilledText.includes('[1]'));
  });

  test('DomDistiller handles empty strings safely', () => {
    const distiller = new DomDistiller();
    const result = distiller.distill('');

    assert.strictEqual(result.interactiveElementCount, 0);
    assert.strictEqual(result.tokenSavingsPercent, 0);
  });

  test('MarkdownExtractor converts HTML into clean markdown', () => {
    const extractor = new MarkdownExtractor();
    const result = extractor.extract(sampleHtml);

    assert.strictEqual(result.title, 'Test Store');
    assert.ok(result.markdown.includes('# Flagship GPU'));
    assert.ok(result.markdown.includes('[Home](/home)'));
    assert.ok(result.wordCount > 0);
  });

  test('ActionPlanner translates user intent into deterministic steps and Playwright script', () => {
    const planner = new ActionPlanner();
    const distiller = new DomDistiller();
    const elements = distiller.distill(sampleHtml).elements;

    const plan = planner.plan('Search for RTX 5090 and click search', elements);
    assert.ok(plan.totalSteps >= 3);
    assert.strictEqual(plan.steps[0].action, 'navigate');
    assert.ok(plan.runnableScript.includes('playwright'));
  });

  test('UIVerifier flags missing accessibility attributes and dead links', () => {
    const verifier = new UIVerifier();
    const badHtml = '<img src="cat.jpg"><a href="#">Dead Link</a><button><svg></svg></button>';
    const audit = verifier.verify(badHtml);

    assert.ok(audit.issueCount >= 2, 'Should flag missing alt and dead link');
    assert.ok(audit.score < 80, 'Score should be penalized for issues');
  });

  test('NeuralCrawler2046 simulates 2046 MAX quantum spatial web telemetry', () => {
    const crawler = new NeuralCrawler2046();
    const report = crawler.simulate({ meshProtocol: '6dof-neural-stream', spatialNodes: 2048, quantumCoherence: 98 });

    assert.strictEqual(report.specVersion, '2046.1.0-MAX');
    assert.ok(report.metrics.maxMeshScore >= 80);
    assert.ok(report.metrics.stateCollapseLatency.endsWith('ps'));
    assert.ok(report.metrics.gazePreFetchAccuracy.endsWith('%'));
  });

  test('MCPServer exposes 5 tools and handles dispatch correctly', () => {
    const mcp = new MCPServer();
    assert.strictEqual(mcp.tools.length, 5);

    const distillRes = mcp.handleToolCall('browser_distill_dom', { html: sampleHtml });
    assert.ok(distillRes.interactiveElementCount >= 3);

    const mdRes = mcp.handleToolCall('browser_extract_markdown', { html: sampleHtml });
    assert.strictEqual(mdRes.title, 'Test Store');

    const planRes = mcp.handleToolCall('browser_plan_actions', { intent: 'Click buy now', html: sampleHtml });
    assert.ok(planRes.totalSteps > 0);

    const verifyRes = mcp.handleToolCall('browser_verify_ui', { html: sampleHtml });
    assert.ok(verifyRes.score > 70);

    const simRes = mcp.handleToolCall('browser_simulate_2046', { meshProtocol: 'quantum-entangled' });
    assert.ok(simRes.metrics.maxMeshScore >= 85);
  });
});
