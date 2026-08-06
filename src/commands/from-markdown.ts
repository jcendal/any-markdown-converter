import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import type { ExportFormat } from '../types';
import { PANDOC_FORMATS } from '../types';
import { pandocLoader, PandocState } from '../utils/pandoc-loader';

interface FormatOption {
  label: string;
  format: ExportFormat;
  description: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { label: '$(file-pdf) PDF', format: 'pdf', description: 'PDF with Mermaid diagrams (requires Chrome)' },
  { label: '$(file) Word (.docx)', format: 'docx', description: 'Microsoft Word document' },
  { label: '$(graph) PowerPoint (.pptx)', format: 'pptx', description: 'Presentation (slides separated by ---)' },
  { label: '$(table) Excel (.xlsx)', format: 'xlsx', description: 'Spreadsheet (from Markdown tables)' },
  { label: '$(book) EPUB', format: 'epub', description: 'E-book format' },
  { label: '$(file-code) HTML', format: 'html', description: 'Standalone HTML page' },
  { label: '$(file-text) RTF', format: 'rtf', description: 'Rich Text Format' },
  { label: '$(file-text) ODT', format: 'odt', description: 'OpenDocument Text' },
];

export async function handleConvertFromMarkdown(uri?: vscode.Uri): Promise<void> {
  const targetUri = uri || vscode.window.activeTextEditor?.document.uri;

  if (!targetUri) {
    vscode.window.showWarningMessage('Markdown Converter: No file selected.');
    return;
  }

  if (path.extname(targetUri.fsPath).toLowerCase() !== '.md') {
    vscode.window.showWarningMessage('Markdown Converter: This command only works with .md files.');
    return;
  }

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor?.document.uri.fsPath === targetUri.fsPath && activeEditor.document.isDirty) {
    await activeEditor.document.save();
  }

  const items = FORMAT_OPTIONS.map((opt) => {
    let desc = opt.description;
    if (PANDOC_FORMATS.has(opt.format) && pandocLoader.currentState !== PandocState.Ready) {
      desc += ' — requires one-time setup on first use';
    }
    return {
      label: opt.label,
      description: desc,
      format: opt.format,
    };
  });

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select export format',
    title: 'Markdown Converter: Export to...',
  });

  if (!selected) return;

  await doConversion(targetUri, selected.format);
}

async function doConversion(uri: vscode.Uri, format: ExportFormat): Promise<void> {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Markdown Converter',
      cancellable: false,
    },
    async (progress) => {
      const basename = path.basename(uri.fsPath, '.md');
      const dir = path.dirname(uri.fsPath);
      const outputPath = path.join(dir, `${basename}.${format}`);

      try {
        const markdown = await fs.readFile(uri.fsPath, 'utf-8');

        if (PANDOC_FORMATS.has(format)) {
          if (pandocLoader.currentState === PandocState.NotLoaded) {
            progress.report({
              message: `Setting up extension for ${format.toUpperCase()} export... (one-time only)`,
            });
          } else {
            progress.report({ message: `Exporting to ${format.toUpperCase()}...` });
          }

          const { convertMdWithPandoc } = await import('../converters/md-to-pandoc');
          await convertMdWithPandoc(markdown, outputPath, format);
        } else {
          progress.report({ message: `Exporting to ${format.toUpperCase()}...` });

          switch (format) {
            case 'docx': {
              const { convertMdToDocx } = await import('../converters/md-to-docx');
              await convertMdToDocx(markdown, outputPath);
              break;
            }
            case 'pptx': {
              const { convertMdToPptx } = await import('../converters/md-to-pptx');
              await convertMdToPptx(markdown, outputPath);
              break;
            }
            case 'xlsx': {
              const { convertMdToXlsx } = await import('../converters/md-to-xlsx');
              await convertMdToXlsx(markdown, outputPath);
              break;
            }
            case 'pdf': {
              const { convertMdToPdf } = await import('../converters/md-to-pdf');
              const config = vscode.workspace.getConfiguration('markdownConverter');
              await convertMdToPdf(markdown, outputPath, {
                chromePath: config.get<string>('chromePath', ''),
                pageSize: config.get<string>('pdf.pageSize', 'A4'),
                orientation: config.get<'portrait' | 'landscape'>('pdf.orientation', 'portrait'),
                fontSize: config.get<number>('pdf.fontSize', 13),
                showPageNumbers: config.get<boolean>('pdf.showPageNumbers', true),
                mermaidWaitMs: config.get<number>('pdf.mermaidWaitMs', 4000),
              });
              break;
            }
            case 'html': {
              const { Marked } = await import('marked');
              const marked = new Marked();
              const stripped = markdown.replace(/^---[\s\S]*?---\n*/m, '');
              const htmlBody = await marked.parse(stripped);
              const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${basename}</title>
<style>body{font-family:system-ui;max-width:800px;margin:0 auto;padding:40px;line-height:1.6}
code{background:#f4f4f4;padding:2px 6px;border-radius:3px}
pre{background:#f4f4f4;padding:16px;border-radius:6px;overflow-x:auto}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px}
th{background:#f4f4f4}</style></head><body>${htmlBody}</body></html>`;
              await fs.writeFile(outputPath, html, 'utf-8');
              break;
            }
          }
        }

        const config = vscode.workspace.getConfiguration('markdownConverter');
        const openAfter = config.get<boolean>('openAfterExport', true);

        if (openAfter) {
          if (format === 'html' || format === 'pdf') {
            await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath));
          } else {
            await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath));
          }
          vscode.window.showInformationMessage(
            `Exported: ${path.basename(outputPath)}`
          );
        } else {
          const choice = await vscode.window.showInformationMessage(
            `Exported: ${path.basename(outputPath)}`,
            'Reveal in Explorer'
          );
          if (choice === 'Reveal in Explorer') {
            await vscode.commands.executeCommand(
              'revealFileInOS',
              vscode.Uri.file(outputPath)
            );
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Markdown Converter: Export to ${format.toUpperCase()} failed — ${msg}`);
      }
    }
  );
}
