import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';
import Organization from './organizationModel.js';

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
      references: {
        model: Organization,
        key: 'id',
      },
    },
  },
  {
    tableName: 'channels',
  },
);

export default Channel;
