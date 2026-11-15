/**
 * @file mcp.js
 * @description Model Context Protocol (MCP) Server for Browser-OS.
 * Exposes DOM distillation, markdown extraction, action planning, and UI verification to Claude and Cursor.
 * Part of 1nsharma-labs/browser-os
 */

import { DomDistiller } from './dom_distiller.js';
import { MarkdownExtractor } from './markdown_extractor.js';
import { ActionPlanner } from './action_planner.js';
import { UIVerifier } from './ui_verifier.js';
import { NeuralCrawler2046 } from './neural_crawler_2046.js';

export class MCPServer {
  constructor() {
    this.distiller = new DomDistiller();
    this.markdownExtractor = new MarkdownExtractor();
    this.planner = new ActionPlanner();
    this.verifier = new UIVerifier();
    this.neuralCrawler = new NeuralCrawler2046();

    this.tools = [
      {
        name: 'browser_distill_dom',
        description: 'Compresses raw HTML into an indexed semantic action tree, slashing tokens by 95% for coding agents.',
        inputSchema: {
          type: 'object',
          properties: {
            html: { type: 'string', description: 'Raw HTML source to distill.' }
          },
          required: ['html']
        }
      },
      {
        name: 'browser_extract_markdown',
        description: 'Strips tracking scripts and navigation boilerplate, converting webpage HTML into clean markdown.',
        inputSchema: {
          type: 'object',
          properties: {
            html: { type: 'string', description: 'Webpage HTML to convert to markdown.' }
          },
          required: ['html']
        }
      },
      {
        name: 'browser_plan_actions',
        description: 'Translates a natural language user goal into a deterministic step sequence and executable Playwright script.',
        inputSchema: {
          type: 'object',
          properties: {
            intent: { type: 'string', description: 'Natural language goal (e.g. Search for laptop on store and click checkout).' },
            html: { type: 'string', description: 'Optional HTML of current page to ground element indices.' }
          },
          required: ['intent']
        }
      },
      {
        name: 'browser_verify_ui',
        description: 'ProofShot UI verification: audits HTML/components for missing alt tags, empty buttons, dead links, and mobile layout risks.',
        inputSchema: {
          type: 'object',
          properties: {
            html: { type: 'string', description: 'HTML to audit.' }
          },
          required: ['html']
        }
      },
      {
        name: 'browser_simulate_2046',
        description: 'Year 2046 MAX Spec: Simulates 6DoF holographic neural spatial web crawling and quantum DOM collapse.',
        inputSchema: {
          type: 'object',
          properties: {
            meshProtocol: { type: 'string', enum: ['2d-legacy-dom', 'spatial-xr', '6dof-neural-stream', 'quantum-entangled'] },
            spatialNodes: { type: 'number' }
          }
        }
      }
    ];
  }

  handleToolCall(name, args = {}) {
    switch (name) {
      case 'browser_distill_dom':
        return this.distiller.distill(args.html || '');
      case 'browser_extract_markdown':
        return this.markdownExtractor.extract(args.html || '');
      case 'browser_plan_actions': {
        const elements = args.html ? this.distiller.distill(args.html).elements : [];
        return this.planner.plan(args.intent, elements);
      }
      case 'browser_verify_ui':
        return this.verifier.verify(args.html || '');
      case 'browser_simulate_2046':
        return this.neuralCrawler.simulate(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  startStdio() {
    process.stdin.setEncoding('utf8');
    let buffer = '';

    process.stdin.on('data', chunk => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const req = JSON.parse(line);
          const res = this.processRequest(req);
          if (res) {
            process.stdout.write(JSON.stringify(res) + '\n');
          }
        } catch (err) {
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32700, message: 'Parse error', data: String(err) }
          }) + '\n');
        }
      }
    });
  }

  processRequest(req) {
    const { id, method, params } = req;

    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'browser-os-mcp',
            version: '2046.1.0'
          },
          capabilities: { tools: {} }
        }
      };
    }

    if (method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: this.tools }
      };
    }

    if (method === 'tools/call') {
      try {
        const result = this.handleToolCall(params.name, params.arguments || {});
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32603, message: err.message }
        };
      }
    }

    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` }
    };
  }
}

if (process.argv[1] && process.argv[1].endsWith('mcp.js')) {
  const server = new MCPServer();
  server.startStdio();
}
