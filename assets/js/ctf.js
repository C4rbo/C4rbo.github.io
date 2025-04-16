document.addEventListener('DOMContentLoaded', function () {
    // Effetto pioggia binaria
    const canvas = document.getElementById('binaryRain');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const binary = '01';
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);

    function drawBinaryRain() {
        ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#6e48aa';
        ctx.font = '15px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = binary.charAt(Math.floor(Math.random() * binary.length));
            ctx.fillText(text, i * 20, drops[i] * 20);

            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawBinaryRain, 33);

    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    mobileMenuBtn.addEventListener('click', function () {
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function () {
        nav.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Caricamento automatico lista CTF dalla homepage
    if (document.getElementById('ctf-list')) {
        fetch('data/ctf-index.json')
            .then(res => res.json())
            .then(ctfs => {
                const ctfList = document.getElementById('ctf-list');
                ctfs.forEach(ctf => {
                    const ctfElement = document.createElement('a');
                    ctfElement.className = 'skill-item';
                    ctfElement.href = ctf.path;
                    ctfElement.innerHTML = `
                        <h3 class="skill-name">${ctf.organizer}</h3>
                        <p class="social-link">View Writeups</p>
                    `;
                    ctfList.appendChild(ctfElement);
                });
            });
    }

    // Carica dinamicamente le organizzazioni da organizers.xml
    if (document.getElementById('organizers-list')) {
        fetch('data/organizers.xml')
            .then(res => res.text())
            .then(xmlText => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, 'application/xml');
                const organizers = xml.querySelectorAll('organizer');

                const organizerList = document.getElementById('organizers-list');

                organizers.forEach(org => {
                    const name = org.querySelector('name').textContent;
                    const url = org.querySelector('url').textContent;

                    const item = document.createElement('a');
                    item.className = 'skill-item';
                    item.href = url;
                    item.target = '_blank';
                    item.rel = 'noopener noreferrer';
                    item.innerHTML = `
                        <h3 class="skill-name">${name}</h3>
                        <p class="social-link">Visit it</p>
                    `;
                    organizerList.appendChild(item);
                });
            })
            .catch(err => {
                document.getElementById('organizers-list').innerHTML = `<p><strong>Errore nel caricamento delle organizzazioni:</strong> ${err.message}</p>`;
            });
    }

    // Caricamento dinamico dei writeup
    if (document.getElementById('writeups-list')) {
        const writeupsList = document.getElementById('writeups-list');
        const currentPath = window.location.pathname.replace(/\/$/, '');
        const writeupDir = `${currentPath}/writeup/`;
        const indexPath = `${currentPath}/index.json`;

        fetch(indexPath)
            .then(res => {
                if (!res.ok) throw new Error('Impossibile caricare index.json');
                return res.json();
            })
            .then(data => {
                data.writeups.forEach(file => {
                    const categoryMatch = file.match(/^([a-zA-Z0-9]+)_/);
                    const category = categoryMatch ? categoryMatch[1].toUpperCase() : 'UNKNOWN';

                    const writeupElement = document.createElement('div');
                    writeupElement.className = 'skill-item load-writeup';
                    writeupElement.dataset.file = file;
                    writeupElement.dataset.dir = writeupDir;
                    writeupElement.innerHTML = `
                        <h3 class="skill-name">${file.replace('.md', '').replace(/_/g, ' ')}</h3>
                        <p class="category-label"><strong>Categoria:</strong> ${category}</p>
                        <p class="social-link">View Writeup</p>
                    `;
                    writeupsList.appendChild(writeupElement);
                });
            })
            .catch(err => {
                writeupsList.innerHTML = `<p><strong>Errore:</strong> ${err.message}</p>`;
            });

        // Click listener per card cliccabili
        document.addEventListener('click', function (e) {
            const el = e.target.closest('.load-writeup');
            if (el) {
                const file = el.dataset.file;
                const dir = el.dataset.dir;
                const path = `${dir}${file}`;

                fetch(path)
                    .then(res => {
                        if (!res.ok) throw new Error('File non trovato');
                        return res.text();
                    })
                    .then(md => {
                        document.getElementById('writeup-content').innerHTML = marked.parse(md);
                    })
                    .catch(err => {
                        document.getElementById('writeup-content').innerHTML = `
                            <p><strong>Errore nel caricamento di:</strong> ${path}</p>
                            <pre>${err}</pre>
                        `;
                    });
            }
        });
    }
});

// Resize canvas
window.addEventListener('resize', function () {
    const canvas = document.getElementById('binaryRain');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
