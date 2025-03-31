document.addEventListener('DOMContentLoaded', function() {
    loadCTFs();
    
    const modal = document.getElementById('challengesModal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function loadCTFs() {
    fetch('../../writeups.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const ctfs = data.querySelectorAll('ctf');
            const ctfGrid = document.getElementById('ctfGrid');
            
            ctfs.forEach(ctf => {
                const name = ctf.querySelector('name').textContent;
                const date = ctf.querySelector('date').textContent;
                const description = ctf.querySelector('description').textContent;
                const writeupsCount = ctf.querySelector('writeups').getAttribute('count');
                const challengesCount = ctf.querySelector('challenges').getAttribute('count');
                const id = ctf.getAttribute('id');
                
                const ctfCard = document.createElement('div');
                ctfCard.className = 'ctf-card';
                ctfCard.setAttribute('data-ctf-id', id);
                
                ctfCard.innerHTML = `
                    <div class="ctf-card-header">
                        <h3>${name}</h3>
                        <p>${date}</p>
                    </div>
                    <div class="ctf-card-body">
                        <p>${description}</p>
                        <div class="ctf-stats">
                            <div class="stat">
                                <div class="stat-value">${writeupsCount}</div>
                                <div class="stat-label">Writeups</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">${challengesCount}</div>
                                <div class="stat-label">Challenges</div>
                            </div>
                        </div>
                    </div>
                `;
                
                ctfCard.addEventListener('click', function() {
                    openChallengesModal(ctf);
                });
                
                ctfGrid.appendChild(ctfCard);
            });
        })
        .catch(error => {
            console.error('Error loading CTFs:', error);
            document.getElementById('ctfGrid').innerHTML = `
                <div class="error-message">
                    <p>Failed to load CTF data. Please try again later.</p>
                </div>
            `;
        });
}

function openChallengesModal(ctfData) {
    const modal = document.getElementById('challengesModal');
    const modalTitle = document.getElementById('modalTitle');
    const challengesList = document.getElementById('challengesList');
    
    const name = ctfData.querySelector('name').textContent;
    const challenges = ctfData.querySelectorAll('challenge');
    
    modalTitle.textContent = `${name} Challenges`;
    challengesList.innerHTML = '';
    
    challenges.forEach(challenge => {
        const title = challenge.querySelector('title').textContent;
        const category = challenge.getAttribute('category');
        const points = challenge.getAttribute('points');
        const difficulty = challenge.getAttribute('difficulty');
        const filename = challenge.querySelector('filename').textContent;
        
        const challengeItem = document.createElement('div');
        challengeItem.className = 'challenge-item';
        challengeItem.innerHTML = `
            <h3>${title}</h3>
            <p>${category} challenge worth ${points} points</p>
            <div class="challenge-meta">
                <span><i class="fas fa-star"></i> ${difficulty}</span>
                <span><i class="fas fa-flag"></i> ${points} pts</span>
            </div>
        `;
        
        challengeItem.addEventListener('click', function() {

            console.log(`Opening writeup: ${filename}`);
            window.location.href = `writeups/${filename}`;
        });
        
        challengesList.appendChild(challengeItem);
    });
    
    modal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const overlay = document.getElementById('overlay');
    const nav = document.getElementById('mainNav');
    
    function toggleMenu() {
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on nav links
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


});
