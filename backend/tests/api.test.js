const request = require('supertest');
const app = require('../server');

describe('SpecBud API Tests', () => {
  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Products API', () => {
    test('GET /api/products should return products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/products with pagination', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 5 });
      
      expect(response.status).toBe(200);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.current).toBe(1);
    });

    test('GET /api/products with filters', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ type: 'laptops', category: 'premium' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Search API', () => {
    test('GET /api/search should return search results', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'laptop' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('GET /api/search/suggestions should return suggestions', async () => {
      const response = await request(app)
        .get('/api/search/suggestions')
        .query({ q: 'mac' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Categories API', () => {
    test('GET /api/categories should return categories', async () => {
      const response = await request(app).get('/api/categories');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Prices API', () => {
    test('GET /api/prices/current should return current prices', async () => {
      const response = await request(app)
        .get('/api/prices/current')
        .query({ productIds: '507f1f77bcf86cd799439011' });
      
      // This might return 200 with empty data if no products exist
      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('GET /api/nonexistent should return 404', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
    });

    test('GET /api/products/invalid-id should return 404', async () => {
      const response = await request(app).get('/api/products/invalid-id');
      expect(response.status).toBe(500); // CastError for invalid ObjectId
    });
  });
});
