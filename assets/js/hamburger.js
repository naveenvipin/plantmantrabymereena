
(function(){
  function init(){
    const header = document.querySelector('.site-header');
    const btn = document.querySelector('.nav-toggle');
    if(!header || !btn) return;

    btn.addEventListener('click', ()=>{
      const open = header.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (e)=>{
      if(e.target.closest('.site-header')) return;
      header.classList.remove('nav-open');
      btn.setAttribute('aria-expanded','false');
    });

    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 980){
        header.classList.remove('nav-open');
        btn.setAttribute('aria-expanded','false');
      }
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
