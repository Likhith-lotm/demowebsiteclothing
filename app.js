const KEY='aura_demo_v2';
const CH=('BroadcastChannel' in window)?new BroadcastChannel('aura_demo_sync'):null;
const FALLBACK='https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80';
const STORE_WHATSAPP='917569089592'; // Demo store WhatsApp number. Change this for the real store.
const SEED=[
{id:1,name:'Ivory Chanderi Kurta',cat:'Kurtas',price:3490,old:4200,tag:'Sale',stock:4,images:['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=80','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80'],sizes:['S','M','L','XL'],desc:'A softly structured kurta in breathable Chanderi-inspired fabric.',active:true,featured:true,hotDeal:true},
{id:2,name:'Terracotta Co-ord Set',cat:'Co-ords',price:5250,old:null,tag:'New',stock:12,images:['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80'],sizes:['S','M','L'],desc:'An easy two-piece silhouette designed for day-to-evening dressing.',active:true,featured:true,hotDeal:false},
{id:3,name:'Sage Linen Wrap Dress',cat:'Dresses',price:4890,old:null,tag:'',stock:8,images:['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=80'],sizes:['S','M','L','XL'],desc:'A relaxed wrap dress with a flattering waist and natural texture.',active:true,hotDeal:false},
{id:4,name:'Indigo Block-Print Dress',cat:'Dresses',price:4150,old:5200,tag:'Sale',stock:3,images:['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80'],sizes:['S','M','L'],desc:'Hand-inspired block-print character in a fluid everyday dress.',active:true,hotDeal:true},
{id:5,name:'Sand Cotton Kurta Set',cat:'Kurtas',price:3890,old:null,tag:'New',stock:15,images:['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80'],sizes:['S','M','L','XL'],desc:'Light cotton separates made for warm days.',active:true,hotDeal:false},
{id:6,name:'Ochre Silk Co-ord',cat:'Co-ords',price:6790,old:null,tag:'',stock:5,images:['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80'],sizes:['S','M','L'],desc:'A refined co-ord with a softly luminous finish.',active:true,hotDeal:false}
];
const Store={all(){try{let d=JSON.parse(localStorage.getItem(KEY));if(!Array.isArray(d)){this.save(SEED);return structuredClone(SEED)}return d}catch(e){this.save(SEED);return structuredClone(SEED)}},save(d){localStorage.setItem(KEY,JSON.stringify(d))},commit(d){this.save(d);CH&&CH.postMessage({type:'update'});dispatchEvent(new Event('aura:update'))},onChange(fn){CH&&CH.addEventListener('message',fn);addEventListener('storage',e=>e.key===KEY&&fn());addEventListener('aura:update',fn)}};
const inr=n=>'₹'+Number(n||0).toLocaleString('en-IN');
function campaigns(){try{return JSON.parse(localStorage.getItem('aura_campaigns')||'[]')}catch{return[]}}
function saveCampaigns(x){localStorage.setItem('aura_campaigns',JSON.stringify(x));CH&&CH.postMessage({type:'update'});dispatchEvent(new Event('aura:update'))}
function activeCampaign(){return campaigns().find(x=>x.active!==false)}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function discountOf(p){return p.old&&p.old>p.price?Math.round((1-p.price/p.old)*100):0}
function isHotDeal(p){return p.hotDeal===true || discountOf(p)>0 || String(p.tag||'').toLowerCase()==='sale'}

function setupNavigation(){
 const menu=document.getElementById('mobileMenu'),btn=document.getElementById('menuBtn'),close=document.getElementById('closeMenu');
 const overlay=document.getElementById('overlay');
 const categoryPanel=document.getElementById('categoryPanel');
 const categoryToggle=document.querySelector('[data-category-toggle]');
 categoryToggle?.addEventListener('click',()=>categoryPanel?.classList.toggle('on'));
 document.addEventListener('click',e=>{if(categoryPanel?.classList.contains('on')&&!e.target.closest('.category-panel')&&!e.target.closest('[data-category-toggle]'))categoryPanel.classList.remove('on')});
 document.querySelector('.mobile-category-toggle')?.addEventListener('click',e=>{const group=e.currentTarget.closest('.mobile-category-group');group?.classList.toggle('on');const sign=e.currentTarget.querySelector('span');if(sign)sign.textContent=group?.classList.contains('on')?'−':'+'});
 const open=()=>{menu?.classList.add('on');overlay?.classList.add('on')};
 const shut=()=>{menu?.classList.remove('on'); if(!document.getElementById('cart')?.classList.contains('on'))overlay?.classList.remove('on')};
 btn?.addEventListener('click',open);close?.addEventListener('click',shut);
 menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut));
 document.querySelectorAll('[data-category]').forEach(el=>el.addEventListener('click',()=>{const c=el.dataset.category;location.href=`index.html?category=${encodeURIComponent(c)}#shop`}));
 document.querySelectorAll('[data-open-hot-deals]').forEach(el=>el.addEventListener('click',()=>location.href='hot-deals.html'));
}

if(document.getElementById('productGrid')){
 const grid=document.getElementById('productGrid'),filters=document.getElementById('filters');
 let params=new URLSearchParams(location.search),active=params.get('category')||'All',search='';
 const render=()=>{const items=Store.all().filter(p=>p.active!==false),cats=['All',...new Set(items.map(p=>p.cat))],camp=activeCampaign();
  if(!cats.includes(active))active='All';
  document.getElementById('promo').innerHTML=camp?`<div><span class="eyebrow" style="color:#d9c0a5">${esc(camp.label)}</span><h2>${esc(camp.title)}</h2><p>${esc(camp.text)}</p><a class="btn" style="background:var(--sand);color:var(--ink)" href="hot-deals.html">Shop the sale</a></div><div class="promo-media" style="background-image:url('${camp.image||FALLBACK}')"></div>`:'';
  filters.innerHTML=cats.map(c=>`<button class="chip ${c===active?'on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
  const list=items.filter(p=>(active==='All'||p.cat===active)&&(!search||`${p.name} ${p.cat} ${p.desc||''}`.toLowerCase().includes(search.toLowerCase())));
  document.getElementById('searchCount').textContent=`${list.length} piece${list.length===1?'':'s'}`;
  grid.innerHTML=list.length?list.map(p=>`<article class="card"><a href="product.html?id=${p.id}"><div class="card-img">${p.tag?`<span class="tag ${p.tag.toLowerCase()}">${esc(p.tag)}</span>`:''}<img src="${p.images?.[0]||FALLBACK}" alt="${esc(p.name)}"></div><div class="card-info"><span class="card-cat">${esc(p.cat)}</span><h4>${esc(p.name)}</h4><div class="price"><strong>${inr(p.price)}</strong>${p.old?`<del>${inr(p.old)}</del>`:''}</div>${p.stock<=5?`<div class="stock-note">Only ${p.stock} left</div>`:''}</div></a></article>`).join(''):`<div class="no-results"><h3>No pieces found</h3><p>Try another category or search term.</p><button class="btn btn-solid" id="clearFilters">View all pieces</button></div>`;
  filters.onclick=e=>{let b=e.target.closest('.chip');if(b){active=b.dataset.c;search='';const input=document.getElementById('productSearch');if(input)input.value='';history.replaceState({},'',`index.html${active==='All'?'':`?category=${encodeURIComponent(active)}`}#shop`);render()}};
  document.getElementById('clearFilters')?.addEventListener('click',()=>{active='All';search='';history.replaceState({},'', 'index.html#shop');render()});
 };
 const input=document.getElementById('productSearch'),clear=document.getElementById('clearSearch');
 input?.addEventListener('input',()=>{search=input.value.trim();render()});
 clear?.addEventListener('click',()=>{search='';if(input)input.value='';render();input?.focus()});
 render();Store.onChange(render);
}

if(document.getElementById('hotDealsGrid')){
 const grid=document.getElementById('hotDealsGrid');
 const renderDeals=()=>{const items=Store.all().filter(p=>p.active!==false&&isHotDeal(p));
  document.getElementById('dealCount').textContent=`${items.length} discounted piece${items.length===1?'':'s'}`;
  grid.innerHTML=items.length?items.map(p=>{const d=discountOf(p);return `<article class="card"><a href="product.html?id=${p.id}"><div class="card-img"><span class="tag sale">${d?`-${d}% OFF`:'HOT DEAL'}</span><img src="${p.images?.[0]||FALLBACK}" alt="${esc(p.name)}"></div><div class="card-info"><span class="card-cat">${esc(p.cat)}</span><h4>${esc(p.name)}</h4><div class="price"><strong>${inr(p.price)}</strong>${p.old?`<del>${inr(p.old)}</del>`:''}</div>${d?`<div class="stock-note">Save ${inr(p.old-p.price)}</div>`:''}</div></a></article>`}).join(''):`<div class="no-results"><h3>No hot deals right now</h3><p>Check back soon for the next sale.</p><a class="btn btn-solid" href="index.html#shop">Shop the collection</a></div>`;
 };
 renderDeals();Store.onChange(renderDeals);
}

function cartApi(){
 let cart=JSON.parse(sessionStorage.getItem('aura_cart')||'[]');
 const save=()=>{sessionStorage.setItem('aura_cart',JSON.stringify(cart));document.querySelectorAll('#cartCount').forEach(e=>e.textContent=cart.reduce((s,x)=>s+x.q,0));};
 window.addToCart=(id,qty=1,size='')=>{const p=Store.all().find(x=>x.id==id);if(!p)return;let x=cart.find(i=>i.id==id&&i.size===size);x?x.q+=qty:cart.push({...p,q:qty,size});save();toast('Added to bag')};
 window.removeCart=(id,size)=>{cart=cart.filter(x=>!(x.id==id&&x.size===size));save();drawCart()};
 window.changeQty=(id,size,d)=>{let x=cart.find(i=>i.id==id&&i.size===size);if(x){x.q+=d;if(x.q<1)removeCart(id,size)}save();drawCart()};
 window.drawCart=()=>{const body=document.getElementById('cartBody');if(!body)return;body.innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><img src="${x.images?.[0]||FALLBACK}"><div><h4>${esc(x.name)}</h4><small>${x.size?'Size '+esc(x.size)+' · ':''}${inr(x.price)}</small><div class="qty-row"><div class="qty-control"><button onclick="changeQty(${x.id},'${esc(x.size)}',-1)">−</button><span>${x.q}</span><button onclick="changeQty(${x.id},'${esc(x.size)}',1)">+</button></div></div></div></div>`).join(''):'<p class="empty">Your bag is empty.</p>';document.getElementById('cartTotal').textContent=inr(cart.reduce((s,x)=>s+x.price*x.q,0))};
 window.openCart=()=>{document.getElementById('cart')?.classList.add('on');document.getElementById('overlay')?.classList.add('on');drawCart()};
 document.getElementById('cartBtn')?.addEventListener('click',openCart);
 document.getElementById('closeCart')?.addEventListener('click',()=>{document.getElementById('cart').classList.remove('on');if(!document.getElementById('mobileMenu')?.classList.contains('on'))document.getElementById('overlay').classList.remove('on')});
 document.getElementById('overlay')?.addEventListener('click',()=>{document.getElementById('cart')?.classList.remove('on');document.getElementById('mobileMenu')?.classList.remove('on');document.getElementById('overlay').classList.remove('on')});
 save();
}
function toast(m){const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1800)}
cartApi();

function checkoutApi(){
 const modal=document.getElementById('checkoutModal'),openBtn=document.getElementById('checkoutBtn'),closeBtn=document.getElementById('checkoutClose'),send=document.getElementById('whatsappCheckout');
 if(!modal||!openBtn)return;
 openBtn.addEventListener('click',()=>{const cart=JSON.parse(sessionStorage.getItem('aura_cart')||'[]');if(!cart.length){toast('Your bag is empty');return}modal.classList.add('on')});
 closeBtn?.addEventListener('click',()=>modal.classList.remove('on'));
 modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('on')});
 send?.addEventListener('click',()=>{
  const name=document.getElementById('customerName')?.value.trim(),phone=document.getElementById('customerPhone')?.value.trim(),email=document.getElementById('customerEmail')?.value.trim(),address=document.getElementById('customerAddress')?.value.trim(),city=document.getElementById('customerCity')?.value.trim(),state=document.getElementById('customerState')?.value.trim(),pin=document.getElementById('customerPin')?.value.trim();
  if(!name||!phone||!address||!city||!state||!pin){toast('Please complete all required details');return}
  if(!/^[6-9]\d{9}$/.test(phone.replace(/\D/g,''))){toast('Enter a valid 10-digit phone number');return}
  if(!/^\d{6}$/.test(pin)){toast('Enter a valid 6-digit PIN');return}
  const cart=JSON.parse(sessionStorage.getItem('aura_cart')||'[]');
  const total=cart.reduce((s,x)=>s+x.price*x.q,0);
  const lines=cart.map((x,i)=>`${i+1}. ${x.name}${x.size?` | Size: ${x.size}`:''} | Qty: ${x.q} | ${inr(x.price*x.q)}`).join('\n');
  const message=`Hello AURA 👋\n\nI would like to place an order.\n\nCUSTOMER DETAILS\nName: ${name}\nPhone: ${phone}${email?`\nEmail: ${email}`:''}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nPIN: ${pin}\n\nORDER DETAILS\n${lines}\n\nTotal: ${inr(total)}\n\nPlease confirm availability, delivery and payment details. Thank you!`;
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`,'_blank');
  modal.classList.remove('on');
 });
}
checkoutApi();
setupNavigation();

if(document.getElementById('detailRoot')){
 const id=new URLSearchParams(location.search).get('id'),p=Store.all().find(x=>x.id==id)||Store.all()[0];let selected=0,size=p.sizes?.[0]||'';
 const draw=()=>{document.getElementById('detailRoot').innerHTML=`<div class="gallery-main"><img id="mainImg" src="${p.images[selected]||FALLBACK}"></div><div class="thumbs">${(p.images||[]).map((im,i)=>`<button class="${i===selected?'active':''}" onclick="window.selImg(${i})"><img src="${im}"></button>`).join('')}</div>`;document.getElementById('infoRoot').innerHTML=`${p.tag?`<span class="eyebrow">${esc(p.tag)}</span>`:''}<h1>${esc(p.name)}</h1><div class="detail-price">${inr(p.price)} ${p.old?`<span class="detail-old">${inr(p.old)}</span>`:''}</div><p class="detail-desc">${esc(p.desc||'A thoughtfully designed piece made for everyday wear.')}</p><div class="stock">${p.stock<=5?'Only '+p.stock+' pieces left — order soon.':p.stock+' pieces available.'}</div><label>Size</label><div class="size-grid">${(p.sizes||[]).map(s=>`<button class="size-btn ${s===size?'active':''}" onclick="window.selSize('${s}')">${s}</button>`).join('')}</div><div class="qty-row"><div class="qty-control"><button onclick="window.dec()">−</button><span id="dq">1</span><button onclick="window.inc()">+</button></div><button class="btn btn-solid" onclick="addToCart(${p.id},+document.getElementById('dq').textContent,'${size}')">Add to Bag</button></div><div class="related"><h3>Why you'll love it</h3><p class="detail-desc">Multiple views, clear pricing, stock visibility and size selection give customers the information they need before buying.</p></div>`};
 window.selImg=i=>{selected=i;draw()};window.selSize=s=>{size=s;draw()};let q=1;window.inc=()=>{q++;document.getElementById('dq').textContent=q};window.dec=()=>{q=Math.max(1,q-1);document.getElementById('dq').textContent=q};draw();
}
