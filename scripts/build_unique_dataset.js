const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');

function fetchJson(url) {
  return new Promise(resolve => {
    const mod = url.startsWith('https:') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'AureliaJewels/2.0 (contact@aurelia.com)' } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https:') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP status ' + res.statusCode + ' for ' + url));
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => f.close(() => resolve()));
    }).on('error', reject);
  });
}

async function getVAImages(query, count = 30) {
  const url = `https://api.vam.ac.uk/v2/objects/search?q=${encodeURIComponent(query)}&images_exist=1&page_size=${count}`;
  const res = await fetchJson(url);
  if (!res?.records) return [];
  const list = [];
  for (const r of res.records) {
    if (!r._images?._primary_thumbnail) continue;
    const match = r._images._primary_thumbnail.match(/collections\/([^\/]+)/);
    const imgId = match ? match[1] : null;
    if (imgId) {
      list.push({
        id: r.systemNumber,
        title: r._primaryTitle || r.objectType || 'Jewellery',
        url: `https://framemark.vam.ac.uk/collections/${imgId}/full/800,/0/default.jpg`
      });
    }
  }
  return list;
}

async function main() {
  console.log('=== Step 1: Preparing directories ===');
  const imgDir = path.resolve('aurelia-final/images/products');
  const assetDir = path.resolve('aurelia-final/assets/products');
  fs.mkdirSync(imgDir, { recursive: true });
  fs.mkdirSync(assetDir, { recursive: true });

  const tempDir = '/tmp/aurelia_raw_downloads';
  fs.mkdirSync(tempDir, { recursive: true });

  console.log('=== Step 2: Sourcing images for all 10 categories ===');

  // We need 15 unique images for each of the 10 categories:
  // 1. Necklaces
  // 2. Necklace Sets
  // 3. Chains
  // 4. Cross Chains
  // 5. Pendants
  // 6. Earrings
  // 7. Rings
  // 8. Hug Rings
  // 9. Bangles
  // 10. Bracelets

  const localAssets = {
    Necklaces: [
      'src/assets/images/gold_kundan_necklace_1789138494616.jpg',
      'src/assets/images/diamond_necklace_1789138592455.jpg',
      'src/assets/images/necklace_choker_ruby_1789243696162.jpg',
      'src/assets/images/test_necklace_1789416788266.jpg'
    ],
    'Necklace Sets': [
      'src/assets/images/necklace_set_bridal_1789415103335.jpg',
      'src/assets/images/necklace_set_temple_1789415189037.jpg',
      'src/assets/images/necklace_set_sapphire_1789415266929.jpg'
    ],
    Chains: [
      'src/assets/images/chain_classic_gold_1789415133539.jpg',
      'src/assets/images/chain_figaro_curb_1789415288950.jpg'
    ],
    'Cross Chains': [
      'src/assets/images/cross_chain_gold_1789415119203.jpg',
      'src/assets/images/cross_chain_platinum_1789415204370.jpg',
      'src/assets/images/cross_chain_rose_gold_1789415304297.jpg'
    ],
    Pendants: [
      'src/assets/images/pendant_floral_gemstone_1789243762974.jpg',
      'src/assets/images/pendant_round_gold_1789415316572.jpg',
      'src/assets/images/pendant_teardrop_gold_1789415175322.jpg'
    ],
    Earrings: [
      'src/assets/images/earrings_jhumka_antique_1789243710167.jpg',
      'src/assets/images/pearl_drop_earrings_1789138616613.jpg',
      'src/assets/images/royal_gold_earrings_1789138526064.jpg'
    ],
    Rings: [
      'src/assets/images/luxury_diamond_ring_1789138539078.jpg',
      'src/assets/images/emerald_gold_ring_1789138633280.jpg',
      'src/assets/images/ring_cocktail_ruby_1789243722907.jpg'
    ],
    'Hug Rings': [
      'src/assets/images/hug_ring_gold_1789415149249.jpg',
      'src/assets/images/hug_ring_diamond_1789415217202.jpg',
      'src/assets/images/hug_ring_sapphire_1789415330233.jpg'
    ],
    Bangles: [
      'src/assets/images/handcrafted_bangles_1789138552395.jpg',
      'src/assets/images/diamond_gold_bangle_1789138652343.jpg',
      'src/assets/images/bangles_filigree_gold_1789243736132.jpg'
    ],
    Bracelets: [
      'src/assets/images/bracelet_tennis_gold_1789415162269.jpg',
      'src/assets/images/bracelet_cuff_gold_1789415229336.jpg',
      'src/assets/images/bracelet_charm_gold_1789415342443.jpg'
    ]
  };

  const usedUrls = new Set();
  const usedHashes = new Set();

  // Load CMA data if available
  let cmaData = {};
  try {
    cmaData = JSON.parse(fs.readFileSync('/tmp/cma_all_jewelry.json', 'utf8'));
  } catch(e) {}

  const categories = [
    { name: 'Necklaces', prefix: 'necklace', query: 'Indian gold necklace', cmaKey: 'Necklaces' },
    { name: 'Necklace Sets', prefix: 'necklace-set', query: 'necklace and earrings gold', cmaKey: 'Necklaces' },
    { name: 'Chains', prefix: 'chain', query: 'gold chain necklace', cmaKey: 'Chains' },
    { name: 'Cross Chains', prefix: 'cross-chain', query: 'cross pendant gold chain', cmaKey: 'Pendants' },
    { name: 'Pendants', prefix: 'pendant', query: 'Indian gold pendant', cmaKey: 'Pendants' },
    { name: 'Earrings', prefix: 'earrings', query: 'Indian gold earrings', cmaKey: 'Earrings' },
    { name: 'Rings', prefix: 'ring', query: 'Indian gold ring', cmaKey: 'Rings' },
    { name: 'Hug Rings', prefix: 'hug-ring', query: 'gold ring band', cmaKey: 'Rings' },
    { name: 'Bangles', prefix: 'bangle', query: 'Indian gold bangle', cmaKey: 'Bangles' },
    { name: 'Bracelets', prefix: 'bracelet', query: 'Indian gold bracelet', cmaKey: 'Bracelets' }
  ];

  const processedImages = {};

  for (const cat of categories) {
    processedImages[cat.name] = [];
    console.log(`\nProcessing category: ${cat.name}...`);

    // 1. First add available studio local assets
    const locals = localAssets[cat.name] || [];
    for (const loc of locals) {
      if (fs.existsSync(loc)) {
        const rawBuf = fs.readFileSync(loc);
        const hash = crypto.createHash('md5').update(rawBuf).digest('hex');
        if (!usedHashes.has(hash)) {
          usedHashes.add(hash);
          processedImages[cat.name].push({ source: loc, isLocal: true });
          console.log(`  Added local studio image: ${loc} (${hash})`);
        }
      }
    }

    // 2. For earrings, pull from RingFIR
    if (cat.name === 'Earrings') {
      for (let i = 1; i <= 30 && processedImages[cat.name].length < 15; i++) {
        const pad = String(i).padStart(3, '0');
        const ringFirUrl = `https://raw.githubusercontent.com/skarifahmed/RingFIR/main/data/RingFIR/${pad}/${pad}_001.png`;
        if (!usedUrls.has(ringFirUrl)) {
          usedUrls.add(ringFirUrl);
          processedImages[cat.name].push({ source: ringFirUrl, isLocal: false });
        }
      }
    }

    // 3. Fetch from V&A Museum
    if (processedImages[cat.name].length < 15) {
      console.log(`  Fetching V&A images for ${cat.name} with query: "${cat.query}"...`);
      const vaList = await getVAImages(cat.query, 40);
      for (const item of vaList) {
        if (processedImages[cat.name].length >= 15) break;
        if (!usedUrls.has(item.url)) {
          usedUrls.add(item.url);
          processedImages[cat.name].push({ source: item.url, isLocal: false, title: item.title });
        }
      }
    }

    // 4. If still need more, fallback to CMA
    if (processedImages[cat.name].length < 15 && cmaData[cat.cmaKey]) {
      console.log(`  Fetching CMA images for ${cat.name}...`);
      for (const item of cmaData[cat.cmaKey]) {
        if (processedImages[cat.name].length >= 15) break;
        if (!usedUrls.has(item.url)) {
          usedUrls.add(item.url);
          processedImages[cat.name].push({ source: item.url, isLocal: false, title: item.title });
        }
      }
    }

    console.log(`  Category ${cat.name} has ${processedImages[cat.name].length} curated sources.`);
  }

  // Now download, standardize with ImageMagick to 800x800, and save
  console.log('\n=== Step 3: Downloading, standardizing to 800x800 and verifying unique hashes ===');

  let productGlobalId = 1;
  const masterProductList = [];
  const finalHashes = new Map();

  for (const cat of categories) {
    const items = processedImages[cat.name].slice(0, 15);
    if (items.length < 15) {
      throw new Error(`Category ${cat.name} has only ${items.length} items, expected 15!`);
    }

    for (let idx = 0; idx < 15; idx++) {
      const item = items[idx];
      const itemNum = String(idx + 1).padStart(3, '0');
      const prodId = productGlobalId++;
      const prodNum = String(prodId).padStart(3, '0');

      const targetFileName = `${cat.prefix}-${itemNum}.jpg`;
      const legacyFileName = `product_${prodNum}.jpg`;

      const targetPath = path.join(imgDir, targetFileName);
      const legacyPath = path.join(imgDir, legacyFileName);
      const assetPath = path.join(assetDir, targetFileName);

      const rawTempPath = path.join(tempDir, `raw_${prodNum}.jpg`);

      if (item.isLocal) {
        fs.copyFileSync(item.source, rawTempPath);
      } else {
        await downloadFile(item.source, rawTempPath);
      }

      // Convert to clean 800x800 sRGB JPEG with ImageMagick
      execSync(`convert "${rawTempPath}" -resize 800x800 -background white -gravity center -extent 800x800 -quality 90 -strip "${targetPath}"`);

      // Copy to legacy path and asset dir
      fs.copyFileSync(targetPath, legacyPath);
      fs.copyFileSync(targetPath, assetPath);

      // Verify MD5 hash
      const buf = fs.readFileSync(targetPath);
      const md5 = crypto.createHash('md5').update(buf).digest('hex');

      if (finalHashes.has(md5)) {
        throw new Error(`CRITICAL ERROR: Duplicate MD5 detected! Product ${prodId} matches product ${finalHashes.get(md5)}`);
      }
      finalHashes.set(md5, prodId);

      // Register product data
      masterProductList.push({
        id: prodId,
        category: cat.name,
        targetFile: `/images/products/${targetFileName}`,
        legacyFile: `/images/products/${legacyFileName}`,
        assetFile: `/assets/products/${targetFileName}`,
        md5: md5,
        originalTitle: item.title || cat.name
      });
    }
  }

  console.log(`\nSUCCESS: Processed all ${masterProductList.length} products with ${finalHashes.size} UNIQUE MD5 hashes!`);
  fs.writeFileSync('/tmp/product_image_mapping.json', JSON.stringify(masterProductList, null, 2));
}

main().catch(err => {
  console.error('Failed to build dataset:', err);
  process.exit(1);
});
