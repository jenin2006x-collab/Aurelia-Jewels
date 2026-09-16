(function(){
  const FALLBACK_MAP = {
    Necklaces: '/images/categories/necklaces.jpg',
    'Necklace Sets': '/images/categories/necklace_sets.jpg',
    Chains: '/images/categories/chains.jpg',
    Pendants: '/images/categories/pendants.jpg',
    Earrings: '/images/categories/earrings.jpg',
    Rings: '/images/categories/rings.jpg',
    Bangles: '/images/categories/bangles.jpg',
    Bracelets: '/images/categories/bracelets.jpg'
  };
  function fallbackImg(cat) {
    return FALLBACK_MAP[cat] || '/images/categories/necklaces.jpg';
  }
  function productImg(p) {
    return (p && (p.image || p.img || (Array.isArray(p.images) && p.images[0]))) || fallbackImg(p && p.category);
  }
  function fmt(n){return '₹'+Number(n||0).toLocaleString('en-IN')}
  function toast(msg,type='ok'){let x=document.getElementById('toast');if(!x){x=document.createElement('div');x.id='toast';document.body.appendChild(x)}x.textContent=msg;x.dataset.type=type;x.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.classList.remove('show'),2600)}
  function stars(r){return '★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r))}
  function refresh(){document.querySelectorAll('.cart-count').forEach(e=>e.textContent=Cart.getItems().reduce((s,i)=>s+i.qty,0));document.querySelectorAll('.wishlist-count').forEach(e=>e.textContent=Cart.wishlist().length);renderDrawer();document.querySelectorAll('[data-wish-id]').forEach(b=>b.textContent=Cart.isWishlisted(b.dataset.wishId)?'♥':'♡')}
  function renderDrawer(){
    const el=document.getElementById('cartItems');
    if(el){
      const a=Cart.getItems();
      el.innerHTML=a.length?a.map(i=>`<div class="drawer-item"><img class="drawer-thumb" src="${productImg(i)}" alt="${i.name}" loading="lazy"><div><b>${i.name}</b><small>${fmt(i.price)} × ${i.qty}</small><div class="mini-actions"><button onclick="Cart.updateQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="Cart.updateQty(${i.id},1)">+</button><button onclick="Cart.remove(${i.id})">Remove</button></div></div></div>`).join(''):'<div class="empty-state">Your bag is waiting for a little sparkle.</div>';
      const t=Cart.getTotals();
      ['cartSubtotal','cartDiscount','cartShipping','cartTotal'].forEach((id,j)=>{const n=document.getElementById(id);if(n)n.textContent=fmt([t.subtotal,t.discount,t.shipping,t.total][j])})
    }
    const w=document.getElementById('wishlistItems');
    if(w){
      const a=Cart.wishlist().map(id=>AureliaData.getProductById(id)).filter(Boolean);
      w.innerHTML=a.length?a.map(i=>`<div class="drawer-item"><img class="drawer-thumb" src="${productImg(i)}" alt="${i.name}" loading="lazy"><div><b>${i.name}</b><small>${fmt(i.price)}</small><button class="text-btn" onclick="Cart.add(${i.id});UI.toast('Added to bag')">Add to bag</button></div></div>`).join(''):'<div class="empty-state">No saved favourites yet.</div>';
    }
  }
  window.UI={
    formatPrice:fmt,
    starsHTML:stars,
    toast,
    showToast:toast,
    refresh,
    fallbackImg,
    productCardHTML:p=>`<article class="product-card"><div class="product-media"><a href="product-detail.html?id=${p.id}" class="product-media-link" aria-label="${p.name}"><img class="product-card-image" src="${productImg(p)}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImg(p.category)}'"> </a><span class="badge">${p.badge||''}</span><button class="wish-btn" data-wish-id="${p.id}" onclick="event.preventDefault();Cart.toggleWishlist(${p.id});UI.toast('Wishlist updated')">${Cart.isWishlisted(p.id)?'♥':'♡'}</button></div><div class="product-info"><span class="eyebrow">${p.category}</span><h3><a href="product-detail.html?id=${p.id}">${p.name}</a></h3><div class="rating">${stars(p.rating)} <small>(${p.reviewCount})</small></div><div><strong>${fmt(p.price)}</strong> <del>${fmt(p.oldPrice)}</del> <em>${p.discount}% OFF</em></div><button class="add-btn" onclick="Cart.add(${p.id});UI.toast('Added to shopping bag')">ADD TO BAG</button></div></article>`,
    openDrawer(id){document.getElementById(id)?.classList.add('open');document.getElementById('drawerOverlay')?.classList.add('open')},
    openCartDrawer(){this.openDrawer('cartDrawer')},
    closeDrawers(){
      document.querySelectorAll('.drawer,.drawer-overlay,.filters').forEach(e=>e.classList.remove('open'));
      document.querySelector('.catalog-layout')?.classList.remove('filters-open');
      document.getElementById('openFilters')?.classList.remove('active');
      document.getElementById('openFilters')?.setAttribute('aria-expanded','false');
      if(typeof window.setAureliaFiltersOpen==='function')window.setAureliaFiltersOpen(false);
    }
  };
  document.addEventListener('DOMContentLoaded',()=>{
    refresh();
    document.getElementById('drawerOverlay')?.addEventListener('click',UI.closeDrawers);
    document.getElementById('cartBtn')?.addEventListener('click',()=>UI.openDrawer('cartDrawer'));
    document.getElementById('wishlistBtn')?.addEventListener('click',()=>UI.openDrawer('wishlistDrawer'));
    document.getElementById('closeCart')?.addEventListener('click',UI.closeDrawers);
    document.getElementById('closeWishlist')?.addEventListener('click',UI.closeDrawers);
    document.getElementById('drawerApplyCoupon')?.addEventListener('click',()=>{
      try{Cart.applyCoupon(document.getElementById('drawerCouponInput').value);toast('Promo applied')}catch(e){toast(e.message,'error')}
    });
  });
})();
