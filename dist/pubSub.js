'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlRedisSubscriptions = require('graphql-redis-subscriptions');

var REDIS_DOMAIN_NAME = process.env.REDIS_HOST || '127.0.0.1'; // import { PubSub } from 'graphql-subscriptions/dist/pubsub';

// export default new PubSub();

var PORT_NUMBER = '6379';

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

// export default new RedisPubSub({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: '6379',
//   retry_strategy: optionss =>
//     // reconnect after
//     Math.max(optionss.attempt * 100, 3000),
// });

exports.default = new _graphqlRedisSubscriptions.RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: 6379,
    retry_strategy: function retry_strategy(options) {
      return Math.max(options.attempt * 100, 3000);
    }
  }
});