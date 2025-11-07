import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('sys', 'root', 'my-secret-pw', {
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connection();
export default sequelize;
