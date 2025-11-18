import User from '../models/userModel.js';
import Organization from '../models/organizationModel.js';
import Channel from '../models/channelModel.js';
import {
  ChannelMessage,
  DirectMessage,
  DirectMessageRoom,
} from '../models/messageModel.js';
import UserChannel from '../models/userChannelModel.js';

const modelRelationships = async () => {
  Organization.hasMany(User);
  User.belongsTo(Organization);

  Organization.hasMany(Channel);
  Channel.belongsTo(Organization);

  User.belongsToMany(Channel, { through: UserChannel });
  Channel.belongsToMany(User, { through: UserChannel });

  User.hasMany(ChannelMessage);
  ChannelMessage.belongsTo(User);

  Channel.hasMany(ChannelMessage);
  ChannelMessage.belongsTo(Channel);

  // User <--> DirectMessage
  User.hasMany(DirectMessage, { foreignKey: 'senderId', as: 'SentMessages' });
  DirectMessage.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });

  // One User can receive many messages (as receiver)
  User.hasMany(DirectMessage, {
    foreignKey: 'receiverId',
    as: 'ReceivedMessages',
  });
  DirectMessage.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

  // User <--> DirectMessageRoom
  // A user can be user1 in many rooms
  User.hasMany(DirectMessageRoom, {
    foreignKey: 'user1Id',
    as: 'DMRoomsAsUser1',
  });
  DirectMessageRoom.belongsTo(User, { foreignKey: 'user1Id', as: 'User1' });

  // A user can be user2 in many rooms
  User.hasMany(DirectMessageRoom, {
    foreignKey: 'user2Id',
    as: 'DMRoomsAsUser2',
  });
  DirectMessageRoom.belongsTo(User, { foreignKey: 'user2Id', as: 'User2' });

  // DirectMessageRoom <--> DirectMessage
  DirectMessageRoom.hasMany(DirectMessage, {
    foreignKey: 'roomId',
    as: 'Messages',
  });
  DirectMessage.belongsTo(DirectMessageRoom, {
    foreignKey: 'roomId',
    as: 'Room',
  });
};

modelRelationships();
export default modelRelationships;
