import sequelize from '../utils/database.js';
import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import Organization from '../models/organizationModel.js';
import modelRelationships from './entityRelationships.js';
import Message from '../models/messageModel.js';

async function main() {
  await sequelize.sync({ force: true });

  const testOrg = await Organization.create({
    organizationName: 'Test Org',
  });

  const testOrg2 = await Organization.create({
    organizationName: 'Better Organization',
  });

  const cannoli = await User.create({
    firstName: 'Cannoli',
    lastName: 'Garcia',
    email: 'admin@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'superuser',
    organizationId: 1,
  });

  const bookie = await User.create({
    firstName: 'Cannoli',
    lastName: 'Garcia',
    email: 'cannoli@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
    organizationId: 1,
  });

  const guy = await User.create({
    firstName: 'Lame',
    lastName: 'Guy',
    email: 'lameguy@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
    organizationId: 1,
  });

  const testChannel = await Channel.create({
    channelName: 'General Chat',
    organizationId: 1,
  });

  const testChannel2 = await Channel.create({
    channelName: 'Private Chat',
    organizationId: 1,
  });

  const message1 = await Message.create({
    messageContent: 'Testing!',
    userId: 1,
    channelId: 1,
  });

  const channels = await Channel.findAll(); // We will use this to get the channels, then we can filter by name or id

  await cannoli.addChannels([testChannel, testChannel2]);
  await bookie.addChannels([testChannel, testChannel2]);
  await guy.addChannels(testChannel);

  await sequelize.close();
}

main().catch(console.error);
