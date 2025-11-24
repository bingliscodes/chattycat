import '../config/env.js';
import sequelize from '../utils/database';
import Organization from '../models/organizationModel.js';

console.log('running setup...');
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Clean state
});

afterAll(async () => {
  await sequelize.close();
});
