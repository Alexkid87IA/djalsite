/* ============================================
   TOURNÉE : fonctions sans DOM
   Utilisées par main.js (objet global Tour)
   et testées avec : node --test tests/
============================================ */
(function (root) {
    const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    function toISODate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }

    function getUpcomingDates(dates, today) {
        const todayISO = toISODate(today);
        return dates
            .filter(item => item.date >= todayISO)
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    function groupFeatured(upcoming) {
        const groups = [];
        upcoming.filter(item => item.featured).forEach(item => {
            const last = groups[groups.length - 1];
            if (last && last.venue === item.venue && last.city === item.city) {
                last.dates.push(item.date);
            } else {
                groups.push({ venue: item.venue, city: item.city, url: item.url, dates: [item.date] });
            }
        });
        return groups;
    }

    function formatDays(isoDates) {
        const parts = isoDates.map(iso => ({
            day: String(Number(iso.slice(8, 10))),
            month: MONTHS[Number(iso.slice(5, 7)) - 1]
        }));
        const sameMonth = parts.every(part => part.month === parts[0].month);
        const labels = sameMonth ? parts.map(part => part.day) : parts.map(part => `${part.day} ${part.month}`);
        const joined = labels.length > 1
            ? `${labels.slice(0, -1).join(', ')} & ${labels[labels.length - 1]}`
            : labels[0];
        return sameMonth ? `${joined} ${parts[0].month}` : joined;
    }

    // Ligne « Et aussi » du héros : premières dates featured, hors salle de la prochaine date
    function featuredLine(upcoming) {
        const next = upcoming[0];
        const group = groupFeatured(upcoming).find(g => !(next && g.venue === next.venue && g.city === next.city));
        if (!group) return null;
        const article = group.dates.length > 1 ? 'les' : 'le';
        return { venue: group.venue, city: group.city, when: `${article} ${formatDays(group.dates)}` };
    }

    function renderTourRow(item) {
        const classes = ['tour-row'];
        if (item.featured) classes.push('is-featured');
        if (item.complet) classes.push('is-complet');

        const action = item.complet
            ? '<span class="tour-soldout">Complet</span>'
            : `<a href="${item.url}" target="_blank" rel="noopener" class="btn-tickets">Billets</a>`;

        return `
            <div class="${classes.join(' ')}">
                <div class="tour-date"><span class="tour-day">${item.day}</span><span class="tour-month">${item.month}</span></div>
                <div class="tour-place"><span class="tour-city">${item.city}</span><span class="tour-venue">${item.venue}</span></div>
                ${action}
            </div>`;
    }

    const api = { MONTHS, toISODate, getUpcomingDates, groupFeatured, formatDays, featuredLine, renderTourRow };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        root.Tour = api;
    }
})(this);
