import { DataTypes } from 'sequelize';

import sequelize from '../utils/database.js';
import User from './userModel.js';
import Organization from './channelModel.js';

const UserOrganization = sequelize.define(
  'UserOrganization',
  {
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
    },
    organizationId: {
      type: DataTypes.UUID,
      references: {
        model: Organization,
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('owner', 'admin', 'member', 'superuser'),
      allowNull: false,
      defaultValue: 'member',
    },

    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  },
);

export default UserOrganization;
