const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const commonPath = path.join(__dirname, '../src/js/common.js');

// Faux DOM minimal : assez pour exécuter le début de common.js
function makeContext({ withObserver }) {
    const observed = [];
    const htmlClasses = new Set();
    const context = {
        document: {
            documentElement: { classList: { add: c => htmlClasses.add(c) } },
            querySelectorAll: selector => (selector === '.reveal' ? [{}, {}] : []),
            getElementById: () => null,
            querySelector: () => null
        }
    };
    if (withObserver) {
        context.IntersectionObserver = class {
            observe(el) { observed.push(el); }
            unobserve() {}
        };
    }
    context.window = context;
    return { context, observed, htmlClasses };
}

function run(context) {
    // La nav n'existe pas dans le faux DOM : le script plante après les apparitions
    try { vm.runInNewContext(fs.readFileSync(commonPath, 'utf8'), context); } catch (e) { /* attendu */ }
}

test('common.js observe les .reveal avant tout code qui peut planter', () => {
    const { context, observed, htmlClasses } = makeContext({ withObserver: true });
    run(context);
    assert.ok(htmlClasses.has('js'));
    assert.equal(observed.length, 2);
});

test('sans IntersectionObserver, html.js n\'est pas posé (contenu visible)', () => {
    const { context, htmlClasses } = makeContext({ withObserver: false });
    run(context);
    assert.equal(htmlClasses.has('js'), false);
});
