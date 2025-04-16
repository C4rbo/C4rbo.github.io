const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');
        const overlay = document.getElementById('overlay');
        
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.add('active');
            overlay.classList.add('active');
        });
        
        overlay.addEventListener('click', () => {
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        const canvas = document.getElementById('binaryRain');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const binary = '01';
        const columns = Math.floor(canvas.width / 20);
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * canvas.height);
        }
        
        function drawBinaryRain() {
            ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#6e48aa';
            ctx.font = '16px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = binary.charAt(Math.floor(Math.random() * binary.length));
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
        }
        
        setInterval(drawBinaryRain, 50);
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });