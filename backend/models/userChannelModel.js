import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';
import User from './userModel.js';
import Channel from './channelModel.js';

const UserChannel = sequelize.define(
  'UserChannel',
  {
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
    },
    channelId: {
      type: DataTypes.UUID,
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
