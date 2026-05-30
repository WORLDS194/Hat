class HatEngine {
    constructor() {
        this.memory = {};
        this.commands = {
            // Variable / Text declaration
            'wear': (args) => {
                const [key, val] = args.split('=').map(s => s.trim());
                this.memory[key] = val ? val.replace(/['"]/g, '') : "";
            },
            // Pure Data declaration
            'data': (args) => {
                const [key, val] = args.split('=').map(s => s.trim());
                this.memory[key] = val ? val.replace(/['"]/g, '') : "";
            },
            // Math operations
            'math': (args) => {
                const [key, val] = args.split('=').map(s => s.trim());
                // Evaluates the math expression using numbers or stored variables
                try {
                    const dynamicExpression = val.replace(/[a-zA-Z_]\w*/g, (match) => {
                        return this.memory[match] !== undefined ? this.memory[match] : match;
                    });
                    this.memory[key] = eval(dynamicExpression);
                } catch(e) {
                    this.memory[key] = "Math Error";
                }
            },
            // UI Output
            'show': (arg) => {
                const text = this.memory[arg] !== undefined ? this.memory[arg] : arg.replace(/['"]/g, '');
                this.updateDOM(`<div>${text}</div>`);
            },
            // UI Headers
            'header': (text) => {
                const content = this.memory[text] !== undefined ? this.memory[text] : text.replace(/['"]/g, '');
                this.updateDOM(`<h1>${content}</h1>`);
            },
            // Hyperlinks
            'link': (args) => {
                const [label, url] = args.split(',').map(s => s.trim());
                const cleanLabel = label.replace(/['"]/g, '');
                const cleanUrl = url.replace(/['"]/g, '');
                this.updateDOM(`<p><a href="${cleanUrl}" target="_blank">${cleanLabel}</a></p>`);
            },
            // Styling the layout container
            'style': (args) => {
                const [prop, val] = args.split(',').map(s => s.trim());
                const output = document.getElementById('hat-output');
                if (output) output.style[prop] = val;
            }
        };
        this.init();
    }

    // Automatically looks for <HAT> tags on the page
    init() {
        window.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('script[type="text/plain"]').forEach(s => {
                if (s.textContent.includes('<HAT>')) this.run(s.textContent);
            });
        });
    }

    run(code) {
        code.split('\n').forEach(line => {
            line = line.trim();
            if (!line || line.includes('<HAT>') || line.includes('</HAT>')) return;
            
            // Matches command(arguments) or command arguments
            const match = line.match(/^(\w+)\((.*)\)|(\w+)\s+(.*)/);
            if (match) {
                const cmd = match[1] || match[3];
                const args = match[2] || match[4];
                if (this.commands[cmd]) this.commands[cmd](args);
            }
        });
    }

    updateDOM(html) {
        const out = document.getElementById('hat-output');
        if (out) out.innerHTML += html;
    }
}

// Start it up automatically
new HatEngine();
