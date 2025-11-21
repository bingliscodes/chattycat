export default {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'], // Optional if loading .env before test
  setupFilesAfterEnv: ['./tests/setup.js'],
  transform: {},
};
