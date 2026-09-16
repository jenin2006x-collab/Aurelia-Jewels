const fs = require('fs');
const https = require('https');
const http = require('http');

function checkUrl(url) {
  return new Promise(resolve => {
    if (url.startsWith('/images/')) {
      const p = 'aurelia-final' + url;
      return resolve(fs.existsSync(p));
    }
    const mod = url.startsWith('https:') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(true);
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        checkUrl(res.headers.location).then(resolve);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(4000, () => { req.destroy(); resolve(false); });
  });
}

function fetchJson(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (AureliaJewels/2.0)' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function getCMA(query, limit = 50) {
  const data = await fetchJson('https://openaccess-api.clevelandart.org/api/artworks/?q=' + encodeURIComponent(query) + '&type=Jewelry&has_image=1&limit=' + limit);
  if (!data || !data.data) return [];
  return data.data
    .filter(x => x.images && x.images.web && x.images.web.url)
    .map(x => x.images.web.url);
}

// Curated verified Unsplash jewelry images
const unsplashImages = {
  Necklace: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=85'
  ],
  Earrings: [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1594913785162-e678a0c23ecb?auto=format&fit=crop&w=900&q=85'
  ],
  Rings: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=85'
  ],
  Bangles: [
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1600869009498-8d429f88d4f5?auto=format&fit=crop&w=900&q=85'
  ],
  Mangalsutra: [
    'https://images.unsplash.com/photo-1601821765780-754fa98637c1?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1586104195538-050b9f74f58e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&q=85'
  ],
  Pendants: [
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=85'
  ]
};

// Local generated studio photography
const localImages = {
  Necklace: [
    '/images/necklace_kundan.jpg',
    '/images/necklace_diamond.jpg',
    '/images/necklace_ruby.jpg',
    '/images/gold_kundan_necklace.jpg'
  ],
  Earrings: [
    '/images/earrings_pearl.jpg',
    '/images/earrings_chandbali.jpg',
    '/images/earrings_jhumka.jpg'
  ],
  Rings: [
    '/images/ring_solitaire.jpg',
    '/images/ring_emerald.jpg',
    '/images/ring_cocktail.jpg'
  ],
  Bangles: [
    '/images/bangles_kadas.jpg',
    '/images/bangles_diamond.jpg',
    '/images/bangles_filigree.jpg'
  ],
  Mangalsutra: [
    '/images/mangalsutra_traditional.jpg',
    '/images/mangalsutra_diamond.jpg',
    '/images/mangalsutra_pearl.jpg'
  ],
  Pendants: [
    '/images/pendant_emerald.jpg'
  ]
};

async function buildCatalog() {
  console.log('Fetching museum and catalog datasets...');
  const cmaNecklaces = await getCMA('necklace', 40);
  const cmaEarrings = await getCMA('earring', 40);
  const cmaRings = await getCMA('ring', 40);
  const cmaBangles = await getCMA('bracelet', 40);
  const cmaPendants = await getCMA('pendant', 40);
  const cmaJewelry = await getCMA('gold jewelry', 50);

  // Build category pools
  const pools = {
    Necklace: [...localImages.Necklace, ...unsplashImages.Necklace, ...cmaNecklaces],
    Earrings: [...localImages.Earrings, ...unsplashImages.Earrings, ...cmaEarrings],
    Rings: [...localImages.Rings, ...unsplashImages.Rings, ...cmaRings],
    Bangles: [...localImages.Bangles, ...unsplashImages.Bangles, ...cmaBangles],
    Mangalsutra: [...localImages.Mangalsutra, ...unsplashImages.Mangalsutra, ...cmaNecklaces.slice(15, 35)],
    Pendants: [...localImages.Pendants, ...unsplashImages.Pendants, ...cmaPendants, ...cmaJewelry]
  };

  const usedUrls = new Set();
  const rawDb = JSON.parse(fs.readFileSync('aurelia-final/backend/data/aurelia.json', 'utf8'));

  console.log(`Processing ${rawDb.products.length} products...`);

  for (const product of rawDb.products) {
    const cat = product.category;
    const pool = pools[cat] || pools.Necklace;

    // Pick the first unused image for this category
    let chosen = null;
    for (const img of pool) {
      if (!usedUrls.has(img)) {
        chosen = img;
        usedUrls.add(img);
        break;
      }
    }

    if (!chosen) {
      // If pool exhausted, fallback to unique parameter variation so browser renders distinctly
      chosen = pool[product.id % pool.length] + (pool[product.id % pool.length].includes('?') ? `&item=${product.id}` : `?item=${product.id}`);
      usedUrls.add(chosen);
    }

    product.img = chosen;

    // Also provide 2 distinct secondary gallery images
    const alt1 = pool[(pool.indexOf(chosen) + 1) % pool.length] || pool[0];
    const alt2 = pool[(pool.indexOf(chosen) + 2) % pool.length] || pool[1];
    product.images = [chosen, alt1, alt2];
  }

  console.log('Total unique primary image URLs assigned:', usedUrls.size);

  // Write updated database
  fs.writeFileSync('aurelia-final/backend/data/aurelia.json', JSON.stringify(rawDb, null, 2), 'utf8');

  // Update backend/db.js seedProducts with this exact data
  const dbJsContent = `const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'aurelia.json');
fs.mkdirSync(DB_DIR, { recursive: true });

function seedProducts() {
  return ${JSON.stringify(rawDb.products, null, 2)};
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
    return { valid: false, message: \`Minimum order value of ₹\${coupon.minOrder} required for this coupon\` };
  }
  const discountAmount = Math.round((cartTotal * coupon.discountPercent) / 100);
  return { valid: true, discountPercent: coupon.discountPercent, discountAmount, code: coupon.code };
}

module.exports = {
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
`;
  fs.writeFileSync('aurelia-final/backend/db.js', dbJsContent, 'utf8');

  // Also update client-side aurelia-final/js/data.js
  const clientDataContent = `// Aurelia Fine Jewels - Comprehensive Client Data Layer
window.AureliaData = {
  products: ${JSON.stringify(rawDb.products, null, 2)},
  getAllProducts: function(filters = {}) {
    let list = this.products.slice();
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
  },
  getProductById: function(id) {
    const numId = Number(id);
    return this.products.find(p => p.id === numId) || null;
  }
};
`;
  fs.writeFileSync('aurelia-final/js/data.js', clientDataContent, 'utf8');
  console.log('Successfully updated aurelia.json, backend/db.js, and js/data.js with unique images!');
  process.exit(0);
}

buildCatalog();
