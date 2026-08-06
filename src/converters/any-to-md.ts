import * as path from 'path';
import * as fs from 'fs/promises';
import * as vscode from 'vscode';
import { SUPPORTED_INPUT_EXTENSIONS } from '../types';

const HTML_EXTENSIONS = new Set(['.html', '.htm']);

function extractBody(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
}

async function convertHtmlToMarkdown(filePath: string): Promise<string> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const html = extractBody(raw);
  const TurndownService = (await import('turndown')).default;
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });
  td.remove(['script', 'style', 'noscript']);
  return td.turndown(html);
}

export async function convertToMarkdown(uri: vscode.Uri): Promise<string> {
  const ext = path.extname(uri.fsPath).toLowerCase();

  if (!SUPPORTED_INPUT_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported file format: ${ext}`);
  }

  if (HTML_EXTENSIONS.has(ext)) {
    return convertHtmlToMarkdown(uri.fsPath);
  }

  const { toMarkdown } = await import('@firecrawl/anydoc');
  const markdown: string = await toMarkdown(uri.fsPath);
  return markdown;
}
