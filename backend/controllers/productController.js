const Product = require('../models/Product');
const Review = require('../models/Review');
const { cloudinary } = require('../config/cloudinary');

// @GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { category, sort, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    if (sort === 'price-desc') sortObj = { price: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @POST /api/products (admin)
exports.createProduct = async (req, res, next) => {
  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        images.push({ url: file.path, publicId: file.filename });
      }
    }

    const data = { ...req.body, images, sizes: JSON.parse(req.body.sizes || '[]') };
    if (data.featured !== undefined) data.featured = data.featured === 'true' || data.featured === true;
    if (data.salePrice === '') data.salePrice = null;

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @PUT /api/products/:id (admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };
    if (req.body.sizes) {
      updateData.sizes = JSON.parse(req.body.sizes);
    }
    if (updateData.featured !== undefined) updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    if (updateData.salePrice === '') updateData.salePrice = null;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => ({ url: f.path, publicId: f.filename }));
      updateData.images = [...product.images, ...newImages];
    }

    Object.assign(product, updateData);
    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from cloudinary
    for (const img of product.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @POST /api/products/:id/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingReview = await Review.findOne({ product: req.params.id, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    await Review.create({ product: req.params.id, user: req.user._id, rating, comment });

    const reviews = await Review.find({ product: req.params.id });
    product.numReviews = reviews.length;
    product.averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await product.save();

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

// @GET /api/products/:id/reviews
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
