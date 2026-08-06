declare module 'pandoc-wasm' {
  interface ConvertResult {
    stdout: string;
    stderr: string;
    files: Record<string, Blob>;
    mediaFiles?: Record<string, Blob>;
  }

  interface ConvertOptions {
    from?: string;
    to?: string;
    standalone?: boolean;
    'output-file'?: string;
    'reference-doc'?: string;
    [key: string]: unknown;
  }

  export function convert(
    options: ConvertOptions,
    stdin: string | null,
    files: Record<string, string | Blob>
  ): Promise<ConvertResult>;

  export function query(
    options: Record<string, unknown>
  ): Promise<{ stdout: string; stderr: string }>;
}
