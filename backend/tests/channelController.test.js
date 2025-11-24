import request from 'supertest';
import app from '../app.js';
import Channel from '../models/channelModel.js';
import Organization from '../models/organizationModel.js';

describe('Channel API', () => {
  let jwtCookie;
  let testOrg;
  beforeAll(async () => {
    // Simulate login or generate JWT cookie here
    const loginRes = await request(app).post('/api/v1/users/login').send({
      email: 'admin@gmail.com',
      password: 'password',
    });

    testOrg = await Organization.create({
      organizationName: 'Test Organization',
    });
    // Extract JWT cookie from response
    const cookies = loginRes.headers['set-cookie'];
    jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));
  });

  it('should create a new channel', async () => {
    const channel = {
      channelName: 'Test Channel',
      organizationId: testOrg.id,
    };

    const res = await request(app)
      .post('/api/v1/channels')
      .set('Cookie', jwtCookie)
      .send(channel);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.data.channelName).toBe(channel.channelName);
  });

  it('should delete a channel', async () => {
    const channelToDelete = await Channel.create({
      channelName: 'Delete this channel',
      organizationId: testOrg.id,
    });

    const res = await request(app)
      .delete(`/api/v1/channels/${channelToDelete.id}`)
      .set('Cookie', jwtCookie);

    expect(res.statusCode).toBe(204);
  });
});
