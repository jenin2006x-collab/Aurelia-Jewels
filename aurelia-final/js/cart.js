(function(){
const CK='aurelia_cart_v2',WK='aurelia_wishlist_v2',OK='aurelia_orders_v2',RK='aurelia_recent_v2',CP='aurelia_coupon_v2';
const get=k=>JSON.parse(localStorage.getItem(k)||'[]'),set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const items=()=>get(CK);
function syncCart(){if(window.Auth&&Auth.isLoggedIn())AureliaAPI.put('/cart',{items:items()}).catch(()=>{});}
function syncWish(){if(window.Auth&&Auth.isLoggedIn())AureliaAPI.put('/wishlist',{ids:get(WK)}).catch(()=>{});}
function totals(extraShipping){const sub=items().reduce((s,i)=>s+i.price*i.qty,0),c=JSON.parse(localStorage.getItem(CP)||'null');let disc=0;if(c){const x=AureliaData.coupons[c.code];if(x&&sub>=x.min)disc=x.type==='percent'?Math.round(sub*x.value/100):x.value}const ship=extraShipping!=null?extraShipping:(sub>=999||!sub?0:99);return{subtotal:sub,discount:Math.min(disc,sub),shipping:ship,total:Math.max(0,sub-disc)+ship}};
async function hydrate(){if(!Auth.isLoggedIn())return;try{const [c,w]=await Promise.all([AureliaAPI.get('/cart'),AureliaAPI.get('/wishlist')]);set(CK,c.items||[]);set(WK,w.ids||[]);UI&&UI.refresh()}catch{}}
window.Cart={
getItems:items,hydrate,
add(id,qty=1,opts={}){const p=AureliaData.getProductById(id);if(!p)throw Error('Product unavailable');let a=items(),x=a.find(i=>i.id===p.id);if(x)x.qty=Math.min(p.stock,x.qty+qty);else a.push({...p,qty,metal:opts.metal||p.metal,polish:opts.polish||p.polish});set(CK,a);syncCart();UI&&UI.refresh();return a},
updateQty(id,delta){let a=items(),x=a.find(i=>i.id===Number(id));if(!x)return;if(delta>0){const p=AureliaData.getProductById(id);x.qty=Math.min(p?.stock||99,x.qty+delta)}else x.qty=Math.max(0,x.qty+delta);set(CK,a.filter(i=>i.qty>0));syncCart();UI&&UI.refresh()},
remove(id){set(CK,items().filter(i=>i.id!==Number(id)));syncCart();UI&&UI.refresh()},clear(){set(CK,[]);syncCart();UI&&UI.refresh()},getTotals:totals,getCoupon(){return JSON.parse(localStorage.getItem(CP)||'null')},
applyCoupon(code){code=String(code||'').trim().toUpperCase();const c=AureliaData.coupons[code],sub=items().reduce((s,i)=>s+i.price*i.qty,0);if(!c)throw Error('Invalid promo code');if(sub<c.min)throw Error('Minimum order is ₹'+c.min.toLocaleString('en-IN'));set(CP,{code});UI&&UI.refresh();return {...c,success:true,message:'Promo code applied successfully.'}},clearCoupon(){localStorage.removeItem(CP)},
wishlist(){return get(WK)},isWishlisted(id){return get(WK).includes(Number(id))},toggleWishlist(id){let a=get(WK),n=Number(id);a=a.includes(n)?a.filter(x=>x!==n):[...a,n];set(WK,a);syncWish();UI&&UI.refresh();return a.includes(n)},
addRecentlyViewed(id){let a=get(RK).filter(x=>x!==Number(id));a.unshift(Number(id));set(RK,a.slice(0,8))},getRecentlyViewed(){return get(RK).map(id=>AureliaData.getProductById(id)).filter(Boolean)},
getOrders(){return get(OK)},async fetchOrders(){if(!Auth.isLoggedIn())return get(OK);try{const r=await AureliaAPI.get('/orders');set(OK,r.orders||[]);return r.orders||[]}catch{return get(OK)}},
async placeOrder(payload){if(!Auth.isLoggedIn())throw Error('Please sign in before placing an order');const r=await AureliaAPI.post('/orders',payload);set(OK,[r.order,...get(OK).filter(o=>o.id!==r.order.id&&o.orderId!==r.order.id)]);set(CK,[]);localStorage.removeItem(CP);UI&&UI.refresh();return r.order},
createOrder(payload){return this.placeOrder(payload)},addItem(product,qty=1,metal,polish){return this.add(product.id,qty,{metal,polish})},removeItem(id){return this.remove(id)},clearCart(){return this.clear()},getWishlist(){return this.wishlist()},
addReview(id,review){if(Auth.isLoggedIn())AureliaAPI.post('/products/'+id+'/reviews',review).then(r=>{set('aurelia_reviews_'+id,r.reviews||[]);UI&&UI.refresh()}).catch(()=>{});const k='aurelia_reviews_'+id,a=get(k);a.unshift({...review,date:new Date().toISOString()});set(k,a);return a},
getReviews(id){return get('aurelia_reviews_'+id)},getCount(){return items().reduce((s,i)=>s+i.qty,0)},getOrder(id){return get(OK).find(o=>(o.orderId||o.id)===id)||null}
};
})();
