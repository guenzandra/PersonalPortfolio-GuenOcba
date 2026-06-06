// UI Handlers - Manages navbar scroll, counters, tabs, filters, and responsive elements
(function() {
    // Navbar scroll state
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // Counter animation
    function animateCount(el, target, suffix = '', duration = 1400) {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            if (el) el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else if (el) el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
    }

    // Stats counter observer
    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const statExp = document.getElementById('stat-exp');
                const statProjects = document.getElementById('stat-projects');
                const statCerts = document.getElementById('stat-certs');
                if (statExp) animateCount(statExp, 2, '+');
                if (statProjects) animateCount(statProjects, 20, '+');
                if (statCerts) animateCount(statCerts, 10, '+');
            }
        }, { threshold: 0.5 }).observe(statsEl);
    }

    // Skills tabs
    const skillsTabs = document.getElementById('skills-tabs');
    if (skillsTabs) {
        skillsTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.skill-tab');
            if (!tab) return;

            document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const panel = document.getElementById('panel-' + tab.dataset.tab);
            if (panel) panel.classList.add('active');
        });
    }

    // Project filter
    const filterBar = document.getElementById('filter-bar');
    if (filterBar) {
        filterBar.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.dataset.category;
            document.querySelectorAll('#projects-grid .project-card').forEach(card => {
                const show = cat === 'all' || card.dataset.category === cat;
                card.style.display = show ? '' : 'none';
                if (show) card.style.animation = 'fadeUp 0.4s ease both';
            });
        });
    }

    // Responsive exp grid
    function updateExpGrid() {
        const g = document.querySelector('.exp-grid');
        if (g) g.style.gridTemplateColumns = window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)';
    }
    window.addEventListener('resize', updateExpGrid);
    updateExpGrid();

    // Email click feedback
    document.querySelector('a[href^="mailto"]')?.addEventListener('click', () => {
        if (window.showToast) window.showToast('Email', 'Opening your email client...');
    });
})();