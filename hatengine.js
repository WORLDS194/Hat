// hatengine.js
class HatEngine {
    constructor() {
        this.memory = {};
        this.commands = {
            'wear': (args) => {
                const [key, val] = args.split('=').map(s => s.trim());
                this.memory[key] = val.replace(/['"]/g, '');
            },
            'show': (arg) => {
                const text = this.memory[arg] || arg.replace(/['"]/g, '');
                this.updateDOM(`<div>${text}</div>`);
            },
            'math': (args) => {
                const [key, val] = args.split('=').map(s => s.trim());
                this.memory[key] = eval(val); // Powerful for calculations
            },
            'link': (args) => {
                const [label, url] = args.split(',').map(s => s.trim());
                this.updateDOM(`<a href="${url.replace(/['"]/g, '')}">${label.replace(/['"]/g, '')}</a>`);
            },
            'header': (text) => {
                this.updateDOM(`<h1>${text.replace(/['"]/g, '')}</h1>`);
            },
            'style': (args) => {
                const [prop, val] = args.split(',').map(s => s.trim());
                document.getElementById('hat-output').style[prop] = val;
            }
        };
    }

    run(code) {
        const lines = code.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (!line || line.includes('<HAT>') || line.includes('</HAT>')) continue;

            const match = line.match(/^(\w+)\((.*)\)|(\w+)\s+(.*)/);
            if (match) {
                const cmd = match[1] || match[3];
                const args = match[2] || match[4];
                if (this.commands[cmd]) this.commands[cmd](args);
            }
        }
    }

    updateDOM(html) {
        const outputDiv = document.getElementById('hat-output');
        if (outputDiv) outputDiv.innerHTML += `<div>${html}</div>`;
    }
}
window.HatEngine = HatEngine;
