import '../config/env.js';
import { Sequelize } from 'sequelize';

console.log('Env variables:', process.env.NEON_DB_HOST);
let sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'sys',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'my-secret-pw',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
    },
  );
} else if (process.env.NODE_ENV === 'production') {
  // Use PostGres for production?
  sequelize = new Sequelize(
    process.env.NEON_DB_NAME,
    process.env.NEON_DB_USER,
    process.env.NEON_DB_PASSWORD,
    {
      host: process.env.NEON_DB_HOST,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  );
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
