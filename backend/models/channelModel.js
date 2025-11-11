import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';

const Channel = sequelize.define(
  'channel',
  {
    channelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'channels',
  },
);

export default Channel;
