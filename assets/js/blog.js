// blog.js - Dynamic Blog System with XML
document.addEventListener('DOMContentLoaded', function() {
    // Configurazione
    const config = {
        postsPerPage: 6,
        xmlPath: '../../assets/data/blog.xml',
        defaultThumbnail: '../assets/images/default-thumb.jpg'
    };
    
    // Stato dell'applicazione
    const state = {
        allPosts: [],
        filteredPosts: [],
        currentPage: 1,
        currentCategory: 'all',
        currentSearch: ''
    };
    
    // Elementi DOM
    const dom = {
        blogContainer: document.getElementById('blogPosts'),
        searchInput: document.getElementById('searchInput'),
        categoryFilter: document.getElementById('categoryFilter'),
        prevPageBtn: document.getElementById('prevPage'),
        nextPageBtn: document.getElementById('nextPage'),
        pageInfo: document.getElementById('pageInfo'),
        loadingIndicator: document.getElementById('loadingIndicator')
    };
    
    // Inizializzazione
    init();
    
    function init() {
        setupEventListeners();
        loadPosts();
    }
    
    function setupEventListeners() {
        dom.searchInput.addEventListener('input', handleSearch);
        dom.categoryFilter.addEventListener('change', handleCategoryFilter);
        dom.prevPageBtn.addEventListener('click', goToPreviousPage);
        dom.nextPageBtn.addEventListener('click', goToNextPage);
    }
    
    function loadPosts() {
        showLoading();
        
        fetch(config.xmlPath)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(parseXml)
            .then(posts => {
                state.allPosts = posts;
                applyFilters();
                render();
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                showError();
            })
            .finally(hideLoading);
    }
    
    function parseXml(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const posts = xmlDoc.querySelectorAll('post');
        
        return Array.from(posts).map(post => ({
            id: post.getAttribute('id'),
            category: post.getAttribute('category'),
            date: post.getAttribute('date'),
            title: post.querySelector('title').textContent,
            description: post.querySelector('description').textContent,
            contentFile: post.querySelector('content_file').textContent,
            author: post.querySelector('author')?.textContent || 'Carbo',
            tags: Array.from(post.querySelectorAll('tags tag')).map(tag => tag.textContent),
            thumbnail: post.querySelector('thumbnail')?.textContent || config.defaultThumbnail
        }));
    }
    
    function applyFilters() {
        state.filteredPosts = state.allPosts.filter(post => {
            // Filtro per categoria
            const categoryMatch = state.currentCategory === 'all' || 
                                post.category === state.currentCategory;
            
            // Filtro per ricerca
            const searchMatch = state.currentSearch === '' ||
                post.title.toLowerCase().includes(state.currentSearch) ||
                post.description.toLowerCase().includes(state.currentSearch) ||
                post.tags.some(tag => tag.toLowerCase().includes(state.currentSearch));
            
            return categoryMatch && searchMatch;
        });
        
        // Ordina per data (dal più recente)
        state.filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Reset alla prima pagina
        state.currentPage = 1;
    }
    
    function render() {
        renderPosts();
        updatePagination();
    }
    
    function renderPosts() {
        if (state.filteredPosts.length === 0) {
            dom.blogContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        const startIndex = (state.currentPage - 1) * config.postsPerPage;
        const endIndex = startIndex + config.postsPerPage;
        const postsToShow = state.filteredPosts.slice(startIndex, endIndex);
        
        dom.blogContainer.innerHTML = postsToShow.map(post => `
            <article class="post-card" data-id="${post.id}">
                <div class="post-thumbnail">
                    <img src="${post.thumbnail}" alt="${post.title}" onerror="this.src='${config.defaultThumbnail}'">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-category ${post.category}">
                            ${formatCategory(post.category)}
                        </span>
                        <span class="post-date">
                            ${formatDate(post.date)}
                        </span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-description">${post.description}</p>
                    <div class="post-footer">
                        <div class="post-tags">
                            ${post.tags.map(tag => `
                                <span class="tag">${tag}</span>
                            `).join('')}
                        </div>
                        <a href="${post.contentFile}" class="read-more">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
    }
    
    function updatePagination() {
        const totalPages = Math.ceil(state.filteredPosts.length / config.postsPerPage);
        
        // Aggiorna stato pulsanti
        dom.prevPageBtn.disabled = state.currentPage === 1;
        dom.nextPageBtn.disabled = state.currentPage === totalPages || totalPages === 0;
        
        // Aggiorna info pagina
        dom.pageInfo.textContent = totalPages > 0 
            ? `Page ${state.currentPage} of ${totalPages}` 
            : 'No posts';
    }
    
    function handleSearch(e) {
        state.currentSearch = e.target.value.toLowerCase();
        applyFilters();
        render();
    }
    
    function handleCategoryFilter(e) {
        state.currentCategory = e.target.value;
        applyFilters();
        render();
    }
    
    function goToPreviousPage() {
        if (state.currentPage > 1) {
            state.currentPage--;
            render();
            scrollToTop();
        }
    }
    
    function goToNextPage() {
        const totalPages = Math.ceil(state.filteredPosts.length / config.postsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            render();
            scrollToTop();
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    function formatCategory(category) {
        const categories = {
            'security': '<i class="fas fa-shield-alt"></i> Security',
            'programming': '<i class="fas fa-code"></i> Programming',
            'cheatsheet': '<i class="fas fa-cheatsheet"></i> Cheatsheet',
            'tutorial': '<i class="fas fa-graduation-cap"></i> Tutorial'
        };
        return categories[category] || category;
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    function showLoading() {
        dom.loadingIndicator.style.display = 'block';
        dom.blogContainer.style.opacity = '0.5';
    }
    
    function hideLoading() {
        dom.loadingIndicator.style.display = 'none';
        dom.blogContainer.style.opacity = '1';
    }
    
    function showError() {
        dom.blogContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Posts</h3>
                <p>Please try refreshing the page or check back later.</p>
                <button onclick="window.location.reload()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        `;
    }
});