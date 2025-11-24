import request from 'supertest';
import app from '../app.js';
import Organization from '../models/organizationModel.js';

// const jwtCookie = beforeEach(async () => {
//   // Get a cookie value that can be used to add to the request
//
//   return jwtCookie;
// });

describe('Organization API', () => {
  let jwtCookie;
  beforeAll(async () => {
    // Simulate login or generate JWT cookie here
    const loginRes = await request(app).post('/api/v1/users/login').send({
      email: 'admin@gmail.com',
      password: 'password',
    });

    //   // Extract JWT cookie from response
    const cookies = loginRes.headers['set-cookie'];
    jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));
  });

  it('should create a new organization', async () => {
    // Create the org, using the cookie
    const org = {
      organizationName: 'Test Org',
    };

    const res = await request(app)
      .post('/api/v1/organizations')
      .set('Cookie', jwtCookie)
      .send(org);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.data.organizationName).toBe(org.organizationName);
  });

  it('should get all organizations', async () => {
    const res = await request(app).get('/api/v1/organizations');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.data)).toBe(true);
    expect(res.body.data.data).toHaveLength(1);
  });

  it('should delete the organization that was created', async () => {
    const orgToDelete = await Organization.create({
      organizationName: 'Soon to be deleted',
    });

    const res = await request(app)
      .delete(`/api/v1/organizations/${orgToDelete.id}`)
      .set('Cookie', jwtCookie);

    expect(res.statusCode).toBe(204);
  });
});
