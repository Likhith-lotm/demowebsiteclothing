/* AURA Motion — lightweight, native-scroll reveal engine.
   No Lenis, no RAF ticker, no scroll-linked transforms. */
(function(){
  'use strict';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    '.section-head',
    '.season-card',
    '.new-arrivals-grid .card',
    '.cat-card',
    '.product-grid .card',
    '.shop-tools',
    '.filters',
    '.promo',
    '.story-img',
    '.story-text',
    '.reviews blockquote'
  ];
  let observer = null;
  let refreshQueued = false;

  function targets(){
    const all=[];
    selectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>all.push(el)));
    return [...new Set(all)];
  }

  function prepare(){
    if(reduce)return;
    targets().forEach((el,i)=>{
      if(el.dataset.auraMotionPrepared)return;
      el.dataset.auraMotionPrepared='1';
      el.classList.add('aura-motion-hidden');
      const delay=Math.min((i%4)*70,210);
      el.style.setProperty('--motion-delay',delay+'ms');
      if(observer)observer.observe(el);
    });
  }

  function refresh(){
    if(reduce)return;
    if(refreshQueued)return;
    refreshQueued=true;
    requestAnimationFrame(()=>{
      refreshQueued=false;
      prepare();
    });
  }

  if(reduce){
    window.AuraMotion={refresh:function(){}};
    return;
  }

  if('IntersectionObserver' in window){
    observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add('aura-motion-visible');
        observer.unobserve(entry.target);
      });
    },{root:null,rootMargin:'0px 0px -8% 0px',threshold:.08});
  }

  function fallback(){
    if(observer)return;
    targets().forEach(el=>el.classList.add('aura-motion-visible'));
  }

  window.AuraMotion={refresh};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{prepare();fallback()},{once:true});
  else{prepare();fallback();}
})();
