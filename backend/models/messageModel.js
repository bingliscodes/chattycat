import { DataTypes } from 'sequelize';
import User from './userModel.js';

import sequelize from '../utils/database.js';

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

export const Message = sequelize.define('message', {
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
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: DirectMessageRoom,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  channelId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'channels',
      key: 'id',
    },
  },
  parentMessageId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM('channel', 'direct'),
    allowNull: false,
  },
});

export const ChannelMessage = sequelize.define('channelMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  messageContent: {
    type: DataTypes.STRING,
  },
  channelId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'channels',
      key: 'id',
    },
  },
});

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
