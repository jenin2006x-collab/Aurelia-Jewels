const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('/tmp/catalog150.json', 'utf8'));

// Format for data.js
const codeForDataJs = `(function(){
const products = ${JSON.stringify(catalog, null, 2)};
const coupons = {FIRST10:{type:'percent',value:10,min:0},WELCOME15:{type:'percent',value:15,min:1500},FESTIVE20:{type:'percent',value:20,min:3000},FLAT500:{type:'flat',value:500,min:2999}};
const cats = ['Necklace','Earrings','Rings','Bangles','Mangalsutra','Pendants'];
window.AureliaData = {
  products,
  coupons,
  categories: cats.map(c => ({ name: c })),
  getProductById: id => products.find(p => p.id === Number(id)),
  search: q => products.filter(p => (p.name + ' ' + p.category + ' ' + p.metal + ' ' + p.stone).toLowerCase().includes(String(q).toLowerCase())),
  getProductsByCategory: c => products.filter(p => p.category.toLowerCase() === String(c).toLowerCase()),
  async syncFromServer(){
    try {
      if (window.AureliaAPI) {
        const r = await AureliaAPI.get('/products');
        if (Array.isArray(r.products) && r.products.length) {
          this.products.splice(0, this.products.length, ...r.products);
          return r.products;
        }
      }
    } catch(e) {
      console.warn('Using cached catalogue:', e.message);
    }
    return this.products;
  }
};
})();
`;

fs.writeFileSync('aurelia-final/js/data.js', codeForDataJs);
console.log('Successfully wrote aurelia-final/js/data.js with', catalog.length, 'products');

// Now update backend db.js seedProducts function
const backendDbCode = `const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'aurelia.json');
fs.mkdirSync(DB_DIR, { recursive: true });

function seedProducts() {
  return ${JSON.stringify(catalog, null, 2)};
}
const coupons = {FIRST10:{type:'percent',value:10,min:0},WELCOME15:{type:'percent',value:15,min:1500},FESTIVE20:{type:'percent',value:20,min:3000},FLAT500:{type:'flat',value:500,min:2999}};
function fresh(){return {users:[],products:seedProducts(),coupons,orders:[],reviews:{},wishlists:{},carts:{},addresses:{}};}
let db;
if(fs.existsSync(DB_FILE)){try{db=JSON.parse(fs.readFileSync(DB_FILE,'utf8'));}catch{db=fresh();}}else db=fresh();
for(const k of ['users','products','orders','reviews','wishlists','carts','addresses']) if(db[k]===undefined) db[k]=fresh()[k];
if(!db.products || db.products.length !== 150) db.products = seedProducts();
if(!db.coupons || !Object.keys(db.coupons).length) db.coupons = coupons;
function save(){const tmp=DB_FILE+'.tmp';fs.writeFileSync(tmp,JSON.stringify(db,null,2));fs.renameSync(tmp,DB_FILE);}
function id(){return crypto.randomUUID();}
function publicUser(u){if(!u)return null;const {passwordHash,passwordSalt,...safe}=u;return safe;}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){const hash=crypto.scryptSync(String(password),salt,64).toString('hex');return {hash,salt};}
function verifyPassword(password,u){return crypto.timingSafeEqual(Buffer.from(hashPassword(password,u.passwordSalt).hash,'hex'),Buffer.from(u.passwordHash,'hex'));}
module.exports={get db(){return db},save,id,publicUser,hashPassword,verifyPassword,DB_FILE};
`;

fs.writeFileSync('aurelia-final/backend/db.js', backendDbCode);
console.log('Successfully wrote aurelia-final/backend/db.js');

// Also update backend data/aurelia.json
const dbFile = 'aurelia-final/backend/data/aurelia.json';
const dbData = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
dbData.products = catalog;
fs.writeFileSync(dbFile, JSON.stringify(dbData, null, 2));
console.log('Successfully wrote aurelia.json with', dbData.products.length, 'products');
