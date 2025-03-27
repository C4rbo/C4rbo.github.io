document.addEventListener("DOMContentLoaded", () => {
    // Load data
    fetch('data.xml')
        .then(response => response.text())
        .then(str => (new DOMParser()).parseFromString(str, "text/xml"))
        .then(xml => {
            const writeups = xml.querySelectorAll('writeup');
            const gridContainer = document.getElementById('writeupGrid');
            const modal = document.getElementById('writeupModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
            const closeModal = document.getElementById('closeModal');
            
            let allWriteups = [];
            
            // Parse writeups
            writeups.forEach(writeup => {
                const writeupData = {
                    title: writeup.querySelector('title').textContent,
                    description: writeup.querySelector('description').textContent,
                    category: writeup.querySelector('category').textContent,
                    difficulty: writeup.querySelector('difficulty').textContent,
                    flag: writeup.querySelector('flag').textContent,
                    content: writeup.querySelector('content') ? writeup.querySelector('content').innerHTML : '',
                    date: writeup.querySelector('date') ? writeup.querySelector('date').textContent : '',
                    author: writeup.querySelector('author') ? writeup.querySelector('author').textContent : 'Anonymous'
                };
                allWriteups.push(writeupData);
            });
            
            // Function to render writeups
            function renderWriteups(writeupsToRender) {
                gridContainer.innerHTML = '';
                
                if (writeupsToRender.length === 0) {
                    gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No writeups found</p>';
                    return;
                }
                
                writeupsToRender.forEach(writeup => {
                    const card = document.createElement('div');
                    card.className = 'writeup-card';
                    
                    let difficultyClass = '';
                    if (writeup.difficulty.toLowerCase().includes('veryEasy')) difficultyClass = 'very easy';
                    else if (writeup.difficulty.toLowerCase().includes('easy')) difficultyClass = 'easy';
                    else if (writeup.difficulty.toLowerCase().includes('medium')) difficultyClass = 'medium';
                    else if (writeup.difficulty.toLowerCase().includes('hard')) difficultyClass = 'hard';
                    
                    card.innerHTML = `
                        <div class="card-header">
                            <h3>${writeup.title}</h3>
                        </div>
                        <div class="card-body">
                            <div class="meta-info">
                                <span class="category">${writeup.category}</span>
                                <span class="difficulty ${difficultyClass}">${writeup.difficulty}</span>
                            </div>
                            <p class="description">${writeup.description}</p>
                            <div class="meta-info">
                                <small><i class="far fa-calendar-alt"></i> ${writeup.date || 'Unknown date'}</small>
                                <small><i class="far fa-user"></i> ${writeup.author}</small>
                            </div>
                        </div>
                    `;
                    
                    card.addEventListener('click', () => {
                        openModal(writeup);
                    });
                    
                    gridContainer.appendChild(card);
                });
            }
            
            function openModal(writeup) {
                modalTitle.textContent = writeup.title;
                
                let difficultyClass = '';
                if (writeup.difficulty.toLowerCase().includes('veryEasy')) difficultyClass = 'very easy';
                else if (writeup.difficulty.toLowerCase().includes('easy')) difficultyClass = 'easy';
                else if (writeup.difficulty.toLowerCase().includes('medium')) difficultyClass = 'medium';
                else if (writeup.difficulty.toLowerCase().includes('hard')) difficultyClass = 'hard';
                
                modalBody.innerHTML = `
                    <div class="writeup-meta">
                        <p><strong>Author:</strong> ${writeup.author}</p>
                        <p><strong>Difficulty:</strong> <span class="${difficultyClass}">${writeup.difficulty}</span></p>
                        <p><strong>Category:</strong> ${writeup.category}</p>
                    </div>
                    
                    <div class="writeup-content">
                        ${writeup.content || `<p>${writeup.description}</p><p>Writeup details not available.</p>`}
                    </div>
                    
                    <div class="flag-reveal">
                        <h3><i class="fas fa-flag"></i> Flag</h3>
                        <p>Click the button to reveal the flag:</p>
                        <button id="revealFlag">Show Flag</button>
                        <div class="flag-value" id="flagValue">${writeup.flag}</div>
                    </div>
                `;
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                document.getElementById('revealFlag').addEventListener('click', function() {
                    const flagValue = document.getElementById('flagValue');
                    if (flagValue.style.display === 'block') {
                        flagValue.style.display = 'none';
                        this.textContent = 'Show Flag';
                    } else {
                        flagValue.style.display = 'block';
                        this.textContent = 'Hide Flag';
                    }
                });
            }
            
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
            
            renderWriteups(allWriteups);
        })
        .catch(error => {
            console.error("Error loading writeups:", error);
            document.getElementById('writeupGrid').innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; color: #ff2d75;">
                    <i class="fas fa-exclamation-triangle"></i> Error loading writeups. 
                    Please refresh the page or check your connection.
                </p>
            `;
        });
});