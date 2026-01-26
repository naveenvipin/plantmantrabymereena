
(function(){
  function shouldSkip(img){
    const cls = (img.getAttribute('class') || '');
    if (cls.includes('brand-logo')) return true;
    const src = (img.getAttribute('src') || '').toLowerCase();
    if (!src) return true;
    if (src.includes('logo-watermark')) return true;
    if (src.endsWith('logo.jpg') || src.endsWith('logo.png')) return true;
    if (src.endsWith('.svg')) return true;
    // Don't double-watermark tooltip images (handled inside .pm-tip)
    if (img.closest('.pm-tip')) return true;
    // Skip instagram embeds (they are iframes created later)
    if (img.closest('.instagram-media')) return true;
    return false;
  }

  function wrapImage(img){
    if (shouldSkip(img)) return;

    // If already wrapped
    if (img.parentElement && img.parentElement.classList && img.parentElement.classList.contains('pm-img-wrap')) return;

    const wrap = document.createElement('span');
    wrap.className = 'pm-img-wrap';
    wrap.setAttribute('aria-hidden','true');
    // block wrapper works for most layouts; keeps responsive width
    wrap.style.position = 'relative';
    wrap.style.display = 'block';
    wrap.style.lineHeight = '0';

    const parent = img.parentNode;
    parent.insertBefore(wrap, img);
    wrap.appendChild(img);

    const overlay = document.createElement('span');
    overlay.className = 'pm-wm-overlay';
    overlay.setAttribute('aria-hidden','true');
    wrap.appendChild(overlay);
  }

  function init(){
    document.querySelectorAll('img').forEach(wrapImage);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
