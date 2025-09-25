const request = require('supertest');
const app = require('../app');

test('should fail if email is already taken',async()=>{
    await request(app).post('/api/auth/register').send({email:'gaurav1234@gmail.com'
        ,password:'123456789'
    });

    const res=await request(app).post('api/auth/register')
    .send({email:'gaurav1234@gmail.com',password:'123456789'});

    expect(res.statucCode).toEqual(400);
    expect(res.body.message).toBe('Email already in use');
});