
(function(){
  // Normalize a pathname: remove trailing slash, treat '/' as '/index.html'
  const normalizePath = (p) => {
    if (!p) return '/index.html';
    let path = p.split('?')[0].split('#')[0];
    if (path.endsWith('/')) path = path.slice(0, -1);
    if (path === '') path = '/index.html';
    if (path === '/') path = '/index.html';
    return path;
  };

  const currentPath = normalizePath(window.location.pathname);

  document.querySelectorAll('.site-header nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Resolve relative href to an absolute URL, then compare pathname
    const resolved = new URL(href, window.location.href);
    const targetPath = normalizePath(resolved.pathname);

    if (targetPath === currentPath) {
      link.classList.add('nav-current');
      link.removeAttribute('href'); // make it not clickable
      link.setAttribute('aria-current', 'page');
    }
  });
})();
