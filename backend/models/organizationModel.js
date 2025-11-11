import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';

const Organization = sequelize.define(
  'organization',
  {
    // organizationId: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
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
