const crypto=require('crypto');
const dbmod=require('./db');
const {issue,verify,bearer}=require('./auth');
const {hashPassword,publicUser}=dbmod;
const db=()=>dbmod.db;
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
function ok(res,data){json(res,200,data)}
function fail(res,status,message){json(res,status,{error:message})}
async function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>1e6)req.destroy();});req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch(e){reject(e)}});req.on('error',reject)})}
function auth(req,res,roles){const p=verify(bearer(req));if(!p){fail(res,401,'Authentication required');return null}if(roles&&!roles.includes(p.role)){fail(res,403,'Admin access required');return null}const u=db().users.find(x=>x.id===p.sub);if(!u){fail(res,401,'Account not found');return null}return u}
function productSafe(p){return p}
function cartFor(u){return db().carts[u.id]||[]}
function calc(items,couponCode,delivery=0){const sub=items.reduce((s,i)=>s+i.price*i.qty,0);const c=couponCode?db().coupons[String(couponCode).toUpperCase()]:null;let disc=0;if(c&&sub>=c.min)disc=c.type==='percent'?Math.round(sub*c.value/100):c.value;const shipping=delivery!=null?delivery:(sub>=999||!sub?0:99);return {subtotal:sub,discount:Math.min(disc,sub),shipping,total:Math.max(0,sub-disc)+shipping,coupon:c?String(couponCode).toUpperCase():null}}
function sanitizeItems(input){return (Array.isArray(input)?input:[]).map(x=>{const p=db().products.find(p=>p.id===Number(x.id));if(!p)throw Error('Product '+x.id+' unavailable');const qty=Math.max(1,Math.min(p.stock,Number(x.qty)||1));return {...p,qty,metal:x.metal||p.metal,polish:x.polish||p.polish};})}
async function handle(req,res,pathName){
  const method=req.method;
  if(pathName==='/api/health'&&method==='GET')return ok(res,{ok:true,service:'Aurelia API',time:new Date().toISOString(),database:dbmod.DB_FILE});
  if(pathName==='/api/products'&&method==='GET'){
    const u=new URL(req.url,'http://localhost');let items=[...db().products];const q=u.searchParams.get('q');const cat=u.searchParams.get('category');const max=Number(u.searchParams.get('maxPrice')||0);const metals=u.searchParams.getAll('metal');
    if(q){
      const lq=q.trim().toLowerCase();
      if(lq==='mangalsutra'||lq==='mangalsutras'){
        items=[];
      } else if(lq==='cross chain'||lq==='cross chains'){
        items=items.filter(p=>p.category==='Chains'&&((p.subcategory||'').toLowerCase().includes('cross')||p.name.toLowerCase().includes('cross')));
      } else if(lq==='hug ring'||lq==='hug rings'){
        items=items.filter(p=>p.category==='Rings'&&((p.subcategory||'').toLowerCase().includes('hug')||p.name.toLowerCase().includes('hug')));
      } else if(lq==='chain'||lq==='chains'){
        items=items.filter(p=>p.category==='Chains'||p.name.toLowerCase().includes('chain'));
      } else if(lq==='ring'||lq==='rings'){
        items=items.filter(p=>p.category==='Rings'||p.name.toLowerCase().includes('ring'));
      } else if(lq==='necklace'||lq==='necklaces'){
        items=items.filter(p=>p.category==='Necklaces'||p.category==='Necklace Sets'||p.name.toLowerCase().includes('necklace'));
      } else {
        items=items.filter(p=>(p.name+' '+p.category+' '+(p.subcategory||'')+' '+p.metal+' '+p.polish+' '+(p.stone||'')+' '+(p.desc||p.description||'')).toLowerCase().includes(lq));
      }
    }
    if(cat){
      const c=cat.trim().toLowerCase();
      if(c==='cross chain'||c==='cross chains'){
        items=items.filter(p=>p.category==='Chains'&&((p.subcategory||'').toLowerCase().includes('cross')||p.name.toLowerCase().includes('cross')));
      } else if(c==='hug ring'||c==='hug rings'){
        items=items.filter(p=>p.category==='Rings'&&((p.subcategory||'').toLowerCase().includes('hug')||p.name.toLowerCase().includes('hug')));
      } else {
        items=items.filter(p=>{
          const pc=p.category.toLowerCase();
          if(pc===c)return true;
          if((c==='necklace'||c==='necklaces')&&pc==='necklaces')return true;
          if((c==='necklace set'||c==='necklace sets')&&pc==='necklace sets')return true;
          if((c==='chain'||c==='chains')&&pc==='chains')return true;
          if((c==='pendant'||c==='pendants')&&pc==='pendants')return true;
          if((c==='earring'||c==='earrings')&&pc==='earrings')return true;
          if((c==='ring'||c==='rings')&&pc==='rings')return true;
          if((c==='bangle'||c==='bangles')&&pc==='bangles')return true;
          if((c==='bracelet'||c==='bracelets')&&pc==='bracelets')return true;
          return false;
        });
      }
    }
    if(max)items=items.filter(p=>p.price<=max);
    if(metals.length)items=items.filter(p=>metals.some(m=>p.metal.toLowerCase().includes(m.toLowerCase())));
    const sort=u.searchParams.get('sort');
    if(sort==='price-low')items.sort((a,b)=>a.price-b.price);
    if(sort==='price-high')items.sort((a,b)=>b.price-a.price);
    if(sort==='latest')items.sort((a,b)=>b.id-a.id);
    return ok(res,{products:items.map(productSafe),count:items.length});
  }
  const pm=pathName.match(/^\/api\/products\/(\d+)$/);if(pm&&method==='GET'){const p=db().products.find(x=>x.id===Number(pm[1]));return p?ok(res,p):fail(res,404,'Product not found')}
  if(pathName==='/api/auth/register'&&method==='POST'){const d=await body(req);if(!d.name||!d.email||!d.password)return fail(res,400,'Name, email and password are required');if(String(d.password).length<6)return fail(res,400,'Password must be at least 6 characters');if(db().users.some(x=>x.email.toLowerCase()===String(d.email).toLowerCase()))return fail(res,409,'An account already exists');const hp=hashPassword(d.password);const u={id:dbmod.id(),name:String(d.name),email:String(d.email).toLowerCase(),phone:d.phone||'',role:'customer',passwordHash:hp.hash,passwordSalt:hp.salt,createdAt:new Date().toISOString()};db().users.push(u);dbmod.save();return json(res,201,{user:publicUser(u),token:issue(u)})}
  if(pathName==='/api/auth/login'&&method==='POST'){const d=await body(req);const u=db().users.find(x=>x.email.toLowerCase()===String(d.email||'').toLowerCase());if(!u||!dbmod.verifyPassword(d.password||'',u))return fail(res,401,'Invalid email or password');return ok(res,{user:publicUser(u),token:issue(u)})}
  if(pathName==='/api/auth/me'&&method==='GET'){const u=auth(req,res);return u?ok(res,{user:publicUser(u)}):null}
  if(pathName==='/api/auth/me'&&method==='PUT'){const u=auth(req,res);if(!u)return;const d=await body(req);Object.assign(u,{name:d.name??u.name,phone:d.phone??u.phone});dbmod.save();return ok(res,{user:publicUser(u)})}
  if(pathName==='/api/addresses'&&method==='GET'){const u=auth(req,res);return u?ok(res,{addresses:db().addresses[u.id]||[]}):null}
  if(pathName==='/api/addresses'&&method==='POST'){const u=auth(req,res);if(!u)return;const d=await body(req);if(!d.name||!d.line1||!d.city||!d.state||!d.pincode)return fail(res,400,'Complete address required');const a=db().addresses[u.id]||[];const item={id:Date.now(),...d,default:a.length===0};a.push(item);db().addresses[u.id]=a;dbmod.save();return json(res,201,{addresses:a})}
  const am=pathName.match(/^\/api\/addresses\/(\d+)$/);if(am&&method==='DELETE'){const u=auth(req,res);if(!u)return;db().addresses[u.id]=(db().addresses[u.id]||[]).filter(x=>x.id!==Number(am[1]));dbmod.save();return ok(res,{addresses:db().addresses[u.id]})}
  if(pathName==='/api/cart'&&method==='GET'){const u=auth(req,res);return u?ok(res,{items:cartFor(u)}):null}
  if(pathName==='/api/cart'&&method==='PUT'){const u=auth(req,res);if(!u)return;const d=await body(req);try{db().carts[u.id]=sanitizeItems(d.items);dbmod.save();return ok(res,{items:db().carts[u.id]})}catch(e){return fail(res,400,e.message)}}
  if(pathName==='/api/wishlist'&&method==='GET'){const u=auth(req,res);return u?ok(res,{ids:db().wishlists[u.id]||[]}):null}
  if(pathName==='/api/wishlist'&&method==='PUT'){const u=auth(req,res);if(!u)return;const d=await body(req);db().wishlists[u.id]=[...new Set((d.ids||[]).map(Number))].filter(id=>db().products.some(p=>p.id===id));dbmod.save();return ok(res,{ids:db().wishlists[u.id]})}
  if(pathName==='/api/coupons/validate'&&method==='POST'){const d=await body(req);const code=String(d.code||'').trim().toUpperCase();const c=db().coupons[code];const items=sanitizeItems(d.items||[]);const sub=items.reduce((s,i)=>s+i.price*i.qty,0);if(!c)return fail(res,400,'Invalid promo code');if(sub<c.min)return fail(res,400,'Minimum order is ₹'+c.min.toLocaleString('en-IN'));return ok(res,{code,...c,totals:calc(items,code,d.delivery)})}
  if(pathName==='/api/orders'&&method==='POST'){const p=verify(bearer(req));const u=p?db().users.find(x=>x.id===p.sub):null;const d=await body(req);let items;try{items=sanitizeItems(d.items||(u?cartFor(u):[]));}catch(e){return fail(res,400,e.message)}if(!items.length)return fail(res,400,'Your shopping bag is empty');const totals=calc(items,d.coupon,d.deliveryCost);const orderId='AJ-'+crypto.randomBytes(4).toString('hex').toUpperCase();const custName=d.customer?.name||u?.name||'Valued Patron';const custEmail=d.customer?.email||u?.email||'patron@aurelia.local';const custPhone=d.customer?.phone||u?.phone||'';const order={id:orderId,orderId:orderId,createdAt:new Date().toISOString(),status:'Placed',userId:u?u.id:'guest',customer:{name:custName,email:custEmail,phone:custPhone},address:d.address||null,deliveryMethod:d.deliveryMethod||'Standard Delivery',paymentMethod:d.paymentMethod||'Cash on Delivery',items,totals,coupon:d.coupon||null,tracking:[{status:'Placed',at:new Date().toISOString()}],trackingSteps:[{label:"Order Placed",done:true,time:"Confirmed"},{label:"Vault Inspection",done:false,time:"Pending"},{label:"Securely Packed",done:false,time:"Pending"},{label:"Air Transit",done:false,time:"Pending"},{label:"Delivered",done:false,time:"Pending"}]};db().orders.unshift(order);if(u)db().carts[u.id]=[];dbmod.save();return json(res,201,{order})}
  if(pathName==='/api/orders'&&method==='GET'){const p=verify(bearer(req));const u=p?db().users.find(x=>x.id===p.sub):null;if(!u)return ok(res,{orders:[]});return ok(res,{orders:db().orders.filter(o=>o.userId===u.id)})}
  const om=pathName.match(/^\/api\/orders\/([^/]+)$/);if(om&&method==='GET'){const p=verify(bearer(req));const u=p?db().users.find(x=>x.id===p.sub):null;const target=om[1];const o=db().orders.find(x=>(x.id===target||x.orderId===target)&&(!u||u.role==='admin'||x.userId===u.id||x.userId==='guest'));return o?ok(res,{order:o}):fail(res,404,'Order not found')}
  const rm=pathName.match(/^\/api\/products\/(\d+)\/reviews$/);if(rm&&method==='GET'){return ok(res,{reviews:db().reviews[rm[1]]||[]})}if(rm&&method==='POST'){const u=auth(req,res);if(!u)return;const d=await body(req);if(!d.rating||!d.text)return fail(res,400,'Rating and review are required');const arr=db().reviews[rm[1]]||[];arr.unshift({id:dbmod.id(),name:u.name,rating:Number(d.rating),text:String(d.text),date:new Date().toISOString()});db().reviews[rm[1]]=arr;dbmod.save();return json(res,201,{reviews:arr})}
  // Admin
  if(pathName==='/api/admin/products'&&method==='POST'){const u=auth(req,res,['admin']);if(!u)return;const d=await body(req);const p={...d,id:Math.max(0,...db().products.map(x=>x.id))+1,stock:Number(d.stock||0)};db().products.push(p);dbmod.save();return json(res,201,{product:p})}
  const ap=pathName.match(/^\/api\/admin\/products\/(\d+)$/);if(ap&&method==='PUT'){const u=auth(req,res,['admin']);if(!u)return;const p=db().products.find(x=>x.id===Number(ap[1]));if(!p)return fail(res,404,'Product not found');Object.assign(p,await body(req));dbmod.save();return ok(res,{product:p})}if(ap&&method==='DELETE'){const u=auth(req,res,['admin']);if(!u)return;db().products=db().products.filter(x=>x.id!==Number(ap[1]));dbmod.save();return ok(res,{success:true})}
  if(pathName==='/api/admin/orders'&&method==='GET'){const u=auth(req,res,['admin']);return u?ok(res,{orders:db().orders}):null}
  const ao=pathName.match(/^\/api\/admin\/orders\/([^/]+)$/);if(ao&&method==='PUT'){const u=auth(req,res,['admin']);if(!u)return;const o=db().orders.find(x=>x.id===ao[1]);if(!o)return fail(res,404,'Order not found');const d=await body(req);o.status=d.status||o.status;o.tracking=o.tracking||[];o.tracking.push({status:o.status,at:new Date().toISOString()});dbmod.save();return ok(res,{order:o})}
  if(pathName==='/api/admin/customers'&&method==='GET'){const u=auth(req,res,['admin']);return u?ok(res,{customers:db().users.map(publicUser)}):null}
  if(pathName==='/api/admin/coupons'&&method==='GET'){const u=auth(req,res,['admin']);return u?ok(res,{coupons:db().coupons}):null}
  if(pathName==='/api/admin/stats'&&method==='GET'){const u=auth(req,res,['admin']);return u?ok(res,{stats:{totalProducts:db().products.length,totalOrders:db().orders.length,totalCustomers:db().users.length,revenue:db().orders.reduce((s,x)=>s+(x.totals?.total||0),0)}}):null}
  return false;
}
module.exports={handle};
