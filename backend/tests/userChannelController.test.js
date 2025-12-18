import request from 'supertest';
import app from '../app.js';
import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import Organization from '../models/organizationModel.js';

describe('UserChannel API', () => {
  let testOrg;
  let testChannel;
  let testUser;
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

    testOrg = await Organization.create({
      organizationName: 'Test Organization',
    });
    testUser = await User.create({
      firstName: 'Cannoli',
      lastName: 'Garcia',
      email: 'cannoli123@gmail.com',
      password: 'password',
      passwordConfirm: 'password',
      organizationId: testOrg.id,
    });

    testChannel = await Channel.create({
      channelName: 'New Channel',
      organizationId: testOrg.id,
    });
  });

  it('should add a user to a channel', async () => {
    const res = await request(app)
      .post('/api/v1/users/addToChannel')
      .set('Cookie', jwtCookie)
      .send({ userId: testUser.id, channelName: 'New Channel' });

    const updatedUser = await User.findByPk(testUser.id, {
      include: [
        { model: Channel, as: 'Channels', attributes: ['channelName', 'id'] },
      ],
    });

    const updatedChannels = updatedUser.channels;

    expect(res.statusCode).toBe(200);
    expect(updatedChannels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: testChannel.id,
          channelName: testChannel.channelName,
        }),
      ]),
    );
  });

  it('should remove a user from a channel', async () => {
    const testChannel2 = await Channel.create({
      channelName: 'Channel to Remove User From',
      organizationId: testOrg.id,
    });

    const res = await request(app)
      .post('/api/v1/users/removeFromChannel')
      .set('Cookie', jwtCookie)
      .send({
        userId: testUser.id,
        channelName: testChannel2.channelName,
      });

    const updatedUser = await User.findByPk(testUser.id, {
      include: [
        { model: Channel, as: 'Channels', attributes: ['channelName', 'id'] },
      ],
    });

    const updatedChannels = updatedUser.channels;

    expect(res.statusCode).toBe(200);
    expect(updatedChannels).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: testChannel2.id,
          channelName: testChannel2.channelName,
        }),
      ]),
    );
  });
});
