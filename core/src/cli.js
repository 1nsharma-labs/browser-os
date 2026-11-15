#!/usr/bin/env node

/**
 * @file cli.js
 * @description Zero-dependency Executable CLI for 1nsharma-labs/browser-os.
 * Distills DOMs, extracts clean markdown, plans browser actions, and audits UI health.
 */

import fs from 'fs';
import { DomDistiller } from './dom_distiller.js';
import { MarkdownExtractor } from './markdown_extractor.js';
import { ActionPlanner } from './action_planner.js';
import { UIVerifier } from './ui_verifier.js';
import { NeuralCrawler2046 } from './neural_crawler_2046.js';
import { MCPServer } from './mcp.js';
import { startServer } from './server.js';

const BANNER = `
\x1b[36m  ██████╗ ██████╗  ██████╗ ██╗    ██╗███████╗███████╗██████╗        ██████╗ ███████╗
  ██╔══██╗██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔════╝██╔══██╗      ██╔═══██╗██╔════╝
  ██████╔╝██████╔╝██║   ██║██║ █╗ ██║███████╗█████╗  ██████╔╝█████╗██║   ██║███████╗
  ██╔══██╗██╔══██╗██║   ██║██║███╗██║╚════██║██╔══╝  ██╔══██╗╚════╝██║   ██║╚════██║
  ██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝███████║███████╗██║  ██║      ╚██████╔╝███████║
  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚══════╝╚═╝  ╚═╝       ╚═════╝ ╚══════╝\x1b[0m
  \x1b[1m\x1b[35mAutonomous Browser & Web Intelligence Engine for AI Agents (Year 2046 MAX Spec)\x1b[0m
  \x1b[90mBuilt with ❤️ by Amit Sharma (@1nsharma) • Kanpur, India • 1nsharma-labs\x1b[0m
`;

async function fetchOrRead(source) {
  if (source.startsWith('http://') || source.startsWith('https://')) {
    const res = await fetch(source);
    return await res.text();
  }
  if (fs.existsSync(source)) {
    return fs.readFileSync(source, 'utf8');
  }
  return source;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'distill': {
      const source = args[1];
      if (!source) {
        console.log(BANNER);
        console.log('\x1b[31mError: Please provide an HTML file, snippet, or URL to distill.\x1b[0m');
        console.log('Usage: browser-os distill "https://example.com" or browser-os distill page.html\n');
        process.exit(1);
      }
      const html = await fetchOrRead(source);
      const distiller = new DomDistiller();
      const res = distiller.distill(html);
      console.log(BANNER);
      console.log(`\x1b[1m\x1b[33m⚡ Semantic DOM Distillation Telemetry:\x1b[0m`);
      console.log(`  \x1b[36mRaw Tokens:\x1b[0m ${res.rawTokensEstimate.toLocaleString()} tokens (${res.rawCharCount.toLocaleString()} chars)`);
      console.log(`  \x1b[32mDistilled Tokens:\x1b[0m ${res.distilledTokensEstimate.toLocaleString()} tokens (${res.distilledCharCount.toLocaleString()} chars)`);
      console.log(`  \x1b[35mToken Savings:\x1b[0m \x1b[1m${res.tokenSavingsPercent}%\x1b[0m [${res.interactiveElementCount} interactive elements indexed]`);
      console.log(`\n\x1b[1mIndexed Element Action Tree:\x1b[0m`);
      console.log(res.distilledText.split('\n').slice(0, 15).join('\n'));
      if (res.elements.length > 15) {
        console.log(`  \x1b[90m... and ${res.elements.length - 15} more indexed elements.\x1b[0m`);
      }
      console.log();
      break;
    }

    case 'md': {
      const source = args[1];
      if (!source) {
        console.log(BANNER);
        console.log('\x1b[31mError: Please provide an HTML file or URL to extract markdown.\x1b[0m');
        process.exit(1);
      }
      const html = await fetchOrRead(source);
      const extractor = new MarkdownExtractor();
      const res = extractor.extract(html);
      console.log(BANNER);
      console.log(`\x1b[1m\x1b[33m📝 Extracted Clean Markdown (${res.wordCount} words):\x1b[0m\n`);
      console.log(res.markdown.slice(0, 600));
      if (res.markdown.length > 600) {
        console.log(`\n\x1b[90m... [truncated ${res.markdown.length - 600} characters]\x1b[0m\n`);
      }
      break;
    }

    case 'plan': {
      const intent = args.slice(1).join(' ') || 'Search for AI developer tools and inspect first result';
      const planner = new ActionPlanner();
      const res = planner.plan(intent);
      console.log(BANNER);
      console.log(`\x1b[1m\x1b[33m🧭 Autonomous Browser Action Plan for:\x1b[0m "${res.intent}"`);
      console.log(`  Total Steps: ${res.totalSteps} | Estimated Latency: ~${res.estimatedExecutionMs}ms\n`);
      res.steps.forEach(s => {
        console.log(`  \x1b[36m[Step ${s.step}]\x1b[0m \x1b[1m${s.action.toUpperCase()}\x1b[0m -> ${s.rationale}`);
      });
      console.log(`\n\x1b[1mExecutable Automation Script Preview:\x1b[0m`);
      console.log(res.runnableScript.slice(0, 450) + '\n  ...\n');
      break;
    }

    case 'verify': {
      const source = args[1] || 'sample.html';
      let html = '<button>Submit</button><img src="hero.jpg"><a href="#">Click</a>';
      if (args[1]) {
        html = await fetchOrRead(source);
      }
      const verifier = new UIVerifier();
      const res = verifier.verify(html);
      console.log(BANNER);
      console.log(`\x1b[1m\x1b[33m🔍 ProofShot UI & Accessibility Audit:\x1b[0m`);
      console.log(`  \x1b[32mHealth Score:\x1b[0m \x1b[1m${res.score}/100\x1b[0m [${res.status}]`);
      console.log(`  Issues Detected: ${res.issueCount}`);
      res.issues.forEach((iss, idx) => {
        const color = iss.severity === 'error' ? '\x1b[31m' : '\x1b[33m';
        console.log(`  ${color}[${idx + 1}] (${iss.category}) ${iss.message}\x1b[0m`);
        console.log(`      \x1b[90mFix: ${iss.fix}\x1b[0m`);
      });
      console.log();
      break;
    }

    case '2046': {
      const crawler = new NeuralCrawler2046();
      const res = crawler.simulate({ meshProtocol: '6dof-neural-stream', spatialNodes: 2048, quantumCoherence: 98 });
      console.log(BANNER);
      console.log(`\x1b[1m\x1b[35m🔮 Year 2046 MAX Spatial Web Mesh Telemetry:\x1b[0m`);
      console.log(`  Spec: ${res.specVersion} | Protocol: ${res.meshProtocol}`);
      console.log(`  \x1b[32mMax Mesh Score:\x1b[0m \x1b[1m${res.metrics.maxMeshScore}/100\x1b[0m [${res.verdict}]`);
      console.log(`  \x1b[36mQuantum State Collapse Latency:\x1b[0m ${res.metrics.stateCollapseLatency}`);
      console.log(`  \x1b[36mGaze Pre-Fetch Accuracy:\x1b[0m ${res.metrics.gazePreFetchAccuracy}`);
      console.log(`  \x1b[36mSpatial Anchor Vertices:\x1b[0m ${res.metrics.activeSpatialAnchors.toLocaleString()}`);
      console.log(`  \x1b[36mCrawl Velocity:\x1b[0m ${res.metrics.nodeCrawlVelocity}`);
      console.log(`  \x1b[90m${res.telemetryNotice}\x1b[0m\n`);
      break;
    }

    case 'serve': {
      const port = parseInt(args[1] || '3999', 10);
      startServer(port);
      break;
    }

    case 'mcp': {
      const server = new MCPServer();
      server.startStdio();
      break;
    }

    case 'help':
    default:
      console.log(BANNER);
      console.log(`\x1b[1mCommands:\x1b[0m`);
      console.log(`  \x1b[36mdistill <file|url>\x1b[0m    Compress raw HTML into indexed action tree (95% token savings)`);
      console.log(`  \x1b[36mmd <file|url>\x1b[0m         Extract clean markdown from webpage HTML for LLM RAG`);
      console.log(`  \x1b[36mplan "<intent>"\x1b[0m       Plan deterministic browser steps and generate Playwright code`);
      console.log(`  \x1b[36mverify [file|url]\x1b[0m     Audit UI for missing a11y alt/labels, dead links, and overflow`);
      console.log(`  \x1b[36m2046\x1b[0m                  Simulate Year 2046 MAX spatial web mesh and quantum crawl`);
      console.log(`  \x1b[36mserve [port]\x1b[0m          Launch interactive web simulator (default 3999)`);
      console.log(`  \x1b[36mmcp\x1b[0m                   Launch stdio Model Context Protocol (MCP) server`);
      console.log();
      break;
  }
}

main().catch(err => {
  console.error('\x1b[31mFatal error:\x1b[0m', err);
  process.exit(1);
});
