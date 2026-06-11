//js/main.js
// Main - Initializes all components and handles page loader
(function() {
    // Initialize AOS
    AOS.init({ duration: 680, easing: 'ease-out-cubic', once: true, offset: 55 });

    // Page loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            if (loader) loader.classList.add('hidden');
        }, 1200);
    });

    // Load GitHub data
    loadGitHub();

    // Toast function for global use
    window.showToast = function(title, msg) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
            <div>
                <div class="toast-title">${title}</div>
                <div class="toast-msg">${msg}</div>
            </div>
            <div class="toast-bar"></div>
        `;
        container.appendChild(toast);
        requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 450);
        }, 3500);
    };

    // Welcome toast
    setTimeout(() => {
        if (window.showToast) window.showToast('Welcome', 'Thanks for visiting my portfolio.');
    }, 1900);
})();