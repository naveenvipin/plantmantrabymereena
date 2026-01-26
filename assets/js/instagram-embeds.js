
(function(){
  function process(){
    try{
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process){
        window.instgrm.Embeds.process();
      }
    }catch(e){}
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{
      // give embed.js a moment to load
      setTimeout(process, 600);
      setTimeout(process, 1600);
    });
  } else {
    setTimeout(process, 600);
    setTimeout(process, 1600);
  }
})();
