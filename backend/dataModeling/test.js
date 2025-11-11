import sequelize from '../utils/database.js';
import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import Organization from '../models/organizationModel.js';
import modelRelationships from './entityRelationships.js';

async function main() {
  await sequelize.sync({ force: true });

  const testOrg = await Organization.create({
    organizationName: 'Test org',
  });

  const cannoli = await User.create({
    firstName: 'Cannoli',
    lastName: 'Garcia',
    email: 'cannoli7@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'Admin',
    organizationId: 1,
  });

  const Bookie = await User.create({
    firstName: 'Cannoli',
    lastName: 'Garcia',
    email: 'cannoli8@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
    role: 'Admin',
    organizationId: 1,
  });

  const testChannel = await Channel.create({
    channelName: 'Test Channel1',
    organizationId: 1,
  });

  const testChannel2 = await Channel.create({
    channelName: 'Test Channel2',
    organizationId: 1,
  });

  const channels = await Channel.findAll(); // We will use this to get the channels, then we can filter by name or id
  console.log(channels);

  await cannoli.addChannels(channels[1]);
  await Bookie.addChannels([testChannel, testChannel2]);

  await sequelize.close();
}

main().catch(console.error);
