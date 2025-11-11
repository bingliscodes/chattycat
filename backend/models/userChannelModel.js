import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';
import User from './userModel.js';
import Channel from './channelModel.js';

const UserChannel = sequelize.define(
  'user_channel',
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    channelId: {
      type: DataTypes.INTEGER,
      references: {
        model: Channel,
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  },
);

export default UserChannel;
