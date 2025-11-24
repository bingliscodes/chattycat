import request from 'supertest';
import app from '../app.js';

describe.only('User API', () => {
  const superuser = {
    firstName: 'Super',
    lastName: 'User',
    email: 'admin@gmail.com',
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
    expect(res.body.data).toHaveLength(2);
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

    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(superuser.email);
  });
});
