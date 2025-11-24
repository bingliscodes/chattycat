import request from 'supertest';
import app from '../app.js';

describe.skip('Organization API', () => {
  it('should create a new organization', async () => {
    // Create user
    const superuser = {
      firstName: 'Cannoli',
      lastName: 'Garcia',
      email: 'cannoli1234@gmail.com',
      password: 'password',
      passwordConfirm: 'password',
      role: 'superuser',
    };

    // Get user on req, then create org?

    const org = {
      organizationName: 'Test Org',
    };

    const res = await request(app).post('/api/v1/organizations').send(org);
    expect(res.statusCode).toBe(201);
    // expect(res.body.data.organization.organizationName).toBe(
    //   org.organizationName,
    // );
  });
});
