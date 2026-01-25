/* ============================================
   DJAL - EN PLEINE CONSCIENCE
   Main JavaScript
============================================ */

// Navigation scroll effect
const navWrapper = document.getElementById('nav-wrapper');

const handleNavScroll = () => {
    if (window.scrollY > 50) {
        navWrapper.classList.add('scrolled');
    } else {
        navWrapper.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleNavScroll);

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMobile.classList.toggle('open');
    document.body.classList.toggle('menu-open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-mobile-link, .nav-mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMobile.classList.remove('open');
        document.body.classList.remove('menu-open');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter form handling
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        // TODO: Integrate with newsletter service
        alert('Merci pour votre inscription !');
        newsletterForm.reset();
    });
}
