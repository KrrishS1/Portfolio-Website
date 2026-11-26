/* Shared behaviour: reading progress, reveal on scroll, card spotlight, copy buttons. */
{
  const root = document.documentElement;
  root.classList.add('js');

  // Reading progress (hairline under the header)
  const prog = document.getElementById('prog');
  const onScroll = () => {
    if (!prog) return;
    const max = root.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Reveal on scroll
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('in'));
  }

  // Card spotlight follows the pointer
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Copy buttons: <button data-copy="text">
  document.querySelectorAll('[data-copy]').forEach(b => {
    const label = b.textContent;
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied'; }
      catch (e) { b.textContent = 'Press Ctrl+C'; }
      setTimeout(() => { b.textContent = label; }, 1600);
    });
  });
}
