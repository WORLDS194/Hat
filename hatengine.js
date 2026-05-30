// hatengine.js
class HatEngine {
    constructor() {
        this.memory = {};
        console.log("Hat Engine: Initialized and ready.");
    }

    // Main parser
    run(code) {
        // Strip out the wrapper tags
        const cleanCode = code.replace(/<HAT>/g, '').replace(/<\/HAT>/g, '').trim();
        const lines = cleanCode.split('\n');

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Handle 'wear' keyword (Variables)
            if (line.startsWith('wear')) {
                const parts = line.replace('wear ', '').split('=');
                if (parts.length === 2) {
                    const key = parts[0].trim();
                    const val = parts[1].trim().replace(/['"]/g, '');
                    this.memory[key] = val;
                }
            } 
            // Handle 'show' keyword (Output)
            else if (line.startsWith('show')) {
                const match = line.match(/show\((.*)\)/);
                if (match) {
                    const key = match[1].trim();
                    const value = this.memory[key] || key;
                    this.updateDOM(value);
                }
            }
            // Handle 'alert' keyword (Popups)
            else if (line.startsWith('alert')) {
                const match = line.match(/alert\((.*)\)/);
                if (match) {
                    const key = match[1].trim();
                    alert(this.memory[key] || key);
                }
            }
        }
    }

    // Helper to render output to the webpage
    updateDOM(text) {
        const outputDiv = document.getElementById('hat-output');
        if (outputDiv) {
            const p = document.createElement('p');
            p.textContent = text;
            outputDiv.appendChild(p);
        } else {
            console.log("Hat Output:", text);
        }
    }
}

// Attach to window so HTML files can see it immediately
window.HatEngine = HatEngine;
