import '../config/env.js';
import sequelize from '../utils/database';
import User from '../models/userModel.js';

console.log('running setup...');
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Clean state

  await User.create({
    firstName: 'Super',
    lastName: 'User',
    email: 'admin@gmail.com',
    password: 'password',
    passwordConfirm: 'password',
  });
});

afterAll(async () => {
  await sequelize.close();
});
