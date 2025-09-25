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
