# Refonte de la landing page D'JAL — Spec

Date : 2026-10-01
Fichier concerné : `index.html` (+ CSS dans `src/css/`, JS dans `src/js/main.js`)

## Objectif

Refaire entièrement le design de la landing page, en gardant tout le contenu existant. La page doit à la fois :
- vendre des billets (tournée accessible immédiatement),
- servir de vitrine à l'artiste (spectacle, vidéos, cinéma, presse),
- fidéliser la communauté (réseaux, newsletter, livre d'or).

Seule l'image du héros (`src/assets/images/hero.jpg`, fumée rose/bleue) est conservée telle quelle.

## Direction visuelle : « Affiche de tournée »

Références Mobbin :
- Héros typographique : [Eventbrite Music](https://mobbin.com/sites/sections/eb6fc6f9-fd8f-4e1f-bcf8-550cdc575e22), [VEED](https://mobbin.com/sites/sections/2a21db01-2c58-4721-9dc6-dcd2cb53b576)
- Liste de dates : [Sana](https://mobbin.com/sites/sections/199ca363-50b6-46bd-bca0-129c0ed49114)
- Chiffres clés : [DICE](https://mobbin.com/sites/sections/43937985-b049-46f0-8adc-c0894537b24f)
- Bandeau presse : [Grain](https://mobbin.com/sites/sections/b37b6944-18e6-42d1-9233-a809699a0830)

### Tokens

| Token | Valeur | Usage |
|---|---|---|
| `--bg` | `#000` | Fond principal |
| `--bg-alt` | `#0d0d0d` | Sections alternées |
| `--pink` | `#e91e8c` | Boutons d'action (Billets, Réserver) |
| `--blue` | `#2d7dd2` | Accent secondaire (étiquettes, survols) |
| `--text` | `#fff` | Texte principal |
| `--text-muted` | `rgba(255,255,255,0.6)` | Texte secondaire (salles, sous-titres) |
| `--line` | `rgba(255,255,255,0.12)` | Séparateurs |

Le dégradé rose→bleu n'est plus utilisé partout : uniquement en touche ponctuelle (ex. soulignement du héros).

### Typographie

- Titres : **Anton** (Google Fonts), majuscules, interlignage serré (~0.95).
- Texte courant : **Inter** (déjà chargée).
- Les deux polices chargées via une seule balise Google Fonts.

### Animations

Uniquement des apparitions au scroll (fondu + léger décalage vertical) via `IntersectionObserver`. Respect de `prefers-reduced-motion` (aucune animation si activé).

## Structure de la page (ordre final)

1. **Nav** — logo à gauche, 5 liens (Spectacle, Tournée, Vidéos, Presse, Livre d'or), bouton rose « Billets » toujours visible (ancre `#tournee`). Les icônes réseaux sociaux sont retirées de la nav (elles restent dans le menu mobile et le footer). Menu burger sur mobile, comportement JS actuel conservé.
2. **Héros** — validé sur maquette (`mockups/hero.html`, jetable). `hero.jpg` est une affiche verticale qui contient déjà « D'JAL » et « En pleine conscience » : elle est affichée telle quelle, sans texte par-dessus.
   - Desktop : grille 2 colonnes (≈ 57 % / 43 %). Gauche : étiquette bleue « Tournée 2026 · N dates » (N calculé), titre Anton géant « EN PLEINE / CONSCIENCE » souligné d'un trait dégradé rose→bleu (le titre déborde légèrement sur l'affiche), sous-titre « Le nouveau spectacle de D'JAL. Toujours à cent à l'heure, toujours déjanté. », boutons « Réserver mes places » (rose, vers `#tournee`) et « Extraits » (contour, vers `#extraits`). Droite : affiche en `object-fit: cover`, fondue dans le noir à gauche et en bas.
   - Encart « Prochaine date » (jour en Anton, mois en rose, ville, salle, lien « Billets → » vers la billetterie) rempli par le JS avec la première date à venir ; masqué s'il n'y a aucune date.
   - Ligne « À ne pas rater » : générée à partir des dates `featured: true` à venir (même salle regroupée, ex. « Le Grand Rex, Paris — 30 & 31 octobre ») ; masquée s'il n'y en a pas.
   - Mobile (< 900px) : affiche en haut (≈ 78vh), contenu en dessous qui remonte sur le fondu, boutons empilés pleine largeur. Barre fixe en bas « Prochaine date : JJ mois · Ville » + bouton « Billets », **affichée uniquement une fois le héros dépassé** au scroll.
3. **Chiffres clés** (nouveau bandeau) — 3 chiffres tirés du texte existant :
   - « 20 M+ » — vues du « Portugais »
   - « 200+ » — représentations
   - « Olympia · Casino de Paris » — salles mythiques
4. **Tournée** (`#tournee`) — liste en lignes : date en Anton (« 10 » + « OCT »), ville en blanc, salle en gris, bouton rose « Billets » à droite (sous la ligne sur mobile). 6 premières dates à venir affichées, bouton « Voir toutes les dates (N) » qui déplie le reste sans recharger. Les dates passées restent filtrées (logique déjà présente). Gestion `complet` / `featured` existante conservée.
5. **Le spectacle** (`#spectacle`) — texte actuel à gauche (intro, histoire, pitch « En Pleine Conscience », mention « En accord avec La Tiny Team & Heb »), portrait `djal-portrait.png` à droite, lien « Lire la biographie complète ».
6. **Sur scène** (`#extraits`) — les reels Instagram existants en carrousel horizontal glissable (scroll-snap), flèches précédent/suivant sur desktop.
7. **Les classiques** (`#videos`) — les vidéos YouTube existantes en grille (2 colonnes desktop, 1 mobile).
8. **Filmographie** (`#cinema`) — les 3 bandes-annonces YouTube existantes en cartes vidéo (3 colonnes desktop, 1 mobile). Pas de titres de films ajoutés (non disponibles).
9. **Presse** (`#presse`) — bandeau noir plein, titre « ILS PARLENT DE LUI », la vidéo d'interview existante en grand. Aucune citation ni logo inventé.
10. **Livre d'or** (`#livredor`) — les messages existants en cartes (guillemets décoratifs, prénom et date), lien « Voir plus de messages » vers `livredor.html`.
11. **Communauté** (`#communaute`, fusion des sections « Rejoins la communauté » et « Restons connectés ») — titre, texte, 6 cartes réseaux (Instagram, TikTok, YouTube, Facebook, X, Snapchat) en grille compacte, puis le formulaire newsletter (`#newsletter-form`, comportement JS actuel inchangé).
12. **Footer** — logo, liens réseaux, mentions existantes.

## Approche technique

- On garde l'architecture : `index.html`, un fichier CSS par section dans `src/css/components/`, `src/js/main.js`.
- Réécriture du HTML de `index.html` (structure ci-dessus) et du CSS de chaque composant.
- `_variables.css` : remplacé par les nouveaux tokens.
- Nouveau fichier `src/css/components/_stats.css` pour le bandeau chiffres clés. `_contact.css` et `_instagram.css` fusionnés dans `_communaute.css` si les classes ne sont plus utilisées.
- `main.js` : ajout (1) de l'encart « Prochaine date », de la ligne « À ne pas rater » et du compteur « N dates », (2) de la barre fixe mobile (affichée après le héros), (3) du bouton « Voir toutes les dates », (4) des apparitions au scroll. Les données `tourDates` ne changent pas. Le reste du JS (nav, menu mobile, smooth scroll, newsletter) est conservé.
- **Pages secondaires** : `biographie.html` et `livredor.html` partagent `main.css`, la nav (`.nav-wrapper`) et le footer (`.footer`). Les classes de nav et de footer sont conservées pour qu'elles héritent du nouveau style sans modification de leur HTML. Leur contenu n'est pas modifié ; on vérifie seulement qu'elles s'affichent correctement.

## Hors périmètre

- Brancher la newsletter sur un vrai service (aujourd'hui le formulaire est seulement intercepté en JS).
- Ajouter des citations presse, logos médias ou titres de films (contenu à fournir par Alex).
- Refaire le design de `biographie.html` et `livredor.html`.

## Vérification

- Rendu desktop (1440px) et mobile (375px) dans le navigateur intégré, section par section.
- Pas de scroll horizontal sur mobile.
- Clic sur un bouton « Billets » : ouvre le bon lien billetterie dans un nouvel onglet.
- « Voir toutes les dates » affiche bien toutes les dates à venir ; aucune date passée affichée.
- Encart « Prochaine date » = première date à venir de `tourDates`.
- Menu mobile s'ouvre / se ferme.
- `biographie.html` et `livredor.html` s'affichent sans casse (nav, footer).
- Aucune erreur dans la console.
