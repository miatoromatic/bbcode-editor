class BBCodeEditor {
    constructor() {
        this.editor = document.getElementById('editor');
        this.highlight = document.getElementById('highlight');
        this.lineNumbers = document.getElementById('lineNumbers');
        this.status = document.getElementById('status');
        this.foldPanel = document.getElementById('foldPanel');
        this.foldContent = document.getElementById('foldContent');
        this.foldPanelVisible = false;

        // Inline tags that should not be collapsible
        this.inlineTags = new Set([
            'b', 'i', 'u', 's', 'url', 'color', 'size',
            'font', 'email', 'img', 'sup', 'sub', 'abbr',
            'acronym', 'strike', 'strong', 'em'
        ]);

        this.init();
    }

    init() {
        // Event listeners
        this.editor.addEventListener('input', () => this.handleInput());
        this.editor.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.editor.addEventListener('scroll', () => this.syncScroll());

        document.getElementById('copyBtn').addEventListener('click', () => this.copyAll());
        document.getElementById('downloadBtn').addEventListener('click', () => this.download());
        document.getElementById('clearBtn').addEventListener('click', () => this.clear());
        document.getElementById('sampleBtn').addEventListener('click', () => this.loadSample());
        document.getElementById('toggleFoldBtn').addEventListener('click', () => this.toggleFoldPanel());

        // Initial update
        this.handleInput();
    }

    handleInput() {
        const text = this.editor.value;
        this.updateHighlight(text);
        this.updateLineNumbers(text);
        this.updateStatus(text);
        if (this.foldPanelVisible) {
            this.updateFoldView(text);
        }
    }

    handleKeyDown(e) {
        // Auto-close BBCode tags when ] is typed
        if (e.key === ']' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
            const text = this.editor.value;
            const cursorPos = this.editor.selectionStart;

            // Find the opening tag before cursor
            const beforeCursor = text.substring(0, cursorPos);
            const tagMatch = beforeCursor.match(/\[(\w+)(?:=[^\]]+)?$/);

            if (tagMatch) {
                const tagName = tagMatch[1];

                // Check if closing tag already exists
                const afterCursor = text.substring(cursorPos);
                const closingTag = `[/${tagName}]`;

                if (!afterCursor.includes(closingTag)) {
                    // Insert closing tag after the cursor (after the ] we're typing)
                    setTimeout(() => {
                        const pos = this.editor.selectionStart;
                        this.editor.value =
                            this.editor.value.substring(0, pos) +
                            closingTag +
                            this.editor.value.substring(pos);
                        this.editor.selectionStart = pos;
                        this.editor.selectionEnd = pos;
                        this.handleInput();
                    }, 0);
                }
            }
        }

        // Tab key handling
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.editor.selectionStart;
            const end = this.editor.selectionEnd;
            const value = this.editor.value;

            this.editor.value = value.substring(0, start) + '    ' + value.substring(end);
            this.editor.selectionStart = this.editor.selectionEnd = start + 4;
            this.handleInput();
        }
    }

    updateHighlight(text) {
        if (!text) {
            this.highlight.innerHTML = '';
            return;
        }

        // Escape HTML
        let highlighted = this.escapeHtml(text);

        // Highlight BBCode tags
        // Pattern: [tagname] or [tagname=value] or [/tagname]
        highlighted = highlighted.replace(
            /(\[)(\/?)(\w+)((?:=[^\]]+)?)(\])/g,
            (match, openBracket, slash, tagName, attribute, closeBracket) => {
                let result = `<span class="bbcode-bracket">${openBracket}</span>`;

                if (slash) {
                    result += `<span class="bbcode-tag">${slash}</span>`;
                }

                result += `<span class="bbcode-tag">${tagName}</span>`;

                if (attribute) {
                    // Parse attribute (=value)
                    const attrMatch = attribute.match(/^(=)(.+)$/);
                    if (attrMatch) {
                        result += `<span class="bbcode-equals">${attrMatch[1]}</span>`;
                        result += `<span class="bbcode-value">${attrMatch[2]}</span>`;
                    }
                }

                result += `<span class="bbcode-bracket">${closeBracket}</span>`;
                return result;
            }
        );

        this.highlight.innerHTML = highlighted;
    }

    updateLineNumbers(text) {
        const lines = text.split('\n').length;
        let lineNumbersHtml = '';

        for (let i = 1; i <= lines; i++) {
            lineNumbersHtml += `<div class="line-number">${i}</div>`;
        }

        this.lineNumbers.innerHTML = lineNumbersHtml;
    }

    updateStatus(text) {
        const lines = text.split('\n').length;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;

        this.status.textContent = `Ready | Lines: ${lines} | Characters: ${chars} | Words: ${words}`;
    }

    syncScroll() {
        this.highlight.scrollTop = this.editor.scrollTop;
        this.highlight.scrollLeft = this.editor.scrollLeft;
        this.lineNumbers.scrollTop = this.editor.scrollTop;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    copyAll() {
        this.editor.select();
        document.execCommand('copy');

        // Visual feedback
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }

    download() {
        const text = this.editor.value;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'bbcode_' + new Date().toISOString().slice(0, 10) + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clear() {
        if (this.editor.value && !confirm('Are you sure you want to clear all content?')) {
            return;
        }
        this.editor.value = '';
        this.handleInput();
        this.editor.focus();
    }

    loadSample() {
        const sample = `[center][b]Welcome to BBCode Editor![/b][/center]

[b]Bold text[/b] and [i]italic text[/i] and [u]underlined text[/u]

[color=red]This text is red[/color]
[color=#00ff00]This text is green (hex)[/color]
[color=blue]This text is blue[/color]

[size=20]Large text[/size]
[size=10]Small text[/size]

[url=https://www.example.com]Click here to visit Example.com[/url]
[url]https://www.example.com[/url]

[img]https://via.placeholder.com/150[/img]

[quote]This is a quoted text block[/quote]

[quote=John Doe]This is a quote by John Doe[/quote]

[code]
function example() {
    console.log("This is code");
}
[/code]

[list]
[*]First item
[*]Second item
[*]Third item
[/list]

[list=1]
[*]Numbered item 1
[*]Numbered item 2
[*]Numbered item 3
[/list]

[youtube]dQw4w9WgXcQ[/youtube]

[spoiler]This is hidden spoiler content[/spoiler]

Nested tags example:
[center][b][color=red]Centered, bold, red text[/color][/b][/center]

[table]
[tr][td]Cell 1[/td][td]Cell 2[/td][/tr]
[tr][td]Cell 3[/td][td]Cell 4[/td][/tr]
[/table]`;

        this.editor.value = sample;
        this.handleInput();
    }

    toggleFoldPanel() {
        this.foldPanelVisible = !this.foldPanelVisible;
        this.foldPanel.classList.toggle('active');
        if (this.foldPanelVisible) {
            this.updateFoldView(this.editor.value);
        }
    }

    parseBBCode(text) {
        // Parse BBCode into a tree structure
        const tokens = [];
        const regex = /\[(\/?)([\w]+)(?:=([^\]]+))?\]/g;
        let match;
        let lastIndex = 0;

        while ((match = regex.exec(text)) !== null) {
            // Add text before tag
            if (match.index > lastIndex) {
                const textContent = text.substring(lastIndex, match.index);
                if (textContent.trim()) {
                    tokens.push({
                        type: 'text',
                        content: textContent,
                        start: lastIndex,
                        end: match.index
                    });
                }
            }

            tokens.push({
                type: match[1] ? 'close' : 'open',
                tag: match[2],
                attribute: match[3] || null,
                full: match[0],
                start: match.index,
                end: regex.lastIndex
            });

            lastIndex = regex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            const textContent = text.substring(lastIndex);
            if (textContent.trim()) {
                tokens.push({
                    type: 'text',
                    content: textContent,
                    start: lastIndex,
                    end: text.length
                });
            }
        }

        return this.buildTree(tokens);
    }

    buildTree(tokens) {
        const root = { children: [] };
        const stack = [root];

        for (const token of tokens) {
            if (token.type === 'open') {
                const node = {
                    tag: token.tag,
                    attribute: token.attribute,
                    children: [],
                    start: token.start,
                    end: token.end
                };
                stack[stack.length - 1].children.push(node);
                stack.push(node);
            } else if (token.type === 'close') {
                if (stack.length > 1 && stack[stack.length - 1].tag === token.tag) {
                    stack[stack.length - 1].closeEnd = token.end;
                    stack.pop();
                } else {
                    // Unmatched closing tag - add as text
                    stack[stack.length - 1].children.push({
                        type: 'text',
                        content: token.full
                    });
                }
            } else if (token.type === 'text') {
                stack[stack.length - 1].children.push(token);
            }
        }

        return root.children;
    }

    updateFoldView(text) {
        const tree = this.parseBBCode(text);
        this.foldContent.innerHTML = this.renderTree(tree, 0);
    }

    renderTree(nodes, depth) {
        let html = '';
        let nodeId = 0;

        for (const node of nodes) {
            if (node.type === 'text') {
                const preview = node.content.trim().substring(0, 50);
                if (preview) {
                    html += `<div class="fold-item" style="margin-left: ${depth * 15}px">
                        <span class="fold-text">${this.escapeHtml(preview)}${node.content.length > 50 ? '...' : ''}</span>
                    </div>`;
                }
            } else {
                const isInlineTag = this.inlineTags.has(node.tag.toLowerCase());

                if (isInlineTag) {
                    // For inline tags, show them without collapse functionality
                    const tagDisplay = node.attribute ?
                        `[${node.tag}=${node.attribute}]...[/${node.tag}]` :
                        `[${node.tag}]...[/${node.tag}]`;

                    html += `<div class="fold-item" style="margin-left: ${depth * 15}px">
                        <span style="display: inline-block; width: 16px;"></span>
                        <span class="fold-tag">${this.escapeHtml(tagDisplay)}</span>
                    </div>`;
                } else {
                    // For block-level tags, show collapse functionality
                    const id = `fold-${Date.now()}-${nodeId++}`;
                    const tagDisplay = node.attribute ?
                        `[${node.tag}=${node.attribute}]...[/${node.tag}]` :
                        `[${node.tag}]...[/${node.tag}]`;

                    html += `<div class="fold-item" style="margin-left: ${depth * 15}px">
                        <span class="fold-toggle" onclick="bbcodeEditor.toggleFold('${id}')">▼</span>
                        <span class="fold-tag">${this.escapeHtml(tagDisplay)}</span>
                        <div class="fold-content" id="${id}">
                            ${node.children ? this.renderTree(node.children, depth + 1) : ''}
                        </div>
                    </div>`;
                }
            }
        }

        return html || '<div class="fold-item" style="color: #858585;">No BBCode tags found</div>';
    }

    toggleFold(id) {
        const element = document.getElementById(id);
        const toggle = element.previousElementSibling.previousElementSibling;

        if (element.classList.contains('collapsed')) {
            element.classList.remove('collapsed');
            toggle.textContent = '▼';
        } else {
            element.classList.add('collapsed');
            toggle.textContent = '▶';
        }
    }
}

// Initialize the editor
const bbcodeEditor = new BBCodeEditor();
