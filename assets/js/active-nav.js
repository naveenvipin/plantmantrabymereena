
(function(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.site-header nav a');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const target = href.split('/').pop();
    if (target === path) {
      link.classList.add('nav-current');
      link.removeAttribute('href');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
