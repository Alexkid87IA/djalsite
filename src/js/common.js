/* ============================================
   DJAL - EN PLEINE CONSCIENCE
   JavaScript commun à toutes les pages
============================================ */

// ============================================
// APPARITIONS AU SCROLL
// Branchées en premier : si la suite du script plante, le contenu apparaît quand même.
// Sans IntersectionObserver, pas de classe js, donc rien n'est masqué.
// ============================================
if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ============================================
// NAVIGATION
// ============================================
const navWrapper = document.getElementById('nav-wrapper');
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

window.addEventListener('scroll', () => {
    navWrapper.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

function setMenu(open) {
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navMobile.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
}

navToggle.addEventListener('click', () => setMenu(!navMobile.classList.contains('open')));

navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
});
