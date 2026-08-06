import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { findChrome } from '../utils/chrome-finder';

interface PdfOptions {
  chromePath?: string;
  pageSize: string;
  orientation: 'portrait' | 'landscape';
  fontSize: number;
  showPageNumbers: boolean;
  mermaidWaitMs: number;
  margins?: { top: string; bottom: string; left: string; right: string };
}

function buildHtmlTemplate(body: string, options: PdfOptions): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: ${options.fontSize}px;
    line-height: 1.6;
    color: #1f2328;
    max-width: 100%;
    padding: 20px 40px;
  }
  h1 { font-size: 2em; border-bottom: 1px solid #d1d9e0; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #d1d9e0; padding-bottom: 0.3em; }
  h3 { font-size: 1.25em; }
  code {
    background: #eff1f3;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 85%;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }
  pre {
    background: #f6f8fa;
    border: 1px solid #d1d9e0;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
  }
  pre code { background: none; padding: 0; font-size: 85%; }
  blockquote {
    border-left: 4px solid #d1d9e0;
    padding: 0 16px;
    color: #59636e;
    margin: 0;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }
  th, td {
    border: 1px solid #d1d9e0;
    padding: 8px 12px;
    text-align: left;
  }
  th { background: #f6f8fa; font-weight: 600; }
  img { max-width: 100%; height: auto; }
  a { color: #0969da; text-decoration: none; }
  .mermaid { text-align: center; margin: 16px 0; }
  @media print {
    .mermaid, table, pre { page-break-inside: avoid; }
  }
</style>
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
</script>
</head>
<body>
${body}
</body>
</html>`;
}

export async function convertMdToPdf(
  markdown: string,
  outputPath: string,
  options: PdfOptions
): Promise<void> {
  const puppeteer = await import('puppeteer-core');

  const chromePath = options.chromePath || findChrome();
  if (!chromePath) {
    throw new Error(
      'Chrome/Chromium not found. Install Chrome or set markdownConverter.chromePath in settings.'
    );
  }

  const { Marked } = await import('marked');
  const marked = new Marked();

  const renderer = {
    code({ text, lang }: { text: string; lang?: string | null }) {
      if (lang === 'mermaid') {
        return `<pre class="mermaid">${text}</pre>`;
      }
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const langClass = lang ? ` class="language-${lang}"` : '';
      return `<pre><code${langClass}>${escaped}</code></pre>`;
    },
  };

  marked.use({ renderer });

  const stripped = markdown.replace(/^---[\s\S]*?---\n*/m, '');
  const htmlBody = await marked.parse(stripped);
  const fullHtml = buildHtmlTemplate(htmlBody, options);

  const tmpDir = os.tmpdir();
  const tmpHtml = path.join(tmpDir, `md-converter-${Date.now()}.html`);
  await fs.writeFile(tmpHtml, fullHtml, 'utf-8');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`file://${tmpHtml}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, options.mermaidWaitMs));

    const pdfOptions: Record<string, unknown> = {
      path: outputPath,
      format: options.pageSize,
      landscape: options.orientation === 'landscape',
      printBackground: true,
      margin: options.margins || {
        top: '18mm',
        bottom: '18mm',
        left: '15mm',
        right: '15mm',
      },
    };

    if (options.showPageNumbers) {
      pdfOptions.displayHeaderFooter = true;
      pdfOptions.headerTemplate = '<span></span>';
      pdfOptions.footerTemplate = `
        <div style="font-size:9px;width:100%;text-align:center;color:#666;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>`;
    }

    await page.pdf(pdfOptions);
  } finally {
    await browser.close();
    await fs.unlink(tmpHtml).catch(() => {});
  }
}
