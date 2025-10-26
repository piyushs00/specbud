import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  source: {
    type: String,
    required: true,
    enum: ['amazon', 'flipkart', 'reliance_digital', 'croma', 'official_store', 'other']
  },
  url: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'limited_stock'],
    default: 'in_stock'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  discount: {
    percentage: Number,
    amount: Number
  },
  originalPrice: Number,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    seller: String,
    shipping: String,
    warranty: String,
    offers: [String]
  }
});

// Indexes for efficient querying
priceHistorySchema.index({ productId: 1, timestamp: -1 });
priceHistorySchema.index({ source: 1, timestamp: -1 });
priceHistorySchema.index({ timestamp: -1 });

// Static method to get price trends
priceHistorySchema.statics.getPriceTrend = async function(productId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    productId,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: 1 });
};

// Static method to get lowest price
priceHistorySchema.statics.getLowestPrice = async function(productId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const result = await this.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        lowestPrice: { $min: '$price' },
        lowestPriceDate: { $min: '$timestamp' },
        source: { $first: '$source' }
      }
    }
  ]);
  
  return result[0] || null;
};

// Static method to get price statistics
priceHistorySchema.statics.getPriceStats = async function(productId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        priceCount: { $sum: 1 }
      }
    }
  ]);
};

export default mongoose.model('PriceHistory', priceHistorySchema);
