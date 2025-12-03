import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';

const Channel = sequelize.define(
  'channel',

  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    channelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: 'channels',
  },
);

export default Channel;
