// hatengine.js - IE Compatible Version
window.HatEngine = function() {
    var self = this;
    this.memory = {};
    
    this.commands = {
        'wear': function(args) {
            var parts = args.split('=');
            var key = parts[0].trim();
            var val = parts[1] ? parts[1].trim() : "";
            self.memory[key] = val.replace(/['"]/g, '');
        },
        'data': function(args) {
            var parts = args.split('=');
            var key = parts[0].trim();
            var val = parts[1] ? parts[1].trim() : "";
            self.memory[key] = val.replace(/['"]/g, '');
        },
        'math': function(args) {
            var parts = args.split('=');
            var key = parts[0].trim();
            var val = parts[1] ? parts[1].trim() : "";
            try {
                // IE-compatible variable replacement inside math expressions
                var dynamicExpression = val.replace(/[a-zA-Z_]\w*/g, function(match) {
                    return self.memory[match] !== undefined ? self.memory[match] : match;
                });
                self.memory[key] = eval(dynamicExpression);
            } catch(e) {
                self.memory[key] = "Math Error";
            }
        },
        'show': function(arg) {
            var text = self.memory[arg] !== undefined ? self.memory[arg] : arg.replace(/['"]/g, '');
            self.updateDOM('<div>' + text + '</div>');
        },
        'header': function(text) {
            var content = self.memory[text] !== undefined ? self.memory[text] : text.replace(/['"]/g, '');
            self.updateDOM('<h1>' + content + '</h1>');
        },
        'link': function(args) {
            var parts = args.split(',');
            var label = parts[0].trim().replace(/['"]/g, '');
            var url = parts[1] ? parts[1].trim().replace(/['"]/g, '') : '';
            self.updateDOM('<p><a href="' + url + '" target="_blank">' + label + '</a></p>');
        },
        'style': function(args) {
            var parts = args.split(',');
            var prop = parts[0].trim();
            var val = parts[1] ? parts[1].trim() : '';
            var output = document.getElementById('hat-output');
            if (output) {
                output.style[prop] = val;
            }
        }
    };
    
    this.init();
};

HatEngine.prototype.init = function() {
    var self = this;
    
    // IE-compatible DOM content loaded event listener
    var runEngine = function() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (script.getAttribute('type') === 'text/plain' && script.innerHTML.indexOf('<HAT>') !== -1) {
                self.run(script.innerHTML);
            }
        }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        runEngine();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', runEngine, false);
    } else if (document.attachEvent) { // Legacy IE support
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState === 'complete') runEngine();
        });
    }
};

HatEngine.prototype.run = function(code) {
    var self = this;
    var lines = code.split('\n');
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line || line.indexOf('<HAT>') !== -1 || line.indexOf('</HAT>') !== -1) continue;
        
        var match = line.match(/^(\w+)\((.*)\)|(\w+)\s+(.*)/);
        if (match) {
            var cmd = match[1] || match[3];
            var args = match[2] || match[4];
            if (self.commands[cmd]) {
                self.commands[cmd](args);
            }
        }
    }
};

HatEngine.prototype.updateDOM = function(html) {
    var out = document.getElementById('hat-output');
    if (out) {
        out.innerHTML += html;
    }
};

// Start the engine safely for all browsers
new HatEngine();
