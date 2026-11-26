/* Shared behaviour for every page: reading progress, reveal-on-scroll, theme toggle. */
(function () {
  document.documentElement.classList.add('js');
  // Reading progress bar (top of the header)
  var prog = document.getElementById('prog');
  function onScroll() {
    if (!prog) return;
    var h = document.documentElement, max = h.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Reveal cards and sections as they scroll in
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Light / dark toggle (remembered per browser)
  var root = document.documentElement, btn = document.getElementById('theme');
  function apply(t) {
    if (t) root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    if (btn) btn.textContent = (t === 'light' ? 'Dark' : (t === 'dark' ? 'Auto' : 'Light')) + ' mode';
  }
  var saved = null; try { saved = localStorage.getItem('theme'); } catch (e) {}
  apply(saved);
  if (btn) btn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme'), next = cur === 'light' ? 'dark' : (cur === 'dark' ? null : 'light');
    apply(next);
    try { next ? localStorage.setItem('theme', next) : localStorage.removeItem('theme'); } catch (e) {}
  });
})();
