import sequelize from '../utils/database.js';
import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import Organization from '../models/organizationModel.js';
import modelRelationships from './entityRelationships.js';
import { Message } from '../models/messageModel.js';
import { findOrCreateDMRoom } from '../utils/createRoom.js';

async function main() {
  await sequelize.sync({ force: true });

  const testOrg = await Organization.create({
    organizationName: 'Test Org',
  });

  const testOrg2 = await Organization.create({
    organizationName: 'Better Organization',
  });

  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'Garcia',
    email: 'admin@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'superuser',
  });
  admin.addOrganizations([testOrg, testOrg2]);

  const cannoli = await User.create({
    firstName: 'Cannoli',
    lastName: 'Garcia',
    email: 'cannoli@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
  });
  cannoli.addOrganizations([testOrg, testOrg2]);

  const bookie = await User.create({
    firstName: 'Bookie',
    lastName: 'Garcia',
    email: 'bookie@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
  });
  bookie.addOrganizations([testOrg, testOrg2]);

  const guy = await User.create({
    firstName: 'Lame',
    lastName: 'Guy',
    email: 'lameguy@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
  });

  const testChannel = await Channel.create({
    channelName: 'General Chat',
    organizationId: testOrg.id,
  });

  const testChannel2 = await Channel.create({
    channelName: 'Private Chat',
    organizationId: testOrg.id,
  });

  const message1 = await Message.create({
    messageContent: 'Testing!',
    senderId: admin.id,
    channelId: testChannel.id,
    type: 'channel',
  });

  const dmRoom = await findOrCreateDMRoom(cannoli.id, bookie.id, testOrg.id);

  const dm = await Message.create({
    messageContent: 'Sup Bookie!',
    type: 'direct',
    senderId: cannoli.id,
    receiverId: bookie.id,
    roomId: dmRoom.id,
  });

  const dm2 = await Message.create({
    messageContent: 'Meowdy pawtner',
    type: 'direct',
    senderId: bookie.id,
    receiverId: cannoli.id,
    roomId: dmRoom.id,
  });

  await cannoli.addChannels([testChannel, testChannel2]);
  await bookie.addChannels([testChannel, testChannel2]);
  await guy.addChannels(testChannel);

  await sequelize.close();
}

main().catch(console.error);
