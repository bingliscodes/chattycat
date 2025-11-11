import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

import sequelize from '../utils/database.js';
import Organization from './organizationModel.js';

const User = sequelize.define(
  'user',
  {
    // userId: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordConfirm: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
      validate: {
        customValidator(value) {
          if (value !== this.password) throw new Error('Passwords must match!');
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    // organizationId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Organization,
    //     key: 'id',
    //   },
    // },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
  },
  {
    instanceMethods: {},
    tableName: 'users',
  },
);

User.beforeSave(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 12);

  user.password = hashedPassword;
  user.passwordConfirm = undefined;
  user.passwordChangedAt = Date.now() - 1000;
});

User.prototype.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

export default User;
