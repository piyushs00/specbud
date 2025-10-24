# SpecBud Backend API

A comprehensive backend API for the SpecBud tech product recommendation platform, built with Node.js, Express, and MongoDB. Features Amazon API integration for live price tracking and product recommendations.

## 🚀 Features

- **Product Management**: CRUD operations for tech products
- **Price Tracking**: Real-time price monitoring across multiple retailers
- **Amazon Integration**: Live price fetching from Amazon India
- **Search & Filtering**: Advanced search with multiple criteria
- **Category Management**: Organized product categorization
- **Price History**: Historical price tracking and analytics
- **Recommendations**: AI-powered product suggestions
- **Rate Limiting**: API protection and throttling
- **CORS Support**: Frontend integration ready

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Amazon Product Advertising API credentials (optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd specbud/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/specbud
   AWS_ACCESS_KEY_ID=your_amazon_access_key
   AWS_SECRET_ACCESS_KEY=your_amazon_secret_key
   AWS_ASSOCIATE_TAG=your_associate_tag
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/trending/items` - Get trending products
- `GET /api/products/featured/items` - Get featured products
- `GET /api/products/search/query` - Search products
- `GET /api/products/:id/recommendations` - Get product recommendations
- `POST /api/products/:id/update-price` - Update product price
- `GET /api/products/:id/price-history` - Get price history
- `POST /api/products/compare` - Compare products

### Prices
- `GET /api/prices/current` - Get current prices
- `GET /api/prices/history/:productId` - Get price history
- `GET /api/prices/trends/:productId` - Get price trends
- `GET /api/prices/alerts` - Get price alerts
- `POST /api/prices/update/:productId` - Update price
- `GET /api/prices/amazon/:asin` - Get Amazon price
- `GET /api/prices/compare/:productId` - Compare prices
- `GET /api/prices/stats/:productId` - Get price statistics
- `GET /api/prices/deals/best` - Get best deals
- `GET /api/prices/drops/recent` - Get recent price drops

### Search
- `GET /api/search` - Global search
- `POST /api/search/filtered` - Filtered search
- `GET /api/search/amazon` - Amazon search
- `GET /api/search/suggestions` - Search suggestions
- `GET /api/search/popular` - Popular searches
- `GET /api/search/filters` - Search filters
- `POST /api/search/advanced` - Advanced search

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:category/products` - Get category products
- `GET /api/categories/:category/stats` - Get category statistics
- `GET /api/categories/:category/filters` - Get category filters
- `GET /api/categories/:category/trending` - Get trending products
- `GET /api/categories/:category/deals` - Get category deals
- `GET /api/categories/compare` - Compare categories

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/specbud |
| `AWS_ACCESS_KEY_ID` | Amazon API access key | - |
| `AWS_SECRET_ACCESS_KEY` | Amazon API secret key | - |
| `AWS_ASSOCIATE_TAG` | Amazon associate tag | - |
| `JWT_SECRET` | JWT secret key | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `PRICE_UPDATE_INTERVAL` | Price update interval (minutes) | 60 |

### Amazon API Setup

1. **Create Amazon Product Advertising API account**
   - Visit [Amazon Product Advertising API](https://webservices.amazon.com/paapi5/documentation/)
   - Create an account and get your credentials

2. **Get Associate Tag**
   - Sign up for Amazon Associates program
   - Get your associate tag

3. **Configure credentials**
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_ASSOCIATE_TAG=your_associate_tag
   AWS_REGION=us-east-1
   ```

## 🗄️ Database Schema

### Product Model
```javascript
{
  name: String,
  shortDesc: String,
  type: String, // laptops, phones, tablets, earphones
  category: String, // gaming, office, budget, premium, creative
  brand: String,
  image: String,
  basePrice: Number,
  currentPrice: Number,
  currency: String,
  specs: Object,
  useCase: [String],
  buyLinks: [Object],
  rating: Number,
  reviewCount: Number,
  tags: [String],
  featured: Boolean,
  trending: Boolean,
  status: String
}
```

### PriceHistory Model
```javascript
{
  productId: ObjectId,
  price: Number,
  source: String,
  url: String,
  availability: String,
  currency: String,
  timestamp: Date
}
```

## 🔄 Price Tracking

The system automatically tracks prices using:

1. **Scheduled Updates**: Cron job runs every hour
2. **Amazon Integration**: Direct API calls to Amazon
3. **Web Scraping**: Fallback scraping for other retailers
4. **Price History**: All price changes are stored
5. **Alerts**: Price drop notifications

## 🚦 Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Configurable**: Via environment variables
- **Headers**: Rate limit info in response headers

## 🔒 Security

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: API protection
- **Input Validation**: Joi schema validation
- **Error Handling**: Secure error responses

## 📊 Monitoring

- **Health Check**: `GET /health`
- **Logging**: Morgan HTTP request logging
- **Error Tracking**: Comprehensive error handling
- **Performance**: Response time monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name specbud-api
pm2 save
pm2 startup
```

### Using Docker
```bash
docker build -t specbud-api .
docker run -p 5000:5000 specbud-api
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 📈 Performance

- **Database Indexing**: Optimized queries
- **Caching**: Redis integration (optional)
- **Compression**: Gzip compression
- **Pagination**: Efficient data loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

- **v1.0.0**: Initial release with basic functionality
- **v1.1.0**: Added Amazon API integration
- **v1.2.0**: Enhanced price tracking
- **v1.3.0**: Advanced search and filtering

---

**Built with ❤️ for the SpecBud team**
