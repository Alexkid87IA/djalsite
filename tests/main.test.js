const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const mainSource = fs.readFileSync(path.join(__dirname, '../src/js/main.js'), 'utf8');

// Faux DOM minimal : assez pour exécuter le début de main.js
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

test('les .reveal sont observés même si tour.js ne charge pas', () => {
    const { context, observed, htmlClasses } = makeContext({ withObserver: true });
    // Tour est absent : main.js plante, mais après avoir branché les apparitions
    assert.throws(() => vm.runInNewContext(mainSource, context));
    assert.ok(htmlClasses.has('js'));
    assert.equal(observed.length, 2);
});

test('sans IntersectionObserver, html.js n\'est pas posé (contenu visible)', () => {
    const { context, htmlClasses } = makeContext({ withObserver: false });
    try { vm.runInNewContext(mainSource, context); } catch (e) { /* Tour absent */ }
    assert.equal(htmlClasses.has('js'), false);
});
