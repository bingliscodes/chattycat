import { DataTypes } from 'sequelize';
import User from './userModel.js';

import sequelize from '../utils/database.js';

export const ChannelMessage = sequelize.define('channelMessage', {
  messageContent: {
    type: DataTypes.STRING,
  },
});

export const DirectMessageRoom = sequelize.define(
  'directMessageRoom',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user1Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    user2Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { indexes: [{ unique: true, fields: ['user1Id', 'user2Id'] }] },
);

export const DirectMessage = sequelize.define('directMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  messageContent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: DirectMessageRoom,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
});
