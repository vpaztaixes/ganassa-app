// TODO: Implement
// =============================================
// GANASSA - Main JS (shared across all pages)
// =============================================

// --- Preloader ---
window.addEventListener('load', () => {
    const progressBar = document.querySelector('.preloader-progress-bar');
    const preloaderText = document.querySelector('.preloader-text');
    
    if (!progressBar || !preloaderText) return;

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            preloaderText.textContent = 'Kick Off';
            preloaderText.style.color = "var(--shamrock-green)";
            
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.classList.add('loaded');

                // Custom event for page-specific init after preloader
                document.dispatchEvent(new Event('ganassa:loaded'));
            }, 500);
        }
        progressBar.style.width = `${progress}%`;
    }, 100);
});

// --- Header Scroll ---
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// --- Mobile Menu ---
(function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    if (!hamburger || !navMenu) return;

    function closeMenu() {
        navMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.querySelector('i').classList.add('fa-bars');
        body.style.overflow = '';
    }

    function openMenu() {
        navMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        hamburger.querySelector('i').classList.remove('fa-bars');
        hamburger.querySelector('i').classList.add('fa-times');
        body.style.overflow = 'hidden';
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
})();