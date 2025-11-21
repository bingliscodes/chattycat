import '../config/env.js';
import sequelize from '../utils/database';
import Organization from '../models/organizationModel.js';

console.log('running setup...');
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Clean state
  const testOrg = await Organization.create({
    organizationName: 'Test org',
  });

  globalThis.testOrg = testOrg;
  console.log('✅ testOrg created:', testOrg.id);
});

afterAll(async () => {
  await sequelize.close();
});
