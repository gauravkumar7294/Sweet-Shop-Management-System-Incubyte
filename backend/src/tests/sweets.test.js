
//Logic for the test for the registerUser,login User and AddSweet endpoints

/*

const request=require('supertest');
const app=require('../app');
const {registerUser,loginUser}=require('../services/authService');

jest.mock('../services/authService');
jest.mock('../services/sweetService');

test('POST /api/sweets- Add a new swwet',()=>{
    let adminToke;
    let customerToken;
    let adminUser;

    beforeAll(async()=>{
        adminUser={id:1,email:'gauravkumar@.com',role:'ADMIN'};
        const customerUser={id:2,email:'customer@test.com',role:'CUSTOMER'};

        registerUser.mockImplementation(async(email,password,role)=>{
            if(role==='ADMIN')
                return adminUser;
            return customerUser;
        });

         loginUser.mockResolvedValueOnce('fake-admin-token-123'); // First call to login gets admin token
    loginUser.mockResolvedValueOnce('fake-customer-token-456'); // Second call gets customer token

    adminToken = await loginUser('admin@test.com', 'password');
    customerToken = await loginUser('customer@test.com', 'password');
    })


    test('should return 401 Unauthorized if no token is provided', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .send({ name: 'Kaju Katli', price: 25, quantity: 100 });

    expect(res.statusCode).toBe(401);
  });


  test('should return 403 Forbidden if a non-admin user tries to add a sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Jalebi', price: 10, quantity: 200 });

    expect(res.statusCode).toBe(403);
  });
  
  test('should return 201 Created and the new sweet if an admin user adds a sweet', async () => {
    const newSweetData = { name: 'Gulab Jamun', price: 20, quantity: 150, imageUrl: 'http://example.com/gulab.jpg' };
    
    // We expect the sweetService.createSweet to be called and return the new sweet with an ID
    const sweetService = require('../services/sweetService');
    sweetService.createSweet.mockResolvedValue({ id: 1, ...newSweetData });

     const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newSweetData);

    expect(res.statusCode).toBe(201);
    expect(res.body.sweet).toHaveProperty('id');
    expect(res.body.sweet.name).toBe('Gulab Jamun');
  });
});

*/

const request = require('supertest');
const app = require('../app');
const prisma = require('../config/prisma');
const authService = require('../services/authService');

// Mock the middleware to simulate authenticated users
jest.mock('../middleware/authenticate', () => (req, res, next) => {
  // Check for a test token and attach a mock user object
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (token.startsWith('test_token_')) {
      const role = token.split('_')[2].toUpperCase(); // e.g., 'test_token_admin' -> 'ADMIN'
      req.user = { id: 1, role: role };
    }
  }
  next();
});

describe('Sweets API Endpoints', () => {
  let adminToken;
  let customerToken;
  let sweetId;

  beforeAll(() => {
    // Generate mock tokens for different roles
    adminToken = 'Bearer test_token_admin';
    customerToken = 'Bearer test_token_customer';
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.sweet.deleteMany();
    await prisma.$disconnect();
  });


  // Test Suite for POST /api/sweets (Adding a new sweet)
  describe('POST /api/sweets', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const res = await request(app).post('/api/sweets').send({ name: 'Kaju Katli' });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 403 Forbidden if a non-admin user tries to add a sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', customerToken)
        .send({ name: 'Jalebi', price: 15, quantity: 100 });
      expect(res.statusCode).toEqual(403);
    });

    it('should allow an admin to add a new sweet and return 201 Created', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', adminToken)
        .send({ name: 'Rasgulla', price: 20, quantity: 50, category: 'Syrupy', imageUrl: 'rasgulla.jpg' });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toBe('Rasgulla');
      expect(res.body.id).toBeDefined();
      sweetId = res.body.id; // Save for later tests
    });
  });

  // Test Suite for GET /api/sweets (Viewing all sweets)
  describe('GET /api/sweets', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const res = await request(app).get('/api/sweets');
      expect(res.statusCode).toEqual(401);
    });

    it('should allow any authenticated user to view the list of sweets', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .set('Authorization', customerToken);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toBe('Rasgulla');
    });
  });
  
  // Test Suite for PUT /api/sweets/:id (Updating a sweet)
  describe('PUT /api/sweets/:id', () => {
     it('should allow an admin to update a sweet', async () => {
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', adminToken)
            .send({ price: 25, quantity: 40 });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.price).toBe(25);
        expect(res.body.quantity).toBe(40);
     });
  });

  // Test Suite for POST /api/sweets/:id/purchase (Purchasing a sweet)
  describe('POST /api/sweets/:id/purchase', () => {
    it('should allow an authenticated user to purchase a sweet, decreasing quantity', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', customerToken)
            .send({ quantity: 5 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Purchase successful');
        expect(res.body.sweet.quantity).toBe(35); // 40 - 5 = 35
    });

    it('should return 400 if trying to purchase more than available quantity', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', customerToken)
            .send({ quantity: 100 });
        
        expect(res.statusCode).toEqual(400);
    });
  });

  // Test Suite for POST /api/sweets/:id/restock (Restocking a sweet)
  describe('POST /api/sweets/:id/restock', () => {
    it('should allow an admin to restock a sweet, increasing quantity', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', adminToken)
            .send({ quantity: 15 });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Restock successful');
        expect(res.body.sweet.quantity).toBe(50); // 35 + 15 = 50
    });
  });

  // Test Suite for DELETE /api/sweets/:id (Deleting a sweet)
  describe('DELETE /api/sweets/:id', () => {
    it('should allow an admin to delete a sweet', async () => {
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', adminToken);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Sweet deleted successfully');
    });
  });
});
