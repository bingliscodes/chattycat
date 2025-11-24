import request from 'supertest';
import app from '../app.js';

describe.skip('Channel API', () => {
  it('should create a new channel', async () => {
    const channel = {
      channelName: 'Test Channel',
    };

    const res = await request(app).post('/api/v1/channels').send(channel);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.channel.channelName).toBe(channel.channelName);
  });
});
