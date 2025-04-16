document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    mobileMenuBtn?.addEventListener('click', () => {
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay?.addEventListener('click', () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
    });

    // CTF List (homepage)
    const ctfList = document.getElementById('ctf-list');
    if (ctfList) {
        fetch('data/ctf-index.json')
            .then(res => res.json())
            .then(ctfs => {
                ctfs.forEach(ctf => {
                    const el = document.createElement('a');
                    el.className = 'skill-item';
                    el.href = ctf.path;
                    el.innerHTML = `
                        <h3 class="skill-name">${ctf.organizer}</h3>
                        <p class="social-link">View Writeups</p>
                    `;
                    ctfList.appendChild(el);
                });
            })
            .catch(err => {
                ctfList.innerHTML = `<p><strong>Errore:</strong> ${err.message}</p>`;
            });
    }

    // Organizer List (organizers page)
    const organizersList = document.getElementById('organizers-list');
    if (organizersList) {
        fetch('data/organizers.xml')
            .then(res => res.text())
            .then(xmlText => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, 'application/xml');
                const organizers = xml.querySelectorAll('organizer');

                organizers.forEach(org => {
                    const name = org.querySelector('name').textContent;
                    const url = org.querySelector('url').textContent;

                    const el = document.createElement('a');
                    el.className = 'skill-item';
                    el.href = url;
                    el.target = '_blank';
                    el.rel = 'noopener noreferrer';
                    el.innerHTML = `
                        <h3 class="skill-name">${name}</h3>
                        <p class="social-link">Visit it</p>
                    `;
                    organizersList.appendChild(el);
                });
            })
            .catch(err => {
                organizersList.innerHTML = `<p><strong>Errore:</strong> ${err.message}</p>`;
            });
    }

    // Writeup list (CTF detail page)
    const writeupsList = document.getElementById('writeups-list');
    if (writeupsList) {
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

                    const el = document.createElement('div');
                    el.className = 'skill-item load-writeup';
                    el.dataset.file = file;
                    el.dataset.dir = writeupDir;
                    el.innerHTML = `
                        <h3 class="skill-name">${file.replace('.md', '').replace(/_/g, ' ')}</h3>
                        <p class="category-label"><strong>Categoria:</strong> ${category}</p>
                        <p class="social-link">View Writeup</p>
                    `;
                    writeupsList.appendChild(el);
                });
            })
            .catch(err => {
                writeupsList.innerHTML = `<p><strong>Errore:</strong> ${err.message}</p>`;
            });

        // Carica contenuto writeup al click
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
