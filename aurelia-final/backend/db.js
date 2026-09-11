const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'aurelia.json');
fs.mkdirSync(DB_DIR, { recursive: true });

function seedProducts() {
  const imgs=[
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=85'
  ];
  const names=['Royal Kundan Choker','Celeste Pearl Drop','Aria Solitaire Ring','Meera Antique Jhumka','Noor Gold Kada','Saanvi Pendant Set','Aadhya Bridal Haar','Ira Rose Gold Hoops','Veda Kundan Ring','Tara Layered Chain','Riya Mangalsutra','Anaya Pearl Choker','Zara Halo Ring','Myra Temple Jhumka','Kiara Gold Bangle','Avni Polki Pendant','Diya Bridal Set','Aarohi Diamond Studs','Navya Kundan Kada','Ishita Chain Pendant','Siya Classic Ring','Rhea Chandbali','Aanya Heritage Bangle','Mahi Mangalsutra','Esha Pearl Drops','Kavya Statement Choker','Naina Solitaire Band','Tia Floral Jhumka','Sara Rose Gold Bangle','Vanya Polki Set','Anvi Minimal Pendant','Isha Bridal Necklace'];
  const cats=['Necklace','Earrings','Rings','Bangles','Mangalsutra','Pendants'];
  return names.map((name,i)=>{const cat=cats[i%cats.length];const price=1899+((i*733)%7600);const old=Math.round(price*(1.18+((i%4)*.08)));return {id:i+1,name,category:cat,price,oldPrice:old,discount:Math.round((1-price/old)*100),rating:4.4+(i%6)*.1,reviewCount:47+i*13,metal:['Gold','Silver','Rose Gold'][i%3],polish:['High Polish','Antique','Matte'][i%3],stone:['Kundan','Pearl','Lab Solitaire','Polki'][i%4],material:i%3===0?'925 Sterling Silver':'Premium Brass Core',plating:i%3===1?'22K Yellow Gold Plating':'18K Rose Gold Plating',dimensions:'Adjustable / Universal',weight:(12+i%8)+' grams',warranty:'1 Year Complete Warranty',delivery:'Dispatched in 24–48 Hours',stock:3+(i%9),badge:i<4?'BESTSELLER':i<8?'NEW':'SIGNATURE',desc:'Aurelia craftsmanship meets modern Indian elegance in this finely finished piece, designed for celebrations and everyday heirloom moments.',img:imgs[i%imgs.length],images:[imgs[i%imgs.length],imgs[(i+1)%imgs.length],imgs[(i+2)%imgs.length]]};});
}
const coupons={FIRST10:{type:'percent',value:10,min:0},WELCOME15:{type:'percent',value:15,min:1500},FESTIVE20:{type:'percent',value:20,min:3000},FLAT500:{type:'flat',value:500,min:2999}};
function fresh(){return {users:[],products:seedProducts(),coupons,orders:[],reviews:{},wishlists:{},carts:{},addresses:{}};}
let db;
if(fs.existsSync(DB_FILE)){try{db=JSON.parse(fs.readFileSync(DB_FILE,'utf8'));}catch{db=fresh();}}else db=fresh();
for(const k of ['users','products','orders','reviews','wishlists','carts','addresses']) if(db[k]===undefined) db[k]=fresh()[k];
if(!db.products.length) db.products=seedProducts();
if(!db.coupons || !Object.keys(db.coupons).length) db.coupons=coupons;
function save(){const tmp=DB_FILE+'.tmp';fs.writeFileSync(tmp,JSON.stringify(db,null,2));fs.renameSync(tmp,DB_FILE);}
function id(){return crypto.randomUUID();}
function publicUser(u){if(!u)return null;const {passwordHash,passwordSalt,...safe}=u;return safe;}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){const hash=crypto.scryptSync(String(password),salt,64).toString('hex');return {hash,salt};}
function verifyPassword(password,u){return crypto.timingSafeEqual(Buffer.from(hashPassword(password,u.passwordSalt).hash,'hex'),Buffer.from(u.passwordHash,'hex'));}
module.exports={get db(){return db},save,id,publicUser,hashPassword,verifyPassword,DB_FILE};
