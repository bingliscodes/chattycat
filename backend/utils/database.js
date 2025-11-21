import { Sequelize } from 'sequelize';

let sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else {
  sequelize = new Sequelize('sys', 'root', 'my-secret-pw', {
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    logging: false,
  });
}

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
