import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';

const Channel = sequelize.define(
  'channel',
  {
    // channelId: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
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
