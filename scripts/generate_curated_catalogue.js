const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const mapping = JSON.parse(fs.readFileSync('/tmp/product_image_mapping.json', 'utf8'));

// 15 curated, distinctive names and details for each category
const categoryMetadata = {
  Necklaces: [
    {
      name: "Royal Kundan Heritage Choker",
      subcategory: "Choker",
      price: 18999, oldPrice: 21999,
      metal: "22K Gold", polish: "Gold", stone: "Uncut Polki & Kundan",
      weight: "14 grams", dimensions: "Adjustable Dori 14–18 in",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Handcrafted 22K gold heritage choker featuring certified uncut polki stones set in traditional lac kundan work."
    },
    {
      name: "Celeste Diamond Cascade Necklace",
      subcategory: "Collar",
      price: 34999, oldPrice: 39999,
      metal: "18K Gold", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "18 grams", dimensions: "16 inches with secure clasp",
      badge: "NEW ARRIVAL", isBestseller: false, isFeatured: true,
      desc: "Brilliant-cut laboratory-certified diamonds cascading across an 18K white-gold articulated framework."
    },
    {
      name: "Padmavati Ruby Regal Choker",
      subcategory: "Choker",
      price: 24500, oldPrice: 28000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "22 grams", dimensions: "15 inches choker width",
      badge: "ROYAL", isBestseller: true, isFeatured: true,
      desc: "Majestic antique-finished gold choker encrusted with deep pigeon-blood rubies and freshwater seed pearls."
    },
    {
      name: "Noor-e-Kashmir Emerald Choker",
      subcategory: "Gulbandh",
      price: 29999, oldPrice: 34500,
      metal: "22K Gold", polish: "Gold", stone: "Zambian Emerald",
      weight: "26 grams", dimensions: "14.5 inches inner circumference",
      badge: "EXCLUSIVE", isBestseller: false, isFeatured: true,
      desc: "Imperial Mughal-inspired gulbandh with untreated Zambian emerald droplets strung with micro-faceted gold beads."
    },
    {
      name: "Swarna Vriksha Filigree Gold Necklace",
      subcategory: "Haar",
      price: 15499, oldPrice: 17999,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "16 grams", dimensions: "18 inches length",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Delicate wirework filigree depicting traditional floral arabesques in hallmarked 22 karat yellow gold."
    },
    {
      name: "Nilambari Royal Sapphire Choker",
      subcategory: "Choker",
      price: 31500, oldPrice: 36000,
      metal: "18K Gold", polish: "Dual Tone", stone: "Ceylonese Sapphire",
      weight: "21 grams", dimensions: "15 inches length",
      badge: "TRENDING", isBestseller: true, isFeatured: false,
      desc: "Deep royal blue faceted sapphires encircled by a dual-tone yellow and white gold bezel matrix."
    },
    {
      name: "Aadrika Jadau Polki Collar",
      subcategory: "Collar",
      price: 26999, oldPrice: 31000,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "24 grams", dimensions: "16 inches with extendable tassel",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Classic Bikaner jadau craftsmanship highlighted by open-cut polki crystals and meenakari reverse enameling."
    },
    {
      name: "Mayurakshi Temple Coin Necklace",
      subcategory: "Kasumala",
      price: 19800, oldPrice: 22500,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "28 grams", dimensions: "18 inches traditional drape",
      badge: "HERITAGE", isBestseller: true, isFeatured: false,
      desc: "Traditional South Indian kasu mala composed of 32 embossed coins honoring auspicious motifs in matte antique gold."
    },
    {
      name: "Zeenat Chandrika Pearl Collar",
      subcategory: "Hasli",
      price: 17200, oldPrice: 19999,
      metal: "22K Gold", polish: "Gold", stone: "Basra Pearls",
      weight: "19 grams", dimensions: "Torque style 15 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Solid torque collar (hasli) with capped finials strung with rows of natural Basra seed pearls."
    },
    {
      name: "Chandramukhi Polki Choker",
      subcategory: "Choker",
      price: 22499, oldPrice: 25999,
      metal: "22K Gold", polish: "Gold", stone: "Uncut Polki & Kundan",
      weight: "17 grams", dimensions: "14 inches adjustable",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Crescent-shaped gold links encrusted with luminous uncut polki gems and delicate pearl jhumki droplets."
    },
    {
      name: "Navratna Imperial Gold Haar",
      subcategory: "Navratna",
      price: 28500, oldPrice: 32000,
      metal: "22K Gold", polish: "Gold", stone: "Navratna Gemstones",
      weight: "25 grams", dimensions: "20 inches regal length",
      badge: "VINTAGE", isBestseller: false, isFeatured: false,
      desc: "Harmonious nine-gem setting invoking astrological balance, set in polished 22 karat yellow gold bezels."
    },
    {
      name: "Hemavati Floral Filigree Choker",
      subcategory: "Choker",
      price: 14800, oldPrice: 16999,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "12 grams", dimensions: "15 inches length",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Artisanal Cuttack tarakasi filigree gold lace forming an airy floral pattern across the collarbones."
    },
    {
      name: "Devaki Antique Temple Choker",
      subcategory: "Temple",
      price: 23999, oldPrice: 27500,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "29 grams", dimensions: "15.5 inches length",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Nagashi hand-repoussé temple motifs accented by natural cabochon rubies in warm antique 22K gold."
    },
    {
      name: "Sultana Layered Polki Gala Necklace",
      subcategory: "Haar",
      price: 36000, oldPrice: 42000,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "34 grams", dimensions: "22 inches 3-step drape",
      badge: "LIMITED", isBestseller: false, isFeatured: true,
      desc: "Three cascading tiers of uncut polki medallions flanked by South Sea pearl clusters and emerald spacers."
    },
    {
      name: "Aayushi Geometric Gold Choker",
      subcategory: "Contemporary",
      price: 16500, oldPrice: 18900,
      metal: "18K Gold", polish: "Gold", stone: "Solitaire Diamond",
      weight: "15 grams", dimensions: "16 inches choker",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Modern minimalist architectural gold segments set with micro-pavé diamonds for sleek evening wear."
    }
  ],

  "Necklace Sets": [
    {
      name: "Aadya Bridal Kundan & Polki Set",
      subcategory: "Bridal Set",
      price: 48999, oldPrice: 56000,
      metal: "22K Gold", polish: "Gold", stone: "Uncut Polki & Kundan",
      weight: "58 grams", dimensions: "Necklace 16 in, Earrings 2.5 in",
      badge: "BRIDAL CHOICE", isBestseller: true, isFeatured: true,
      desc: "Grand bridal necklace complete with matching tiered chandbali earrings and maang tikka in heritage jadau kundan."
    },
    {
      name: "Kalyani Temple Gold Haram Set",
      subcategory: "Temple Set",
      price: 42500, oldPrice: 48000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "62 grams", dimensions: "Necklace 22 in, Jhumkas 2 in",
      badge: "TEMPLE EDITION", isBestseller: true, isFeatured: true,
      desc: "Long temple haram paired with bell-shaped jhumkas showcasing Lakshmi repoussé relief work and cabochon kemp stones."
    },
    {
      name: "Nilam Celestial Sapphire Bridal Set",
      subcategory: "Sapphire Suite",
      price: 54000, oldPrice: 62000,
      metal: "18K Gold", polish: "Dual Tone", stone: "Ceylonese Sapphire",
      weight: "46 grams", dimensions: "Collar 15 in, Drop Earrings 2 in",
      badge: "HAUTE JOAILLERIE", isBestseller: false, isFeatured: true,
      desc: "Intricately articulated white and yellow gold collar suite complemented by oval sapphire drops and diamond clusters."
    },
    {
      name: "Maharani Polki & Ruby Wedding Suite",
      subcategory: "Bridal Set",
      price: 59999, oldPrice: 69000,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "74 grams", dimensions: "Necklace 17 in, Earrings 3 in",
      badge: "EXCLUSIVE", isBestseller: false, isFeatured: true,
      desc: "Regal necklace and chandelier earring suite studded with certified syndicate polki stones and pigeon blood rubies."
    },
    {
      name: "Dakshin Heritage Laxmi Temple Set",
      subcategory: "Temple Set",
      price: 38900, oldPrice: 44000,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "52 grams", dimensions: "Necklace 18 in, Earrings 1.8 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Intricately carved Goddess Lakshmi medallions on a double-rope chain with matching auspicious jhumkis."
    },
    {
      name: "Zaveri Emerald Bridal Choker Set",
      subcategory: "Bridal Set",
      price: 46000, oldPrice: 52500,
      metal: "22K Gold", polish: "Gold", stone: "Zambian Emerald",
      weight: "48 grams", dimensions: "Choker 15 in, Earrings 2 in",
      badge: "BESTSELLER", isBestseller: true, isFeatured: false,
      desc: "Lustrous uncut polki choker with tumbling emerald bead tassels and coordinating teardrop ear pendants."
    },
    {
      name: "Rajkumari Jadau Pearl Collar Set",
      subcategory: "Jadau Suite",
      price: 36500, oldPrice: 41000,
      metal: "22K Gold", polish: "Antique", stone: "Basra Pearls",
      weight: "41 grams", dimensions: "Collar 16 in, Earrings 2 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Rajasthan jadau craftsmanship featuring woven micro-pearl cords and open-back polki lotus clusters."
    },
    {
      name: "Chandravati Ruby Temple Haram Set",
      subcategory: "Temple Set",
      price: 49500, oldPrice: 57000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "66 grams", dimensions: "Haram 24 in, Jhumkas 2.2 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Regal temple necklace set featuring dancing apsara motifs with unheated ruby accents and antique golden finish."
    },
    {
      name: "Gulbahar Floral Diamond Necklace Set",
      subcategory: "Diamond Suite",
      price: 52000, oldPrice: 60000,
      metal: "18K Gold", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "38 grams", dimensions: "Necklace 16 in, Studs 0.8 in",
      badge: "MODERN BRIDE", isBestseller: false, isFeatured: false,
      desc: "Contemporary floral cluster necklace in 18K white gold with matching round brilliant-cut solitaire earrings."
    },
    {
      name: "Rukmani Antique Mango Mala Set",
      subcategory: "Manga Malai",
      price: 41000, oldPrice: 47000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "55 grams", dimensions: "Mala 20 in, Earrings 1.9 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Timeless South Indian paisley manga malai linked with ruby-studded mango motifs and matching antique drops."
    },
    {
      name: "Noorani Polki Hasli & Studs Set",
      subcategory: "Hasli Set",
      price: 33000, oldPrice: 38000,
      metal: "22K Gold", polish: "Gold", stone: "Uncut Polki & Kundan",
      weight: "36 grams", dimensions: "Hasli 15 in, Tops 1 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Structured torque hasli with reversible floral meenakari enamel and matching circular polki button studs."
    },
    {
      name: "Swarnanjali 22K Gold Choker Set",
      subcategory: "Traditional Set",
      price: 29500, oldPrice: 34000,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "34 grams", dimensions: "Choker 15 in, Jhumkas 1.7 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Solid 22 karat gold mesh choker with hanging golden bead fringe and handcrafted dome jhumkis."
    },
    {
      name: "Vasundhara Kempu Heritage Set",
      subcategory: "Temple Set",
      price: 37500, oldPrice: 43000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "49 grams", dimensions: "Necklace 18 in, Earrings 2 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Deep red kempu gemstones set in 22K antique gold casing with floral repoussé links and matching earrings."
    },
    {
      name: "Meera Vintage Pearl Mala Suite",
      subcategory: "Pearl Suite",
      price: 34500, oldPrice: 39500,
      metal: "22K Gold", polish: "Gold", stone: "Basra Pearls",
      weight: "43 grams", dimensions: "Mala 22 in, Chandbalis 2.5 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Seven-strand natural pearl satlada mala connected by gold jadau clasps with statement crescent chandbalis."
    },
    {
      name: "Aadishree Royal Navratna Set",
      subcategory: "Navratna Suite",
      price: 45000, oldPrice: 51000,
      metal: "22K Gold", polish: "Gold", stone: "Navratna Gemstones",
      weight: "51 grams", dimensions: "Necklace 18 in, Drops 1.8 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Complete sacred nine-gem necklace suite set in polished yellow gold with coordinating navratna drop earrings."
    }
  ],

  Chains: [
    {
      name: "Sovereign 22K Solid Gold Link Chain",
      subcategory: "Curb Chain",
      price: 12999, oldPrice: 14999,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "11 grams", dimensions: "20 inches length, 3.2 mm width",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Substantial 22 karat solid yellow gold curb chain with precision diamond-cut beveled edges and lobster clasp."
    },
    {
      name: "Imperial 3:1 Figaro Gold Chain",
      subcategory: "Figaro Chain",
      price: 14500, oldPrice: 16800,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "13 grams", dimensions: "22 inches length, 3.8 mm width",
      badge: "POPULAR", isBestseller: true, isFeatured: true,
      desc: "Timeless Italian Figaro pattern featuring three circular links alternating with an elongated oval link in 22K gold."
    },
    {
      name: "Arya Diamond-Cut Rope Chain",
      subcategory: "Rope Chain",
      price: 16800, oldPrice: 19500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "15 grams", dimensions: "24 inches length, 4.0 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Tightly interwoven spiral rope chain capturing and reflecting ambient light from every facet."
    },
    {
      name: "Vanguard 18K White Gold Wheat Chain",
      subcategory: "Wheat Chain",
      price: 11200, oldPrice: 13000,
      metal: "18K Gold", polish: "Rhodium", stone: "Plain Gold",
      weight: "9 grams", dimensions: "18 inches length, 2.5 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Flexible four-strand wheat chain in 18K white gold with rhodium plating for exceptional shine and durability."
    },
    {
      name: "Rudra 22K Solid Box Link Chain",
      subcategory: "Box Chain",
      price: 13800, oldPrice: 15900,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "12 grams", dimensions: "20 inches length, 2.8 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Clean geometric square box links delivering unmatched structural resilience and smooth skin contact."
    },
    {
      name: "Titan Heavy Mariner Link Chain",
      subcategory: "Mariner Chain",
      price: 21000, oldPrice: 24500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "20 grams", dimensions: "22 inches length, 5.0 mm width",
      badge: "BOLD", isBestseller: false, isFeatured: false,
      desc: "Substantial anchor/mariner style links with center reinforcing bar, crafted in certified 22 karat gold."
    },
    {
      name: "Aditya Rounded Snake Chain",
      subcategory: "Snake Chain",
      price: 9999, oldPrice: 11500,
      metal: "18K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "8 grams", dimensions: "18 inches length, 2.0 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Silky, seamless snake chain links with mirror-finish cylindrical contouring for effortless drape."
    },
    {
      name: "Prana Dual-Tone Gold Spiga Chain",
      subcategory: "Spiga Chain",
      price: 15200, oldPrice: 17500,
      metal: "18K Gold", polish: "Dual Tone", stone: "Plain Gold",
      weight: "12 grams", dimensions: "20 inches length, 3.0 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Braided teardrop spiga links alternating between yellow and white gold in a dynamic interlocking weave."
    },
    {
      name: "Indra 22K Textured Singapore Chain",
      subcategory: "Singapore Chain",
      price: 8999, oldPrice: 10400,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "7 grams", dimensions: "18 inches length, 2.2 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Delicate twisted Singapore wave chain that shimmers dynamically with every subtle movement."
    },
    {
      name: "Gaurav Flat Herringbone Gold Chain",
      subcategory: "Herringbone Chain",
      price: 18500, oldPrice: 21500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "17 grams", dimensions: "18 inches length, 5.5 mm width",
      badge: "VINTAGE", isBestseller: false, isFeatured: false,
      desc: "Ultra-flat polished herringbone chain lying flush against the collarbone with liquid gold fluidity."
    },
    {
      name: "Surya 22K Handcrafted Foxtail Chain",
      subcategory: "Foxtail Chain",
      price: 17900, oldPrice: 20500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "16 grams", dimensions: "22 inches length, 3.5 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Dense chevron-patterned foxtail weave made entirely by hand in hallmarked 916 purity yellow gold."
    },
    {
      name: "Nirvana Platinum Cable Link Chain",
      subcategory: "Cable Chain",
      price: 24000, oldPrice: 27500,
      metal: "Platinum", polish: "Rhodium", stone: "Plain Gold",
      weight: "14 grams", dimensions: "20 inches length, 2.6 mm width",
      badge: "PLATINUM 950", isBestseller: false, isFeatured: false,
      desc: "Dense 950 purity solid platinum cable links offering superior strength and hypoallergenic comfort."
    },
    {
      name: "Maya Rose Gold Venetian Box Chain",
      subcategory: "Box Chain",
      price: 10500, oldPrice: 12200,
      metal: "Rose Gold", polish: "Rose Gold", stone: "Plain Gold",
      weight: "8 grams", dimensions: "18 inches length, 2.2 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Romantic 18K blush rose gold box chain with polished geometric links and secure spring ring."
    },
    {
      name: "Veer 22K Hollow Cuban Link Chain",
      subcategory: "Cuban Chain",
      price: 19800, oldPrice: 23000,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "18 grams", dimensions: "24 inches length, 6.0 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Voluminous Miami Cuban chain engineered with lightweight hollow core for grand visual presence."
    },
    {
      name: "Anand Delicate Gold Trace Chain",
      subcategory: "Trace Chain",
      price: 7499, oldPrice: 8700,
      metal: "18K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "5 grams", dimensions: "16 inches length, 1.8 mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Featherlight 18K yellow gold trace chain ideal for suspending lightweight lockets and solitary charms."
    }
  ],

  "Cross Chains": [
    {
      name: "Elysian Layered Gold Cross Chain",
      subcategory: "Cross Chain",
      price: 14999, oldPrice: 17500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "12 grams", dimensions: "Chain 20 in, Cross 1.5 in",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Sculpted 22K yellow gold Latin crucifix suspended from a classic diamond-cut cable link chain."
    },
    {
      name: "St. Jude Platinum Cross Chain",
      subcategory: "Cross Chain",
      price: 27999, oldPrice: 32000,
      metal: "Platinum", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "16 grams", dimensions: "Chain 22 in, Cross 1.6 in",
      badge: "PLATINUM 950", isBestseller: false, isFeatured: true,
      desc: "Hallmarked Pt950 solid platinum cross centered with a round brilliant diamond on an Italian curb chain."
    },
    {
      name: "Rose Gold Pavé Cross Chain",
      subcategory: "Cross Chain",
      price: 13500, oldPrice: 15800,
      metal: "Rose Gold", polish: "Rose Gold", stone: "Solitaire Diamond",
      weight: "10 grams", dimensions: "Chain 18 in, Cross 1.2 in",
      badge: "TRENDING", isBestseller: true, isFeatured: true,
      desc: "Romantic 18K rose gold crucifix set with 24 micro-pavé diamonds on a delicate faceted trace chain."
    },
    {
      name: "Constantine Byzantine Cross Chain",
      subcategory: "Cross Chain",
      price: 18900, oldPrice: 22000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "15 grams", dimensions: "Chain 22 in, Cross 1.8 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Historical Byzantine flared-arm cross in antique matte gold with ruby cabochon terminal points."
    },
    {
      name: "Aethelred Orthodox Cross Chain",
      subcategory: "Cross Chain",
      price: 16200, oldPrice: 18900,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "13 grams", dimensions: "Chain 20 in, Cross 1.4 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Three-bar Russian Orthodox cross with engraved IC XC NIKA emblems on a sturdy rope chain."
    },
    {
      name: "Celeste Diamond Bezel Cross Chain",
      subcategory: "Cross Chain",
      price: 22500, oldPrice: 26000,
      metal: "18K Gold", polish: "Gold", stone: "Solitaire Diamond",
      weight: "11 grams", dimensions: "Chain 18 in, Cross 1.3 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Eleven bezel-set brilliant diamonds linked together to form a dazzling, minimalist Christian cross."
    },
    {
      name: "Verona Dual-Tone Crucifix Chain",
      subcategory: "Cross Chain",
      price: 17800, oldPrice: 20500,
      metal: "18K Gold", polish: "Dual Tone", stone: "Plain Gold",
      weight: "14 grams", dimensions: "Chain 22 in, Cross 1.7 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Yellow gold cross body featuring an embossed white gold Corpus Christi figure on a wheat chain."
    },
    {
      name: "Jerusalem Filigree Cross Chain",
      subcategory: "Cross Chain",
      price: 15400, oldPrice: 17800,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "12 grams", dimensions: "Chain 20 in, Cross 1.5 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Intricate lacework filigree Jerusalem cross with four small crosslets occupying each corner quadrant."
    },
    {
      name: "Kensington Celtic Knot Cross Chain",
      subcategory: "Cross Chain",
      price: 19500, oldPrice: 22800,
      metal: "22K Gold", polish: "Antique", stone: "Zambian Emerald",
      weight: "16 grams", dimensions: "Chain 24 in, Cross 1.9 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Celtic ringed high cross decorated with endless knotwork carvings and a center square emerald."
    },
    {
      name: "Geneva Slim Gold Cross Chain",
      subcategory: "Cross Chain",
      price: 9800, oldPrice: 11400,
      metal: "18K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "7 grams", dimensions: "Chain 18 in, Cross 1.0 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Sleek, high-polish tubular gold cross designed for understated daily devotion and modern layering."
    },
    {
      name: "Valletta Maltese Cross Chain",
      subcategory: "Cross Chain",
      price: 16800, oldPrice: 19500,
      metal: "22K Gold", polish: "Gold", stone: "Basra Pearls",
      weight: "13 grams", dimensions: "Chain 20 in, Cross 1.4 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Eight-pointed Maltese cross with seed pearl terminal accents suspended from a diamond-cut box chain."
    },
    {
      name: "Sanctuary Engraved Gold Cross Chain",
      subcategory: "Cross Chain",
      price: 13900, oldPrice: 16200,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "11 grams", dimensions: "Chain 20 in, Cross 1.3 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Satin-finished 22K yellow gold cross engraved with the Lord's Prayer on an interlocking Figaro chain."
    },
    {
      name: "Lourdes Sapphire Accented Cross Chain",
      subcategory: "Cross Chain",
      price: 21000, oldPrice: 24500,
      metal: "18K Gold", polish: "Rhodium", stone: "Ceylonese Sapphire",
      weight: "12 grams", dimensions: "Chain 18 in, Cross 1.4 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "18K white gold crucifix bordered by channel-set Ceylon blue sapphires and fine milgrain edging."
    },
    {
      name: "Avignon Gothic Trefoil Cross Chain",
      subcategory: "Cross Chain",
      price: 18200, oldPrice: 21000,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "14 grams", dimensions: "Chain 22 in, Cross 1.6 in",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Gothic architectural trefoil cross ends crafted in warm antique gold on an oxidized link chain."
    },
    {
      name: "Trinity Triple Layered Cross Chain",
      subcategory: "Layered Chain",
      price: 23500, oldPrice: 27000,
      metal: "18K Gold", polish: "Dual Tone", stone: "Solitaire Diamond",
      weight: "17 grams", dimensions: "Chains 16, 18, 20 in",
      badge: "TRENDING", isBestseller: false, isFeatured: false,
      desc: "Curated trio of layered chains featuring a micro cross, solitaire diamond bezel, and hammered coin."
    }
  ],

  Pendants: [
    {
      name: "Ananya Navratna Gemstone Pendant",
      subcategory: "Navratna Pendant",
      price: 9999, oldPrice: 11999,
      metal: "22K Gold", polish: "Gold", stone: "Navratna Gemstones",
      weight: "7 grams", dimensions: "Pendant 1.4 in length",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Auspicious nine planetary gemstones framed in a solar halo of hallmarked 22 karat yellow gold."
    },
    {
      name: "Surya Divine Sun Medallion",
      subcategory: "Temple Pendant",
      price: 11500, oldPrice: 13500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "9 grams", dimensions: "Diameter 1.3 inches",
      badge: "DEVOTIONAL", isBestseller: true, isFeatured: true,
      desc: "Radiant Surya sunburst medallion featuring intricate repoussé rays and a centered auspicious om emblem."
    },
    {
      name: "Mayura Solitaire Teardrop Pendant",
      subcategory: "Teardrop",
      price: 14200, oldPrice: 16500,
      metal: "18K Gold", polish: "Gold", stone: "Solitaire Diamond",
      weight: "6 grams", dimensions: "Length 1.1 inches",
      badge: "EXCLUSIVE", isBestseller: false, isFeatured: true,
      desc: "Pear-shaped brilliant diamond haloed by micro-pavé gems on an 18K yellow gold bail."
    },
    {
      name: "Ganesha Auspicious Gold Pendant",
      subcategory: "Devotional",
      price: 12800, oldPrice: 14900,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "10 grams", dimensions: "Length 1.5 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Graceful handcrafted Lord Ganesha silhouette accented by a natural ruby eye and antique gold finish."
    },
    {
      name: "Padma Blooming Lotus Gold Pendant",
      subcategory: "Floral",
      price: 8999, oldPrice: 10500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "6 grams", dimensions: "Diameter 1.0 inch",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Multi-layered three-dimensional lotus petals blooming outward from a polished golden stamen."
    },
    {
      name: "Nilambari Emerald Drop Pendant",
      subcategory: "Gemstone",
      price: 17500, oldPrice: 20000,
      metal: "18K Gold", polish: "Gold", stone: "Zambian Emerald",
      weight: "8 grams", dimensions: "Length 1.4 inches",
      badge: "TRENDING", isBestseller: false, isFeatured: false,
      desc: "Oval-cut certified Zambian emerald surrounded by brilliant-cut diamond accents on 18K gold."
    },
    {
      name: "Kundan Chandramukhi Polki Pendant",
      subcategory: "Jadau",
      price: 15900, oldPrice: 18500,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "11 grams", dimensions: "Length 1.6 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Crescent jadau polki medallion with enameled peacock backing and suspended natural pearl bunch."
    },
    {
      name: "Shyamala Peacock Enamel Pendant",
      subcategory: "Meenakari",
      price: 13400, oldPrice: 15600,
      metal: "22K Gold", polish: "Gold", stone: "Burmese Ruby",
      weight: "9 grams", dimensions: "Length 1.3 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Vibrant Banaras green and cobalt meenakari enamel peacock with ruby eye and golden feathers."
    },
    {
      name: "Aethelgard Solitaire Diamond Pendant",
      subcategory: "Solitaire",
      price: 21900, oldPrice: 25000,
      metal: "18K Gold", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "5 grams", dimensions: "Length 0.8 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Classic six-prong basket mounting holding an exceptional round brilliant solitaire diamond."
    },
    {
      name: "Vasuki Naga Temple Gold Pendant",
      subcategory: "Temple",
      price: 16000, oldPrice: 18800,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "12 grams", dimensions: "Length 1.7 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Sacred coiled serpent motif representing protection and wisdom, carved in deep relief antique gold."
    },
    {
      name: "Tara Filigree Heart Locket Pendant",
      subcategory: "Locket",
      price: 10800, oldPrice: 12500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "8 grams", dimensions: "Length 1.2 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Hinged keepsake locket with delicate filigree lattice work allowing two miniature photographs inside."
    },
    {
      name: "Dakshina Laxmi Coin Pendant",
      subcategory: "Kasumala",
      price: 7999, oldPrice: 9200,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "5 grams", dimensions: "Diameter 0.9 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Traditional Lakshmi kasu gold coin with seated goddess relief and ornate floral border loop."
    },
    {
      name: "Rohini Basra Pearl Teardrop Pendant",
      subcategory: "Pearl",
      price: 11900, oldPrice: 13800,
      metal: "22K Gold", polish: "Gold", stone: "Basra Pearls",
      weight: "7 grams", dimensions: "Length 1.3 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Lustrous teardrop natural pearl capped with ornate 22K gold granulation and filigree cap."
    },
    {
      name: "Rudraksha 22K Gold Cap Pendant",
      subcategory: "Spiritual",
      price: 8500, oldPrice: 9800,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "6 grams", dimensions: "Length 1.1 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Genuine five-mukhi sacred Rudraksha bead encased between handcrafted 22K gold designer caps."
    },
    {
      name: "Trishul & Damru Divine Gold Pendant",
      subcategory: "Devotional",
      price: 12500, oldPrice: 14500,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "9 grams", dimensions: "Length 1.6 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Auspicious Shiva Trishul and Damru emblem rendered with sharp lines and antique matte finish."
    }
  ],

  Earrings: [
    {
      name: "Chandrika Heritage Meenakari Jhumkas",
      subcategory: "Jhumka",
      price: 14500, oldPrice: 16999,
      metal: "22K Gold", polish: "Antique", stone: "Basra Pearls",
      weight: "15 grams", dimensions: "Length 2.2 inches",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Classic bell jhumkas adorned with ruby-red meenakari inlay, seed pearl droplets, and floral stud tops."
    },
    {
      name: "Basra Pearl Chandelier Drop Earrings",
      subcategory: "Drops",
      price: 16800, oldPrice: 19500,
      metal: "22K Gold", polish: "Gold", stone: "Basra Pearls",
      weight: "17 grams", dimensions: "Length 2.5 inches",
      badge: "HERITAGE", isBestseller: true, isFeatured: true,
      desc: "Tiered chandelier earrings with cascades of natural Basra pearls strung on delicate gold link wires."
    },
    {
      name: "Rajwada Royal Gold Chandbali Earrings",
      subcategory: "Chandbali",
      price: 18999, oldPrice: 22000,
      metal: "22K Gold", polish: "Gold", stone: "Uncut Polki & Kundan",
      weight: "19 grams", dimensions: "Length 2.8 inches",
      badge: "ROYAL", isBestseller: false, isFeatured: true,
      desc: "Crescent-shaped Mughal chandbalis set with uncut polki diamonds and finished with micro-pearl latkans."
    },
    {
      name: "Aadya Temple Peacock Stud Earrings",
      subcategory: "Studs",
      price: 8999, oldPrice: 10500,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "8 grams", dimensions: "Diameter 0.8 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Handcrafted 22K gold peacock ear tops featuring detailed feather etching and centered ruby stones."
    },
    {
      name: "Celeste Solitaire Diamond Studs",
      subcategory: "Solitaire Studs",
      price: 24500, oldPrice: 28000,
      metal: "18K Gold", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "4 grams", dimensions: "0.5 ct each, 4-prong setting",
      badge: "ESSENTIAL", isBestseller: true, isFeatured: false,
      desc: "Timeless four-prong solitaire diamond studs in 18K white gold, certified VVS clarity and ideal cut."
    },
    {
      name: "Mayuri Filigree Gold Jhumkas",
      subcategory: "Jhumka",
      price: 12500, oldPrice: 14500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "12 grams", dimensions: "Length 1.9 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Airy filigree wirework bell domes with dangling golden bead droplets in high-polish 22 karat gold."
    },
    {
      name: "Zeenat Kundan Chandbali Drops",
      subcategory: "Chandbali",
      price: 15900, oldPrice: 18500,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "16 grams", dimensions: "Length 2.4 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Antique gold crescent earrings encrusted with foil-backed kundan gems and emerald bead fringes."
    },
    {
      name: "Nilambari Sapphire Floral Studs",
      subcategory: "Studs",
      price: 13800, oldPrice: 16000,
      metal: "18K Gold", polish: "Gold", stone: "Ceylonese Sapphire",
      weight: "6 grams", dimensions: "Diameter 0.7 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Flower blossom earrings featuring six Ceylon sapphire petals surrounding a brilliant diamond center."
    },
    {
      name: "Swarnakshi Traditional Kanphool",
      subcategory: "Kanphool",
      price: 21000, oldPrice: 24500,
      metal: "22K Gold", polish: "Gold", stone: "Burmese Ruby",
      weight: "22 grams", dimensions: "Full ear coverage with sahara",
      badge: "VINTAGE", isBestseller: false, isFeatured: false,
      desc: "Heritage bridal kanphool ear adornment with ear-supporting pearl chain sahara and ruby florets."
    },
    {
      name: "Hemalata Rose Gold Huggie Hoops",
      subcategory: "Hoops",
      price: 9400, oldPrice: 10900,
      metal: "Rose Gold", polish: "Rose Gold", stone: "Solitaire Diamond",
      weight: "5 grams", dimensions: "Diameter 0.6 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Sleek 18K rose gold hinged huggie hoops paved with micro-diamonds for elegant daily comfort."
    },
    {
      name: "Padma Dual-Tone Lotus Ear Drops",
      subcategory: "Drops",
      price: 11200, oldPrice: 13000,
      metal: "18K Gold", polish: "Dual Tone", stone: "Plain Gold",
      weight: "9 grams", dimensions: "Length 1.5 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Curved white and yellow gold lotus petals suspended from articulated geometric ear hooks."
    },
    {
      name: "Kaveri Antique Temple Coin Jhumkas",
      subcategory: "Jhumka",
      price: 13900, oldPrice: 16200,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "14 grams", dimensions: "Length 2.0 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Auspicious Lakshmi coin tops anchored to antique bell jhumkis with delicate golden chain dori."
    },
    {
      name: "Meera Polki & Emerald Earcuffs",
      subcategory: "Earcuffs",
      price: 17500, oldPrice: 20500,
      metal: "22K Gold", polish: "Antique", stone: "Zambian Emerald",
      weight: "16 grams", dimensions: "Length 2.2 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Contemporary silhouette ear-climbers set with uncut polki slices and emerald cluster finials."
    },
    {
      name: "Sultana Geometric Diamond Hoops",
      subcategory: "Hoops",
      price: 19500, oldPrice: 22800,
      metal: "18K Gold", polish: "Gold", stone: "Solitaire Diamond",
      weight: "10 grams", dimensions: "Diameter 1.2 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Inside-out diamond hoop earrings engineered so diamonds face forward from both exterior and interior."
    },
    {
      name: "Devaki Kempu Temple Drops",
      subcategory: "Drops",
      price: 10500, oldPrice: 12200,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "11 grams", dimensions: "Length 1.6 inches",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Traditional red kempu teardrops nestled inside 22K antique gold bezel prongs with screwback posts."
    }
  ],

  Rings: [
    {
      name: "Koh-i-Noor Cushion Cut Solitaire Ring",
      subcategory: "Solitaire Ring",
      price: 28999, oldPrice: 33500,
      metal: "18K Gold", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "6 grams", dimensions: "Size 14 Indian (Customizable)",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Splendid cushion-cut certified solitaire diamond held securely in an 18K white gold cathedral shank."
    },
    {
      name: "Zambian Emerald & Diamond Halo Ring",
      subcategory: "Cocktail Ring",
      price: 22500, oldPrice: 26000,
      metal: "18K Gold", polish: "Gold", stone: "Zambian Emerald",
      weight: "7 grams", dimensions: "Size 13 Indian",
      badge: "NEW ARRIVAL", isBestseller: true, isFeatured: true,
      desc: "Vivid green octagon-cut Zambian emerald surrounded by a double halo of brilliant pavé diamonds."
    },
    {
      name: "Burmese Ruby Vintage Cocktail Ring",
      subcategory: "Cocktail Ring",
      price: 19800, oldPrice: 23000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "9 grams", dimensions: "Size 15 Indian",
      badge: "VINTAGE", isBestseller: false, isFeatured: true,
      desc: "Oval natural Burmese ruby framed by ornate hand-chased antique gold petals and milgrain borders."
    },
    {
      name: "Aadya Polki Floral Statement Ring",
      subcategory: "Statement Ring",
      price: 16500, oldPrice: 19000,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "11 grams", dimensions: "Adjustable shank",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Oversized Mughal floral statement ring with uncut polki petals, meenakari underside, and adjustable ring band."
    },
    {
      name: "Nilam Ceylon Sapphire Trilogy Ring",
      subcategory: "Trilogy Ring",
      price: 26000, oldPrice: 30000,
      metal: "Platinum", polish: "Rhodium", stone: "Ceylonese Sapphire",
      weight: "8 grams", dimensions: "Size 12 Indian",
      badge: "PLATINUM 950", isBestseller: false, isFeatured: false,
      desc: "Three-stone trilogy ring representing past, present, and future with natural blue sapphires in solid Pt950."
    },
    {
      name: "Navratna Astrological Balance Ring",
      subcategory: "Navratna Ring",
      price: 14800, oldPrice: 17200,
      metal: "22K Gold", polish: "Gold", stone: "Navratna Gemstones",
      weight: "8 grams", dimensions: "Size 16 Indian",
      badge: "SACRED", isBestseller: true, isFeatured: false,
      desc: "Nine sacred planetary gems set in an auspicious cosmic mandala pattern in solid 22K yellow gold."
    },
    {
      name: "Chandrika Pearl Cluster Cocktail Ring",
      subcategory: "Cocktail Ring",
      price: 12900, oldPrice: 15000,
      metal: "22K Gold", polish: "Gold", stone: "Basra Pearls",
      weight: "10 grams", dimensions: "Adjustable shank",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Bunch of luminous natural seed pearls blooming from a golden floral basket with carved leaves."
    },
    {
      name: "Mayuri Filigree Gold Dome Ring",
      subcategory: "Dome Ring",
      price: 11500, oldPrice: 13200,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "8 grams", dimensions: "Size 14 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Handcrafted filigree dome ring featuring micro-granulation beads and open-air scrolling arabesques."
    },
    {
      name: "Samrat 22K Men's Lion Signet Ring",
      subcategory: "Signet Ring",
      price: 21500, oldPrice: 25000,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "14 grams", dimensions: "Size 20 Indian",
      badge: "FOR MEN", isBestseller: false, isFeatured: false,
      desc: "Heavy solid 22K gold signet ring featuring a sculpted lion head emblem symbolising courage and royalty."
    },
    {
      name: "Elysia Diamond Bypass Ring",
      subcategory: "Bypass Ring",
      price: 17200, oldPrice: 19800,
      metal: "18K Gold", polish: "Dual Tone", stone: "Solitaire Diamond",
      weight: "6 grams", dimensions: "Size 13 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Fluid bypass ribbon band in dual-tone gold ending in twin sparkling round diamonds."
    },
    {
      name: "Kempu Heritage Temple Ring",
      subcategory: "Temple Ring",
      price: 13500, oldPrice: 15600,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "9 grams", dimensions: "Size 15 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "South Indian antique temple ring with square cabochon kemp stones surrounding a central golden flower."
    },
    {
      name: "Celeste Eternity Emerald Band Ring",
      subcategory: "Eternity Ring",
      price: 18400, oldPrice: 21500,
      metal: "18K Gold", polish: "Gold", stone: "Zambian Emerald",
      weight: "5 grams", dimensions: "Size 14 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Continuous circle of channel-set square French-cut Zambian emeralds in 18K yellow gold."
    },
    {
      name: "Aadrika Floral Meenakari Ring",
      subcategory: "Meenakari Ring",
      price: 15200, oldPrice: 17800,
      metal: "22K Gold", polish: "Gold", stone: "Uncut Polki & Kundan",
      weight: "10 grams", dimensions: "Adjustable shank",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Pink Jaipur gulabi meenakari enamel floral ring with uncut polki center and adjustable shank."
    },
    {
      name: "Padma Sculpted Lotus Bud Ring",
      subcategory: "Solitaire Ring",
      price: 16800, oldPrice: 19500,
      metal: "18K Gold", polish: "Gold", stone: "Solitaire Diamond",
      weight: "6 grams", dimensions: "Size 12 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Delicate lotus bud prongs opening to present a certified laboratory-grown solitaire diamond."
    },
    {
      name: "Sultana Antique Paisley Finger Ring",
      subcategory: "Statement Ring",
      price: 14200, oldPrice: 16500,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "9 grams", dimensions: "Size 15 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Traditional paisley motif curving along the finger, studded with seed rubies and micro-pearls."
    }
  ],

  "Hug Rings": [
    {
      name: "Devotion Gold Twist Hug Ring",
      subcategory: "Hug Ring",
      price: 7999, oldPrice: 9500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "5 grams", dimensions: "Size 13 Indian (Comfort Fit)",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Ergonomically contoured comfort-fit band with gentle twisting spirals that hug the finger naturally."
    },
    {
      name: "Eternity Pavé Diamond Hug Band",
      subcategory: "Hug Band",
      price: 13999, oldPrice: 16200,
      metal: "18K Gold", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "4 grams", dimensions: "Size 12 Indian",
      badge: "POPULAR", isBestseller: true, isFeatured: true,
      desc: "Low-profile micro-pavé diamond eternity band designed to hug engagement rings seamlessly without gaps."
    },
    {
      name: "Celeste Sapphire Stackable Hug Ring",
      subcategory: "Stackable",
      price: 11500, oldPrice: 13200,
      metal: "18K Gold", polish: "Gold", stone: "Ceylonese Sapphire",
      weight: "4 grams", dimensions: "Size 14 Indian",
      badge: "TRENDING", isBestseller: false, isFeatured: true,
      desc: "Slim stackable ring with alternating round blue sapphires and bezel-set diamond accents."
    },
    {
      name: "Aadya Rose Gold Twisted Hug Ring",
      subcategory: "Hug Ring",
      price: 8500, oldPrice: 9900,
      metal: "Rose Gold", polish: "Rose Gold", stone: "Plain Gold",
      weight: "4 grams", dimensions: "Size 13 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Braided 18K rose gold ropes intertwining in a continuous harmonious band with mirror polish."
    },
    {
      name: "Mayuri Beaded Contour Hug Ring",
      subcategory: "Contour Ring",
      price: 6999, oldPrice: 8200,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "4 grams", dimensions: "Size 14 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Delicate milgrain-beaded contour band shaped to hug solitaire gemstones and cocktail settings."
    },
    {
      name: "Nirvana Platinum Comfort Hug Band",
      subcategory: "Comfort Band",
      price: 18500, oldPrice: 21500,
      metal: "Platinum", polish: "Rhodium", stone: "Plain Gold",
      weight: "7 grams", dimensions: "Size 15 Indian, 3mm width",
      badge: "PLATINUM 950", isBestseller: false, isFeatured: false,
      desc: "Ultra-pure Pt950 platinum wedding band engineered with rounded interior curves for supreme comfort."
    },
    {
      name: "Zeenat Emerald Accent Hug Band",
      subcategory: "Stackable",
      price: 12200, oldPrice: 14000,
      metal: "18K Gold", polish: "Gold", stone: "Zambian Emerald",
      weight: "4 grams", dimensions: "Size 12 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Petite 18K gold band set with a graduated chevron arc of natural emeralds designed to wrap stones."
    },
    {
      name: "Vasundhara Hammered Gold Hug Ring",
      subcategory: "Textured Band",
      price: 9200, oldPrice: 10700,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "6 grams", dimensions: "Size 15 Indian, 4mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Artisanal hand-hammered facets scattering light with an organic, tactile matte antique texture."
    },
    {
      name: "Swarna V-Shaped Chevron Hug Ring",
      subcategory: "Chevron Band",
      price: 7499, oldPrice: 8800,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "4 grams", dimensions: "Size 13 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Clean geometric V-shaped chevron ring that nests gracefully beneath any marquise or pear ring."
    },
    {
      name: "Chandrika Pearl Dot Hug Ring",
      subcategory: "Pearl Band",
      price: 8900, oldPrice: 10400,
      metal: "22K Gold", polish: "Gold", stone: "Basra Pearls",
      weight: "5 grams", dimensions: "Size 14 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Alternating bezel-set seed pearls and polished gold spheres creating a textured beaded band."
    },
    {
      name: "Samriddhi Dual-Tone Interlocking Hug Ring",
      subcategory: "Interlocking",
      price: 14500, oldPrice: 16800,
      metal: "18K Gold", polish: "Dual Tone", stone: "Plain Gold",
      weight: "6 grams", dimensions: "Size 14 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Twin interlocking rolling bands in rose and white gold that slide smoothly over the knuckle."
    },
    {
      name: "Padma Engraved Floral Hug Band",
      subcategory: "Engraved Band",
      price: 9800, oldPrice: 11400,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "5 grams", dimensions: "Size 15 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Delicate continuous vine and blossom pattern hand-engraved around a solid 22K yellow gold band."
    },
    {
      name: "Tara Diamond Curved Crown Hug Ring",
      subcategory: "Crown Band",
      price: 15800, oldPrice: 18200,
      metal: "18K Gold", polish: "Gold", stone: "Solitaire Diamond",
      weight: "4 grams", dimensions: "Size 13 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Tiara-inspired curved crown band featuring seven graduating round diamonds crowning your ring."
    },
    {
      name: "Rukmani Ruby Channel Hug Ring",
      subcategory: "Channel Band",
      price: 12800, oldPrice: 14900,
      metal: "22K Gold", polish: "Gold", stone: "Burmese Ruby",
      weight: "5 grams", dimensions: "Size 14 Indian",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Channel-set square natural rubies secured between smooth protective gold borders without snagging."
    },
    {
      name: "Aadishree Minimalist Gold Wire Hug Ring",
      subcategory: "Slim Band",
      price: 5999, oldPrice: 6999,
      metal: "18K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "3 grams", dimensions: "Size 12 Indian, 1.5mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Ultra-slim solid 18K yellow gold wire band, ideal for multi-finger curation and stacking."
    }
  ],

  Bangles: [
    {
      name: "Gokharu Traditional Gold Kada Pair",
      subcategory: "Kada Pair",
      price: 36999, oldPrice: 42000,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "42 grams", dimensions: "Size 2.6 (Inner Diameter 60mm)",
      badge: "HERITAGE", isBestseller: true, isFeatured: true,
      desc: "Classic Gujarati gokharu spike-stud kada pair cast in pure 22K antique gold with screw closures."
    },
    {
      name: "Aethelgard Diamond Openable Bangle",
      subcategory: "Diamond Bangle",
      price: 29999, oldPrice: 34500,
      metal: "18K Gold", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "24 grams", dimensions: "Size 2.4 (Openable with clasp)",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Channel-set diamond single-line openable bangle in 18K white gold with hidden box clasp and safety lock."
    },
    {
      name: "Tarakasi Cuttack Filigree Gold Bangles",
      subcategory: "Filigree Pair",
      price: 24500, oldPrice: 28000,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "28 grams", dimensions: "Size 2.6 Pair",
      badge: "ARTISANAL", isBestseller: false, isFeatured: true,
      desc: "Pair of delicate filigree lace bangles from the master silversmiths and goldsmiths of Odisha."
    },
    {
      name: "Padmavati Ruby Enamel Kada",
      subcategory: "Meenakari Kada",
      price: 32000, oldPrice: 37000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "36 grams", dimensions: "Size 2.4",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Rajasthani pachchikam kada featuring elephant head makara finials with ruby eyes and reverse enamel."
    },
    {
      name: "Kalyani Temple Lakshmi Repoussé Kada",
      subcategory: "Temple Kada",
      price: 38500, oldPrice: 44000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "44 grams", dimensions: "Size 2.6",
      badge: "DEVOTIONAL", isBestseller: true, isFeatured: false,
      desc: "Wide cuff kada showcasing Goddess Lakshmi surrounded by floral vine scrolls in high-relief repoussé."
    },
    {
      name: "Swarna Rekha Classic Gold Churi Set",
      subcategory: "Churi Set of 4",
      price: 28900, oldPrice: 33000,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "32 grams", dimensions: "Size 2.6 Set of 4",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Set of four daily-wear solid gold bangles with diamond-cut faceted grooves reflecting brilliant light."
    },
    {
      name: "Zeenat Polki & Pearl Openable Kada",
      subcategory: "Jadau Kada",
      price: 34000, oldPrice: 39000,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "38 grams", dimensions: "Size 2.4 (Hinged)",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Hinged antique kada bordered by seed pearls and centering a row of open-back syndicate polki gems."
    },
    {
      name: "Nilambari Sapphire & Diamond Bangle",
      subcategory: "Gemstone Bangle",
      price: 31000, oldPrice: 35500,
      metal: "18K Gold", polish: "Gold", stone: "Ceylonese Sapphire",
      weight: "26 grams", dimensions: "Size 2.4",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Alternating oval blue sapphires and brilliant diamond clusters set in an elegant scalloped gold frame."
    },
    {
      name: "Mayura Peacock Carved Gold Kada",
      subcategory: "Animal Motif Kada",
      price: 35500, oldPrice: 41000,
      metal: "22K Gold", polish: "Gold", stone: "Burmese Ruby",
      weight: "40 grams", dimensions: "Size 2.6",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Twin peacock heads meeting at the center with ruby eyes and feathered golden neck details."
    },
    {
      name: "Chandramukhi Polki Churi Pair",
      subcategory: "Jadau Pair",
      price: 26500, oldPrice: 30500,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "30 grams", dimensions: "Size 2.4 Pair",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Pair of slim polki bangles designed to sandwich glass or gold bangles in festive wedding sets."
    },
    {
      name: "Vasundhara Solid Antique Gold Kada",
      subcategory: "Solid Kada",
      price: 41000, oldPrice: 47000,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "48 grams", dimensions: "Size 2.8",
      badge: "HEAVY SOLID", isBestseller: false, isFeatured: false,
      desc: "Heavyweight 22 karat solid gold kada with matte antique patina and engraved Sanskrit blessings."
    },
    {
      name: "Hemavati Geometric Gold Bangle",
      subcategory: "Contemporary",
      price: 22000, oldPrice: 25500,
      metal: "18K Gold", polish: "Dual Tone", stone: "Plain Gold",
      weight: "22 grams", dimensions: "Size 2.4",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Modern hexagonal facets in dual-tone yellow and white gold with sleek tongue clasp."
    },
    {
      name: "Meera Emerald Cluster Kada",
      subcategory: "Gemstone Kada",
      price: 33500, oldPrice: 38500,
      metal: "22K Gold", polish: "Antique", stone: "Zambian Emerald",
      weight: "37 grams", dimensions: "Size 2.6",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Lush green emerald beads woven alongside antique gold filigree medallions in a wide statement cuff."
    },
    {
      name: "Sultana Navratna Auspicious Bangle",
      subcategory: "Navratna Bangle",
      price: 27500, oldPrice: 31500,
      metal: "22K Gold", polish: "Gold", stone: "Navratna Gemstones",
      weight: "29 grams", dimensions: "Size 2.4",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Continuous cycle of the nine sacred planetary gemstones set in individual bezel cups in 22K gold."
    },
    {
      name: "Devaki Cuffed Temple Gold Kada",
      subcategory: "Temple Kada",
      price: 39000, oldPrice: 45000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "45 grams", dimensions: "Size 2.6",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "South Indian heritage temple kada with dancing figurines of divine musicians and ruby cabochons."
    }
  ],

  Bracelets: [
    {
      name: "Aura 18K Yellow Gold Diamond Tennis Bracelet",
      subcategory: "Tennis Bracelet",
      price: 32999, oldPrice: 38000,
      metal: "18K Gold", polish: "Gold", stone: "Solitaire Diamond",
      weight: "14 grams", dimensions: "7 inches with double safety clasp",
      badge: "BESTSELLER", isBestseller: true, isFeatured: true,
      desc: "Continuous strand of certified round brilliant diamonds in individual four-prong 18K yellow gold baskets."
    },
    {
      name: "Samrat Embossed Gold Cuff Bracelet",
      subcategory: "Cuff Bracelet",
      price: 26500, oldPrice: 30500,
      metal: "22K Gold", polish: "Antique", stone: "Plain Gold",
      weight: "26 grams", dimensions: "Adjustable 2.5 inches width",
      badge: "ROYAL CUFF", isBestseller: false, isFeatured: true,
      desc: "Bold artisanal gold cuff embossed with majestic royal motifs and finished with a rich antique glow."
    },
    {
      name: "Lakshmi Auspicious Charm Gold Bracelet",
      subcategory: "Charm Bracelet",
      price: 18999, oldPrice: 22000,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "16 grams", dimensions: "7.5 inches length",
      badge: "DEVOTIONAL", isBestseller: true, isFeatured: true,
      desc: "22K link bracelet suspending five traditional auspicious charms including lotus, om, coin, and conch."
    },
    {
      name: "Celeste Platinum Diamond Link Bracelet",
      subcategory: "Link Bracelet",
      price: 39500, oldPrice: 45000,
      metal: "Platinum", polish: "Rhodium", stone: "Solitaire Diamond",
      weight: "19 grams", dimensions: "7.25 inches length",
      badge: "PLATINUM 950", isBestseller: false, isFeatured: false,
      desc: "Solid Pt950 platinum geometric links interspersed with diamond bar links for enduring prestige."
    },
    {
      name: "Zeenat Kundan & Pearl Chain Bracelet",
      subcategory: "Jadau Bracelet",
      price: 19800, oldPrice: 23000,
      metal: "22K Gold", polish: "Antique", stone: "Uncut Polki & Kundan",
      weight: "18 grams", dimensions: "7 inches adjustable",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Delicate polki florets connected by multi-strand seed pearl cords with ornate enameled gold clasp."
    },
    {
      name: "Nilambari Sapphire Evil Eye Gold Bracelet",
      subcategory: "Talisman Bracelet",
      price: 14500, oldPrice: 17000,
      metal: "18K Gold", polish: "Gold", stone: "Ceylonese Sapphire",
      weight: "8 grams", dimensions: "6.5–7.5 inches adjustable",
      badge: "TRENDING", isBestseller: true, isFeatured: false,
      desc: "Protective evil eye talisman crafted with blue sapphire, diamond halo, and mother-of-pearl center."
    },
    {
      name: "Padma Floral Filigree Gold Bracelet",
      subcategory: "Filigree Bracelet",
      price: 16800, oldPrice: 19500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "15 grams", dimensions: "7.5 inches length",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Interconnected tarakasi filigree flowers with articulated hinges and invisible pressure clasp."
    },
    {
      name: "Swarna Byzantine Woven Gold Bracelet",
      subcategory: "Byzantine Bracelet",
      price: 23500, oldPrice: 27000,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "22 grams", dimensions: "8 inches length, 5mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Complex four-direction Byzantine link weave forming a flexible, supple golden rope on the wrist."
    },
    {
      name: "Mayuri Emerald & Polki Cuff Bracelet",
      subcategory: "Cuff Bracelet",
      price: 28900, oldPrice: 33500,
      metal: "22K Gold", polish: "Antique", stone: "Zambian Emerald",
      weight: "25 grams", dimensions: "Flexible spring cuff",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Open bypass cuff featuring oval emerald cabochons and uncut polki clusters at both wrist finials."
    },
    {
      name: "Hemalata Rose Gold Diamond Bar Bracelet",
      subcategory: "Bar Bracelet",
      price: 15200, oldPrice: 17800,
      metal: "Rose Gold", polish: "Rose Gold", stone: "Solitaire Diamond",
      weight: "9 grams", dimensions: "7 inches adjustable cord",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Curved bar paved with micro-diamonds on an 18K rose gold cable chain for everyday minimalism."
    },
    {
      name: "Kalyani Temple Kempu Gold Bracelet",
      subcategory: "Temple Bracelet",
      price: 21500, oldPrice: 25000,
      metal: "22K Gold", polish: "Antique", stone: "Burmese Ruby",
      weight: "20 grams", dimensions: "7.5 inches length",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Antique gold links engraved with sacred floral medallions and ruby-red kempu gemstone centers."
    },
    {
      name: "Chandrika Navratna Link Bracelet",
      subcategory: "Navratna Bracelet",
      price: 19500, oldPrice: 22800,
      metal: "22K Gold", polish: "Gold", stone: "Navratna Gemstones",
      weight: "17 grams", dimensions: "7.25 inches length",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Nine astrological gems set along a continuous 22K yellow gold bezel chain with safety lock."
    },
    {
      name: "Vasundhara Handcrafted Foxtail Bracelet",
      subcategory: "Foxtail Bracelet",
      price: 17800, oldPrice: 20500,
      metal: "22K Gold", polish: "Gold", stone: "Plain Gold",
      weight: "16 grams", dimensions: "8 inches length, 4.5mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Dense foxtail link bracelet with engraved decorative endcaps and solid 22K swivel lobster clasp."
    },
    {
      name: "Sultana Dual-Tone Curb Bracelet",
      subcategory: "Curb Bracelet",
      price: 24500, oldPrice: 28500,
      metal: "18K Gold", polish: "Dual Tone", stone: "Plain Gold",
      weight: "21 grams", dimensions: "8 inches length, 6mm width",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Bold alternating yellow and white gold curb links with high-polished diamond-cut chamfered edges."
    },
    {
      name: "Tara Diamond Infinity Chain Bracelet",
      subcategory: "Infinity Bracelet",
      price: 13800, oldPrice: 16000,
      metal: "18K Gold", polish: "Gold", stone: "Solitaire Diamond",
      weight: "7 grams", dimensions: "6.75–7.5 in adjustable",
      badge: null, isBestseller: false, isFeatured: false,
      desc: "Central infinity symbol studded with diamonds signifying eternal love, on a delicate gold cable chain."
    }
  ]
};

// Assemble 150 products
const products = [];
let globalId = 1;

for (const [categoryName, items] of Object.entries(categoryMetadata)) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const mappingEntry = mapping.find(m => m.id === globalId);
    if (!mappingEntry) {
      throw new Error(`No mapping entry found for ID ${globalId}`);
    }

    const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
    const rating = Number((4.1 + (globalId % 9) * 0.1).toFixed(1));
    const reviewCount = 15 + ((globalId * 7) % 65);

    const product = {
      id: globalId,
      name: item.name,
      category: categoryName,
      subcategory: item.subcategory,
      price: item.price,
      originalPrice: item.oldPrice,
      oldPrice: item.oldPrice,
      discount: discount,
      rating: rating,
      reviewCount: reviewCount,
      metal: item.metal,
      polish: item.polish,
      stone: item.stone,
      material: `Hallmarked ${item.metal}`,
      plating: item.polish === 'Gold' ? '22K Yellow Gold Micron Polish' : (item.polish + ' Polish'),
      dimensions: item.dimensions,
      weight: item.weight,
      warranty: "Lifetime Purity Guarantee & 1 Year Polish Care",
      delivery: "Dispatched in 24–48 Hours",
      stock: 3 + (globalId % 10),
      badge: item.badge,
      isBestseller: !!item.isBestseller,
      isFeatured: !!item.isFeatured,
      isNew: item.badge === 'NEW ARRIVAL',
      desc: item.desc,
      description: item.desc,
      img: mappingEntry.targetFile,
      image: mappingEntry.targetFile,
      images: [mappingEntry.targetFile]
    };

    products.push(product);
    globalId++;
  }
}

console.log(`Generated ${products.length} products!`);

// Update aurelia-final/backend/data/aurelia.json
const backendDbPath = path.resolve('aurelia-final/backend/data/aurelia.json');
let backendData = {};
if (fs.existsSync(backendDbPath)) {
  backendData = JSON.parse(fs.readFileSync(backendDbPath, 'utf8'));
}
backendData.products = products;
fs.writeFileSync(backendDbPath, JSON.stringify(backendData, null, 2), 'utf8');
console.log(`Updated ${backendDbPath}`);

// Update aurelia-final/js/data.js
const dataJsPath = path.resolve('aurelia-final/js/data.js');
let dataJsContent = fs.readFileSync(dataJsPath, 'utf8');

// Replace the products array in data.js
const productsJsonString = JSON.stringify(products, null, 2);
const startMarker = 'window.AureliaData = {\n  products: ';
const helperIdx = dataJsContent.indexOf('getAllCategories:');
if (helperIdx === -1) {
  throw new Error('Could not locate getAllCategories in data.js');
}

const helpersPart = dataJsContent.slice(helperIdx);
const newDataJs = `// Aurelia Jewels Product & Store Master Database\n// 150 Products across 10 Distinct Categories with 100% Unique Image Assets\n\nwindow.AureliaData = {\n  products: ${productsJsonString},\n\n  ${helpersPart}`;

fs.writeFileSync(dataJsPath, newDataJs, 'utf8');
console.log(`Updated ${dataJsPath}`);
