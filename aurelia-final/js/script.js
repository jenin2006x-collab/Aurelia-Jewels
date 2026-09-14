(function(){
  const state={filtered:null,shown:12};
  function card(p){return `<article class="product-card"><div class="product-media"><a href="product-detail.html?id=${p.id}"><img src="${p.img}" loading="lazy" alt="${p.name}"></a><span class="badge">${p.badge||''}</span><button class="wish-btn" data-wish-id="${p.id}" aria-label="Wishlist ${p.name}" onclick="event.preventDefault();Cart.toggleWishlist(${p.id});UI.toast('Wishlist updated')">${Cart.isWishlisted(p.id)?'♥':'♡'}</button><button class="quick-btn" data-quick-id="${p.id}">QUICK VIEW</button></div><div class="product-info"><span class="eyebrow">${p.category}</span><h3><a href="product-detail.html?id=${p.id}">${p.name}</a></h3><div class="rating">${UI.starsHTML(p.rating)} <small>(${p.reviewCount})</small></div><div><strong>${UI.formatPrice(p.price)}</strong> <del>${UI.formatPrice(p.oldPrice)}</del> <em>${p.discount}% OFF</em></div><button class="add-btn" onclick="Cart.add(${p.id});UI.toast('Added to shopping bag')">ADD TO BAG</button></div></article>`}
  function renderGrid(el,arr){if(el)el.innerHTML=arr.map(card).join('')}
  function catalog(){
    const grid=document.getElementById('productGrid'); if(!grid)return;
    const params=new URLSearchParams(location.search); const catParam=params.get('category'); const qParam=params.get('q'); const urlSort=params.get('sort');
    
    // Select initial set
    let base = AureliaData.products;
    if (catParam) {
      base = AureliaData.getProductsByCategory(catParam);
      const titleEl = document.getElementById('catalogTitle');
      if(titleEl) titleEl.textContent = catParam + ' Collection';
      const eyeEl = document.getElementById('catalogEyebrow');
      if(eyeEl) eyeEl.textContent = 'AURELIA ' + catParam.toUpperCase();
      document.title = catParam + ' Collection | Aurelia Jewels';
      
      // Auto-check the category in sidebar if present
      document.querySelectorAll('.category-filter').forEach(cb => {
        if (cb.value.toLowerCase() === catParam.toLowerCase() ||
            (catParam.toLowerCase().includes('necklace set') && cb.value.toLowerCase().includes('necklace set')) ||
            (catParam.toLowerCase().includes('cross') && cb.value.toLowerCase().includes('cross')) ||
            (catParam.toLowerCase().includes('hug') && cb.value.toLowerCase().includes('hug')) ||
            cb.value.toLowerCase().startsWith(catParam.toLowerCase())) {
          cb.checked = true;
        }
      });
      
      // Highlight active nav link
      document.querySelectorAll('.nav a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href.includes('category=' + encodeURIComponent(catParam).toLowerCase()) ||
            href.includes('category=' + catParam.toLowerCase().replace(/ /g, '+'))) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });
    } else if (qParam) {
      base = AureliaData.search(qParam);
      const titleEl = document.getElementById('catalogTitle');
      if(titleEl) titleEl.textContent = 'Search: "' + qParam + '"';
      const eyeEl = document.getElementById('catalogEyebrow');
      if(eyeEl) eyeEl.textContent = 'SEARCH RESULTS';
      document.title = 'Search "' + qParam + '" | Aurelia Jewels';
      const sInput = document.getElementById('catalogSearch');
      if (sInput) sInput.value = qParam;
    }

    state.filtered = base;
    state.shown = 12;

    if(urlSort && document.getElementById('sortSelect')) {
      document.getElementById('sortSelect').value = urlSort;
    }

    const apply = () => {
      let arr = [...base];
      const searchVal = (document.getElementById('catalogSearch')?.value || '').trim().toLowerCase();
      if (searchVal) {
        arr = AureliaData.search(searchVal);
      }

      const selectedCats = [...document.querySelectorAll('.category-filter:checked')].map(x => x.value.toLowerCase());
      const selectedMetals = [...document.querySelectorAll('[data-filter-metal]:checked')].map(x => x.value.toLowerCase());
      const selectedPolishes = [...document.querySelectorAll('.polish:checked')].map(x => x.value.toLowerCase());
      const maxPrice = Number(document.getElementById('priceRange')?.value || 50000);

      arr = arr.filter(p => {
        if (selectedCats.length && !selectedCats.some(c => p.category.toLowerCase().includes(c) || c.includes(p.category.toLowerCase()))) return false;
        if (selectedMetals.length && !selectedMetals.some(m => p.metal.toLowerCase().includes(m) || m.includes(p.metal.toLowerCase()))) return false;
        if (selectedPolishes.length && !selectedPolishes.some(pol => p.polish.toLowerCase().includes(pol) || pol.includes(p.polish.toLowerCase()))) return false;
        if (p.price > maxPrice) return false;
        return true;
      });

      const sort = document.getElementById('sortSelect')?.value || 'latest';
      if (sort === 'price-low') arr.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') arr.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      else if (sort === 'popular') arr.sort((a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating);
      else arr.sort((a, b) => b.id - a.id);

      renderGrid(grid, arr.slice(0, state.shown));
      const countEl = document.getElementById('resultCount');
      if (countEl) countEl.textContent = arr.length + ' exquisite pieces found';
      
      const moreBtn = document.getElementById('loadMoreBtn');
      if (moreBtn) {
        moreBtn.style.display = state.shown < arr.length ? 'inline-block' : 'none';
        moreBtn.textContent = 'LOAD MORE CREATIONS (' + Math.max(0, arr.length - state.shown) + ' REMAINING)';
      }
      
      const priceVal = document.getElementById('priceValue');
      if (priceVal) priceVal.textContent = UI.formatPrice(maxPrice);
      
      window.AureliaCatalogResults = arr;
    };

    document.getElementById('sortSelect')?.addEventListener('change', apply);
    document.getElementById('catalogSearch')?.addEventListener('input', apply);
    document.getElementById('catalogSearch')?.addEventListener('keydown', e => { if (e.key === 'Enter') apply(); });
    document.getElementById('searchBtn')?.addEventListener('click', () => {
      const v = document.getElementById('catalogSearch')?.value.trim();
      if (v) location.href = 'products.html?q=' + encodeURIComponent(v);
    });
    document.getElementById('priceRange')?.addEventListener('input', apply);
    document.querySelectorAll('.category-filter, [data-filter-metal], .polish').forEach(x => x.addEventListener('change', apply));
    
    document.getElementById('clearFilters')?.addEventListener('click', () => {
      document.querySelectorAll('.category-filter, [data-filter-metal], .polish').forEach(x => x.checked = false);
      const pr = document.getElementById('priceRange');
      if (pr) pr.value = 50000;
      const sInput = document.getElementById('catalogSearch');
      if (sInput) sInput.value = '';
      base = AureliaData.products;
      state.shown = 12;
      const titleEl = document.getElementById('catalogTitle');
      if (titleEl) titleEl.textContent = 'All Collections';
      history.replaceState(null, '', 'products.html');
      apply();
    });

    document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
      state.shown += 12;
      apply();
    });
    document.getElementById('openFilters')?.addEventListener('click', () => document.getElementById('filters')?.classList.add('open'));
    document.getElementById('closeFilters')?.addEventListener('click', () => document.getElementById('filters')?.classList.remove('open'));
    
    apply();
  }
  function home(){
    // Homepage is kept simple and lightweight with no jewellery items per user requirement
  }
  function bindQuickView(){
    let id=null,qty=1;
    window.adjustQuickViewQty=d=>{qty=Math.max(1,qty+d);const x=document.getElementById('qvQty');if(x)x.textContent=qty};
    window.addQuickViewToCart=()=>{if(id){Cart.add(id,qty);UI.toast('Added to shopping bag');document.getElementById('quickViewModal')?.classList.remove('open')}};
    document.addEventListener('click',e=>{const b=e.target.closest('.quick-btn');if(!b)return;e.preventDefault();const p=AureliaData.getProductById(b.dataset.quickId);if(!p)return;id=p.id;qty=1;const map={qvImg:p.img,qvCategory:p.category,qvName:p.name,qvPrice:UI.formatPrice(p.price),qvOldPrice:UI.formatPrice(p.oldPrice),qvDiscount:p.discount+'% OFF',qvDesc:p.desc||p.description};Object.entries(map).forEach(([k,v])=>{const el=document.getElementById(k);if(!el)return;if(k==='qvImg')el.src=v;else el.textContent=v});document.getElementById('qvQty').textContent='1';document.getElementById('quickViewModal')?.classList.add('open')});
  }
  function hero(){
    const slides=[...document.querySelectorAll('.hero-slide')];
    if(slides.length <= 1) return;
    let i=0;
    const dots=document.getElementById('dots');
    if(dots&&dots.children.length===0)slides.forEach((_,k)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(k+1));b.addEventListener('click',()=>show(k));dots.appendChild(b)});
    const ds=[...(dots?.querySelectorAll('button')||[])];
    function show(n){i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('active',k===i));ds.forEach((d,k)=>d.classList.toggle('active',k===i))}
    document.getElementById('prevSlide')?.addEventListener('click',()=>show(i-1));
    document.getElementById('nextSlide')?.addEventListener('click',()=>show(i+1));
    show(0);
    setInterval(()=>show(i+1),6000);
  }
  function navigation(){
    document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('nav')?.classList.toggle('open'));
    document.getElementById('searchBtn')?.addEventListener('click',()=>{const q=document.getElementById('searchInput')?.value.trim();if(q)location.href='products.html?q='+encodeURIComponent(q)});
    document.getElementById('searchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('searchBtn')?.click()});
    document.getElementById('accountBtn')?.addEventListener('click',()=>location.href='account.html');
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
      const h=a.getAttribute('href');
      if(!h || h==='#' || h==='#home' || h.startsWith('#heritage') || h.startsWith('#store') || h.startsWith('#gold')) return;
      if(h.startsWith('#products') || h==='#cart' || h==='#orders' || h==='#account' || h==='#admin'){
        e.preventDefault();
        location.hash=h.slice(1);
        goHash();
      }
    }));
  }
  function goHash(){const h=location.hash||'#home';if(h==='#home'||h==='#')return;const m=h.match(/^#products(?:\?(.*))?$/);if(m){location.href='products.html'+(m[1]?'?'+m[1]:'');return}if(h==='#cart'){location.href='cart.html';return}if(h==='#orders'){location.href='orders.html';return}if(h==='#account'){location.href='account.html';return}if(h==='#admin'){location.href='admin/';return}}
  function modals(){document.querySelectorAll('.modal-close-btn').forEach(b=>b.addEventListener('click',()=>b.closest('.modal-backdrop')?.classList.remove('open')));document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));}
  function newsletter(){document.getElementById('subscribeForm')?.addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('email').value.trim();if(!email)return;localStorage.setItem('aurelia_subscriber',email);UI.toast('You are on the Aurelia list ✦');e.target.reset()})}
  function init(){navigation();hero();home();catalog();bindQuickView();modals();newsletter();goHash();document.getElementById('newArrivalsStrip')?.addEventListener('click',()=>{});if(window.AureliaData?.syncFromServer)AureliaData.syncFromServer().then(()=>{catalog();UI&&UI.refresh()});}
  document.addEventListener('DOMContentLoaded',init);window.addEventListener('hashchange',goHash);
})();

/* Aurelia experience layer: store locator, savings planner and informational links */
(function(){
  function storeResults(){
    const city=document.getElementById('storeCity')?.value||'Hyderabad';
    const data={
      Hyderabad:[['Aurelia Jubilee Hills','Road No. 36, Jubilee Hills'],['Aurelia Banjara Hills','Road No. 12, Banjara Hills']],
      Bengaluru:[['Aurelia Indiranagar','12th Main, Indiranagar'],['Aurelia Whitefield','Main Road, Whitefield']],
      Chennai:[['Aurelia T. Nagar','Usman Road, T. Nagar'],['Aurelia Adyar','LB Road, Adyar']],
      Kochi:[['Aurelia Panampilly Nagar','MG Road, Panampilly Nagar'],['Aurelia Edappally','NH 66, Edappally']],
      Mumbai:[['Aurelia Bandra','Linking Road, Bandra'],['Aurelia Powai','Central Avenue, Powai']]
    };
    const el=document.getElementById('storeResults');if(!el)return;
    el.innerHTML=(data[city]||[]).map((x,i)=>`<article class="store-result"><div><strong>${x[0]}</strong><span>${x[1]}, ${city}</span><small>Open today · 10:00 AM – 8:30 PM</small></div><button class="text-btn" data-store-map="${encodeURIComponent(x[1]+', '+city)}">DIRECTIONS →</button></article>`).join('');
  }
  function openStore(){document.getElementById('storeModal')?.classList.add('open');storeResults()}
  function infoModal(title,body){let m=document.getElementById('infoModal');if(!m){m=document.createElement('div');m.className='modal-backdrop';m.id='infoModal';m.innerHTML='<div class="modal-box"><button class="modal-close-btn" aria-label="Close">×</button><p class="eyebrow">AURELIA INFORMATION</p><h2 id="infoTitle"></h2><div id="infoBody"></div></div>';document.body.appendChild(m);m.querySelector('.modal-close-btn').onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')}}m.querySelector('#infoTitle').textContent=title;m.querySelector('#infoBody').innerHTML=body;m.classList.add('open')}
  const info={
    story:['Our Story & Legacy','Aurelia is a fictional jewellery house created for this internship project, blending contemporary silhouettes with Indian-inspired craftsmanship.'],
    contact:['Contact Us','<p>Email: support@aureliajewels.in</p><p>Phone: +91 (800) 425-9876</p><p>Mon–Sat · 10:00 AM–7:00 PM IST</p>'],
    blog:['Style Edit','Explore the curated collections, jewellery styling ideas and occasion edits featured across the Aurelia experience.'],
    terms:['Terms of Use','Demo-store terms: product imagery, prices and policies are illustrative. Orders are stored by the Aurelia demo API and fulfilment/payment processing is simulated.'],
    privacy:['Privacy Policy','This demo stores cart, wishlist, account and order information in browser localStorage. No real payment or customer database is connected.'],
    shipping:['Shipping','Orders above ₹999 show free demo shipping. Standard demo delivery is estimated at 3–5 business days.'],
    returns:['Returns & Exchange','The demo supports a 15-day return concept. No physical return request is submitted to a real fulfilment system.'],
    certificate:['Certificate Authenticity','Product certification and hallmark information shown in this demo is illustrative and intended to demonstrate the product-detail experience.']
  };
  function bind(){
    document.getElementById('storeBtn')?.addEventListener('click',openStore);document.getElementById('mobileStoreBtn')?.addEventListener('click',openStore);document.getElementById('boutiqueConsultBtn')?.addEventListener('click',openStore);document.getElementById('storeCity')?.addEventListener('change',storeResults);
    document.getElementById('goldRatesBtn')?.addEventListener('click',()=>document.getElementById('goldModal')?.classList.add('open'));
    const amount=document.getElementById('savingAmount'),months=document.getElementById('savingMonths'),label=document.getElementById('savingAmountLabel'),total=document.getElementById('savingTotal');
    function calc(){if(!amount||!months)return;const a=Number(amount.value),m=Number(months.value);if(label)label.textContent=UI.formatPrice(a);if(total)total.textContent=UI.formatPrice(a*m)}
    amount?.addEventListener('input',calc);months?.addEventListener('change',calc);calc();
    document.getElementById('savingPlanBtn')?.addEventListener('click',()=>{const plan={amount:Number(amount?.value||5000),months:Number(months?.value||11),total:Number(amount?.value||5000)*Number(months?.value||11)};localStorage.setItem('aurelia_savings_plan',JSON.stringify(plan));UI.toast('Savings plan saved in this browser ✦')});
    document.addEventListener('click',e=>{const b=e.target.closest('[data-store-map]');if(b){e.preventDefault();const q=decodeURIComponent(b.dataset.storeMap);window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q),'_blank','noopener')}});
    document.querySelectorAll('a[href^="#"]').forEach(a=>{const key=a.getAttribute('href')?.slice(1);if(info[key])a.addEventListener('click',e=>{e.preventDefault();infoModal(info[key][0],info[key][1])})});
  }
  document.addEventListener('DOMContentLoaded',bind);
})();
