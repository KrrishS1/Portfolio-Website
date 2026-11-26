/* Shared behaviour for project pages: section bar highlight, image lightbox, design-evolution tabs. */
(function () {
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Section bar: highlight the section in view
  var links = $$('.sec-bar nav a');
  if (links.length) {
    var ids = links.map(function (a) { return a.getAttribute('href').slice(1); });
    var onScroll = function () {
      var cur = null, y = scrollY + 160;
      ids.forEach(function (id) { var el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
      links.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + cur ? 'true' : 'false'); });
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // Lightbox: any button with data-zoom="src" opens the image large
  var lb = document.getElementById('lb');
  if (lb) {
    var img = lb.querySelector('img'), cap = lb.querySelector('p');
    $$('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        img.src = b.getAttribute('data-zoom'); img.alt = b.getAttribute('data-cap') || '';
        cap.textContent = b.getAttribute('data-cap') || '';
        if (lb.showModal) lb.showModal();
      });
    });
    lb.querySelector('button').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  // Design-evolution stepper
  $$('.evo').forEach(function (evo) {
    var tabs = $$('.evo-tabs button', evo), panes = $$('.evo-pane', evo);
    function show(i) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', i === j ? 'true' : 'false'); t.tabIndex = i === j ? 0 : -1; });
      panes.forEach(function (p, j) { p.hidden = i !== j; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (n) { var k = (i + n + tabs.length) % tabs.length; show(k); tabs[k].focus(); }
      });
    });
    show(0);
  });
})();
