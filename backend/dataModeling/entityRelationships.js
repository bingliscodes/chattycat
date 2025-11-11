import User from '../models/userModel.js';
import Organization from '../models/organizationModel.js';
import Channel from '../models/channelModel.js';
import UserChannel from '../models/userChannelModel.js';
import sequelize from '../utils/database.js';

const modelRelationships = async () => {
  Organization.hasMany(User);
  User.belongsTo(Organization);

  Organization.hasMany(Channel);
  Channel.belongsTo(Organization);

  User.belongsToMany(Channel, { through: UserChannel });
  Channel.belongsToMany(User, { through: UserChannel });
  //   User.hasMany(UserChannel);
  //   UserChannel.belongsTo(User);
  //   Channel.hasMany(UserChannel);
  //   UserChannel.belongsTo(Channel);

  try {
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error(err);
  }
};

modelRelationships();
export default modelRelationships;
