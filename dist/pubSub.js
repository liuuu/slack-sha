'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlRedisSubscriptions = require('graphql-redis-subscriptions');

var REDIS_DOMAIN_NAME = 'http://127.0.0.1'; // import { PubSub } from 'graphql-subscriptions/dist/pubsub';

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

exports.default = new _graphqlRedisSubscriptions.RedisPubSub({
  host: REDIS_DOMAIN_NAME,
  port: PORT_NUMBER,
  retry_strategy: function retry_strategy(optionss) {
    return (
      // reconnect after
      Math.max(optionss.attempt * 100, 3000)
    );
  }
});