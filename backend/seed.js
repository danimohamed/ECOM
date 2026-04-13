require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    // Create admin user
    const admin = await User.create({
      name: 'OPPA Admin',
      email: 'admin@oppa.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create test customer
    await User.create({
      name: 'Test Customer',
      email: 'customer@oppa.com',
      password: 'customer123',
      role: 'customer',
    });

    // Create products
    const products = [
      {
        name: 'OPPA Phantom Jacket',
        description: 'Premium oversized technical jacket with water-resistant shell. Designed in our Paris atelier with precision-cut panels and magnetic closure system. The Phantom series represents the pinnacle of OPPA streetwear engineering.',
        price: 220,
        category: 'upperwear',
        sizes: [
          { size: 'XS', stock: 5 },
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 5 },
        ],
        gradient: 'linear-gradient(135deg,#1a1a1a,#3d3d3d)',
        badge: 'NEW',
        materials: '100% Nylon Shell, Polyester Lining, DWR Coating',
        featured: true,
      },
      {
        name: 'OPPA Shadow Pants',
        description: 'Relaxed-fit cargo pants with adjustable hem and hidden pocket system. Made from premium Japanese cotton twill with a slight stretch for maximum comfort and mobility.',
        price: 170,
        category: 'lowerwear',
        sizes: [
          { size: 'XS', stock: 8 },
          { size: 'S', stock: 12 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 6 },
        ],
        gradient: 'linear-gradient(135deg,#0f0f0f,#2a2a2a)',
        badge: null,
        materials: '98% Cotton, 2% Elastane, YKK Zippers',
        featured: true,
      },
      {
        name: 'OPPA Skull Cap',
        description: 'Heavyweight ribbed beanie with embossed OPPA logo. Double-layered for warmth with a clean, minimal silhouette.',
        price: 40,
        category: 'flexgear',
        sizes: [
          { size: 'M', stock: 30 },
        ],
        gradient: 'linear-gradient(135deg,#222,#444)',
        badge: 'BEST',
        materials: '100% Merino Wool',
        featured: true,
      },
      {
        name: 'OPPA Noir Hoodie',
        description: 'Oversized heavyweight hoodie in washed black. Features kangaroo pocket, double-stitched seams, and brushed fleece interior. The essential OPPA layering piece.',
        price: 95,
        category: 'upperwear',
        sizes: [
          { size: 'S', stock: 15 },
          { size: 'M', stock: 25 },
          { size: 'L', stock: 20 },
          { size: 'XL', stock: 10 },
        ],
        gradient: 'linear-gradient(135deg,#0a0a0a,#2c2c2c)',
        badge: 'NEW',
        materials: '100% Cotton 400gsm French Terry',
        featured: true,
      },
      {
        name: 'OPPA Tactical Tee',
        description: 'Boxy-fit heavyweight t-shirt with dropped shoulders. Screen-printed OPPA tactical graphics on back panel. Pre-washed for a lived-in feel from day one.',
        price: 65,
        category: 'upperwear',
        sizes: [
          { size: 'XS', stock: 10 },
          { size: 'S', stock: 20 },
          { size: 'M', stock: 30 },
          { size: 'L', stock: 20 },
          { size: 'XL', stock: 10 },
        ],
        gradient: 'linear-gradient(135deg,#2c2c2c,#0a0a0a)',
        badge: null,
        materials: '100% Cotton 280gsm',
        featured: true,
      },
      {
        name: 'OPPA Cargo Bermuda',
        description: 'Technical bermuda shorts with multi-pocket cargo system. Adjustable waist with internal drawcord. Water-resistant ripstop fabric for all-terrain wear.',
        price: 115,
        category: 'lowerwear',
        sizes: [
          { size: 'S', stock: 8 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 5 },
        ],
        gradient: 'linear-gradient(135deg,#1c1c1c,#3a3a3a)',
        badge: null,
        materials: '100% Nylon Ripstop',
        featured: true,
      },
      {
        name: 'OPPA Stealth Vest',
        description: 'Padded technical vest with concealed hood system. Lightweight insulation with a minimal, architectural silhouette. Essential layering for transitional weather.',
        price: 180,
        category: 'upperwear',
        sizes: [
          { size: 'S', stock: 6 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 4 },
        ],
        gradient: 'linear-gradient(135deg,#262626,#0f0f0f)',
        badge: 'LIMITED',
        materials: 'Nylon Shell, Recycled Down Fill',
        featured: true,
      },
      {
        name: 'OPPA Heritage Jersey',
        description: 'Vintage-inspired long sleeve jersey with contrast stitching. Oversized fit with ribbed cuffs and hem. Part of the OPPA Heritage capsule collection.',
        price: 85,
        salePrice: 65,
        category: 'upperwear',
        sizes: [
          { size: 'M', stock: 0 },
          { size: 'L', stock: 0 },
        ],
        gradient: 'linear-gradient(135deg,#1a1a1a,#3d3d3d)',
        badge: 'PRE-ORDER',
        materials: '100% Cotton Jersey 320gsm',
        featured: true,
      },
      {
        name: 'OPPA Crossbody Bag',
        description: 'Compact nylon crossbody with magnetic closure and internal organizer. Adjustable strap with OPPA hardware branding.',
        price: 75,
        category: 'flexgear',
        sizes: [
          { size: 'M', stock: 20 },
        ],
        gradient: 'linear-gradient(135deg,#111,#333)',
        badge: null,
        materials: '1000D Cordura Nylon, Metal Hardware',
        featured: false,
      },
      {
        name: 'OPPA Track Pants',
        description: 'Relaxed tapered track pants with side stripe detail. Elastic waist with drawcord. Smooth tricot fabric for a premium athleisure feel.',
        price: 130,
        category: 'lowerwear',
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 18 },
          { size: 'L', stock: 14 },
          { size: 'XL', stock: 7 },
        ],
        gradient: 'linear-gradient(135deg,#0d0d0d,#2e2e2e)',
        badge: null,
        materials: '100% Polyester Tricot',
        featured: false,
      },
    ];

    await Product.insertMany(products);

    // Create coupons
    await Coupon.create([
      {
        code: 'OPPA10',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 100,
        maxUses: 100,
        expiresAt: new Date('2027-12-31'),
      },
      {
        code: 'WELCOME20',
        discountType: 'fixed',
        discountValue: 20,
        minPurchase: 150,
        maxUses: 50,
        expiresAt: new Date('2027-06-30'),
      },
    ]);

    console.log('Seed data imported successfully!');
    console.log(`Admin: admin@oppa.com / admin123`);
    console.log(`Customer: customer@oppa.com / customer123`);
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
