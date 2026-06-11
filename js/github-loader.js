//js/github-loader.js
// GitHub Loader - Fetches and displays GitHub data
async function loadGitHub() {
    try {
        const userRes = await fetch('https://api.github.com/users/guenzandra');
        const userData = await userRes.json();

        const ghReposEl = document.getElementById('gh-repos');
        const ghFollowersEl = document.getElementById('gh-followers');
        
        if (ghReposEl && userData.public_repos !== undefined) {
            ghReposEl.textContent = userData.public_repos;
        }
        if (ghFollowersEl && userData.followers !== undefined) {
            ghFollowersEl.textContent = userData.followers;
        }

        const reposRes = await fetch('https://api.github.com/users/guenzandra/repos?sort=updated&per_page=6');
        const repos = await reposRes.json();

        if (Array.isArray(repos) && repos.length) {
            const langColors = {
                JavaScript: '#F7DF1E',
                PHP: '#4F5D95',
                Python: '#3776AB',
                TypeScript: '#3178C6',
                HTML: '#E34F26',
                CSS: '#1572B6',
                default: '#666'
            };

            let totalStars = 0;
            repos.forEach(r => { totalStars += r.stargazers_count || 0; });
            const ghStarsEl = document.getElementById('gh-stars');
            if (ghStarsEl) ghStarsEl.textContent = totalStars;

            const reposGrid = document.getElementById('repos-grid');
            if (reposGrid) {
                reposGrid.innerHTML = repos.map(r => `
                    <a href="${r.html_url}" target="_blank" rel="noopener" class="repo-card">
                        <div class="repo-name">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                            </svg>
                            ${r.name}
                        </div>
                        <div class="repo-desc">${r.description || 'No description provided.'}</div>
                        <div class="repo-meta">
                            ${r.language ? `
                                <div class="repo-lang">
                                    <span class="lang-dot" style="background:${langColors[r.language] || langColors.default}"></span>
                                    ${r.language}
                                </div>` : ''}
                            <div class="repo-stars">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                                ${r.stargazers_count}
                            </div>
                        </div>
                    </a>
                `).join('');
            }
        }
    } catch (err) {
        console.log('GitHub API error:', err);
    }
}