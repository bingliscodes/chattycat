import request from 'supertest';
import app from '../app.js';
import { DirectMessage, ChannelMessage } from '../models/messageModel.js';
import Organization from '../models/organizationModel.js';
import Channel from '../models/channelModel.js';

describe('Message API', () => {
  let jwtCookie;
  let testChannel;
  beforeAll(async () => {
    // Simulate login or generate JWT cookie here
    const loginRes = await request(app).post('/api/v1/users/login').send({
      email: 'admin@gmail.com',
      password: 'password',
    });

    // Extract JWT cookie from response
    const cookies = loginRes.headers['set-cookie'];
    jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));

    // Create a test org and channel
    const testOrg = await Organization.create({
      organizationName: 'Test Organization',
    });
    testChannel = await Channel.create({
      channelName: 'Test Channnel',
      organizationId: testOrg.id,
    });
  });

  it('should create a new Channel message', () => {});
});
