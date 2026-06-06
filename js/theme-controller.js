// Theme Controller - Handles light/dark mode switching
(function() {
    let isDark = true;
    const themeToggle = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    
    function showToast(title, msg) {
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
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            if (iconSun && iconMoon) {
                iconSun.style.display = isDark ? 'block' : 'none';
                iconMoon.style.display = isDark ? 'none' : 'block';
            }
            showToast('Theme changed', isDark ? 'Switched to dark mode' : 'Switched to light mode');
        });
    }
})();