/* eslint-disable no-return-await */
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'postgresql',
  port: 5432,
  username: 'username',
  password: 'password',
  database: 'your_database',
  retry: {
    max: 5,
    delay: 5000,
  },
});

export const initDatabase = async () => {
  await sequelize.sync();
};

export default sequelize;
