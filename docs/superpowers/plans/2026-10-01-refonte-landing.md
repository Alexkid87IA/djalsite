# Refonte landing D'JAL — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refaire le design de `index.html` en direction « affiche de tournée » (fond noir, titres Anton, billetterie en avant) en gardant tout le contenu existant.

**Architecture:** Site statique sans build. `index.html` + un fichier CSS par section dans `src/css/` (importés par `src/css/main.css`) + `src/js/main.js`. La logique de tournée (filtrage, regroupement, formatage, rendu d'une ligne) part dans un nouveau fichier sans DOM `src/js/tour.js`, testé avec `node --test` ; `main.js` ne fait que brancher ces fonctions au DOM.

**Tech Stack:** HTML, CSS (custom properties, grid, scroll-snap), JavaScript vanilla, Google Fonts (Anton + Inter), Node 22 (`node --test`, aucune dépendance) pour les tests de `tour.js`.

**Spec:** `docs/superpowers/specs/2026-10-01-refonte-landing-design.md` — maquette de référence du héros : `mockups/hero.html`.

## Global Constraints

- Couleurs : `--bg #000`, `--bg-alt #0d0d0d`, `--pink #e91e8c`, `--blue #2d7dd2`, `--text #fff`, `--text-muted rgba(255,255,255,0.6)`, `--line rgba(255,255,255,0.12)`.
- Titres en **Anton**, majuscules ; texte courant en **Inter**. Une seule balise Google Fonts.
- Rose = actions (Billets, Réserver). Bleu = accent (étiquettes). Dégradé rose→bleu uniquement en touche ponctuelle (soulignement du titre héros).
- Aucun contenu inventé : pas de citation presse, pas de logo média, pas de titre de film.
- `biographie.html` et `livredor.html` ne sont **pas modifiées**. Elles utilisent `main.css`, les classes `.nav-wrapper.scrolled`, `.nav`, `.nav-logo`, `.nav-cta`, `.footer`, `.footer-bottom`, `.container`, `.livredor-grid`, `.livredor-item`, `.livredor-text`, `.livredor-author`, `.livredor-name`, `.livredor-date`, et les variables `--dark`, `--darker`, `--light`, `--gray-200`, `--gray-300`, `--pink`, `--transition`. Toutes doivent continuer d'exister.
- Les données `tourDates` de `main.js` ne changent pas (copier le tableau tel quel).
- Pas de dépendance npm, pas de `package.json`.
- Animations : uniquement apparitions au scroll, désactivées si `prefers-reduced-motion: reduce`.
- Mobile : aucune barre de défilement horizontal de 320px à 1440px.
- Commits : nouveaux commits uniquement (jamais `--amend`), terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Spectacle le jour même** : un spectacle daté d'aujourd'hui doit rester affiché toute la journée, même le soir → test `getUpcomingDates garde la date du jour` (Task 1).
2. **JavaScript bloqué ou en erreur** : le contenu ne doit jamais rester invisible à cause des animations → les classes `.reveal` ne masquent que sous `html.js` (Task 2), vérifié en Task 9.
3. **Aucune date à venir** (fin de tournée) : message « Aucune date à venir », encart « Prochaine date », ligne « À ne pas rater » et barre mobile masqués, étiquette « Tournée 2026 » sans compteur → test `renderHeroDates sans date` dans le navigateur (Task 4) et `getUpcomingDates` vide (Task 1).
4. **Dates « featured » à cheval sur deux mois** (ex. 31 oct & 1er nov) : libellé correct « 31 octobre & 1 novembre » → test `formatDays mois différents` (Task 1).
5. **Date marquée `complet`** : pas de lien billetterie, libellé « Complet » → test `renderTourRow complet` (Task 1).

---

## Structure des fichiers

| Fichier | Action | Responsabilité |
|---|---|---|
| `src/js/tour.js` | Créer | Fonctions pures de la tournée (sans DOM). Exporte `Tour` (navigateur) / `module.exports` (Node). |
| `tests/tour.test.js` | Créer | Tests `node --test` de `tour.js`. |
| `src/js/main.js` | Réécrire | Données `tourDates` + branchement DOM (tournée, héros, nav, reels, barre mobile, apparitions, newsletter). |
| `index.html` | Réécrire | Nouvelle structure de la page (12 blocs). |
| `src/css/main.css` | Réécrire | Liste des imports. |
| `src/css/base/_variables.css` | Réécrire | Tokens + alias pour les pages secondaires. |
| `src/css/base/_reset.css` | Réécrire | Reset + base typographique. |
| `src/css/layout/_sections.css` | Réécrire | `.container`, `.section`, en-têtes de section, `.reveal`. |
| `src/css/components/_buttons.css` | Réécrire | `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-tickets`. |
| `src/css/components/_nav.css` | Réécrire | Nav + menu mobile (+ `.nav-cta` pour les pages secondaires). |
| `src/css/components/_hero.css` | Réécrire | Héros + carte prochaine date + barre mobile. |
| `src/css/components/_stats.css` | Créer | Bandeau chiffres clés. |
| `src/css/components/_tournee.css` | Réécrire | Lignes de dates + bouton « Voir toutes les dates ». |
| `src/css/components/_spectacle.css` | Réécrire | Bloc spectacle. |
| `src/css/components/_reels.css` | Réécrire | Carrousel reels. |
| `src/css/components/_videos.css` | Réécrire | Grilles vidéo (classiques + filmographie). |
| `src/css/components/_presse.css` | Réécrire | Bandeau presse. |
| `src/css/components/_livredor.css` | Réécrire | Cartes livre d'or (compatibles `livredor.html`). |
| `src/css/components/_communaute.css` | Créer | Réseaux + newsletter fusionnés. |
| `src/css/layout/_footer.css` | Réécrire | Footer. |
| `src/css/components/_cinema.css`, `_contact.css`, `_instagram.css`, `src/css/layout/_responsive.css` | Supprimer | Remplacés (les media queries vivent désormais dans chaque fichier composant). |
| `mockups/hero.html` | Supprimer (Task 9) | Maquette jetable. |

---

### Task 1: Logique de tournée testée (`tour.js`)

**Files:**
- Create: `src/js/tour.js`
- Test: `tests/tour.test.js`

**Interfaces:**
- Consumes: rien.
- Produces (objet `Tour` global dans le navigateur, `module.exports` dans Node) :
  - `toISODate(date: Date) → string` — `'YYYY-MM-DD'` en heure locale.
  - `getUpcomingDates(dates: TourDate[], today: Date) → TourDate[]` — dates `>= today` (jour inclus), triées croissant.
  - `groupFeatured(upcoming: TourDate[]) → {venue, city, url, dates: string[]}[]` — dates `featured` consécutives de même salle+ville regroupées.
  - `formatDays(isoDates: string[]) → string` — `'30 & 31 octobre'`, `'31 octobre & 1 novembre'`.
  - `renderTourRow(item: TourDate) → string` — HTML d'une ligne `.tour-row`.
  - `TourDate` = `{ date: 'YYYY-MM-DD', day: '03', month: 'Oct', venue, city, url, featured?: true, complet?: true }`.

- [ ] **Step 1: Écrire les tests (qui échouent)**

`tests/tour.test.js` :

```js
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
```

- [ ] **Step 2: Lancer les tests pour vérifier qu'ils échouent**

Run: `cd ~/Desktop/djalsite && node --test tests/`
Expected: FAIL — `Cannot find module '../src/js/tour.js'`

- [ ] **Step 3: Écrire `src/js/tour.js`**

```js
/* ============================================
   TOURNÉE — fonctions sans DOM
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

    const api = { MONTHS, toISODate, getUpcomingDates, groupFeatured, formatDays, renderTourRow };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        root.Tour = api;
    }
})(this);
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `cd ~/Desktop/djalsite && node --test tests/`
Expected: PASS — `# pass 13`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
cd ~/Desktop/djalsite && git add src/js/tour.js tests/tour.test.js && git commit -m "Logique de tournée testée (tour.js)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Fondations CSS (tokens, reset, sections, boutons, imports)

**Files:**
- Modify (réécrire): `src/css/base/_variables.css`, `src/css/base/_reset.css`, `src/css/layout/_sections.css`, `src/css/components/_buttons.css`, `src/css/main.css`
- Create (vides pour l'instant, remplis dans les tâches suivantes): `src/css/components/_stats.css`, `src/css/components/_communaute.css`
- Delete: `src/css/components/_cinema.css`, `src/css/components/_contact.css`, `src/css/components/_instagram.css`, `src/css/layout/_responsive.css`

**Interfaces:**
- Produces (classes utilisées par toutes les tâches suivantes) : `.container`, `.section`, `.section-alt`, `.section-head`, `.section-tag`, `.section-title`, `.section-subtitle`, `.reveal` / `.reveal.is-visible` (actif seulement sous `html.js`), `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-tickets`. Variables : voir `_variables.css` ci-dessous.

- [ ] **Step 1: Vérifier les variables utilisées par les pages secondaires**

Run: `cd ~/Desktop/djalsite && grep -ohE 'var\(--[a-z0-9-]+\)' biographie.html livredor.html | sort -u`
Expected : exactement `--dark`, `--darker`, `--gray-200`, `--gray-300`, `--light`, `--pink`, `--transition`. Si une autre variable apparaît, l'ajouter aux alias du Step 2.

- [ ] **Step 2: Réécrire `src/css/base/_variables.css`**

```css
/* ============================================
   VARIABLES
============================================ */
:root {
    /* Couleurs */
    --bg: #000;
    --bg-alt: #0d0d0d;
    --pink: #e91e8c;
    --blue: #2d7dd2;
    --text: #fff;
    --text-muted: rgba(255,255,255,0.6);
    --line: rgba(255,255,255,0.12);
    --surface: rgba(255,255,255,0.03);

    /* Typo */
    --display: 'Anton', Impact, sans-serif;
    --body: 'Inter', system-ui, sans-serif;

    /* Mise en page */
    --nav-height: 80px;
    --container-width: 1240px;
    --gutter: clamp(16px, 4vw, 40px);
    --section-padding: clamp(72px, 10vw, 128px);
    --radius: 16px;
    --transition: 0.25s ease;

    /* Alias utilisés par biographie.html et livredor.html */
    --dark: var(--bg);
    --darker: var(--bg-alt);
    --light: var(--text);
    --gray-200: rgba(255,255,255,0.7);
    --gray-300: rgba(255,255,255,0.5);
}
```

- [ ] **Step 3: Réécrire `src/css/base/_reset.css`**

```css
/* ============================================
   RESET & BASE
============================================ */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: var(--nav-height);
}

body {
    font-family: var(--body);
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
}

body.menu-open {
    overflow: hidden;
}

[hidden] {
    display: none !important;
}

img, iframe {
    display: block;
    max-width: 100%;
}

a {
    color: inherit;
    text-decoration: none;
}

button {
    font: inherit;
    color: inherit;
    cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
}
```

- [ ] **Step 4: Réécrire `src/css/layout/_sections.css`**

```css
/* ============================================
   SECTIONS (commun)
============================================ */
.container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 var(--gutter);
}

.section {
    padding: var(--section-padding) 0;
}

.section-alt {
    background: var(--bg-alt);
}

.section-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: clamp(32px, 5vw, 56px);
}

.section-tag {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 16px;
}

.section-tag::before {
    content: '';
    width: 40px;
    height: 2px;
    background: currentColor;
}

.section-title {
    font-family: var(--display);
    font-weight: 400;
    font-size: clamp(3rem, 7vw, 6rem);
    line-height: 0.92;
    text-transform: uppercase;
}

.section-subtitle {
    max-width: 420px;
    font-size: 1.05rem;
    color: var(--text-muted);
}

/* Apparitions au scroll : actives seulement si le JS a démarré (html.js) */
.js .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
}

.js .reveal.is-visible {
    opacity: 1;
    transform: none;
}

@media (prefers-reduced-motion: reduce) {
    .js .reveal {
        opacity: 1;
        transform: none;
        transition: none;
    }
}
```

- [ ] **Step 5: Réécrire `src/css/components/_buttons.css`**

```css
/* ============================================
   BOUTONS
============================================ */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px 30px;
    border-radius: 100px;
    border: 1px solid transparent;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition), background var(--transition);
}

.btn svg {
    width: 16px;
    height: 16px;
}

.btn-primary {
    background: var(--pink);
    color: #fff;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(233,30,140,0.35);
}

.btn-ghost {
    border-color: var(--line);
    background: transparent;
    color: var(--text);
}

.btn-ghost:hover {
    border-color: var(--text);
}

/* Petit bouton rose « Billets » (nav, lignes de tournée, barre mobile) */
.btn-tickets,
.nav-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 100px;
    background: var(--pink);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    transition: transform var(--transition), box-shadow var(--transition);
}

.btn-tickets:hover,
.nav-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(233,30,140,0.35);
}
```

- [ ] **Step 6: Créer les fichiers vides et supprimer les anciens**

```bash
cd ~/Desktop/djalsite && printf '/* Bandeau chiffres clés — rempli en Task 5 */\n' > src/css/components/_stats.css && printf '/* Communauté + newsletter — rempli en Task 8 */\n' > src/css/components/_communaute.css && git rm -q src/css/components/_cinema.css src/css/components/_contact.css src/css/components/_instagram.css src/css/layout/_responsive.css
```

- [ ] **Step 7: Réécrire `src/css/main.css`**

```css
/* ============================================
   DJAL - EN PLEINE CONSCIENCE
   Point d'entrée CSS
============================================ */

/* Base */
@import 'base/_variables.css';
@import 'base/_reset.css';

/* Layout */
@import 'layout/_sections.css';

/* Composants */
@import 'components/_buttons.css';
@import 'components/_nav.css';
@import 'components/_hero.css';
@import 'components/_stats.css';
@import 'components/_tournee.css';
@import 'components/_spectacle.css';
@import 'components/_reels.css';
@import 'components/_videos.css';
@import 'components/_presse.css';
@import 'components/_livredor.css';
@import 'components/_communaute.css';

/* Footer */
@import 'layout/_footer.css';
```

- [ ] **Step 8: Vérifier que toutes les feuilles importées existent**

Run: `cd ~/Desktop/djalsite/src/css && for f in $(grep -oE "'[^']+'" main.css | tr -d "'"); do test -f "$f" || echo "MANQUANT: $f"; done; echo ok`
Expected: `ok` seul (aucune ligne `MANQUANT`).

- [ ] **Step 9: Commit**

```bash
cd ~/Desktop/djalsite && git add -A src/css && git commit -m "Fondations CSS de la refonte (tokens, reset, sections, boutons)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Nouveau `index.html` + `main.js` de base

Cette tâche pose **toute** la nouvelle structure HTML et le JS de branchement. Les tâches 4 à 8 ne font ensuite que du CSS (et un peu de JS) section par section.

**Files:**
- Modify (réécrire): `index.html`, `src/js/main.js`

**Interfaces:**
- Consumes: `Tour.*` (Task 1), classes CSS (Task 2).
- Produces (ids/classes utilisés par les tâches 4-9) :
  - Héros : `#hero`, `#hero-count`, `#next-date` (attribut `hidden` par défaut), `#next-date-day`, `#next-date-month`, `#next-date-city`, `#next-date-venue`, `#featured-date` (`hidden` par défaut).
  - Barre mobile : `#mobile-bar` (`hidden` par défaut), `#mobile-bar-date`, `#mobile-bar-city`, `#mobile-bar-link` ; classe `.is-visible`.
  - Tournée : `#tournee-list`, `#tournee-more` (`hidden` par défaut).
  - Reels : `#reels-track`, `.reels-prev`, `.reels-next`.
  - Nav : `#nav-wrapper` (+ classe `.scrolled`), `#nav-toggle` (`aria-expanded`), `#nav-mobile` (+ classe `.open`).
  - JS : fonctions `renderTour(upcoming)` et `renderHeroDates(upcoming)` appelables depuis la console pour les tests.

- [ ] **Step 1: Récupérer les tracés SVG des icônes sociales**

Les icônes sont regroupées dans un sprite SVG en haut du `<body>`. Récupérer les attributs `d` depuis la version d'origine :

Run: `cd ~/Desktop/djalsite && git show 340cedb:index.html | sed -n 31,36p` → Instagram, Facebook, YouTube, Snapchat (bloc `.nav-socials`).
Run: `cd ~/Desktop/djalsite && git show 340cedb:index.html | grep -A1 -E 'aria-label="(TikTok|X)"' | head -4` → TikTok et X.

⚠️ Dans le bloc `.nav-mobile-socials` d'origine, l'icône « Snapchat » est en réalité le logo **Pinterest**. Utiliser le tracé Snapchat du bloc `.nav-socials` (celui qui commence par `M12.206.793`).

- [ ] **Step 2: Réécrire `index.html`**

Remplacer les `d="…"` marqués `COPIER` par les tracés du Step 1 (un tracé par `<symbol>`). Tout le reste est à copier tel quel.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D'JAL - En Pleine Conscience | Site Officiel</title>
    <meta name="description" content="Site officiel de D'JAL, humoriste. Découvrez son nouveau spectacle 'En Pleine Conscience', les dates de tournée et réservez vos billets.">

    <!-- Open Graph -->
    <meta property="og:title" content="D'JAL - En Pleine Conscience">
    <meta property="og:description" content="Le nouveau spectacle de D'JAL en tournée partout en France">
    <meta property="og:image" content="src/assets/images/hero.jpg">
    <meta property="og:type" content="website">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" href="src/css/main.css">
</head>
<body>
    <!-- Icônes (sprite) -->
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <symbol id="i-instagram" viewBox="0 0 24 24"><path fill="currentColor" d="COPIER (Instagram)"/></symbol>
        <symbol id="i-facebook" viewBox="0 0 24 24"><path fill="currentColor" d="COPIER (Facebook)"/></symbol>
        <symbol id="i-youtube" viewBox="0 0 24 24"><path fill="currentColor" d="COPIER (YouTube)"/></symbol>
        <symbol id="i-tiktok" viewBox="0 0 24 24"><path fill="currentColor" d="COPIER (TikTok)"/></symbol>
        <symbol id="i-x" viewBox="0 0 24 24"><path fill="currentColor" d="COPIER (X)"/></symbol>
        <symbol id="i-snapchat" viewBox="0 0 24 24"><path fill="currentColor" d="COPIER (Snapchat, bloc .nav-socials)"/></symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7"/></symbol>
        <symbol id="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></symbol>
        <symbol id="i-chevron-left" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M15 18l-6-6 6-6"/></symbol>
        <symbol id="i-chevron-right" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M9 18l6-6-6-6"/></symbol>
    </svg>

    <!-- ========================================
         NAVIGATION
    ======================================== -->
    <header class="nav-wrapper" id="nav-wrapper">
        <nav class="nav">
            <a href="#hero" class="nav-logo"><img src="src/assets/images/logo.png" alt="D'JAL"></a>
            <ul class="nav-menu">
                <li><a href="#spectacle" class="nav-link">Spectacle</a></li>
                <li><a href="#tournee" class="nav-link">Tournée</a></li>
                <li><a href="#videos" class="nav-link">Vidéos</a></li>
                <li><a href="#presse" class="nav-link">Presse</a></li>
                <li><a href="#livredor" class="nav-link">Livre d'or</a></li>
            </ul>
            <div class="nav-right">
                <a href="#tournee" class="nav-cta">Billets</a>
                <button class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-mobile">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    </header>

    <div class="nav-mobile" id="nav-mobile">
        <div class="nav-mobile-content">
            <a href="#spectacle" class="nav-mobile-link">Spectacle</a>
            <a href="biographie.html" class="nav-mobile-link">Biographie</a>
            <a href="#tournee" class="nav-mobile-link">Tournée</a>
            <a href="#videos" class="nav-mobile-link">Vidéos</a>
            <a href="#cinema" class="nav-mobile-link">Cinéma</a>
            <a href="#presse" class="nav-mobile-link">Presse</a>
            <a href="#livredor" class="nav-mobile-link">Livre d'or</a>
            <div class="nav-mobile-socials">
                <a href="https://www.instagram.com/djalcomedy/" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#i-instagram"/></svg></a>
                <a href="https://www.facebook.com/djalcomedy/?locale=fr_FR" target="_blank" rel="noopener" aria-label="Facebook"><svg><use href="#i-facebook"/></svg></a>
                <a href="https://www.youtube.com/@DjalOfficiel7" target="_blank" rel="noopener" aria-label="YouTube"><svg><use href="#i-youtube"/></svg></a>
                <a href="https://www.tiktok.com/@djalcomedy" target="_blank" rel="noopener" aria-label="TikTok"><svg><use href="#i-tiktok"/></svg></a>
                <a href="https://x.com/djalcomedy" target="_blank" rel="noopener" aria-label="X"><svg><use href="#i-x"/></svg></a>
                <a href="https://www.snapchat.com/add/djalcomedy" target="_blank" rel="noopener" aria-label="Snapchat"><svg><use href="#i-snapchat"/></svg></a>
            </div>
            <a href="#tournee" class="btn btn-primary nav-mobile-cta">Billets</a>
        </div>
    </div>

    <main>
        <!-- ========================================
             HÉROS
        ======================================== -->
        <section class="hero" id="hero">
            <div class="hero-content">
                <span class="hero-tag" id="hero-count">Tournée 2026</span>
                <h1 class="hero-title">
                    <span>En pleine</span>
                    <span class="hero-title-accent">conscience</span>
                </h1>
                <p class="hero-sub">Le nouveau spectacle de <strong>D'JAL</strong>. Toujours à cent à l'heure, toujours déjanté.</p>
                <div class="hero-actions">
                    <a href="#tournee" class="btn btn-primary">Réserver mes places <svg><use href="#i-arrow"/></svg></a>
                    <a href="#extraits" class="btn btn-ghost"><svg><use href="#i-play"/></svg> Extraits</a>
                </div>

                <a href="#tournee" class="next-date" id="next-date" target="_blank" rel="noopener" hidden>
                    <span class="next-date-day"><span id="next-date-day"></span><small id="next-date-month"></small></span>
                    <span class="next-date-info">
                        <span class="next-date-label">Prochaine date</span>
                        <span class="next-date-city" id="next-date-city"></span>
                        <span class="next-date-venue" id="next-date-venue"></span>
                    </span>
                    <span class="next-date-link">Billets →</span>
                </a>
                <p class="featured-date" id="featured-date" hidden></p>
            </div>

            <div class="hero-poster">
                <img src="src/assets/images/hero.jpg" alt="D'JAL — En pleine conscience">
            </div>
        </section>

        <!-- ========================================
             CHIFFRES CLÉS
        ======================================== -->
        <section class="stats" aria-label="Chiffres clés">
            <div class="container stats-grid">
                <div class="stat reveal">
                    <span class="stat-value">20M+</span>
                    <span class="stat-label">vues pour le « Portugais »</span>
                </div>
                <div class="stat reveal">
                    <span class="stat-value">200+</span>
                    <span class="stat-label">représentations</span>
                </div>
                <div class="stat reveal">
                    <span class="stat-value">Olympia · Casino de Paris</span>
                    <span class="stat-label">salles mythiques à guichets fermés</span>
                </div>
            </div>
        </section>

        <!-- ========================================
             TOURNÉE
        ======================================== -->
        <section class="section" id="tournee">
            <div class="container">
                <header class="section-head reveal">
                    <div>
                        <span class="section-tag">Tournée 2026</span>
                        <h2 class="section-title">Prochaines dates</h2>
                    </div>
                    <p class="section-subtitle">Retrouvez D'JAL près de chez vous.</p>
                </header>
                <div class="tour-list" id="tournee-list">
                    <!-- Dates générées par main.js -->
                </div>
                <div class="tour-more">
                    <button class="btn btn-ghost" id="tournee-more" hidden></button>
                </div>
            </div>
        </section>

        <!-- ========================================
             LE SPECTACLE
        ======================================== -->
        <section class="section section-alt" id="spectacle">
            <div class="container spectacle-grid">
                <div class="spectacle-content reveal">
                    <span class="section-tag">D'JAL</span>
                    <h2 class="section-title">Le spectacle</h2>
                    <p class="spectacle-intro">Aussi loin qu'il s'en souvienne, D'jal a toujours été heureux et servi par une imagination débordante, le tout couplé à un vrai sens du partage… Normal quand on est l'aîné d'une fratrie de 7 enfants !</p>
                    <p>À l'adolescence, le jeune homme se découvre une passion pour le cinéma. De petit boulot en petit boulot, D'jal atterrit dans un centre d'aide aux myopathes où il noue une véritable amitié avec Lassana, que la maladie emportera trop vite. <strong>D'jal décide d'aller au bout de ses rêves, car la vie est courte.</strong></p>
                    <p>Il prend conscience de sa capacité à raconter des histoires de façon drôle et décalée, court les scènes ouvertes, impose son style et son personnage culte du "Portugais" (plus de 20 millions de vues !), avant d'exploser au <strong>Jamel Comedy Club</strong>.</p>
                    <div class="spectacle-pitch">
                        <h3>En Pleine Conscience</h3>
                        <p>Après une tournée mondiale à guichets fermés — Trévise, Olympia, Alhambra, Casino de Paris — D'JAL repart sur les routes avec <strong>"En Pleine Conscience"</strong>.</p>
                        <p>Toujours à cent à l'heure, toujours déjanté. Plus de 200 représentations, des personnages toujours plus dingues et des situations encore plus folles. L'occasion de prendre votre dose d'humour et d'amour.</p>
                    </div>
                    <a href="biographie.html" class="btn btn-ghost">Lire la biographie complète <svg><use href="#i-arrow"/></svg></a>
                    <p class="spectacle-mention">En accord avec La Tiny Team &amp; Heb</p>
                </div>
                <div class="spectacle-image reveal">
                    <img src="src/assets/images/djal-portrait.png" alt="D'JAL" loading="lazy">
                </div>
            </div>
        </section>

        <!-- ========================================
             SUR SCÈNE (reels Instagram)
        ======================================== -->
        <section class="section" id="extraits">
            <div class="container">
                <header class="section-head reveal">
                    <div>
                        <span class="section-tag">Extraits</span>
                        <h2 class="section-title">Sur scène</h2>
                    </div>
                    <div class="reels-arrows">
                        <button class="reels-arrow reels-prev" aria-label="Précédent"><svg><use href="#i-chevron-left"/></svg></button>
                        <button class="reels-arrow reels-next" aria-label="Suivant"><svg><use href="#i-chevron-right"/></svg></button>
                    </div>
                </header>
            </div>
            <div class="reels-track" id="reels-track" tabindex="0">
                <div class="reel"><iframe src="https://www.instagram.com/reel/DTvYpC2jByu/embed/" title="Extrait Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>
                <div class="reel"><iframe src="https://www.instagram.com/reel/DSKDpN9DAy0/embed/" title="Extrait Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>
                <div class="reel"><iframe src="https://www.instagram.com/reel/DPy_FqbDJQa/embed/" title="Extrait Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>
                <div class="reel"><iframe src="https://www.instagram.com/reel/DPRoAK5DIa7/embed/" title="Extrait Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>
                <div class="reel"><iframe src="https://www.instagram.com/reel/DPjFqy7jB8G/embed/" title="Extrait Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>
                <div class="reel"><iframe src="https://www.instagram.com/reel/DN_C8lHjBS-/embed/" title="Extrait Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>
                <div class="reel"><iframe src="https://www.instagram.com/reel/DPy_aAgjD2i/embed/" title="Extrait Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>
            </div>
        </section>

        <!-- ========================================
             LES CLASSIQUES (YouTube)
        ======================================== -->
        <section class="section section-alt" id="videos">
            <div class="container">
                <header class="section-head reveal">
                    <div>
                        <span class="section-tag">Vidéos</span>
                        <h2 class="section-title">Les classiques</h2>
                    </div>
                    <p class="section-subtitle">Quelques bons moments passés.</p>
                </header>
                <div class="video-grid video-grid-2">
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/xsIcbGitiuw" title="D'JAL" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/I19SwXcfRmM" title="D'JAL" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/6BUfTCXEuww" title="D'JAL" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/OBn3VVtJvNo" title="D'JAL" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/zj_FIZm_ke0" title="D'JAL" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/fcJDg8esfaE" title="D'JAL" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                </div>
            </div>
        </section>

        <!-- ========================================
             FILMOGRAPHIE
        ======================================== -->
        <section class="section" id="cinema">
            <div class="container">
                <header class="section-head reveal">
                    <div>
                        <span class="section-tag">Cinéma</span>
                        <h2 class="section-title">Filmographie</h2>
                    </div>
                    <p class="section-subtitle">D'JAL sur grand écran.</p>
                </header>
                <div class="video-grid video-grid-3">
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/t1k27_qOh9w" title="Bande-annonce" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/_ritbMqwwf8" title="Bande-annonce" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                    <div class="video-card reveal"><iframe src="https://www.youtube.com/embed/1Ni6lh4GVxA" title="Bande-annonce" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                </div>
            </div>
        </section>

        <!-- ========================================
             PRESSE
        ======================================== -->
        <section class="section press" id="presse">
            <div class="container">
                <header class="press-head reveal">
                    <span class="section-tag">Presse</span>
                    <h2 class="section-title">Ils parlent de lui</h2>
                </header>
                <div class="press-video reveal">
                    <iframe src="https://www.youtube.com/embed/LpweIhFXFcg?start=47" title="D'JAL - Interview" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        </section>

        <!-- ========================================
             LIVRE D'OR
        ======================================== -->
        <section class="section section-alt" id="livredor">
            <div class="container">
                <header class="section-head reveal">
                    <div>
                        <span class="section-tag">Livre d'or</span>
                        <h2 class="section-title">Vos messages</h2>
                    </div>
                    <p class="section-subtitle">Ce que vous dites après le spectacle.</p>
                </header>
                <div class="livredor-grid">
                    <div class="livredor-item reveal">
                        <p class="livredor-text">"Hier soir, superbe soirée, 2h d'éclate total. Merci de nous faire oublier la morosité du quotidien, tout en clashant avec justesse. MERCI, pour cette joie que tu partages, ce n'est que du BONHEUR !!!!"</p>
                        <div class="livredor-author"><span class="livredor-name">Fred</span><span class="livredor-date">17/12/2023</span></div>
                    </div>
                    <div class="livredor-item reveal">
                        <p class="livredor-text">"Super soirée hier au théâtre de Longjumeau, pleine de rires et d'émotions. Vos spectacles devraient être remboursés par la Sécu. Au plaisir de vous revoir très vite"</p>
                        <div class="livredor-author"><span class="livredor-name">Carole</span><span class="livredor-date">16/12/2023</span></div>
                    </div>
                    <div class="livredor-item reveal">
                        <p class="livredor-text">"Je n'ai jamais écrit à un artiste de ma vie, mais ton spectacle m'a tellement fait passer du rire aux larmes que je me devais de prendre la plume! Quelle belle âme !"</p>
                        <div class="livredor-author"><span class="livredor-name">Anthony</span><span class="livredor-date">31/01/2023</span></div>
                    </div>
                    <div class="livredor-item reveal">
                        <p class="livredor-text">"Hier soir à Lyon un show à mourir de rire. Avec un moment de partage de tendresse et d'émotion cela fait un bien fou. Merci pour ces 2h30 de larmes. ☺️"</p>
                        <div class="livredor-author"><span class="livredor-name">Nathalie et Patrick</span><span class="livredor-date">23/11/2023</span></div>
                    </div>
                    <div class="livredor-item reveal">
                        <p class="livredor-text">"Merci pour ce moment passé à Liège. J'ai beaucoup ri. J'ai aussi ressenti beaucoup d'émotions grâce à votre partage. Je vais essayer de profiter de la vie avec pleine conscience."</p>
                        <div class="livredor-author"><span class="livredor-name">Christelle</span><span class="livredor-date">24/05/2023</span></div>
                    </div>
                    <div class="livredor-item reveal">
                        <p class="livredor-text">"Merci pour cet énorme bonheur à Marseille. Trop fort, l'expression mort de rire prend tout son sens grâce à toi. Merci aussi pour ta générosité et bienveillance."</p>
                        <div class="livredor-author"><span class="livredor-name">Sonia</span><span class="livredor-date">20/12/2022</span></div>
                    </div>
                </div>
                <div class="livredor-more">
                    <a href="livredor.html" class="btn btn-ghost">Voir plus de messages <svg><use href="#i-arrow"/></svg></a>
                </div>
            </div>
        </section>

        <!-- ========================================
             COMMUNAUTÉ + NEWSLETTER
        ======================================== -->
        <section class="section" id="communaute">
            <div class="container communaute-grid">
                <div class="communaute-intro reveal">
                    <span class="section-tag">Réseaux sociaux</span>
                    <h2 class="section-title">Rejoins la communauté</h2>
                    <p class="communaute-text">Coulisses exclusives, dates en avant-première, délires quotidiens... Inscris-toi à la newsletter pour recevoir en avant-première les nouvelles dates, les coulisses exclusives et toutes les actus de D'JAL.</p>
                    <form class="newsletter-form" id="newsletter-form">
                        <label class="visually-hidden" for="newsletter-email">Adresse email</label>
                        <input type="email" id="newsletter-email" placeholder="Ton adresse email" required>
                        <button type="submit" class="btn btn-primary">Je m'inscris</button>
                    </form>
                    <p class="newsletter-disclaimer">En t'inscrivant, tu acceptes de recevoir nos emails. Pas de spam, promis.</p>
                </div>
                <div class="social-grid reveal">
                    <a href="https://www.instagram.com/djalcomedy/" target="_blank" rel="noopener" class="social-card"><svg><use href="#i-instagram"/></svg><span class="social-name">Instagram</span><span class="social-handle">@djalcomedy</span></a>
                    <a href="https://www.tiktok.com/@djalcomedy" target="_blank" rel="noopener" class="social-card"><svg><use href="#i-tiktok"/></svg><span class="social-name">TikTok</span><span class="social-handle">@djalcomedy</span></a>
                    <a href="https://www.youtube.com/@DjalOfficiel7" target="_blank" rel="noopener" class="social-card"><svg><use href="#i-youtube"/></svg><span class="social-name">YouTube</span><span class="social-handle">D'JAL Officiel</span></a>
                    <a href="https://www.facebook.com/djalcomedy/?locale=fr_FR" target="_blank" rel="noopener" class="social-card"><svg><use href="#i-facebook"/></svg><span class="social-name">Facebook</span><span class="social-handle">D'JAL Comedy</span></a>
                    <a href="https://x.com/djalcomedy" target="_blank" rel="noopener" class="social-card"><svg><use href="#i-x"/></svg><span class="social-name">X</span><span class="social-handle">@djalcomedy</span></a>
                    <a href="https://www.snapchat.com/add/djalcomedy" target="_blank" rel="noopener" class="social-card"><svg><use href="#i-snapchat"/></svg><span class="social-name">Snapchat</span><span class="social-handle">djalcomedy</span></a>
                </div>
            </div>
        </section>
    </main>

    <!-- ========================================
         FOOTER
    ======================================== -->
    <footer class="footer">
        <div class="container">
            <div class="footer-main">
                <div class="footer-brand">
                    <a href="#hero" class="footer-logo"><img src="src/assets/images/logo.png" alt="D'JAL"></a>
                    <p class="footer-tagline">Humoriste, comédien et homme de scène. En tournée avec "En Pleine Conscience".</p>
                    <div class="footer-socials">
                        <a href="https://www.instagram.com/djalcomedy/" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#i-instagram"/></svg></a>
                        <a href="https://www.facebook.com/djalcomedy/?locale=fr_FR" target="_blank" rel="noopener" aria-label="Facebook"><svg><use href="#i-facebook"/></svg></a>
                        <a href="https://www.youtube.com/@DjalOfficiel7" target="_blank" rel="noopener" aria-label="YouTube"><svg><use href="#i-youtube"/></svg></a>
                        <a href="https://www.tiktok.com/@djalcomedy" target="_blank" rel="noopener" aria-label="TikTok"><svg><use href="#i-tiktok"/></svg></a>
                        <a href="https://x.com/djalcomedy" target="_blank" rel="noopener" aria-label="X"><svg><use href="#i-x"/></svg></a>
                        <a href="https://www.snapchat.com/add/djalcomedy" target="_blank" rel="noopener" aria-label="Snapchat"><svg><use href="#i-snapchat"/></svg></a>
                    </div>
                </div>
                <div class="footer-nav-group">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="#spectacle">Spectacle</a></li>
                        <li><a href="biographie.html">Biographie</a></li>
                        <li><a href="#tournee">Tournée</a></li>
                        <li><a href="#videos">Vidéos</a></li>
                        <li><a href="#cinema">Cinéma</a></li>
                    </ul>
                </div>
                <div class="footer-nav-group">
                    <h4>Plus</h4>
                    <ul>
                        <li><a href="#presse">Presse</a></li>
                        <li><a href="#livredor">Livre d'or</a></li>
                        <li><a href="livredor.html">Tous les avis</a></li>
                        <li><a href="#communaute">Newsletter</a></li>
                    </ul>
                </div>
                <div class="footer-contact">
                    <div class="footer-contact-item">
                        <h4>Production</h4>
                        <p>Benedicte Lecoq <em>— TinyTeam</em></p>
                        <a href="mailto:benedicte@tinyteam.fr">benedicte@tinyteam.fr</a>
                    </div>
                    <div class="footer-contact-item">
                        <h4>Presse</h4>
                        <a href="mailto:caroline@com-a-part.net">caroline@com-a-part.net</a>
                    </div>
                    <div class="footer-contact-item">
                        <h4>Booking</h4>
                        <p>Isabelle Sabatier <em>— Tiny Team</em></p>
                        <a href="mailto:booking@tinyteam.fr">booking@tinyteam.fr</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 D'JAL — Tous droits réservés</p>
            </div>
        </div>
    </footer>

    <!-- Barre mobile (affichée après le héros) -->
    <div class="mobile-bar" id="mobile-bar" hidden>
        <span class="mobile-bar-text"><strong id="mobile-bar-date"></strong><span id="mobile-bar-city"></span></span>
        <a href="#tournee" class="btn-tickets" id="mobile-bar-link" target="_blank" rel="noopener">Billets</a>
    </div>

    <!-- Scripts -->
    <script src="src/js/tour.js"></script>
    <script src="src/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Vérifier qu'aucun `COPIER` ne reste**

Run: `cd ~/Desktop/djalsite && grep -c 'COPIER' index.html`
Expected: `0`

- [ ] **Step 4: Réécrire `src/js/main.js`**

Copier le tableau `tourDates` **à l'identique** depuis la version d'origine (`git show 340cedb:src/js/main.js | sed -n 9,51p`) à l'endroit indiqué.

```js
/* ============================================
   DJAL - EN PLEINE CONSCIENCE
   Main JavaScript (nécessite tour.js avant)
============================================ */

document.documentElement.classList.add('js');

// ============================================
// DONNÉES DE TOURNÉE
// ============================================
const tourDates = [
    /* COLLER ICI les 41 lignes { date: ..., day: ..., ... } d'origine, sans modification */
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
// HÉROS : compteur, prochaine date, « À ne pas rater », barre mobile
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

    const featured = Tour.groupFeatured(upcoming)[0];
    if (featured) {
        featuredLine.innerHTML = `<em>À ne pas rater</em><strong>${featured.venue}, ${featured.city}</strong> — ${Tour.formatDays(featured.dates)}`;
        featuredLine.hidden = false;
    } else {
        featuredLine.hidden = true;
    }
}

const upcomingDates = Tour.getUpcomingDates(tourDates, new Date());
renderTour(upcomingDates);
renderHeroDates(upcomingDates);

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
// APPARITIONS AU SCROLL
// ============================================
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================
// NEWSLETTER (pas encore branchée sur un service)
// ============================================
const newsletterForm = document.getElementById('newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci pour votre inscription !');
    newsletterForm.reset();
});
```

- [ ] **Step 5: Vérifier les données de tournée**

Run: `cd ~/Desktop/djalsite && grep -c "date: '" src/js/main.js && grep -c 'COLLER ICI' src/js/main.js`
Expected: `41` puis `0`.

- [ ] **Step 6: Vérifier dans le navigateur (structure + console)**

Lancer le serveur si besoin : `cd ~/Desktop/djalsite && python3 -m http.server 8000`, ouvrir `http://localhost:8000`. Dans la console :

```js
[
  document.querySelectorAll('.tour-row').length,
  document.querySelectorAll('.tour-row:not([hidden])').length,
  document.getElementById('next-date').hidden,
  document.getElementById('hero-count').textContent
]
```

Expected (au 2026-10-01) : `[13, 6, false, "Tournée 2026 · 13 dates"]`. Aucune erreur rouge dans la console. (La mise en page n'est pas encore stylée : c'est normal.)

- [ ] **Step 7: Commit**

```bash
cd ~/Desktop/djalsite && git add index.html src/js/main.js && git commit -m "Nouvelle structure HTML et JS de la landing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Nav + héros + barre mobile (CSS)

**Files:**
- Modify (réécrire): `src/css/components/_nav.css`, `src/css/components/_hero.css`

**Interfaces:**
- Consumes: ids/classes de Task 3, boutons de Task 2.

- [ ] **Step 1: Réécrire `src/css/components/_nav.css`**

```css
/* ============================================
   NAVIGATION
============================================ */
.nav-wrapper {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 50;
    background: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent);
    transition: background var(--transition), backdrop-filter var(--transition);
}

.nav-wrapper.scrolled {
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
}

.nav {
    height: var(--nav-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 0 5vw;
}

.nav-logo img {
    height: 34px;
    width: auto;
}

.nav-menu {
    display: flex;
    gap: 34px;
    list-style: none;
}

.nav-link {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color var(--transition);
}

.nav-link:hover {
    color: var(--text);
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.nav-toggle {
    display: none;
    width: 42px;
    height: 42px;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: none;
}

.nav-toggle span {
    display: block;
    width: 16px;
    height: 2px;
    margin: 4px auto;
    background: var(--text);
    transition: transform var(--transition), opacity var(--transition);
}

.nav-toggle.active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.nav-toggle.active span:nth-child(2) { opacity: 0; }
.nav-toggle.active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* Menu mobile plein écran */
.nav-mobile {
    position: fixed;
    inset: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    background: var(--bg);
    padding: calc(var(--nav-height) + 24px) var(--gutter) 32px;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--transition), visibility var(--transition);
}

.nav-mobile.open {
    opacity: 1;
    visibility: visible;
}

.nav-mobile-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.nav-mobile-link {
    font-family: var(--display);
    font-size: clamp(2.2rem, 10vw, 3.2rem);
    line-height: 1.1;
    text-transform: uppercase;
}

.nav-mobile-socials {
    display: flex;
    gap: 18px;
    margin: 28px 0;
}

.nav-mobile-socials svg {
    width: 22px;
    height: 22px;
}

@media (max-width: 900px) {
    .nav { padding: 0 16px; }
    .nav-logo img { height: 26px; }
    .nav-menu { display: none; }
    .nav-toggle { display: block; }
    .nav-cta { padding: 10px 16px; font-size: 0.72rem; }
}
```

- [ ] **Step 2: Réécrire `src/css/components/_hero.css`** (repris de la maquette validée)

```css
/* ============================================
   HÉROS
============================================ */
.hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    position: relative;
    overflow: hidden;
}

.hero-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 120px 0 60px 5vw;
    position: relative;
    z-index: 2;
}

.hero-tag {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--blue);
}

.hero-tag::before {
    content: '';
    width: 40px;
    height: 2px;
    background: currentColor;
}

.hero-title {
    font-family: var(--display);
    font-weight: 400;
    font-size: clamp(4.5rem, 9.5vw, 10rem);
    line-height: 0.9;
    text-transform: uppercase;
    margin-right: -12vw; /* le titre déborde sur l'affiche */
}

.hero-title span {
    display: block;
}

.hero-title-accent {
    position: relative;
    width: fit-content;
}

.hero-title-accent::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.06em;
    height: 0.08em;
    background: linear-gradient(90deg, var(--pink), var(--blue));
}

.hero-sub {
    margin-top: 34px;
    max-width: 440px;
    font-size: 1.1rem;
    color: var(--text-muted);
}

.hero-sub strong {
    color: var(--text);
    font-weight: 600;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
}

/* Carte « Prochaine date » */
.next-date {
    margin-top: 48px;
    max-width: 520px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 22px;
    padding: 18px 22px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    backdrop-filter: blur(8px);
    transition: border-color var(--transition);
}

.next-date:hover {
    border-color: var(--pink);
}

.next-date-day {
    font-family: var(--display);
    font-size: 2.6rem;
    line-height: 0.9;
    text-align: center;
}

.next-date-day small {
    display: block;
    font-size: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--pink);
}

.next-date-info {
    display: flex;
    flex-direction: column;
}

.next-date-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
}

.next-date-city {
    margin-top: 4px;
    font-size: 1.15rem;
    font-weight: 700;
}

.next-date-venue {
    font-size: 0.9rem;
    color: var(--text-muted);
}

.next-date-link {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--pink);
    white-space: nowrap;
}

.featured-date {
    margin-top: 14px;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.featured-date strong {
    color: var(--text);
}

.featured-date em {
    margin-right: 8px;
    font-style: normal;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--blue);
}

/* Affiche */
.hero-poster {
    position: relative;
}

.hero-poster img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
}

.hero-poster::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
        linear-gradient(to right, var(--bg) 0%, transparent 30%),
        linear-gradient(to top, var(--bg) 0%, transparent 25%);
}

/* Barre mobile : cachée sur desktop */
.mobile-bar {
    display: none;
}

@media (max-width: 900px) {
    .hero {
        grid-template-columns: 1fr;
        min-height: auto;
    }

    .hero-poster {
        order: -1;
        height: 78vh;
        min-height: 520px;
    }

    .hero-poster img {
        object-position: center 30%;
    }

    .hero-poster::after {
        background:
            linear-gradient(to top, var(--bg) 0%, transparent 35%),
            linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 18%);
    }

    .hero-content {
        padding: 0 16px 48px;
        margin-top: -90px;
    }

    .hero-tag { margin-bottom: 18px; font-size: 0.68rem; }
    .hero-title { font-size: clamp(3.4rem, 18vw, 5.5rem); margin-right: 0; }
    .hero-sub { margin-top: 24px; font-size: 1rem; }
    .hero-actions { flex-direction: column; margin-top: 26px; }
    .hero-actions .btn { padding: 16px 18px; }
    .next-date { margin-top: 32px; gap: 16px; padding: 16px; }
    .next-date-day { font-size: 2.2rem; }

    .mobile-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        position: fixed;
        left: 12px;
        right: 12px;
        bottom: 12px;
        z-index: 30;
        padding: 10px 10px 10px 18px;
        border: 1px solid var(--line);
        border-radius: 100px;
        background: rgba(20,20,20,0.85);
        backdrop-filter: blur(12px);
        transform: translateY(calc(100% + 24px));
        transition: transform 0.35s ease;
    }

    .mobile-bar.is-visible {
        transform: none;
    }

    .mobile-bar-text {
        display: flex;
        flex-direction: column;
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .mobile-bar-text strong {
        font-size: 0.9rem;
        color: var(--text);
    }

    body {
        padding-bottom: 84px; /* la barre ne cache pas le footer */
    }
}
```

- [ ] **Step 3: Vérifier dans le navigateur — desktop 1440×900**

Ouvrir `http://localhost:8000` en 1440×900. Comparer au rendu de `http://localhost:8000/mockups/hero.html` : même mise en page (titre Anton à gauche qui déborde sur l'affiche, carte « Prochaine date : 03 OCT Mennecy », ligne « À ne pas rater Le Grand Rex, Paris — 30 & 31 octobre », nav 5 liens + bouton rose Billets). Faire défiler de 100px : la nav prend un fond noir flouté.

- [ ] **Step 4: Vérifier dans le navigateur — mobile 375×812**

En 375×812 : affiche en haut, titre en dessous, boutons empilés pleine largeur. La barre du bas n'est **pas** visible en haut de page. Faire défiler sous le héros : la barre « Prochaine date : 03 oct · Mennecy · Billets » glisse depuis le bas. Ouvrir le menu (burger) : menu plein écran, `aria-expanded="true"` ; cliquer « Tournée » : le menu se ferme.

Console : `document.documentElement.scrollWidth === innerWidth` → `true`.

- [ ] **Step 5: Vérifier le cas « aucune date » (Review Focus 3)**

Console :
```js
renderTour([]); renderHeroDates([]);
[document.querySelector('.tour-empty')?.textContent, document.getElementById('next-date').hidden, document.getElementById('featured-date').hidden, document.getElementById('mobile-bar').hidden, document.getElementById('hero-count').textContent]
```
Expected: `["Aucune date à venir pour le moment.", true, true, true, "Tournée 2026"]`. Recharger la page ensuite.

- [ ] **Step 6: Commit**

```bash
cd ~/Desktop/djalsite && git add src/css/components/_nav.css src/css/components/_hero.css && git commit -m "Style nav, héros et barre mobile

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Chiffres clés + tournée (CSS)

**Files:**
- Modify (réécrire): `src/css/components/_stats.css`, `src/css/components/_tournee.css`

**Interfaces:**
- Consumes: `.stats`, `.stats-grid`, `.stat`, `.stat-value`, `.stat-label` (Task 3) ; `.tour-list`, `.tour-row`, `.is-featured`, `.is-complet`, `.tour-date`, `.tour-day`, `.tour-month`, `.tour-place`, `.tour-city`, `.tour-venue`, `.tour-soldout`, `.tour-empty`, `.tour-more` (Tasks 1 et 3).

- [ ] **Step 1: Écrire `src/css/components/_stats.css`**

```css
/* ============================================
   CHIFFRES CLÉS
============================================ */
.stats {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: clamp(28px, 4vw, 48px) clamp(16px, 3vw, 40px);
}

.stat + .stat {
    border-left: 1px solid var(--line);
}

.stat-value {
    font-family: var(--display);
    font-size: clamp(2.2rem, 4.5vw, 4rem);
    line-height: 1;
    text-transform: uppercase;
}

.stat-label {
    font-size: 0.9rem;
    color: var(--text-muted);
}

@media (max-width: 900px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .stat + .stat {
        border-left: none;
        border-top: 1px solid var(--line);
    }
}
```

- [ ] **Step 2: Réécrire `src/css/components/_tournee.css`**

```css
/* ============================================
   TOURNÉE
============================================ */
.tour-list {
    border-top: 1px solid var(--line);
}

.tour-row {
    display: grid;
    grid-template-columns: 140px 1fr auto;
    align-items: center;
    gap: 24px;
    padding: 22px 0;
    border-bottom: 1px solid var(--line);
    transition: background var(--transition);
}

.tour-row:hover {
    background: var(--surface);
}

.tour-date {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font-family: var(--display);
    text-transform: uppercase;
}

.tour-day {
    font-size: clamp(2.6rem, 5vw, 3.6rem);
    line-height: 1;
}

.tour-month {
    font-size: 1.3rem;
    color: var(--pink);
}

.tour-place {
    display: flex;
    flex-direction: column;
}

.tour-city {
    font-size: 1.3rem;
    font-weight: 700;
}

.tour-venue {
    color: var(--text-muted);
}

.tour-row.is-featured .tour-city::after {
    content: 'Événement';
    margin-left: 10px;
    padding: 3px 8px;
    border-radius: 100px;
    background: var(--blue);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    vertical-align: middle;
}

.tour-soldout {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
}

.tour-row.is-complet {
    opacity: 0.5;
}

.tour-empty {
    padding: 32px 0;
    color: var(--text-muted);
}

.tour-more {
    margin-top: 32px;
    text-align: center;
}

@media (max-width: 600px) {
    .tour-row {
        grid-template-columns: 76px 1fr;
        row-gap: 14px;
        padding: 18px 0;
    }

    .tour-date {
        flex-direction: column;
        gap: 0;
    }

    .tour-row .btn-tickets,
    .tour-row .tour-soldout {
        grid-column: 2;
        justify-self: start;
    }
}
```

- [ ] **Step 3: Vérifier dans le navigateur**

Desktop 1440 : bandeau 3 colonnes séparées par des lignes ; liste de 6 dates (grande date, mois rose, ville en gras, salle grise, bouton rose à droite) ; les deux lignes Grand Rex ont l'étiquette bleue « Événement ». Cliquer « Voir toutes les dates (13) » → 13 lignes, le bouton disparaît. Cliquer un « Billets » → nouvel onglet vers la billetterie de la ligne.
Mobile 375 : bandeau sur 1 colonne ; bouton Billets sous la ville ; console `document.documentElement.scrollWidth === innerWidth` → `true`.

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/djalsite && git add src/css/components/_stats.css src/css/components/_tournee.css && git commit -m "Style chiffres clés et tournée

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Spectacle + reels (CSS)

**Files:**
- Modify (réécrire): `src/css/components/_spectacle.css`, `src/css/components/_reels.css`

- [ ] **Step 1: Réécrire `src/css/components/_spectacle.css`**

```css
/* ============================================
   LE SPECTACLE
============================================ */
.spectacle-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(32px, 6vw, 96px);
    align-items: center;
}

.spectacle-content .section-title {
    margin-bottom: 28px;
}

.spectacle-content p {
    margin-bottom: 18px;
    color: var(--text-muted);
}

.spectacle-content strong {
    color: var(--text);
}

.spectacle-content .spectacle-intro {
    font-size: 1.2rem;
    color: var(--text);
}

.spectacle-pitch {
    margin: 32px 0;
    padding: 24px 28px;
    border-left: 3px solid var(--pink);
    background: var(--surface);
    border-radius: 0 var(--radius) var(--radius) 0;
}

.spectacle-pitch h3 {
    margin-bottom: 12px;
    font-family: var(--display);
    font-weight: 400;
    font-size: 1.8rem;
    text-transform: uppercase;
}

.spectacle-pitch p:last-child {
    margin-bottom: 0;
}

.spectacle-mention {
    margin-top: 24px;
    font-size: 0.8rem;
}

.spectacle-image img {
    width: 100%;
    border-radius: var(--radius);
}

@media (max-width: 900px) {
    .spectacle-grid {
        grid-template-columns: 1fr;
    }

    .spectacle-image {
        order: -1;
        max-width: 420px;
    }
}
```

- [ ] **Step 2: Réécrire `src/css/components/_reels.css`**

```css
/* ============================================
   SUR SCÈNE (reels)
============================================ */
.reels-arrows {
    display: flex;
    gap: 10px;
}

.reels-arrow {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: none;
    transition: border-color var(--transition);
}

.reels-arrow:hover {
    border-color: var(--text);
}

.reels-arrow svg {
    width: 20px;
    height: 20px;
}

.reels-track {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 var(--gutter);
    padding: 0 var(--gutter) 8px;
    scrollbar-width: none;
}

.reels-track::-webkit-scrollbar {
    display: none;
}

.reel {
    flex: 0 0 clamp(260px, 26vw, 340px);
    aspect-ratio: 9 / 16;
    scroll-snap-align: start;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--bg-alt);
}

.reel iframe {
    width: 100%;
    height: 100%;
    border: none;
}

@media (max-width: 600px) {
    .reels-arrows {
        display: none;
    }

    .reel {
        flex-basis: 78vw;
    }
}
```

- [ ] **Step 3: Vérifier dans le navigateur**

Desktop : spectacle texte à gauche, portrait à droite, bloc rose « EN PLEINE CONSCIENCE ». Reels : rangée horizontale, flèches → défile d'une carte par clic. Mobile 375 : portrait au-dessus du texte ; reels glissables au doigt, une carte ≈ 78 % de la largeur ; `document.documentElement.scrollWidth === innerWidth` → `true`.

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/djalsite && git add src/css/components/_spectacle.css src/css/components/_reels.css && git commit -m "Style spectacle et reels

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Vidéos, filmographie, presse, livre d'or (CSS)

**Files:**
- Modify (réécrire): `src/css/components/_videos.css`, `src/css/components/_presse.css`, `src/css/components/_livredor.css`

- [ ] **Step 1: Réécrire `src/css/components/_videos.css`**

```css
/* ============================================
   GRILLES VIDÉO (classiques + filmographie)
============================================ */
.video-grid {
    display: grid;
    gap: 20px;
}

.video-grid-2 { grid-template-columns: repeat(2, 1fr); }
.video-grid-3 { grid-template-columns: repeat(3, 1fr); }

.video-card {
    aspect-ratio: 16 / 9;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--bg-alt);
}

.video-card iframe {
    width: 100%;
    height: 100%;
    border: none;
}

@media (max-width: 900px) {
    .video-grid-3 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
    .video-grid-2,
    .video-grid-3 { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Réécrire `src/css/components/_presse.css`**

```css
/* ============================================
   PRESSE
============================================ */
.press {
    position: relative;
    text-align: center;
}

.press::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--pink), var(--blue));
}

.press-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: clamp(32px, 5vw, 56px);
}

.press-head .section-title {
    font-size: clamp(3.5rem, 10vw, 9rem);
}

.press-video {
    max-width: 960px;
    margin: 0 auto;
    aspect-ratio: 16 / 9;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
}

.press-video iframe {
    width: 100%;
    height: 100%;
    border: none;
}
```

- [ ] **Step 3: Réécrire `src/css/components/_livredor.css`** (aussi utilisé par `livredor.html`)

```css
/* ============================================
   LIVRE D'OR (aussi utilisé par livredor.html)
============================================ */
.livredor-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.livredor-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
    padding: 56px 28px 28px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
}

.livredor-item::before {
    content: '“';
    position: absolute;
    top: 8px;
    left: 24px;
    font-family: var(--display);
    font-size: 4.5rem;
    line-height: 1;
    color: var(--pink);
}

.livredor-text {
    color: rgba(255,255,255,0.85);
}

.livredor-author {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--line);
}

.livredor-name {
    font-weight: 700;
}

.livredor-date {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.livredor-more {
    margin-top: 32px;
    text-align: center;
}

@media (max-width: 900px) {
    .livredor-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
    .livredor-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Vérifier dans le navigateur**

Desktop : 6 vidéos en 2 colonnes, 3 bandes-annonces en 3 colonnes, presse avec trait dégradé en haut + grand titre centré + vidéo, 6 cartes livre d'or (guillemet rose, prénom + date). Mobile 375 : tout sur 1 colonne, `document.documentElement.scrollWidth === innerWidth` → `true`.
Ouvrir `http://localhost:8000/livredor.html` : grille de cartes lisible (3 colonnes desktop, 1 mobile).

- [ ] **Step 5: Commit**

```bash
cd ~/Desktop/djalsite && git add src/css/components/_videos.css src/css/components/_presse.css src/css/components/_livredor.css && git commit -m "Style vidéos, filmographie, presse et livre d'or

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Communauté + footer (CSS)

**Files:**
- Modify (réécrire): `src/css/components/_communaute.css`, `src/css/layout/_footer.css`

**Interfaces:**
- Consumes: `.communaute-grid`, `.communaute-intro`, `.communaute-text`, `.newsletter-form`, `.newsletter-disclaimer`, `.visually-hidden`, `.social-grid`, `.social-card`, `.social-name`, `.social-handle` ; footer : `.footer`, `.footer-main`, `.footer-brand`, `.footer-logo`, `.footer-tagline`, `.footer-socials`, `.footer-nav-group`, `.footer-contact`, `.footer-contact-item`, `.footer-bottom`.

- [ ] **Step 1: Écrire `src/css/components/_communaute.css`**

```css
/* ============================================
   COMMUNAUTÉ + NEWSLETTER
============================================ */
.communaute-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(32px, 6vw, 96px);
    align-items: center;
}

.communaute-text {
    margin: 24px 0 32px;
    color: var(--text-muted);
}

.newsletter-form {
    display: flex;
    gap: 10px;
    padding: 6px;
    border: 1px solid var(--line);
    border-radius: 100px;
    background: var(--surface);
}

.newsletter-form input {
    flex: 1;
    min-width: 0;
    padding: 0 18px;
    border: none;
    background: none;
    color: var(--text);
    font: inherit;
    outline: none;
}

.newsletter-form .btn {
    padding: 14px 24px;
}

.newsletter-disclaimer {
    margin-top: 12px;
    font-size: 0.8rem;
    color: var(--text-muted);
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
}

.social-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
}

.social-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 22px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    transition: border-color var(--transition), transform var(--transition);
}

.social-card:hover {
    border-color: var(--pink);
    transform: translateY(-2px);
}

.social-card svg {
    width: 26px;
    height: 26px;
    margin-bottom: 14px;
}

.social-name {
    font-weight: 700;
}

.social-handle {
    font-size: 0.85rem;
    color: var(--text-muted);
}

@media (max-width: 900px) {
    .communaute-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
    .social-grid { grid-template-columns: repeat(2, 1fr); }

    .newsletter-form {
        flex-direction: column;
        border-radius: var(--radius);
    }

    .newsletter-form input {
        padding: 14px 16px;
    }
}
```

- [ ] **Step 2: Réécrire `src/css/layout/_footer.css`**

```css
/* ============================================
   FOOTER (aussi utilisé par les pages secondaires)
============================================ */
.footer {
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.footer-main {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
    gap: 40px;
    padding: 64px 0 48px;
}

.footer-logo img {
    height: 34px;
    width: auto;
}

.footer-tagline {
    margin: 18px 0 22px;
    max-width: 280px;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.footer-socials {
    display: flex;
    gap: 14px;
}

.footer-socials a {
    color: var(--text-muted);
    transition: color var(--transition);
}

.footer-socials a:hover {
    color: var(--text);
}

.footer-socials svg {
    width: 20px;
    height: 20px;
}

.footer h4 {
    margin-bottom: 16px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--blue);
}

.footer-nav-group ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.footer-nav-group a,
.footer-contact a {
    color: var(--text-muted);
    transition: color var(--transition);
}

.footer-nav-group a:hover,
.footer-contact a:hover {
    color: var(--text);
}

.footer-contact {
    display: flex;
    flex-direction: column;
    gap: 22px;
    font-size: 0.9rem;
}

.footer-contact h4 {
    margin-bottom: 6px;
}

.footer-contact em {
    color: var(--text-muted);
}

.footer-bottom {
    display: flex;
    justify-content: center;
    padding: 24px 0;
    border-top: 1px solid var(--line);
    font-size: 0.8rem;
    color: var(--text-muted);
}

@media (max-width: 900px) {
    .footer-main { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
    .footer-main { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Vérifier dans le navigateur**

Desktop : communauté en 2 colonnes (titre + texte + formulaire pilule à gauche, 6 cartes réseaux en 3×2 à droite) ; footer 4 colonnes. Soumettre un email → alerte « Merci pour votre inscription ! ». Mobile 375 : formulaire empilé, cartes 2 colonnes, footer 1 colonne, la barre mobile ne cache pas le copyright ; `document.documentElement.scrollWidth === innerWidth` → `true`.

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/djalsite && git add src/css/components/_communaute.css src/css/layout/_footer.css && git commit -m "Style communauté, newsletter et footer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Vérification finale, pages secondaires, nettoyage

**Files:**
- Delete: `mockups/hero.html`

- [ ] **Step 1: Relancer les tests**

Run: `cd ~/Desktop/djalsite && node --test tests/`
Expected: `# pass 13`, `# fail 0`

- [ ] **Step 2: Parcours complet desktop (1440×900) et mobile (375×812 puis 320×640)**

Pour chaque largeur, faire défiler toute la page : chaque section apparaît (fondu), aucune n'est vide ou cassée. Console : aucune erreur rouge ; `document.documentElement.scrollWidth === innerWidth` → `true` aux trois largeurs.

- [ ] **Step 3: Contenu visible sans JavaScript (Review Focus 2)**

Console : `document.documentElement.classList.remove('js')` → toutes les sections `.reveal` restent visibles (aucune zone vide). Recharger ensuite.

- [ ] **Step 4: Mouvement réduit**

Émuler `prefers-reduced-motion: reduce` (DevTools > Rendering) et recharger : aucune animation d'apparition, tout est visible immédiatement.

- [ ] **Step 5: Pages secondaires**

Ouvrir `http://localhost:8000/biographie.html` et `http://localhost:8000/livredor.html` (desktop + mobile) : nav noire avec logo et bouton rose (« Billetterie » / « Retour au site »), texte lisible, footer avec copyright centré, pas de débordement horizontal. Le lien « ← Retour » ramène à l'accueil.

- [ ] **Step 6: Supprimer la maquette**

```bash
cd ~/Desktop/djalsite && rm mockups/hero.html && rmdir mockups
```

- [ ] **Step 7: Commit**

```bash
cd ~/Desktop/djalsite && git add -A && git status --short && git commit -m "Refonte landing : vérification finale et nettoyage

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Avant de committer, vérifier dans `git status --short` que seuls des fichiers du projet apparaissent. `.claude/launch.json` peut être ajouté : il sert à relancer le serveur local.
