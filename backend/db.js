const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'aurelia.json');
fs.mkdirSync(DB_DIR, { recursive: true });

function seedProducts() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      if (parsed.products && parsed.products.length) return parsed.products;
    }
  } catch (e) {}
  return [];
}

function readData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = {
        products: seedProducts(),
        users: [],
        orders: [],
        coupons: [
          { code: 'AURELIA10', discountPercent: 10, minOrder: 1000 },
          { code: 'ROYAL15', discountPercent: 15, minOrder: 2500 },
          { code: 'BRIDAL20', discountPercent: 20, minOrder: 5000 }
        ]
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!data.products || data.products.length === 0) {
      data.products = seedProducts();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    }
    return data;
  } catch (err) {
    console.error('Error reading data:', err);
    return { products: seedProducts(), users: [], orders: [], coupons: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getAllProducts(filters = {}) {
  const data = readData();
  let list = data.products || [];

  if (filters.category && filters.category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.metal) {
    list = list.filter(p => p.metal && p.metal.toLowerCase() === filters.metal.toLowerCase());
  }
  if (filters.stone) {
    list = list.filter(p => p.stone && p.stone.toLowerCase() === filters.stone.toLowerCase());
  }
  if (filters.polish) {
    list = list.filter(p => p.polish && p.polish.toLowerCase() === filters.polish.toLowerCase());
  }
  if (filters.maxPrice) {
    const max = Number(filters.maxPrice);
    if (!isNaN(max)) list = list.filter(p => p.price <= max);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.desc && p.desc.toLowerCase().includes(q))
    );
  }

  if (filters.sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (filters.sort === 'popular') {
    list.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return list;
}

function getProductById(id) {
  const data = readData();
  const numId = Number(id);
  return (data.products || []).find(p => p.id === numId) || null;
}

function findUserByEmail(email) {
  const data = readData();
  return (data.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
}

function createUser(userData) {
  const data = readData();
  const newUser = {
    id: Date.now(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  data.users = data.users || [];
  data.users.push(newUser);
  writeData(data);
  return newUser;
}

function createOrder(orderData) {
  const data = readData();
  const newOrder = {
    id: 'AUR-' + Date.now().toString(36).toUpperCase(),
    ...orderData,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };
  data.orders = data.orders || [];
  data.orders.push(newOrder);
  writeData(data);
  return newOrder;
}

function getOrdersByUser(email) {
  const data = readData();
  return (data.orders || []).filter(o => o.customerEmail && o.customerEmail.toLowerCase() === email.toLowerCase());
}

function validateCoupon(code, cartTotal) {
  const data = readData();
  const coupon = (data.coupons || []).find(c => c.code.toUpperCase() === (code || '').trim().toUpperCase());
  if (!coupon) return { valid: false, message: 'Invalid coupon code' };
  if (cartTotal < coupon.minOrder) {
    return { valid: false, message: `Minimum order value of ₹${coupon.minOrder} required for this coupon` };
  }
  const discountAmount = Math.round((cartTotal * coupon.discountPercent) / 100);
  return { valid: true, discountPercent: coupon.discountPercent, discountAmount, code: coupon.code };
}

let db = readData();
if (!db.users) db.users = [];
if (!db.orders) db.orders = [];
if (!db.coupons || Array.isArray(db.coupons)) {
  db.coupons = {
    'AURELIA10': { type: 'percent', value: 10, min: 1000 },
    'ROYAL15': { type: 'percent', value: 15, min: 2500 },
    'BRIDAL20': { type: 'percent', value: 20, min: 5000 },
    'FIRST10': { type: 'percent', value: 10, min: 999 }
  };
}
if (!db.addresses) db.addresses = {};
if (!db.carts) db.carts = {};
if (!db.wishlists) db.wishlists = {};
if (!db.reviews) db.reviews = {};

function save() {
  writeData(db);
}

function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(pw, user) {
  if (!user || !user.passwordSalt || !user.passwordHash) return false;
  const hash = crypto.scryptSync(pw, user.passwordSalt, 64).toString('hex');
  return hash === user.passwordHash;
}

function publicUser(u) {
  if (!u) return null;
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
}

function genId() {
  return crypto.randomBytes(8).toString('hex');
}

module.exports = {
  db,
  save,
  DB_FILE,
  hashPassword,
  verifyPassword,
  publicUser,
  id: genId,
  readData,
  writeData,
  getAllProducts,
  getProductById,
  findUserByEmail,
  createUser,
  createOrder,
  getOrdersByUser,
  validateCoupon
};
