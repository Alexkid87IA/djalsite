/* ============================================
   DJAL - EN PLEINE CONSCIENCE
   Main JavaScript
============================================ */

// ============================================
// TOUR DATES DATA & FILTERING
// ============================================
const tourDates = [
    { date: '2026-01-23', day: '23', month: 'Jan', venue: 'Carré des Docks', city: 'Le Havre', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/587519' },
    { date: '2026-01-24', day: '24', month: 'Jan', venue: 'Le K', city: 'Reims', complet: true },
    { date: '2026-02-06', day: '06', month: 'Fév', venue: 'Cepac Silo', city: 'Marseille', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/603494' },
    { date: '2026-02-07', day: '07', month: 'Fév', venue: 'Zénith', city: 'Toulon', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/612614' },
    { date: '2026-02-13', day: '13', month: 'Fév', venue: 'Novotel Atria', city: 'Nîmes', complet: true },
    { date: '2026-02-14', day: '14', month: 'Fév', venue: 'Patio de Camargue', city: 'Arles', url: 'https://billetterie.webgazelle.net/sortir-d-jal-arles-arles-spectacle-humour,evenement-12893' },
    { date: '2026-02-20', day: '20', month: 'Fév', venue: 'Salle G. Brassens', city: 'Feytiat', complet: true },
    { date: '2026-02-24', day: '24', month: 'Fév', venue: "L'Odyssée", city: 'Périgueux', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/627638' },
    { date: '2026-02-28', day: '28', month: 'Fév', venue: 'Rockhal', city: 'Esch-sur-Alzette', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/623629' },
    { date: '2026-03-07', day: '07', month: 'Mar', venue: 'Les Ateliers Magiques', city: 'Barbières', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/637232' },
    { date: '2026-03-14', day: '14', month: 'Mar', venue: 'Agen Agora', city: 'Agen', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/609621' },
    { date: '2026-03-20', day: '20', month: 'Mar', venue: 'Pavillon les Bains', city: 'Mers-les-Bains', url: 'https://ginger.trium.fr/fr/t/-/event/65254' },
    { date: '2026-03-26', day: '26', month: 'Mar', venue: 'Théâtre J. Prévert', city: 'Aulnay-sous-Bois', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/624684' },
    { date: '2026-03-28', day: '28', month: 'Mar', venue: 'Centre des Congrès', city: 'Jonzac', complet: true },
    { date: '2026-04-02', day: '02', month: 'Avr', venue: 'Amphithéâtre', city: 'Rodez', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/635697' },
    { date: '2026-04-03', day: '03', month: 'Avr', venue: 'Narbonne Arena', city: 'Narbonne', url: 'https://billetterie.narbonne-arena.fr/fr/product/476/snc_narbonne_arena/d_jal' },
    { date: '2026-04-04', day: '04', month: 'Avr', venue: 'Salle des Marinières', city: 'Porcieu-Amblagnieu', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/616931' },
    { date: '2026-04-08', day: '08', month: 'Avr', venue: 'Théâtre de Yerres', city: 'Yerres', url: 'https://www.francebillet.com/event/djal-en-pleine-conscience-tournee-theatre-de-yerres-cec-yerres-20286836/' },
    { date: '2026-04-10', day: '10', month: 'Avr', venue: 'Zénith', city: 'Caen', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/587525' },
    { date: '2026-04-11', day: '11', month: 'Avr', venue: "L'Escale", city: 'Melun', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/625249' },
    { date: '2026-04-17', day: '17', month: 'Avr', venue: 'Salle Guy Obino', city: 'Vitrolles', url: 'https://www.billetweb.fr/djal-vitrolles' },
    { date: '2026-04-18', day: '18', month: 'Avr', venue: 'Palais des Congrès', city: 'Digne-les-Bains', url: 'https://www.billetweb.fr/djal-digne-les-bains' },
    { date: '2026-04-21', day: '21', month: 'Avr', venue: 'Théâtre des Allobroges', city: 'Cluses', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/645586' },
    { date: '2026-04-24', day: '24', month: 'Avr', venue: 'Auxerrexpo', city: 'Auxerre', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/636406' },
    { date: '2026-04-25', day: '25', month: 'Avr', venue: 'Le Manège', city: 'Vienne', url: 'https://www.billetweb.fr/djal-vienne2' },
    { date: '2026-06-06', day: '06', month: 'Juin', venue: 'Cité des Congrès', city: 'Nantes', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/614833' },
    { date: '2026-06-13', day: '13', month: 'Juin', venue: 'Casino Méditerranée', city: 'Nice', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/621818' },
    { date: '2026-06-19', day: '19', month: 'Juin', venue: 'PBA Grande Salle', city: 'Charleroi', url: 'https://www.pba.be/spectacle/djal-en-pleine-conscience/' },
    { date: '2026-10-03', day: '03', month: 'Oct', venue: 'Espace J-J. Robert', city: 'Mennecy', url: 'https://www.francebillet.com/event/djal-en-pleine-conscience-tournee-espace-culturel-jean-jacques-robert-mennecy-20235520/' },
    { date: '2026-10-30', day: '30', month: 'Oct', venue: 'Le Grand Rex', city: 'Paris', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/621841', featured: true },
    { date: '2026-10-31', day: '31', month: 'Oct', venue: 'Le Grand Rex', city: 'Paris', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/621841', featured: true },
    { date: '2026-11-06', day: '06', month: 'Nov', venue: 'Palais des Congrès', city: 'Perpignan', url: 'https://www.fnactickets.com/ticket-evenement/one-man-woman-show-d-jal-manpedja-lt.htm' },
    { date: '2026-11-07', day: '07', month: 'Nov', venue: 'Le Scarabée', city: 'Riorges', url: 'https://www.ticketmaster.fr/en/manifestation/d-jal-ticket/idmanif/636482' },
    { date: '2026-11-13', day: '13', month: 'Nov', venue: 'Le Cadran', city: 'Évreux', url: 'https://www.francebillet.com/event/djal-en-pleine-conscience-tournee-le-cadran-le-tangram-20256106/' },
    { date: '2026-11-14', day: '14', month: 'Nov', venue: 'Zénith', city: 'Orléans', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/617521' },
    { date: '2026-11-19', day: '19', month: 'Nov', venue: 'Arcadium', city: 'Annecy', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/613040' },
    { date: '2026-11-20', day: '20', month: 'Nov', venue: 'Parc des Expositions', city: 'Bourg-en-Bresse', url: 'https://www.fnacspectacles.com/event/djal-en-pleine-conscience-tournee-ainterexpo-bourg-en-bresse-20662683/' },
    { date: '2026-11-21', day: '21', month: 'Nov', venue: 'Le Summum', city: 'Grenoble', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/616067' },
    { date: '2026-12-10', day: '10', month: 'Déc', venue: 'Gare du Midi', city: 'Biarritz', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/626687' },
    { date: '2026-12-12', day: '12', month: 'Déc', venue: 'Les Arènes', city: 'Évry-Courcouronnes', url: 'https://stardust-spectacles.trium.fr/fr/t/-/event/63784' },
    { date: '2026-12-18', day: '18', month: 'Déc', venue: 'Bourse du Travail', city: 'Lyon', url: 'https://www.ticketmaster.fr/fr/manifestation/d-jal-billet/idmanif/625740' }
];

const MAX_DATES_SHOWN = 6;

function getUpcomingDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tourDates
        .filter(item => new Date(item.date) >= today)
        .slice(0, MAX_DATES_SHOWN);
}

function renderTourDates() {
    const container = document.getElementById('tournee-list');
    if (!container) return;

    const upcomingDates = getUpcomingDates();

    if (upcomingDates.length === 0) {
        container.innerHTML = '<p class="tournee-empty">Aucune date à venir pour le moment.</p>';
        return;
    }

    container.innerHTML = upcomingDates.map(item => {
        const classes = ['tournee-item'];
        if (item.featured) classes.push('featured');
        if (item.complet) classes.push('complet');

        const btn = item.complet
            ? '<span class="tournee-btn disabled">Complet</span>'
            : `<a href="${item.url}" target="_blank" rel="noopener" class="tournee-btn">Réserver</a>`;

        return `
            <div class="${classes.join(' ')}">
                <div class="tournee-date">
                    <span class="day">${item.day}</span>
                    <span class="month">${item.month}</span>
                </div>
                <div class="tournee-info">
                    <span class="venue">${item.venue}</span>
                    <span class="city">${item.city}</span>
                </div>
                ${btn}
            </div>
        `;
    }).join('');
}

// Initialize tour dates on page load
document.addEventListener('DOMContentLoaded', renderTourDates);

// ============================================
// NAVIGATION
// ============================================
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

// ============================================
// INSTAGRAM REELS CAROUSEL
// ============================================
function initReelsCarousel() {
    const carousel = document.getElementById('reels-carousel');
    const prevBtn = document.querySelector('.reels-nav-prev');
    const nextBtn = document.querySelector('.reels-nav-next');
    const dotsContainer = document.getElementById('reels-dots');

    if (!carousel) return;

    const items = carousel.querySelectorAll('.reel-item');
    const itemCount = items.length;
    let currentIndex = 1; // Start at second card to show peek on left

    // Create dots
    if (dotsContainer) {
        for (let i = 0; i < itemCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('reels-dot');
            if (i === 1) dot.classList.add('active');
            dot.addEventListener('click', () => scrollToIndex(i));
            dotsContainer.appendChild(dot);
        }
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.reels-dot') : [];

    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function scrollToIndex(index, smooth = true) {
        currentIndex = Math.max(0, Math.min(index, itemCount - 1));
        const item = items[currentIndex];
        if (!item) return;

        // Get the computed gap
        const style = getComputedStyle(carousel);
        const gap = parseFloat(style.gap) || 20;

        // Calculate scroll position to center the current card with peek on sides
        const itemWidth = item.offsetWidth;
        const scrollLeft = item.offsetLeft - (carousel.offsetWidth - itemWidth) / 2;

        carousel.scrollTo({ left: Math.max(0, scrollLeft), behavior: smooth ? 'smooth' : 'auto' });
        updateDots();
    }

    // Calculate current index from scroll position
    function updateCurrentIndex() {
        const scrollLeft = carousel.scrollLeft;
        const itemWidth = items[0].offsetWidth;
        const style = getComputedStyle(carousel);
        const gap = parseFloat(style.gap) || 20;

        currentIndex = Math.round(scrollLeft / (itemWidth + gap));
        currentIndex = Math.max(0, Math.min(currentIndex, itemCount - 1));
        updateDots();
    }

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToIndex(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToIndex(currentIndex + 1);
        });
    }

    // Update dots on scroll
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateCurrentIndex, 100);
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') scrollToIndex(currentIndex - 1);
        if (e.key === 'ArrowRight') scrollToIndex(currentIndex + 1);
    });

    // Initial scroll to show peek on left (after layout is ready)
    setTimeout(() => {
        // Scroll so first card is partially visible on left
        const firstItem = items[0];
        if (firstItem) {
            const peekAmount = firstItem.offsetWidth * 0.7; // Show 30% of first card
            carousel.scrollTo({ left: peekAmount, behavior: 'auto' });
        }
    }, 150);
}

document.addEventListener('DOMContentLoaded', initReelsCarousel);

// ============================================
// NEWSLETTER
// ============================================
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert('Merci pour votre inscription !');
        newsletterForm.reset();
    });
}
