const test = require('node:test');
const assert = require('node:assert/strict');
const { toISODate, getUpcomingDates, groupFeatured, formatDays, renderTourRow } = require('../src/js/tour.js');

const sample = [
    { date: '2026-09-30', day: '30', month: 'Sep', venue: 'Salle A', city: 'Avant', url: 'https://a.test' },
    { date: '2026-10-31', day: '31', month: 'Oct', venue: 'Le Grand Rex', city: 'Paris', url: 'https://rex.test', featured: true },
    { date: '2026-10-03', day: '03', month: 'Oct', venue: 'Espace J-J. Robert', city: 'Mennecy', url: 'https://mennecy.test' },
    { date: '2026-10-30', day: '30', month: 'Oct', venue: 'Le Grand Rex', city: 'Paris', url: 'https://rex.test', featured: true }
];

test('toISODate utilise la date locale', () => {
    assert.equal(toISODate(new Date(2026, 9, 1, 23, 30)), '2026-10-01');
});

test('getUpcomingDates exclut le passé et trie par date', () => {
    const result = getUpcomingDates(sample, new Date(2026, 9, 1));
    assert.deepEqual(result.map(d => d.date), ['2026-10-03', '2026-10-30', '2026-10-31']);
});

test('getUpcomingDates garde la date du jour, même le soir', () => {
    const result = getUpcomingDates(sample, new Date(2026, 9, 3, 22, 45));
    assert.equal(result[0].date, '2026-10-03');
});

test('getUpcomingDates renvoie [] quand la tournée est finie', () => {
    assert.deepEqual(getUpcomingDates(sample, new Date(2027, 0, 1)), []);
});

test('groupFeatured regroupe les dates consécutives de la même salle', () => {
    const upcoming = getUpcomingDates(sample, new Date(2026, 9, 1));
    assert.deepEqual(groupFeatured(upcoming), [
        { venue: 'Le Grand Rex', city: 'Paris', url: 'https://rex.test', dates: ['2026-10-30', '2026-10-31'] }
    ]);
});

test('groupFeatured renvoie [] sans date featured', () => {
    assert.deepEqual(groupFeatured([sample[2]]), []);
});

test('formatDays une date', () => {
    assert.equal(formatDays(['2026-11-06']), '6 novembre');
});

test('formatDays deux dates du même mois', () => {
    assert.equal(formatDays(['2026-10-30', '2026-10-31']), '30 & 31 octobre');
});

test('formatDays trois dates du même mois', () => {
    assert.equal(formatDays(['2026-04-01', '2026-04-02', '2026-04-03']), '1, 2 & 3 avril');
});

test('formatDays mois différents', () => {
    assert.equal(formatDays(['2026-10-31', '2026-11-01']), '31 octobre & 1 novembre');
});

test('renderTourRow contient date, lieu et lien billetterie', () => {
    const html = renderTourRow(sample[2]);
    assert.match(html, /class="tour-row"/);
    assert.match(html, /<span class="tour-day">03<\/span>/);
    assert.match(html, /<span class="tour-month">Oct<\/span>/);
    assert.match(html, /Mennecy/);
    assert.match(html, /Espace J-J\. Robert/);
    assert.match(html, /href="https:\/\/mennecy\.test" target="_blank" rel="noopener"/);
    assert.match(html, />Billets</);
});

test('renderTourRow marque les dates featured', () => {
    assert.match(renderTourRow(sample[1]), /class="tour-row is-featured"/);
});

test('renderTourRow complet : pas de lien, libellé Complet', () => {
    const html = renderTourRow({ ...sample[2], complet: true });
    assert.match(html, /class="tour-row is-complet"/);
    assert.match(html, /Complet/);
    assert.doesNotMatch(html, /<a /);
});

const { featuredLine } = require('../src/js/tour.js');

test('featuredLine annonce les dates featured quand la prochaine date est ailleurs', () => {
    const upcoming = getUpcomingDates(sample, new Date(2026, 9, 1));
    assert.deepEqual(featuredLine(upcoming), { venue: 'Le Grand Rex', city: 'Paris', when: 'les 30 & 31 octobre' });
});

test('featuredLine ne répète pas la salle de la prochaine date', () => {
    const upcoming = getUpcomingDates(sample, new Date(2026, 9, 4));
    assert.equal(featuredLine(upcoming), null);
});

test('featuredLine utilise « le » pour une seule date', () => {
    const upcoming = [
        sample[2],
        { date: '2026-11-06', day: '06', month: 'Nov', venue: 'Zénith', city: 'Lille', url: 'https://lille.test', featured: true }
    ];
    assert.deepEqual(featuredLine(upcoming), { venue: 'Zénith', city: 'Lille', when: 'le 6 novembre' });
});

test('featuredLine renvoie null sans date featured', () => {
    assert.equal(featuredLine([sample[2]]), null);
});
