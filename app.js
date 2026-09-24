const KEY='aura_demo_v2'; const CH=('BroadcastChannel' in window)?new BroadcastChannel('aura_demo_sync'):null;
const FALLBACK='https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80';
const SEED=[
{id:1,name:'Ivory Chanderi Kurta',cat:'Kurtas',price:3490,old:4200,tag:'Sale',stock:4,images:['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=80','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80'],sizes:['S','M','L','XL'],desc:'A softly structured kurta in breathable Chanderi-inspired fabric.',active:true,featured:true},
{id:2,name:'Terracotta Co-ord Set',cat:'Co-ords',price:5250,old:null,tag:'New',stock:12,images:['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80'],sizes:['S','M','L'],desc:'An easy two-piece silhouette designed for day-to-evening dressing.',active:true,featured:true},
{id:3,name:'Sage Linen Wrap Dress',cat:'Dresses',price:4890,old:null,tag:'',stock:8,images:['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=80'],sizes:['S','M','L','XL'],desc:'A relaxed wrap dress with a flattering waist and natural texture.',active:true},
{id:4,name:'Indigo Block-Print Dress',cat:'Dresses',price:4150,old:5200,tag:'Sale',stock:3,images:['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80'],sizes:['S','M','L'],desc:'Hand-inspired block-print character in a fluid everyday dress.',active:true},
{id:5,name:'Sand Cotton Kurta Set',cat:'Kurtas',price:3890,old:null,tag:'New',stock:15,images:['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80'],sizes:['S','M','L','XL'],desc:'Light cotton separates made for warm days.',active:true},
{id:6,name:'Ochre Silk Co-ord',cat:'Co-ords',price:6790,old:null,tag:'',stock:5,images:['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80'],sizes:['S','M','L'],desc:'A refined co-ord with a softly luminous finish.',active:true}
];
const Store={all(){try{let d=JSON.parse(localStorage.getItem(KEY));if(!Array.isArray(d)){this.save(SEED);return structuredClone(SEED)}return d}catch(e){this.save(SEED);return structuredClone(SEED)}},save(d){localStorage.setItem(KEY,JSON.stringify(d))},commit(d){this.save(d);CH&&CH.postMessage({type:'update'});dispatchEvent(new Event('aura:update'))},onChange(fn){CH&&CH.addEventListener('message',fn);addEventListener('storage',e=>e.key===KEY&&fn());addEventListener('aura:update',fn)}};
const inr=n=>'₹'+Number(n||0).toLocaleString('en-IN');
function campaigns(){try{return JSON.parse(localStorage.getItem('aura_campaigns')||'[]')}catch{return[]}}
function saveCampaigns(x){localStorage.setItem('aura_campaigns',JSON.stringify(x));CH&&CH.postMessage({type:'update'});dispatchEvent(new Event('aura:update'))}
function activeCampaign(){return campaigns().find(x=>x.active!==false)}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

const WISH_KEY='aura_wishlist_v1';
function wishlistIds(){try{const x=JSON.parse(localStorage.getItem(WISH_KEY)||'[]');return Array.isArray(x)?x.map(Number):[]}catch{return[]}}
function saveWishlist(ids){localStorage.setItem(WISH_KEY,JSON.stringify([...new Set(ids.map(Number))]));dispatchEvent(new Event('aura:wishlist'))}
function isWishlisted(id){return wishlistIds().includes(Number(id))}
function wishButton(p){const on=isWishlisted(p.id);return `<button class="wishlist-heart ${on?'on':''}" type="button" aria-label="${on?'Remove from wishlist':'Add to wishlist'}" aria-pressed="${on}" data-wishlist="${p.id}">${on?'♥':'♡'}</button>`}
function toggleWishlist(id){const n=Number(id),ids=wishlistIds();if(ids.includes(n)){saveWishlist(ids.filter(x=>x!==n));toast('Removed from wishlist')}else{saveWishlist([...ids,n]);toast('Added to wishlist')}}
function updateWishlistCount(){document.querySelectorAll('.wishlist-count').forEach(e=>e.textContent=wishlistIds().length)}
function updateWishlistButtons(){document.querySelectorAll('[data-wishlist]').forEach(b=>{const on=isWishlisted(b.dataset.wishlist);b.classList.toggle('on',on);b.textContent=on?'♥':'♡';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'Remove from wishlist':'Add to wishlist')});updateWishlistCount()}
window.toggleWishlist=toggleWishlist;

function renderWishlistPage(){
 const grid=document.getElementById('wishlistGrid'); if(!grid)return;
 const items=Store.all().filter(p=>p.active!==false&&isWishlisted(p.id));
 const count=document.getElementById('wishlistCountText');
 if(count)count.textContent=`${items.length} ${items.length===1?'piece':'pieces'} saved`;
 grid.innerHTML=items.length?items.map(p=>`<article class="card"><a href="product.html?id=${p.id}"><div class="card-img">${wishButton(p)}${p.tag?`<span class="tag ${p.tag.toLowerCase()}">${esc(p.tag)}</span>`:''}<img src="${p.images?.[0]||FALLBACK}" alt="${esc(p.name)}"></div><div class="card-info"><span class="card-cat">${esc(p.cat)}</span><h4>${esc(p.name)}</h4><div class="price"><strong>${inr(p.price)}</strong>${p.old?`<del>${inr(p.old)}</del>`:''}</div></div></a></article>`).join(''):`<div class="no-results wishlist-empty"><h3>Your wishlist is empty</h3><p>Save pieces you love and come back to them anytime.</p><a class="btn btn-solid" href="index.html#shop">Explore the collection</a></div>`;
 updateWishlistButtons();
}


if(document.getElementById('productGrid')){
 const grid=document.getElementById('productGrid'),filters=document.getElementById('filters');let active=new URLSearchParams(location.search).get('category')||'All',cart=JSON.parse(sessionStorage.getItem('aura_cart')||'[]');
 const render=()=>{const items=Store.all().filter(p=>p.active!==false),cats=['All',...new Set(items.map(p=>p.cat))],camp=activeCampaign();
  document.getElementById('promo').innerHTML=camp?`<div><span class="eyebrow" style="color:#d9c0a5">${esc(camp.label)}</span><h2>${esc(camp.title)}</h2><p>${esc(camp.text)}</p><a class="btn" style="background:var(--sand);color:var(--ink)" href="#shop">Shop the sale</a></div><div class="promo-media" style="background-image:url('${camp.image||FALLBACK}')"></div>`:'';
  filters.innerHTML=cats.map(c=>`<button class="chip ${c===active?'on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
  const list=active==='All'?items:items.filter(p=>p.cat===active);
  grid.innerHTML=list.map(p=>`<article class="card"><a href="product.html?id=${p.id}"><div class="card-img">${wishButton(p)}${p.tag?`<span class="tag ${p.tag.toLowerCase()}">${esc(p.tag)}</span>`:''}<img src="${p.images?.[0]||FALLBACK}" alt="${esc(p.name)}"></div><div class="card-info"><span class="card-cat">${esc(p.cat)}</span><h4>${esc(p.name)}</h4><div class="price"><strong>${inr(p.price)}</strong>${p.old?`<del>${inr(p.old)}</del>`:''}</div>${p.stock<=5?`<div class="stock-note">Only ${p.stock} left</div>`:''}</div></a></article>`).join('');
  updateWishlistButtons();
  filters.onclick=e=>{let b=e.target.closest('.chip');if(b){active=b.dataset.c;render()}};
 };
 render();Store.onChange(render);
}

if(document.getElementById('wishlistGrid')){renderWishlistPage()}
if(document.getElementById('hotDealsGrid')){
 const grid=document.getElementById('hotDealsGrid');
 const renderDeals=()=>{const items=Store.all().filter(p=>p.active!==false&&Number(p.old)>Number(p.price));const count=document.getElementById('dealCount');if(count)count.textContent=`${items.length} ${items.length===1?'deal':'deals'}`;grid.innerHTML=items.length?items.map(p=>`<article class="card"><a href="product.html?id=${p.id}"><div class="card-img">${wishButton(p)}<span class="tag sale">${Math.round((1-p.price/p.old)*100)}% Off</span><img src="${p.images?.[0]||FALLBACK}" alt="${esc(p.name)}"></div><div class="card-info"><span class="card-cat">${esc(p.cat)}</span><h4>${esc(p.name)}</h4><div class="price"><strong>${inr(p.price)}</strong><del>${inr(p.old)}</del></div></div></a></article>`).join(''):`<div class="no-results"><h3>No hot deals right now</h3><p>Check back soon for special prices.</p><a class="btn btn-solid" href="index.html#shop">Shop all pieces</a></div>`;updateWishlistButtons()};renderDeals();Store.onChange(renderDeals)}

function cartApi(){
 let cart=JSON.parse(sessionStorage.getItem('aura_cart')||'[]');
 const save=()=>{sessionStorage.setItem('aura_cart',JSON.stringify(cart));document.querySelectorAll('#cartCount').forEach(e=>e.textContent=cart.reduce((s,x)=>s+x.q,0));};
 window.addToCart=(id,qty=1,size='')=>{const p=Store.all().find(x=>x.id==id);if(!p)return;let x=cart.find(i=>i.id==id&&i.size===size);x?x.q+=qty:cart.push({...p,q:qty,size});save();toast('Added to bag')};
 window.removeCart=(id,size)=>{cart=cart.filter(x=>!(x.id==id&&x.size===size));save();drawCart()};
 window.changeQty=(id,size,d)=>{let x=cart.find(i=>i.id==id&&i.size===size);if(x){x.q+=d;if(x.q<1)removeCart(id,size)}save();drawCart()};
 window.drawCart=()=>{const body=document.getElementById('cartBody');if(!body)return;body.innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><img src="${x.images?.[0]||FALLBACK}"><div><h4>${esc(x.name)}</h4><small>${x.size?'Size '+esc(x.size)+' · ':''}${inr(x.price)}</small><div class="qty-row"><div class="qty-control"><button onclick="changeQty(${x.id},'${esc(x.size)}',-1)">−</button><span>${x.q}</span><button onclick="changeQty(${x.id},'${esc(x.size)}',1)">+</button></div></div></div></div>`).join(''):'<p class="empty">Your bag is empty.</p>';document.getElementById('cartTotal').textContent=inr(cart.reduce((s,x)=>s+x.price*x.q,0))};
 window.openCart=()=>{document.getElementById('cart')?.classList.add('on');document.getElementById('overlay')?.classList.add('on');drawCart()};
 document.getElementById('cartBtn')?.addEventListener('click',openCart);document.getElementById('closeCart')?.addEventListener('click',()=>{document.getElementById('cart').classList.remove('on');document.getElementById('overlay').classList.remove('on')});document.getElementById('overlay')?.addEventListener('click',()=>{document.getElementById('cart').classList.remove('on');document.getElementById('overlay').classList.remove('on')});save();
}
function toast(m){const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1800)}
cartApi();

// WhatsApp checkout: collect customer details, build the order message,
// and send it to the store without changing the existing UI styling.
const STORE_WHATSAPP='919800000000';
function getCartItems(){try{const x=JSON.parse(sessionStorage.getItem('aura_cart')||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function openCheckout(){
 const items=getCartItems();
 if(!items.length){toast('Your bag is empty');return}
 const modal=document.getElementById('checkoutModal');
 if(modal){modal.classList.add('on');document.getElementById('customerName')?.focus()}
}
function closeCheckout(){document.getElementById('checkoutModal')?.classList.remove('on')}
function sendWhatsAppOrder(){
 const items=getCartItems();
 if(!items.length){toast('Your bag is empty');closeCheckout();return}
 const name=document.getElementById('customerName')?.value.trim()||'';
 const phone=(document.getElementById('customerPhone')?.value||'').replace(/\D/g,'');
 const address=document.getElementById('customerAddress')?.value.trim()||'';
 const city=document.getElementById('customerCity')?.value.trim()||'';
 const state=document.getElementById('customerState')?.value.trim()||'';
 const pin=(document.getElementById('customerPin')?.value||'').replace(/\D/g,'');
 if(!name||phone.length!==10||!address||!city||!state||pin.length!==6){toast('Please complete all required details');return}
 const total=items.reduce((sum,x)=>sum+Number(x.price||0)*Number(x.q||0),0);
 const lines=[
  'Hello AURA 👋',
  '',
  'I would like to place an order.',
  '',
  '*Customer Details*',
  `Name: ${name}`,
  `Phone: +91 ${phone}`,
  `Address: ${address}`,
  `City: ${city}`,
  `State: ${state}`,
  `PIN: ${pin}`,
  '',
  '*Order Details*',
  ...items.map((x,i)=>`${i+1}. ${x.name}${x.size?` | Size: ${x.size}`:''} | Qty: ${x.q} | ${inr(Number(x.price||0)*Number(x.q||0))}`),
  '',
  `*Total: ${inr(total)}*`,
  '',
  'Please confirm availability and payment/delivery details.'
 ];
 const url=`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
 const win=window.open(url,'_blank');
 if(win){
   sessionStorage.removeItem('aura_cart');
   document.querySelectorAll('#cartCount').forEach(e=>e.textContent='0');
   closeCheckout();
   document.getElementById('cart')?.classList.remove('on');
   document.getElementById('overlay')?.classList.remove('on');
   toast('Order message prepared');
 }else{
   toast('Please allow pop-ups to open WhatsApp');
 }
}
document.getElementById('checkoutBtn')?.addEventListener('click',openCheckout);
document.getElementById('checkoutClose')?.addEventListener('click',closeCheckout);
document.getElementById('whatsappCheckout')?.addEventListener('click',sendWhatsAppOrder);
document.getElementById('checkoutModal')?.addEventListener('click',e=>{if(e.target.id==='checkoutModal')closeCheckout()});

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCheckout()});

if(document.getElementById('detailRoot')){
 const id=new URLSearchParams(location.search).get('id'),p=Store.all().find(x=>x.id==id)||Store.all()[0];let selected=0,size=p.sizes?.[0]||'';
 const draw=()=>{document.getElementById('detailRoot').innerHTML=`<div class="gallery-main"><img id="mainImg" src="${p.images[selected]||FALLBACK}"></div><div class="thumbs">${(p.images||[]).map((im,i)=>`<button class="${i===selected?'active':''}" onclick="window.selImg(${i})"><img src="${im}"></button>`).join('')}</div>`;document.getElementById('infoRoot').innerHTML=`${p.tag?`<span class="eyebrow">${esc(p.tag)}</span>`:''}<div class="detail-title-row"><h1>${esc(p.name)}</h1>${wishButton(p)}</div><div class="detail-price">${inr(p.price)} ${p.old?`<span class="detail-old">${inr(p.old)}</span>`:''}</div><p class="detail-desc">${esc(p.desc||'A thoughtfully designed piece made for everyday wear.')}</p><div class="stock">${p.stock<=5?'Only '+p.stock+' pieces left — order soon.':p.stock+' pieces available.'}</div><label>Size</label><div class="size-grid">${(p.sizes||[]).map(s=>`<button class="size-btn ${s===size?'active':''}" onclick="window.selSize('${s}')">${s}</button>`).join('')}</div><div class="qty-row"><div class="qty-control"><button onclick="window.dec()">−</button><span id="dq">1</span><button onclick="window.inc()">+</button></div><button class="btn btn-solid" onclick="addToCart(${p.id},+document.getElementById('dq').textContent,'${size}')">Add to Bag</button></div><div class="related"><h3>Why you'll love it</h3><p class="detail-desc">Multiple views, clear pricing, stock visibility and size selection give customers the information they need before buying.</p></div>`};
 window.selImg=i=>{selected=i;draw()};window.selSize=s=>{size=s;draw()};let q=1;window.inc=()=>{q++;document.getElementById('dq').textContent=q};window.dec=()=>{q=Math.max(1,q-1);document.getElementById('dq').textContent=q};draw();
}


// Wishlist interactions are local to this browser and persist across pages.
updateWishlistCount();
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-wishlist]');
 if(b){e.preventDefault();e.stopPropagation();toggleWishlist(b.dataset.wishlist);updateWishlistButtons();if(document.getElementById('wishlistGrid'))renderWishlistPage();}
 const menu=e.target.closest('#menuBtn');
 if(menu){document.getElementById('mobileMenu')?.classList.add('on');document.getElementById('overlay')?.classList.add('on')}
 if(e.target.closest('#closeMenu')){document.getElementById('mobileMenu')?.classList.remove('on');document.getElementById('overlay')?.classList.remove('on')}
 const cat=e.target.closest('[data-category-toggle]');
 if(cat){document.getElementById('categoryPanel')?.classList.toggle('on')}
 const mt=e.target.closest('.mobile-category-toggle');
 if(mt){const list=mt.nextElementSibling;list?.classList.toggle('on');const s=mt.querySelector('span');if(s)s.textContent=list?.classList.contains('on')?'−':'+'}
 const catItem=e.target.closest('[data-category]');
 if(catItem){
   const category=catItem.dataset.category;
   if(category){
     e.preventDefault();
     const panel=document.getElementById('categoryPanel');
     panel?.classList.remove('on');
     document.getElementById('mobileMenu')?.classList.remove('on');
     document.getElementById('overlay')?.classList.remove('on');
     if(document.getElementById('productGrid')){
       const chip=[...document.querySelectorAll('.chip')].find(x=>x.dataset.c===category);
       chip?.click();
       document.getElementById('shop')?.scrollIntoView({behavior:'smooth'});
     }else if(category==='All'){
       location.href='index.html#shop';
     }else{
       location.href='index.html?category='+encodeURIComponent(category)+'#shop';
     }
   }
 }
});
addEventListener('storage',e=>{if(e.key===WISH_KEY){updateWishlistButtons();if(document.getElementById('wishlistGrid'))renderWishlistPage()}});
addEventListener('aura:wishlist',()=>{updateWishlistButtons();if(document.getElementById('wishlistGrid'))renderWishlistPage()});
