document.addEventListener('DOMContentLoaded', function() {
    // Estrai ID writeup dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const writeupId = urlParams.get('id');
    const ctfFolder = urlParams.get('ctf') || 'ctf1'; // Default a ctf1 se non specificato
    
    if (!writeupId) {
        showError('Nessun ID writeup specificato');
        return;
    }
    
    // Carica writeup da XML
    loadWriteup(ctfFolder, writeupId);
});

function loadWriteup(ctfFolder, writeupId) {
    fetch(`/writeups/${ctfFolder}/data.xml`)
        .then(response => {
            if (!response.ok) throw new Error('Errore nel caricamento del file XML');
            return response.text();
        })
        .then(str => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(str, "text/xml");
            
            // Controlla errori di parsing XML
            const parserError = xmlDoc.getElementsByTagName("parsererror");
            if (parserError.length > 0) {
                throw new Error('Errore nel parsing del XML: ' + parserError[0].textContent);
            }
            
            return xmlDoc;
        })
        .then(xmlDoc => {
            const writeup = xmlDoc.querySelector(`writeup[id="${writeupId}"]`);
            
            if (!writeup) {
                showError('Writeup non trovato');
                return;
            }
            
            displayWriteup(writeup);
        })
        .catch(error => {
            console.error('Errore nel caricamento del writeup:', error);
            showError('Errore nel caricamento dei dati del writeup: ' + error.message);
        });
}

function displayWriteup(writeup) {
    // Imposta titolo
    document.getElementById('writeup-title').textContent = 
        writeup.querySelector('title').textContent;
    
    // Imposta metainformazioni
    const metaContainer = document.getElementById('writeup-meta');
    const ctf = writeup.querySelector('ctf').textContent;
    const category = writeup.getAttribute('category');
    const points = writeup.getAttribute('points');
    const difficulty = writeup.getAttribute('difficulty');
    
    metaContainer.innerHTML = `
        <span>${ctf}</span>
        <span><span class="category-badge category-${category.toLowerCase()}">${category}</span> - ${points} points</span>
        <span><span class="difficulty-badge difficulty-${difficulty.toLowerCase()}">${difficulty}</span></span>
    `;
    
    // Imposta contenuto
    const contentContainer = document.getElementById('writeup-content');
    const sections = writeup.querySelectorAll('section');
    
    let contentHTML = '';
    sections.forEach(section => {
        const title = section.querySelector('title').textContent;
        const body = section.querySelector('body').textContent;
        
        contentHTML += `
            <section class="writeup-section">
                <h2>${title}</h2>
                ${formatBodyContent(body)}
            </section>
        `;
    });
    
    contentContainer.innerHTML = contentHTML;
    
    // Imposta autore
    const author = writeup.querySelector('author').textContent;
    const date = writeup.querySelector('date').textContent;
    document.getElementById('writeup-author').textContent = `Scritto da ${author} - ${date}`;
}

function formatBodyContent(body) {
    // Converti i blocchi di codice marcati con ``` in HTML corretto
    return body.replace(/```([\s\S]*?)```/g, function(match, code) {
        // Sostituisci caratteri speciali HTML
        const escapedCode = code.trim()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return `<pre><code>${escapedCode}</code></pre>`;
    });
}

function showError(message) {
    document.getElementById('writeup-title').textContent = 'Errore';
    document.getElementById('writeup-content').innerHTML = 
        `<div class="error-message">
            <p>${message}</p>
            <p>Controlla l'URL o riprova più tardi.</p>
        </div>`;
}