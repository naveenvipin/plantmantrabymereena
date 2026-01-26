
(function(){
  const PAD = 10;
  const OFFSET = 14;

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function positionTip(w, tip, clientX, clientY){
    const rect = w.getBoundingClientRect();
    // cursor position within wrapper
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // ensure tooltip measurable
    const prevDisplay = tip.style.display;
    tip.style.display = 'block';
    tip.style.visibility = 'hidden';

    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;

    tip.style.visibility = '';
    tip.style.display = prevDisplay || '';

    // prefer bottom-right of cursor
    let left = x + OFFSET;
    let top  = y + OFFSET;

    // flip if overflow right/bottom
    if (left + tw > rect.width - PAD) left = x - tw - OFFSET;
    if (top + th > rect.height - PAD) top  = y - th - OFFSET;

    // clamp within image area
    left = clamp(left, PAD, rect.width - tw - PAD);
    top  = clamp(top, PAD, rect.height - th - PAD);

    tip.style.left = left + 'px';
    tip.style.top  = top + 'px';
  }

  function init(){
    document.querySelectorAll('.pm-tip').forEach(w=>{
      const tip = w.querySelector('.pm-tip-card');
      const img = w.querySelector('img');
      if(!tip || !img) return;

      // Ensure wrapper positioning context
      const style = window.getComputedStyle(w);
      if(style.position === 'static') w.style.position = 'relative';

      // Move events to the image so it works across the entire image area
      img.addEventListener('mouseenter', (e)=>{
        positionTip(w, tip, e.clientX, e.clientY);
      });
      img.addEventListener('mousemove', (e)=>{
        positionTip(w, tip, e.clientX, e.clientY);
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
