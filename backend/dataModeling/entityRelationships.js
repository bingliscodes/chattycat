import User from '../models/userModel.js';
import Organization from '../models/organizationModel.js';
import Channel from '../models/channelModel.js';
import UserChannel from '../models/userChannelModel.js';

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
};

modelRelationships();
export default modelRelationships;
