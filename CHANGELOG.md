## [1.0.1](https://github.com/jcendal/markdown-converter/compare/v1.0.0...v1.0.1) (2026-08-06)

### Bug Fixes

* remove --no-dependencies from CI packaging ([b9ec097](https://github.com/jcendal/markdown-converter/commit/b9ec09742e331bba8716c5e809bf83bbd1734c13))

## 1.0.0 (2026-08-06)

### Features

* initial release of Markdown Converter ([64f4c0e](https://github.com/jcendal/markdown-converter/commit/64f4c0ee47e60f1cba6ffbe4adb311c7ccdb63b0))

# Changelog

## 0.1.0

- Initial release
- Bidirectional document conversion: any file format ↔ Markdown
- Import 20+ formats to Markdown via anydoc (Rust/WASM)
- Export Markdown to PDF, DOCX, PPTX, XLSX, EPUB, HTML, RTF, ODT
- Mermaid diagram rendering as SVG in PDF export
- pandoc-wasm integration for EPUB, RTF, ODT exports
- Auto-detection of Chrome/Chromium on macOS, Linux, Windows
- Configurable PDF page size, orientation, font size, page numbers
- Context menu and command palette integration
- Preview as Markdown command
