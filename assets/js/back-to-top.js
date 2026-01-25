(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    if (scrolled > 600) btn.classList.add('is-visible');
    else btn.classList.remove('is-visible');
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();