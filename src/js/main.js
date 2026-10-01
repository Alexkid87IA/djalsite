/* ============================================
   DJAL - EN PLEINE CONSCIENCE
   JavaScript de l'accueil (nécessite common.js et tour.js avant)
============================================ */

// ============================================
// DONNÉES DE TOURNÉE
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

// ============================================
// TOURNÉE
// ============================================
function renderTour(upcoming) {
    const list = document.getElementById('tournee-list');
    const moreBtn = document.getElementById('tournee-more');
    if (!list) return;

    if (upcoming.length === 0) {
        list.innerHTML = '<p class="tour-empty">Aucune date à venir pour le moment.</p>';
        moreBtn.hidden = true;
        return;
    }

    list.innerHTML = upcoming.map(Tour.renderTourRow).join('');
    const rows = list.querySelectorAll('.tour-row');
    rows.forEach((row, i) => { row.hidden = i >= MAX_DATES_SHOWN; });

    moreBtn.hidden = upcoming.length <= MAX_DATES_SHOWN;
    moreBtn.textContent = `Voir toutes les dates (${upcoming.length})`;
    moreBtn.onclick = () => {
        rows.forEach(row => { row.hidden = false; });
        moreBtn.hidden = true;
    };
}

// ============================================
// HÉROS : compteur, prochaine date, « Et aussi », barre mobile
// ============================================
function renderHeroDates(upcoming) {
    const count = document.getElementById('hero-count');
    const card = document.getElementById('next-date');
    const featuredLine = document.getElementById('featured-date');
    const bar = document.getElementById('mobile-bar');

    const n = upcoming.length;
    count.textContent = n > 0 ? `Tournée 2026 · ${n} date${n > 1 ? 's' : ''}` : 'Tournée 2026';

    if (n === 0) {
        card.hidden = true;
        featuredLine.hidden = true;
        bar.hidden = true;
        return;
    }

    const next = upcoming[0];
    document.getElementById('next-date-day').textContent = next.day;
    document.getElementById('next-date-month').textContent = next.month;
    document.getElementById('next-date-city').textContent = next.city;
    document.getElementById('next-date-venue').textContent = next.venue;
    card.href = next.complet ? '#tournee' : next.url;
    card.target = next.complet ? '' : '_blank';
    card.hidden = false;

    document.getElementById('mobile-bar-date').textContent = `Prochaine date : ${next.day} ${next.month.toLowerCase()}`;
    document.getElementById('mobile-bar-city').textContent = next.city;
    const barLink = document.getElementById('mobile-bar-link');
    barLink.href = next.complet ? '#tournee' : next.url;
    barLink.target = next.complet ? '' : '_blank';
    bar.hidden = false;

    const featured = Tour.featuredLine(upcoming);
    if (featured) {
        featuredLine.innerHTML = `Et aussi <strong>${featured.venue}, ${featured.city}</strong>, ${featured.when}`;
        featuredLine.hidden = false;
    } else {
        featuredLine.hidden = true;
    }
}

const upcomingDates = Tour.getUpcomingDates(tourDates, new Date());
renderTour(upcomingDates);
renderHeroDates(upcomingDates);

// ============================================
// VIDÉO AVEC MINIATURE : le lecteur YouTube se charge au clic
// ============================================
document.querySelectorAll('.video-facade').forEach(button => {
    button.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${button.dataset.youtube}?autoplay=1`;
        iframe.title = button.getAttribute('aria-label');
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        button.replaceWith(iframe);
    });
});

// ============================================
// REELS : flèches
// ============================================
const reelsTrack = document.getElementById('reels-track');

function scrollReels(direction) {
    const reel = reelsTrack.querySelector('.reel');
    const gap = parseFloat(getComputedStyle(reelsTrack).columnGap) || 0;
    reelsTrack.scrollBy({ left: direction * (reel.offsetWidth + gap), behavior: 'smooth' });
}

document.querySelector('.reels-prev').addEventListener('click', () => scrollReels(-1));
document.querySelector('.reels-next').addEventListener('click', () => scrollReels(1));

// ============================================
// BARRE MOBILE : visible une fois le héros dépassé
// ============================================
const mobileBar = document.getElementById('mobile-bar');

new IntersectionObserver(([entry]) => {
    mobileBar.classList.toggle('is-visible', !entry.isIntersecting);
}).observe(document.getElementById('hero'));

// ============================================
// NEWSLETTER (pas encore branchée sur un service)
// ============================================
const newsletterForm = document.getElementById('newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci pour votre inscription !');
    newsletterForm.reset();
});
