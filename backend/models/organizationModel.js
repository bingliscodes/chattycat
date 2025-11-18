import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';

const Organization = sequelize.define(
  'organization',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'organizations',
  },
);

export default Organization;
