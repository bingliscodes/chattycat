import sequelize from '../utils/database.js';
import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import Organization from '../models/organizationModel.js';
import modelRelationships from './entityRelationships.js';

//TODO: Figure out how to add the organization to the user when signing up

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

  const Bookie = await User.create({
    firstName: 'Cannoli',
    lastName: 'Garcia',
    email: 'cannoli@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'user',
    organizationId: 2,
  });

  const testChannel = await Channel.create({
    channelName: 'Test Channel',
    organizationId: 1,
  });

  const testChannel2 = await Channel.create({
    channelName: 'Test Channel 2',
    organizationId: 1,
  });

  const channels = await Channel.findAll(); // We will use this to get the channels, then we can filter by name or id

  await cannoli.addChannels(channels[1]);
  await Bookie.addChannels([testChannel, testChannel2]);

  await sequelize.close();
}

main().catch(console.error);
