
(function(){
  // A robust tooltip engine:
  // - Moves the tooltip card to <body> while active (avoids clipping & hover-loss)
  // - Positions near pointer with RAF throttling (no lag)
  // - Keeps tooltip open when pointer is over the tooltip itself
  // - Clamps to viewport and flips as needed
  const PAD = 12;
  const OFFSET = 18;

  let activeWrap = null;
  let activeTip = null;
  let tipHome = null; // {parent, nextSibling}
  let rafId = null;
  let lastX = 0, lastY = 0;
  let closeTimer = null;

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function measureTip(tip){
    tip.style.display = 'block';
    tip.style.left = '-9999px';
    tip.style.top = '-9999px';
    tip.style.maxWidth = 'min(380px, 90vw)';
    return tip.getBoundingClientRect();
  }

  function placeNow(x, y){
    if(!activeTip) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const r = measureTip(activeTip);

    let left = x + OFFSET;
    let top  = y + OFFSET;

    if(left + r.width > vw - PAD) left = x - r.width - OFFSET;
    if(top + r.height > vh - PAD) top  = y - r.height - OFFSET;

    left = clamp(left, PAD, vw - r.width - PAD);
    top  = clamp(top, PAD, vh - r.height - PAD);

    activeTip.style.left = left + 'px';
    activeTip.style.top  = top + 'px';
  }

  function requestPlace(){
    if(rafId) return;
    rafId = requestAnimationFrame(()=>{
      rafId = null;
      placeNow(lastX, lastY);
    });
  }

  function openFor(wrap, x, y){
    if(activeWrap === wrap) return;

    close();

    const tip = wrap.querySelector('.pm-tip-card');
    if(!tip) return;

    activeWrap = wrap;
    activeTip = tip;

    // Remember home position then move into body so it doesn't get clipped and doesn't affect hover area
    tipHome = { parent: tip.parentNode, next: tip.nextSibling };
    tip.classList.add('pm-floating');
    document.body.appendChild(tip);

    // Position + show
    lastX = x; lastY = y;
    placeNow(x, y);
  }

  function close(){
    if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
    if(!activeTip) { activeWrap = null; return; }

    // Move tip back to its original place
    const tip = activeTip;
    tip.classList.remove('pm-floating');
    tip.style.left = '-9999px';
    tip.style.top  = '-9999px';
    tip.style.display = '';

    if(tipHome && tipHome.parent){
      if(tipHome.next) tipHome.parent.insertBefore(tip, tipHome.next);
      else tipHome.parent.appendChild(tip);
    }

    activeTip = null;
    activeWrap = null;
    tipHome = null;
  }

  function pointerInTip(x, y){
    if(!activeTip) return false;
    const r = activeTip.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function scheduleClose(x, y){
    if(closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(()=>{
      // If pointer is over tooltip, keep open
      if(pointerInTip(x, y)) return;
      close();
    }, 120);
  }

  function init(){
    // Base styles if missing
    document.querySelectorAll('.pm-tip').forEach(w=>{
      if(!w.hasAttribute('tabindex')) w.setAttribute('tabindex','0');
    });

    // Use pointer events (best cross-device)
    document.addEventListener('pointerover', (e)=>{
      const wrap = e.target.closest('.pm-tip');
      if(!wrap) return;
      if(!wrap.querySelector('.pm-tip-card')) return;
      openFor(wrap, e.clientX, e.clientY);
    }, true);

    document.addEventListener('pointermove', (e)=>{
      if(!activeTip) return;
      lastX = e.clientX; lastY = e.clientY;
      requestPlace();
    }, {passive:true});

    document.addEventListener('pointerout', (e)=>{
      const fromWrap = e.target.closest('.pm-tip');
      if(!fromWrap) return;

      // When leaving the image area, don't close immediately—allow moving into the tooltip
      scheduleClose(e.clientX, e.clientY);
    }, true);

    // Keep open while hovering tooltip itself
    document.addEventListener('pointerover', (e)=>{
      if(!activeTip) return;
      if(e.target.closest('.pm-tip-card')){
        if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
      }
    }, true);
    document.addEventListener('pointerout', (e)=>{
      if(!activeTip) return;
      if(e.target.closest('.pm-tip-card')){
        scheduleClose(e.clientX, e.clientY);
      }
    }, true);

    // Close on scroll / resize to avoid "stuck" states
    window.addEventListener('scroll', ()=>close(), {passive:true});
    window.addEventListener('resize', ()=>close());

    // Mobile tap: toggle
    document.addEventListener('click', (e)=>{
      const wrap = e.target.closest('.pm-tip');
      if(!wrap) return;
      // If already open for this wrap, keep open; otherwise open at center of element
      if(activeWrap === wrap) return;
      const rect = wrap.getBoundingClientRect();
      openFor(wrap, rect.left + rect.width/2, rect.top + rect.height/2);
    });
    // Tap outside closes
    document.addEventListener('click', (e)=>{
      if(e.target.closest('.pm-tip') || e.target.closest('.pm-tip-card')) return;
      close();
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
