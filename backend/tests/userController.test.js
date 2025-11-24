import request from 'supertest';
import app from '../app.js';

describe('User API', () => {
  const superuser = {
    firstName: 'Super',
    lastName: 'User',
    email: 'admin2@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'superuser',
  };

  const userData = {
    firstName: 'Cannoli',
    lastName: 'Garcia',
    email: 'cannoli1234@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
  };

  let jwtCookie;
  beforeAll(async () => {
    // Simulate login or generate JWT cookie here
    const loginRes = await request(app).post('/api/v1/users/login').send({
      email: 'admin@gmail.com',
      password: 'password',
    });

    // Extract JWT cookie from response
    const cookies = loginRes.headers['set-cookie'];
    jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));
  });

  it('should create a user', async () => {
    const res = await request(app).post('/api/v1/users/signup').send(userData);

    const superuserRes = await request(app)
      .post('/api/v1/users/signup')
      .send(superuser);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.email).toBe(userData.email);
    expect(res.body.data.user.firstName).toBe(userData.firstName);
    expect(res.body.data.user.lastName).toBe(userData.lastName);
  });

  it('should return all users', async () => {
    const res = await request(app).get('/api/v1/users');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(3);
  });

  it('should login the user', async () => {
    const res = await request(app).post('/api/v1/users/login').send({
      email: superuser.email,
      password: superuser.password,
    });

    expect(res.statusCode).toBe(200);
  });

  it('should access protected route with valid JWT cookie', async () => {
    const loginRes = await request(app).post('/api/v1/users/login').send({
      email: superuser.email,
      password: superuser.password,
    });

    expect(loginRes.statusCode).toEqual(200);

    // Extract JWT cookie from response
    const cookies = loginRes.headers['set-cookie'];
    const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));

    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Cookie', jwtCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(superuser.email);
  });
});
