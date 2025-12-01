import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';
import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import Organization from '../models/organizationModel.js';
import modelRelationships from './entityRelationships.js';
import { ChannelMessage, DirectMessage } from '../models/messageModel.js';
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
    organizationId: testOrg.id,
  });

  const cannoli = await User.create({
    firstName: 'Cannoli',
    lastName: 'Garcia',
    email: 'cannoli@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
    organizationId: testOrg.id,
  });

  const bookie = await User.create({
    firstName: 'Bookie',
    lastName: 'Garcia',
    email: 'bookie@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
    organizationId: testOrg.id,
  });

  const guy = await User.create({
    firstName: 'Lame',
    lastName: 'Guy',
    email: 'lameguy@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
    organizationId: testOrg.id,
  });

  const testChannel = await Channel.create({
    channelName: 'General Chat',
    organizationId: testOrg.id,
  });

  const testChannel2 = await Channel.create({
    channelName: 'Private Chat',
    organizationId: testOrg.id,
  });

  const message1 = await ChannelMessage.create({
    messageContent: 'Testing!',
    userId: admin.id,
    channelId: testChannel.id,
  });

  const dmRoom = await findOrCreateDMRoom(cannoli.id, bookie.id);

  const dm = await DirectMessage.create({
    messageContent: 'Sup fucker',
    senderId: cannoli.id,
    receiverId: bookie.id,
    roomId: dmRoom.id,
  });

  const dm2 = await DirectMessage.create({
    messageContent: 'Meowdy pawtner',
    senderId: bookie.id,
    receiverId: cannoli.id,
    roomId: dmRoom.id,
  });

  const channels = await Channel.findAll(); // We will use this to get the channels, then we can filter by name or id

  await cannoli.addChannels([testChannel, testChannel2]);
  await bookie.addChannels([testChannel, testChannel2]);
  await guy.addChannels(testChannel);

  await sequelize.close();
}

main().catch(console.error);
