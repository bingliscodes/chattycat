import request from 'supertest';
import app from '../app.js';

console.log(process.env.JWT_SECRET);

describe('User API', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/api/v1/users');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should create a new user', async () => {
    // const testOrg = await Organization.create({ organizationName: 'test Org' });

    const userData = {
      firstName: 'Cannoli',
      lastName: 'Garcia',
      email: 'cannoli1234@gmail.com',
      password: 'password',
      passwordConfirm: 'password',
      organizationId: globalThis.testOrg.id,
    };

    const res = await request(app).post('/api/v1/users/signup').send(userData);

    console.log('🚨 RESPONSE:', res.statusCode, res.body); // ← Log this

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.email).toBe(userData.email);
  });
});
