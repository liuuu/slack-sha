import Sequelize from 'sequelize';
import { connect } from 'tls';

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two second later');
}

export default async () => {
  let max = 20;
  let connected = false;

  const sequelize = new Sequelize('slack', 'postgres', 'postgres', {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    define: {
      underscored: true,
    },
  });

  while (!connected && max) {
    try {
      await sequelize.authenticate();
      connected = true;
    } catch (err) {
      console.log('err');
      await sleep(1000);
      max -= 1;
    }
  }

  if (!connected) {
    return null;
  }

  const models = {
    User: sequelize.import('./user'),
    Channel: sequelize.import('./channel'),
    Message: sequelize.import('./message'),
    Team: sequelize.import('./team'),
    Member: sequelize.import('./member'),
    DirectMessage: sequelize.import('./directMessage'),
  };

  Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  return models;
};

// const sequelize = new Sequelize('slack', 'postgres', 'postgres', {
//   dialect: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   define: {
//     underscored: true,
//   },
// });

// const models = {
//   User: sequelize.import('./user'),
//   Channel: sequelize.import('./channel'),
//   Message: sequelize.import('./message'),
//   Team: sequelize.import('./team'),
//   Member: sequelize.import('./member'),
//   DirectMessage: sequelize.import('./directMessage'),
// };

// Object.keys(models).forEach((modelName) => {
//   if ('associate' in models[modelName]) {
//     models[modelName].associate(models);
//   }
// });

// models.sequelize = sequelize;
// models.Sequelize = Sequelize;
