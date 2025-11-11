import sequelize from './database.js';
import Organization from '../models/organizationModel.js';
import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import UserChannel from '../models/userChannelModel.js';

const runQueries = async () => {
  try {
    await sequelize.sync({ alter: true });
    await Organization.create({
      organizationName: 'Test org',
    });
    // await User.create({
    //   firstName: 'Cannoli',
    //   lastName: 'Garcia',
    //   email: 'cannoli7@gmail.com',
    //   password: 'password',
    //   passwordConfirm: 'password',
    //   role: 'Admin',
    //   organizationId: 1,
    // });
    // await Channel.create({
    //   channel_name: 'Test Channel',
    //   organizationId: 1,
    // });
    // // await UserChannel.create({
    // //   channelId: 1,
    // //   userId: 1,
    // // });
  } catch (err) {
    console.error(err);
  }
};

runQueries();

export default runQueries;
