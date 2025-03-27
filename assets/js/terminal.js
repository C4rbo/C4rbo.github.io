document.addEventListener('DOMContentLoaded', function() {
    const text = "cat carbo_profile.txt";
    const typingElement = document.getElementById('typing-text');
    const outputElement = document.getElementById('output');
    const cursorElement = document.getElementById('cursor');
    
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, Math.random() * 40 + 40);
        } else {
            cursorElement.style.display = 'none';
            setTimeout(showOutput, 400);
        }
    }

    function showOutput() {
        const bio = `
╭───────────────────────────────────────────────╮
│             CARBO - UniBa Student              │
╰───────────────────────────────────────────────╯

--> EDUCATION
   - Computer Science Student @ University of Bari
   - Italian Software Developer
   - Cybersecurity enthusiast
   - CTF Player 

--> TECHNICAL SKILLS
   [Web] HTML5/CSS3, JavaScript, PHP, React, SQL
   [Sec] Burp Suite
   [Lang] Python, C, C++, Assembly
   [Tools] Vscode, Ghidra, Gdb, Gef, Wireshark, Docker, Git

--> CONTACTS
   💻 https://github.com/C4rbo
   🐦 Linkedin: @carbo
   🔐 PGP: 0x1A2B3C4D5E6F7890

╭───────────────────────────────────────────────╮
│  Type 'skills --detail' for full competency    │
╰───────────────────────────────────────────────╯`;

        outputElement.innerHTML = '';
        let j = 0;
        let isNewLine = false;

        function typeOutput() {
            if (j < bio.length) {
                if (bio[j] === '\n') {
                    outputElement.innerHTML += '<br>';
                    isNewLine = true;
                } else {
                    const char = bio[j];
                    const delay = isNewLine ? 100 : Math.random() * 30 + 20;
                    
                    if ('╭╰╮╯│─•'.includes(char)) {
                        outputElement.innerHTML += `<span class="decor-char">${char}</span>`;
                    } else if (char === '@') {
                        outputElement.innerHTML += `<span class="at-char">${char}</span>`;
                    } else {
                        outputElement.innerHTML += char;
                    }
                    
                    isNewLine = false;
                }
                j++;
                setTimeout(typeOutput, isNewLine ? 50 : Math.random() * 30 + 20);
            } else {
                cursorElement.style.display = 'inline-block';
                cursorElement.style.animation = 'blink 1s infinite';
            }
        }

        typeOutput();
    }

    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('terminal').style.opacity = '0';
        setTimeout(() => document.getElementById('terminal').style.display = 'none', 300);
    });

    typeWriter();
});