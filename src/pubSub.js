// import { PubSub } from 'graphql-subscriptions/dist/pubsub';

// export default new PubSub();

import { RedisPubSub } from 'graphql-redis-subscriptions';

const REDIS_DOMAIN_NAME = 'http://127.0.0.1';
const PORT_NUMBER = '6379';

// const options = {
//   host: REDIS_DOMAIN_NAME,
//   port: PORT_NUMBER,
//   retry_strategy: optionss =>
//     // reconnect after
//     Math.max(optionss.attempt * 100, 3000),
// };

// const pubsub = new RedisPubSub({
//   publisher: new Redis(options),
//   subscriber: new Redis(options),
// });

export default new RedisPubSub({
  host: REDIS_DOMAIN_NAME,
  port: PORT_NUMBER,
  retry_strategy: optionss =>
    // reconnect after
    Math.max(optionss.attempt * 100, 3000),
});
