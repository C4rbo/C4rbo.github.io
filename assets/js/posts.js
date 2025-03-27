document.addEventListener("DOMContentLoaded", () => {
    fetch('../assets/data/posts.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load XML file");
            }
            return response.text();
        })
        .then(str => (new DOMParser()).parseFromString(str, "text/xml"))
        .then(xml => {
            const posts = xml.querySelectorAll('post');
            const container = document.getElementById('postsContainer');

            if (posts.length === 0) {
                container.innerHTML = "<p>No posts available.</p>";
                return;
            }

            posts.forEach(post => {
                const title = post.querySelector('title')?.textContent || "Untitled";
                const date = post.querySelector('date')?.textContent || "Date not available";
                const description = post.querySelector('description')?.textContent || "No description";
                const link = post.querySelector('link')?.textContent || "#";

                const postCard = document.createElement('div');
                postCard.className = 'post-card';
                postCard.innerHTML = `
                    <h2 class="post-title">${title}</h2>
                    <div class="post-date">${date}</div>
                    <p class="post-description">${description}</p>
                    <a href="${link}" class="read-more">Read more</a>
                `;
                container.appendChild(postCard);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById('postsContainer').innerHTML = `
                <div class="error-message">
                    <p>Error loading posts. Please try again later.</p>
                </div>
            `;
        });
});