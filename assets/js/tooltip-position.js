
(function(){
  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function placeNearMouse(tip, x, y){
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 12;
    const offset = 18;

    // Ensure measurable
    tip.style.left = '-9999px';
    tip.style.top = '-9999px';
    tip.style.maxWidth = 'min(380px, 90vw)';
    tip.style.opacity = '1';

    const r = tip.getBoundingClientRect();

    let left = x + offset;
    let top  = y + offset;

    if (left + r.width > vw - pad) left = x - r.width - offset;
    if (top + r.height > vh - pad) top  = y - r.height - offset;

    left = clamp(left, pad, vw - r.width - pad);
    top  = clamp(top, pad, vh - r.height - pad);

    tip.style.left = left + 'px';
    tip.style.top  = top + 'px';
    tip.style.opacity = '';
  }

  function deactivate(w){
    w.classList.remove('is-active');
    const tip = w.querySelector('.pm-tip-card');
    if(tip){
      tip.style.left = '-9999px';
      tip.style.top  = '-9999px';
    }
  }

  function init(){
    document.querySelectorAll('.pm-tip').forEach(w=>{
      const tip = w.querySelector('.pm-tip-card');
      const img = w.querySelector('img');
      if(!tip || !img) return;

      if(!w.hasAttribute('tabindex')) w.setAttribute('tabindex','0');

      const onEnter = (e)=>{
        w.classList.add('is-active');
        placeNearMouse(tip, e.clientX, e.clientY);
      };
      const onMove = (e)=>{
        if(!w.classList.contains('is-active')) return;
        placeNearMouse(tip, e.clientX, e.clientY);
      };
      const onLeave = ()=>deactivate(w);

      // Bind directly to image so hover works anywhere on it
      img.addEventListener('mouseenter', onEnter);
      img.addEventListener('mousemove', onMove);
      img.addEventListener('mouseleave', onLeave);

      // Keyboard focus
      w.addEventListener('focusin', ()=>{
        w.classList.add('is-active');
        const rect = img.getBoundingClientRect();
        placeNearMouse(tip, rect.left + rect.width/2, rect.top + rect.height/2);
      });
      w.addEventListener('focusout', ()=>deactivate(w));

      // Mobile tap toggle
      w.addEventListener('click', (e)=>{
        if (window.matchMedia('(hover: hover)').matches) return;
        if(w.classList.contains('is-active')) deactivate(w);
        else{
          w.classList.add('is-active');
          const rect = img.getBoundingClientRect();
          placeNearMouse(tip, rect.left + rect.width/2, rect.top + rect.height/2);
        }
      });
    });

    // click outside closes on mobile
    document.addEventListener('click', (e)=>{
      if (window.matchMedia('(hover: hover)').matches) return;
      if(e.target.closest('.pm-tip')) return;
      document.querySelectorAll('.pm-tip.is-active').forEach(deactivate);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
