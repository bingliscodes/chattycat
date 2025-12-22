import User from '../models/userModel.js';
import Organization from '../models/organizationModel.js';
import Channel from '../models/channelModel.js';
import {
  DirectMessageRoom,
  Message,
  MessageAttachment,
} from '../models/messageModel.js';
import UserChannel from '../models/userChannelModel.js';
import UserOrganization from '../models/userOrganizationModel.js';

const modelRelationships = async () => {
  Organization.belongsToMany(User, { through: UserOrganization, as: 'Users' });
  User.belongsToMany(Organization, {
    through: UserOrganization,
    as: 'Organizations',
  });

  Organization.hasMany(Channel, { foreignKey: 'organizationId' });
  Channel.belongsTo(Organization, { foreignKey: 'organizationId' });

  // User ↔ Channel (M:N)
  User.belongsToMany(Channel, {
    through: UserChannel,
    as: 'Channels',
  });
  Channel.belongsToMany(User, {
    through: UserChannel,
    as: 'Members',
  });

  User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });

  User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
  Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

  Channel.hasMany(Message, { foreignKey: 'channelId', as: 'Messages' });
  Message.belongsTo(Channel, { foreignKey: 'channelId', as: 'Channel' });

  DirectMessageRoom.hasMany(Message, { foreignKey: 'roomId', as: 'Messages' });
  Message.belongsTo(DirectMessageRoom, { foreignKey: 'roomId', as: 'Room' });

  Message.hasMany(Message, {
    foreignKey: 'parentMessageId',
    as: 'ThreadReplies',
  });
  Message.belongsTo(Message, {
    foreignKey: 'parentMessageId',
    as: 'ParentMessage',
  });

  MessageAttachment.belongsTo(Message, {
    foreignKey: 'messageId',
    as: 'MessageAttachmet',
  });
  Message.hasMany(MessageAttachment, {
    foreignKey: 'messageId',
    as: 'Message',
  });
};

modelRelationships();
export default modelRelationships;
