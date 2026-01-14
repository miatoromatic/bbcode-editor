# BBCode Editor

A modern, web-based text editor with syntax highlighting specifically designed for BBCode editing. Perfect for forum users who work with custom BBCode formatting.

## Features

### ✨ Syntax Highlighting
- **Color-coded BBCode tags** - Opening tags `[tag]`, closing tags `[/tag]`, and attributes `[tag=value]` are highlighted in different colors
- **Easy visual parsing** - Quickly identify BBCode structure with golden brackets, brown tags, and cyan values
- **Real-time highlighting** - Updates as you type

### 📝 Editor Features
- **Line numbers** - Track your position in longer documents
- **Auto-close tags** - When you type `]` to close an opening tag, the editor automatically inserts the matching closing tag `[/tagname]`
- **Tab support** - Press Tab to insert 4 spaces for indentation
- **Syntax-aware scrolling** - Synchronized scrolling between editor and highlight overlay

### 🔽 BBCode Folding/Collapsing
- **Toggle Fold View** - Click the "Toggle Fold View" button to see a hierarchical view of your BBCode structure
- **Collapsible sections** - Click the ▼ arrows to collapse/expand BBCode blocks
- **Nested structure visualization** - Easily understand deeply nested BBCode with indented tree view
- **Quick navigation** - Find and focus on specific BBCode sections

### 🛠️ Utility Features
- **📋 Copy All** - One-click copy of all editor content to clipboard
- **💾 Download as TXT** - Export your BBCode as a text file with automatic date stamping
- **🗑️ Clear** - Clear all content (with confirmation dialog)
- **📝 Load Sample** - Load a sample document showcasing various BBCode tags

### 🎨 Modern UI
- **Dark theme** - Easy on the eyes with VS Code-inspired color scheme
- **Responsive design** - Works on different screen sizes
- **Status bar** - Real-time display of lines, characters, and word count

## Usage

Simply open `index.html` in any modern web browser. No installation or server required!

### Keyboard Shortcuts
- **Tab** - Insert 4 spaces
- **Type `]` after opening tag** - Auto-insert closing tag

### Supported BBCode Tags
The editor recognizes all standard BBCode tags including:
- Text formatting: `[b]`, `[i]`, `[u]`, `[s]`
- Colors and sizes: `[color=red]`, `[size=20]`
- Links and images: `[url]`, `[img]`
- Quotes and code: `[quote]`, `[code]`
- Lists: `[list]`, `[*]`
- Tables: `[table]`, `[tr]`, `[td]`
- Media: `[youtube]`, `[video]`
- Special: `[spoiler]`, `[center]`, `[left]`, `[right]`

## File Structure

```
bbcode-editor/
├── index.html   - Main HTML structure
├── style.css    - All styling and themes
├── script.js    - Editor functionality and BBCode parsing
└── README.md    - This file
```

## Technical Details

- **Pure HTML/CSS/JavaScript** - No dependencies or frameworks required
- **Modular structure** - Separated into HTML, CSS, and JavaScript files for maintainability
- **Modern browser required** - Uses ES6+ JavaScript features
- **Transparent overlay technique** - The editor uses a transparent textarea overlaying syntax-highlighted text for seamless editing

## License

MIT License - See LICENSE file for details