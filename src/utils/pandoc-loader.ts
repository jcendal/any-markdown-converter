import * as vscode from 'vscode';
import type { ExportFormat } from '../types';

type PandocWasm = {
  convert: (
    options: Record<string, unknown>,
    stdin: string | null,
    files: Record<string, string | Blob>
  ) => Promise<{ stdout: string; stderr: string; files: Record<string, Blob> }>;
};

export enum PandocState {
  NotLoaded = 'notLoaded',
  Downloading = 'downloading',
  Ready = 'ready',
  Error = 'error',
}

const FORMAT_MAP: Record<string, string> = {
  epub: 'epub3',
  rtf: 'rtf',
  odt: 'odt',
  html: 'html5',
};

class PandocLoader {
  private state: PandocState = PandocState.NotLoaded;
  private pandoc: PandocWasm | null = null;
  private loadPromise: Promise<PandocWasm> | null = null;
  private statusBarItem: vscode.StatusBarItem;
  private readonly onStateChange = new vscode.EventEmitter<PandocState>();
  public readonly onDidChangeState = this.onStateChange.event;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      -100
    );
  }

  get currentState(): PandocState {
    return this.state;
  }

  get isReady(): boolean {
    return this.state === PandocState.Ready;
  }

  private setState(newState: PandocState): void {
    this.state = newState;
    this.onStateChange.fire(newState);
    this.updateStatusBar();
  }

  private updateStatusBar(): void {
    switch (this.state) {
      case PandocState.Downloading:
        this.statusBarItem.text = '$(sync~spin) Any Markdown Converter: Setting up...';
        this.statusBarItem.tooltip =
          'Setting up additional export capabilities. This only happens once.';
        this.statusBarItem.backgroundColor = new vscode.ThemeColor(
          'statusBarItem.warningBackground'
        );
        this.statusBarItem.show();
        break;
      case PandocState.Ready:
        this.statusBarItem.text = '$(check) Any Markdown Converter: Ready';
        this.statusBarItem.tooltip = 'All export formats are available.';
        this.statusBarItem.backgroundColor = undefined;
        this.statusBarItem.show();
        setTimeout(() => {
          if (this.state === PandocState.Ready) {
            this.statusBarItem.hide();
          }
        }, 5000);
        break;
      case PandocState.Error:
        this.statusBarItem.text = '$(error) Any Markdown Converter: Setup incomplete';
        this.statusBarItem.tooltip =
          'Could not set up some export formats. EPUB/RTF/ODT export unavailable.';
        this.statusBarItem.backgroundColor = new vscode.ThemeColor(
          'statusBarItem.errorBackground'
        );
        this.statusBarItem.show();
        break;
      default:
        this.statusBarItem.hide();
    }
  }

  async ensureLoaded(): Promise<PandocWasm> {
    if (this.pandoc) {
      return this.pandoc;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.load();
    return this.loadPromise;
  }

  private async load(): Promise<PandocWasm> {
    this.setState(PandocState.Downloading);

    const progressResult = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Any Markdown Converter',
        cancellable: false,
      },
      async (progress) => {
        progress.report({
          message: 'Setting up extension for first use... This only happens once.',
        });

        try {
          const pandocModule = await import('pandoc-wasm');
          this.pandoc = pandocModule as unknown as PandocWasm;
          this.setState(PandocState.Ready);

          vscode.window.showInformationMessage(
            'Any Markdown Converter: Setup complete. All export formats are now available.'
          );

          return this.pandoc;
        } catch (err) {
          this.setState(PandocState.Error);
          this.loadPromise = null;

          const errorMsg =
            err instanceof Error ? err.message : 'Unknown error';
          vscode.window.showErrorMessage(
            `Any Markdown Converter: Setup incomplete — ${errorMsg}. ` +
            'Some export formats (EPUB, RTF, ODT) will not be available.'
          );
          throw err;
        }
      }
    );

    return progressResult;
  }

  async convert(
    markdown: string,
    format: ExportFormat,
    outputFilename: string
  ): Promise<Buffer> {
    const pandoc = await this.ensureLoaded();
    const pandocFormat = FORMAT_MAP[format] || format;

    const result = await pandoc.convert(
      {
        from: 'gfm',
        to: pandocFormat,
        standalone: true,
        'output-file': outputFilename,
      },
      markdown,
      {}
    );

    const outputBlob = result.files[outputFilename];
    if (!outputBlob) {
      throw new Error(
        `Pandoc did not produce output file: ${outputFilename}. stderr: ${result.stderr}`
      );
    }

    const arrayBuffer = await outputBlob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  dispose(): void {
    this.statusBarItem.dispose();
    this.onStateChange.dispose();
  }
}

export const pandocLoader = new PandocLoader();
