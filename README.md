<div align="center">

# Any Markdown Converter

**Bidirectional document conversion: any file format ↔ Markdown. Powered by anydoc (Rust), turndown, and pandoc-wasm.**

[![Version](https://img.shields.io/open-vsx/v/jcendal/any-markdown-converter?style=flat-square&label=Version)](https://open-vsx.org/extension/jcendal/any-markdown-converter)
[![Downloads](https://img.shields.io/open-vsx/dt/jcendal/any-markdown-converter?style=flat-square&label=Downloads)](https://open-vsx.org/extension/jcendal/any-markdown-converter)
[![Rating](https://img.shields.io/open-vsx/rating/jcendal/any-markdown-converter?style=flat-square&label=Rating)](https://open-vsx.org/extension/jcendal/any-markdown-converter)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) •
[Settings](#%EF%B8%8F-settings) • [How It Works](#-how-it-works)

[![Install in VS Code / Cursor](https://img.shields.io/badge/VSCode%2FCursor-Install-007ACC?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMy4xNSAyLjU4N0wxOC4yMS4yMWExLjQ5NCAxLjQ5NCAwIDAgMC0xLjcwNS4yOWwtOS40NiA4LjYzLTQuMTItMy4xMjhhLjk5OS45OTkgMCAwIDAtMS4yNzYuMDU3TC4zMjcgNy4yNjFBMSAxIDAgMCAwIC4zMjYgOC43NEwzLjg5OSAxMiAuMzI2IDE1LjI2YTEgMSAwIDAgMCAuMDAxIDEuNDc5TDEuNjUgMTcuOTRhLjk5OS45OTkgMCAwIDAgMS4yNzYuMDU3bDQuMTItMy4xMjggOS40NiA4LjYzYTEuNDkyIDEuNDkyIDAgMCAwIDEuNzA0LjI5bDQuOTQyLTIuMzc3QTEuNSAxLjUgMCAwIDAgMjQgMjAuMDZWMy45MzlhMS41IDEuNSAwIDAgMC0uODUtMS4zNTJ6bS01LjE0NiAxNC44NjFMMTAuODI2IDEybDcuMTc4LTUuNDQ4djEwLjg5NnoiLz48L3N2Zz4=)](https://marketplace.visualstudio.com/items?itemName=jcendal.any-markdown-converter)
&nbsp;&nbsp;
[![Install from Open VSX](https://img.shields.io/badge/Open%20VSX-Install-764ABC?style=for-the-badge&logo=eclipse&logoColor=white)](https://open-vsx.org/extension/jcendal/any-markdown-converter)

---

</div>

## 📖 About

Working with documents in VS Code or Cursor often means switching between multiple formats — Word specs, PowerPoint decks, Excel spreadsheets, scanned PDFs, HTML pages, and more. But your editor speaks Markdown.

This extension bridges that gap. It converts **any document to Markdown** using [anydoc](https://github.com/firecrawl/anydoc) (a Rust-based extraction engine) and [turndown](https://github.com/mixmark-io/turndown) (for HTML files), and exports **Markdown back** to Word, PowerPoint, Excel, PDF, EPUB, HTML, RTF, and ODT — all without leaving your editor.

### 🎯 Key Highlights

- 🔄 **Bidirectional** — Import any format to Markdown, and export Markdown to 8+ formats
- 📄 **20+ input formats** — doc, docx, pptx, xlsx, odt, ods, odp, rtf, epub, csv, pdf, html, and more
- 📊 **8 export targets** — PDF, DOCX, PPTX, XLSX, EPUB, HTML, RTF, ODT
- 🦀 **Rust-powered extraction** — Fast, accurate conversion via anydoc (native NAPI-RS addon)
- 🌐 **HTML → Markdown** — Clean conversion with body extraction via turndown
- 📝 **pandoc-wasm** — EPUB, RTF, and ODT exports via pandoc running in WebAssembly (optional)
- 🖨️ **PDF with Mermaid** — Diagrams rendered as real SVG graphics via Chrome
- 🔒 **Privacy-first** — Everything runs locally, no data leaves your machine
- 🖥️ **No bundled browser** — Uses your installed Chrome/Chromium for PDF

---

## ✨ Features

| Feature | Description |
| --- | --- |
| **Any → Markdown** | Convert 20+ document formats to clean Markdown |
| **HTML → Markdown** | Convert HTML/HTM files with body extraction and tag cleanup |
| **Markdown → PDF** | With Mermaid diagrams rendered as real SVG graphics |
| **Markdown → DOCX** | Microsoft Word document |
| **Markdown → PPTX** | PowerPoint presentation (slides separated by `---`) |
| **Markdown → XLSX** | Excel spreadsheet (from Markdown tables) |
| **Markdown → EPUB** | E-book format via pandoc-wasm (optional) |
| **Markdown → HTML** | Standalone HTML page with inline styles |
| **Markdown → RTF** | Rich Text Format via pandoc-wasm (optional) |
| **Markdown → ODT** | OpenDocument Text via pandoc-wasm (optional) |
| **Preview** | Preview any document as Markdown without saving |
| **Context menus** | Right-click in editor, explorer, or use Command Palette |

### Supported Input Formats

| Category | Extensions |
| --- | --- |
| **Microsoft Office** | `.doc`, `.docx`, `.docm`, `.ppt`, `.pptx`, `.pptm`, `.pps`, `.ppsx`, `.ppsm`, `.pot`, `.xls`, `.xlsx`, `.xlsm`, `.xlsb` |
| **OpenDocument** | `.odt`, `.ods`, `.odp` |
| **Web** | `.html`, `.htm` |
| **Other** | `.rtf`, `.epub`, `.csv`, `.pdf` |

---

## 📦 Installation

Open VS Code / Cursor, launch Quick Open (`Ctrl+P` / `Cmd+P`), and run:

```
ext install jcendal.any-markdown-converter
```

Or search for **Any Markdown Converter** in the Extensions sidebar.

---

## 🚀 Usage

### Convert a document to Markdown

Right-click any supported file in the Explorer sidebar or within the editor, then select **Any Markdown Converter: Convert to Markdown**.

You can also use the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for `Convert to Markdown`.

### Export Markdown to another format

Right-click any `.md` file in the Explorer sidebar or within the editor, then select **Any Markdown Converter: Export Markdown to...**

A quick pick menu will appear with all available export formats.

### Preview as Markdown

Use the Command Palette to run **Any Markdown Converter: Preview as Markdown** to see a preview of any supported document without creating a file.

### Other access methods

- **Command Palette** — `Cmd+Shift+P` / `Ctrl+Shift+P` → search for `Any Markdown Converter`
- **Editor title bar** — top-right area when a supported file is active

The output file is saved alongside the source file and opens automatically.

---

## ⚙️ Settings

Configure via `File → Preferences → Settings` and search for `markdownConverter`.

| Setting | Default | Description |
| --- | --- | --- |
| `chromePath` | Auto-detect | Absolute path to Chrome/Chromium executable (for PDF export) |
| `pdf.pageSize` | `A4` | `A4`, `Letter`, `Legal`, `A3`, `A5`, `Tabloid` |
| `pdf.orientation` | `portrait` | `portrait` or `landscape` |
| `pdf.fontSize` | `13` | Base font size in pixels for PDF export |
| `pdf.showPageNumbers` | `true` | Show page numbers in PDF footer |
| `pdf.mermaidWaitMs` | `4000` | Time to wait for Mermaid rendering (1000–30000 ms) |
| `openAfterExport` | `true` | Open the generated file after export |

### Configuration examples

**Landscape A3 for large documents:**

```json
{
  "markdownConverter.pdf.pageSize": "A3",
  "markdownConverter.pdf.orientation": "landscape"
}
```

**Extra time for complex Mermaid diagrams:**

```json
{
  "markdownConverter.pdf.mermaidWaitMs": 10000
}
```

**Minimal PDF without page numbers:**

```json
{
  "markdownConverter.pdf.showPageNumbers": false,
  "markdownConverter.openAfterExport": false
}
```

---

## 🔧 Requirements

For **PDF export**, a Chromium-based browser must be installed:

| Browser | macOS | Linux | Windows |
| --- | :---: | :---: | :---: |
| Google Chrome | ✅ | ✅ | ✅ |
| Microsoft Edge | ✅ | ✅ | ✅ |
| Brave Browser | ✅ | ✅ | ✅ |
| Chromium | ✅ | ✅ | — |

The browser is **auto-detected**. If detection fails:

```json
{
  "markdownConverter.chromePath": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
}
```

For **EPUB, RTF, and ODT export**, the `pandoc-wasm` package is required. It is declared as an optional dependency — if it is not available, these three export formats will be disabled and the extension will notify you. All other conversions work without it.

All other conversions work out of the box with no additional dependencies.

---

## 🏗️ How It Works

```
              ┌── Import engines ───────────────────────────────────────────┐
              │                                                             │
              │  ┌───────────────┐                                          │
┌───────────┐ │  │ anydoc        │                              ┌────────┐  │
│ doc/docx  │─┤  │ (Rust native) │──────────────────────────────│  .md   │  │
│ pptx/xlsx │ │  └───────────────┘                              │        │  │
│ pdf/epub  │ │                                                 └────────┘  │
│ odt/csv   │ │  ┌───────────────┐                              ┌────────┐  │
│           │ │  │ turndown      │                              │  .md   │  │
│ html/htm  │─┤  │ (HTML → MD)   │──────────────────────────────│        │  │
└───────────┘ │  └───────────────┘                              └────────┘  │
              │                                                             │
              └─────────────────────────────────────────────────────────────┘

              ┌── Export engines ────────────────────────────────────────────┐
              │                                                             │
┌───────────┐ │  md-to-docx ──────────────────────────────────▶  .docx     │
│           │ │  pptxgenjs ───────────────────────────────────▶  .pptx     │
│   .md     │─┤  exceljs ────────────────────────────────────▶  .xlsx     │
│           │ │  puppeteer-core + Chrome + Mermaid.js ────────▶  .pdf     │
│           │ │  marked ─────────────────────────────────────▶  .html     │
└───────────┘ │  pandoc-wasm (optional) ─────────────────────▶  .epub     │
              │  pandoc-wasm (optional) ─────────────────────▶  .rtf      │
              │  pandoc-wasm (optional) ─────────────────────▶  .odt      │
              │                                                             │
              └─────────────────────────────────────────────────────────────┘
```

### Import (Any → Markdown)

| Input | Engine |
| --- | --- |
| **Office, PDF, EPUB, CSV, and other binary formats** | [anydoc](https://github.com/firecrawl/anydoc) — Rust-based document extraction engine compiled to a native Node.js addon via NAPI-RS |
| **HTML / HTM** | [turndown](https://github.com/mixmark-io/turndown) — extracts `<body>` content, strips `<script>`, `<style>`, and `<noscript>` tags, then converts to clean Markdown |

### Export (Markdown → ...)

| Format | Engine |
| --- | --- |
| **PDF** | [marked](https://github.com/markedjs/marked) → HTML → Headless Chrome via [puppeteer-core](https://github.com/puppeteer/puppeteer) with [Mermaid.js v11](https://mermaid.js.org/) for diagram rendering |
| **DOCX** | [md-to-docx](https://github.com/MohtashamMurshid/md-to-docx) |
| **PPTX** | [pptxgenjs](https://github.com/gitbrent/PptxGenJS) — slides split on `---` separators |
| **XLSX** | [exceljs](https://github.com/exceljs/exceljs) — Markdown tables → spreadsheet |
| **HTML** | [marked](https://github.com/markedjs/marked) → standalone HTML with inline styles |
| **EPUB, RTF, ODT** | [pandoc-wasm](https://github.com/nicolo-ribaudo/tc39-proposal-pandoc-wasm) — optional dependency |

---

## 🔒 Privacy

This extension runs **entirely on your local machine**:

- ✅ No telemetry or analytics
- ✅ No data collection or transmission
- ✅ Document content never leaves your computer
- ✅ The only network request is loading Mermaid.js from `cdn.jsdelivr.net` (PDF export)

---

## 🐛 Known Issues

| Issue | Workaround |
| --- | --- |
| Complex Mermaid diagrams render incompletely | Increase `pdf.mermaidWaitMs` (e.g. `8000` or `15000`) |
| Chrome not found for PDF export | Set `chromePath` manually in settings |
| EPUB/RTF/ODT export unavailable | These formats require `pandoc-wasm`, which is an optional dependency |
| Some scanned PDFs extract poorly | Quality depends on the document's text layer |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the [repository](https://github.com/jcendal/any-markdown-converter)
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgements

This extension is built on top of these excellent open-source projects:

| Library | Role |
| --- | --- |
| [anydoc](https://github.com/firecrawl/anydoc) | Rust-based document extraction engine (any format → Markdown) via native NAPI-RS addon |
| [turndown](https://github.com/mixmark-io/turndown) | HTML → Markdown conversion with body extraction and tag cleanup |
| [marked](https://github.com/markedjs/marked) | Markdown parser for HTML and PDF generation |
| [puppeteer-core](https://github.com/puppeteer/puppeteer) | Headless Chrome automation for PDF rendering |
| [Mermaid.js](https://mermaid.js.org/) | Diagram rendering as SVG in PDF output |
| [md-to-docx](https://github.com/MohtashamMurshid/md-to-docx) | Markdown to Word document conversion |
| [PptxGenJS](https://github.com/gitbrent/PptxGenJS) | Markdown to PowerPoint presentation generation |
| [ExcelJS](https://github.com/exceljs/exceljs) | Markdown tables to Excel spreadsheet conversion |
| [pandoc-wasm](https://github.com/nicolo-ribaudo/tc39-proposal-pandoc-wasm) | EPUB, RTF, and ODT export via pandoc in WebAssembly (optional) |
| [semantic-release](https://github.com/semantic-release/semantic-release) | Automated versioning and release management |

---

## 📜 License

[MIT](LICENSE) © Jorge Cendal

---

<div align="center">

**Built with ❤️ for the developer community**

[⬆ Back to Top](#any-markdown-converter)

</div>
