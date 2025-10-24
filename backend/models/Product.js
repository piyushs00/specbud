const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic product information
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  shortDesc: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['laptops', 'phones', 'tablets', 'earphones', 'desktops', 'accessories'],
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['gaming', 'office', 'budget', 'premium', 'creative'],
    index: true
  },
  
  // Visual content
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  
  // Pricing information
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Technical specifications
  specs: {
    processor: String,
    graphics: String,
    display: String,
    storage: String,
    ram: String,
    battery: String,
    weight: String,
    dimensions: String,
    connectivity: [String],
    ports: [String]
  },
  
  // Product details
  launched: String,
  brand: {
    type: String,
    required: true,
    index: true
  },
  model: String,
  
  // Investment advice
  investment: String,
  
  // Use cases
  useCase: [{
    type: String,
    enum: ['gaming', 'office', 'creative', 'casual', 'travel', 'fitness']
  }],
  
  // Purchase links
  buyLinks: [{
    site: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    price: Number,
    availability: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'limited_stock'],
      default: 'in_stock'
    },
    lastChecked: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Review content
  youtubeReviews: [String],
  
  // Amazon integration
  amazonASIN: String,
  amazonProductId: String,
  
  // Rating and reviews
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // SEO and search
  tags: [String],
  searchKeywords: [String],
  
  // Status and metadata
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastPriceUpdate: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
productSchema.index({ name: 'text', shortDesc: 'text', tags: 'text' });
productSchema.index({ type: 1, category: 1 });
productSchema.index({ currentPrice: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for price difference
productSchema.virtual('priceDifference').get(function() {
  return this.basePrice - this.currentPrice;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.basePrice > this.currentPrice) {
    return Math.round(((this.basePrice - this.currentPrice) / this.basePrice) * 100);
  }
  return 0;
});

// Method to update price
productSchema.methods.updatePrice = function(newPrice, source) {
  this.basePrice = this.currentPrice; // Store previous price as base
  this.currentPrice = newPrice;
  this.lastPriceUpdate = new Date();
  
  // Update the specific buy link price
  const buyLink = this.buyLinks.find(link => link.site === source);
  if (buyLink) {
    buyLink.price = newPrice;
    buyLink.lastChecked = new Date();
  }
  
  return this.save();
};

// Static method to find products by filters
productSchema.statics.findByFilters = function(filters) {
  const query = {};
  
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.brand) query.brand = filters.brand;
  if (filters.useCase) query.useCase = { $in: [filters.useCase] };
  if (filters.minPrice || filters.maxPrice) {
    query.currentPrice = {};
    if (filters.minPrice) query.currentPrice.$gte = filters.minPrice;
    if (filters.maxPrice) query.currentPrice.$lte = filters.maxPrice;
  }
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Product', productSchema);
