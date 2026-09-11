(function(){
function goHash(){const h=location.hash||'#home';if(h==='#home'||h==='#')return;
 const m=h.match(/^#products(?:\?category=(.*))?$/);if(m){location.href='products.html'+(m[1]?'?category='+encodeURIComponent(decodeURIComponent(m[1])):'');return}
 if(h==='#cart'){location.href='cart.html';return} if(h==='#orders'){location.href='orders.html';return} if(h==='#account'){location.href='account.html';return} if(h==='#admin'){location.href='admin/';return}
}
function carousel(){let i=0,slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('#dots button')];if(!slides.length)return;function show(n){i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('active',k===i));dots.forEach((d,k)=>d.classList.toggle('active',k===i));}document.getElementById('prevSlide')?.addEventListener('click',()=>show(i-1));document.getElementById('nextSlide')?.addEventListener('click',()=>show(i+1));dots.forEach((d,k)=>d.addEventListener('click',()=>show(k)));show(0);setInterval(()=>show(i+1),6000)}
function nav(){document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('nav')?.classList.toggle('open'));document.getElementById('searchBtn')?.addEventListener('click',()=>{const q=document.getElementById('searchInput')?.value.trim();if(q)location.href='products.html?q='+encodeURIComponent(q)});document.getElementById('searchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('searchBtn')?.click()});document.getElementById('accountBtn')?.addEventListener('click',()=>location.href='account.html');document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href');if(h&&h!=='#') {e.preventDefault();location.hash=h.slice(1);goHash();}}));}
function quickView(){
 let id=null,qty=1;
 window.adjustQuickViewQty=d=>{qty=Math.max(1,qty+d);const x=document.getElementById('qvQty');if(x)x.textContent=qty};
 window.addQuickViewToCart=()=>{if(id){Cart.add(id,qty);UI.toast('Added to shopping bag');document.getElementById('quickViewModal')?.classList.remove('open')}};
 document.querySelectorAll('.quick-btn').forEach(b=>b.addEventListener('click',e=>{
  e.preventDefault();
  const card=b.closest('.product-card'),a=card?.querySelector('a[href*="product-detail"]'),m=a?.href.match(/[?&]id=(\d+)/);if(!m)return;
  id=Number(m[1]);const p=AureliaData.getProductById(id);if(!p)return;
  const vals={qvImg:p.img,qvCategory:p.category,qvName:p.name,qvPrice:UI.formatPrice(p.price),qvOldPrice:UI.formatPrice(p.oldPrice),qvDiscount:p.discount+'% OFF',qvDesc:p.description};
  Object.keys(vals).forEach(x=>{const el=document.getElementById(x);if(!el)return;if(x==='qvImg')el.src=vals[x];else el.textContent=vals[x]});
  qty=1;const q=document.getElementById('qvQty');if(q)q.textContent='1';document.getElementById('quickViewModal')?.classList.add('open');
 }));
 document.querySelectorAll('.modal-close-btn').forEach(b=>b.addEventListener('click',()=>b.closest('.modal-backdrop')?.classList.remove('open')));
 document.getElementById('quickViewModal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('open')});
}
function subscribe(){document.getElementById('subscribeForm')?.addEventListener('submit',e=>{e.preventDefault();UI.toast('Thank you for subscribing!');e.target.reset()})}
document.addEventListener('DOMContentLoaded',()=>{nav();carousel();quickView();subscribe();goHash()});window.addEventListener('hashchange',goHash);window.closeAllModals=()=>document.querySelectorAll('.modal-backdrop').forEach(x=>x.classList.remove('open'));})();