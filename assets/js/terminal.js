document.addEventListener('DOMContentLoaded', function() {
    const terminalLines = [
{text: "Last login: Sun Mar 30 18:45:12 on ttys000", delay: 800},
{text: "Welcome to Carbo's Blog", delay: 600},
{text: "Initializing environment...", delay: 400},
{text: "User: <span class='terminal-user'>Carbo</span>", type: "response", delay: 300},
{text: "Status: <span class='terminal-user'>Software Developer & CTF Player</span>", type: "response", delay: 300},
{text: "Education: <span class='terminal-user'>Student at UniBA</span>", type: "response", delay: 300},
{text: "Skills: <span class='terminal-user'>Python, C++, Bash</span>", type: "response", delay: 300},
{text: "cat social.txt", type: "command", delay: 800},
{text: "GitHub: <a href='https://github.com/C4rbo' target='_blank' class='terminal-user'>github.com/C4rbo</a>", type: "response", delay: 150},
{text: "LinkedIn: <a href='https://www.linkedin.com/in/alessio-carbonara-675a1a295/' target='_blank' class='terminal-user'>linkedin.com/in/alessio-carbonara</a>", type: "response", delay: 150},
{text: "connect blog_db", type: "command", delay: 800},
{text: "Access granted. Ready to explore my blog", type: "response", delay: 400}
];

    const terminalOutput = document.getElementById('terminal-output');
    let currentLine = 0;

    function typeTerminal() {
        if (currentLine < terminalLines.length) {
            const line = terminalLines[currentLine];
            const lineElement = document.createElement('div');
            lineElement.className = 'terminal-line';
            
            if (line.type === "command") {
                lineElement.innerHTML = `<span class="terminal-prompt">$ </span><span class="terminal-command">${line.text}</span>`;
            } else if (line.type === "response") {
                lineElement.innerHTML = `<span class="terminal-response">${line.text}</span>`;
            } else {
                lineElement.innerHTML = `<span class="terminal-response">${line.text}</span>`;
            }
            
            terminalOutput.appendChild(lineElement);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            
            currentLine++;
            setTimeout(typeTerminal, line.delay);
        } else {
            // Add blinking cursor at the end
            const cursorElement = document.createElement('span');
            cursorElement.className = 'terminal-cursor';
            terminalOutput.appendChild(cursorElement);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }

    setTimeout(typeTerminal, 1000);

});
