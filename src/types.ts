export type ExportFormat =
  | 'docx'
  | 'pptx'
  | 'xlsx'
  | 'pdf'
  | 'html'
  | 'epub'
  | 'rtf'
  | 'odt';

export const SUPPORTED_INPUT_EXTENSIONS = new Set([
  '.doc', '.docx', '.docm',
  '.ppt', '.pps', '.pot', '.pptx', '.pptm', '.ppsx', '.ppsm',
  '.xls', '.xlsx', '.xlsm', '.xlsb',
  '.odt', '.ods', '.odp',
  '.rtf',
  '.epub',
  '.csv',
  '.pdf',
  '.html', '.htm',
]);

export const PANDOC_FORMATS = new Set<ExportFormat>(['epub', 'rtf', 'odt']);
