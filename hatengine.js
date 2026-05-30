class HatEngine {
    constructor() {
        this.memory = {};
    }

    // Process the raw text inside <HAT> tags
    run(code) {
        const lines = code.split('\n');
        
        for (let line of lines) {
            line = line.trim();
            if (!line || line === '<HAT>' || line === '</HAT>') continue;

            // Handle 'wear' keyword (Variable Declaration)
            if (line.startsWith('wear')) {
                const parts = line.replace('wear ', '').split('=');
                const key = parts[0].trim();
                const val = eval(parts[1].trim()); // Note: Simplistic evaluation
                this.memory[key] = val;
            } 
            // Handle 'show' keyword (Output)
            else if (line.startsWith('show')) {
                const match = line.match(/show\((.*)\)/);
                if (match) {
                    const output = this.memory[match[1]] || match[1].replace(/['"]/g, '');
                    console.log(`[Hat Output]: ${output}`);
                    this.updateDOM(output);
                }
            }
        }
    }

    updateDOM(text) {
        const outputDiv = document.getElementById('hat-output');
        if (outputDiv) {
            outputDiv.innerHTML += `<p>${text}</p>`;
        }
    }
}

// Initialize and execute all Hat blocks on the page
window.addEventListener('DOMContentLoaded', () => {
    const hatEngine = new HatEngine();
    const scripts = document.querySelectorAll('script[type="text/hat"]');
    
    scripts.forEach(script => {
        hatEngine.run(script.innerHTML);
    });
});