'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphqlSubscriptions = require('graphql-subscriptions');

var _permissions = require('../permissions');

var _permissions2 = _interopRequireDefault(_permissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pubsub = new _graphqlSubscriptions.PubSub();

var NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

exports.default = {
  // type Message {
  //   id: Int!
  //   text: String!
  //   user: User!
  //   channel: Channel!
  //   createAt: String!
  // }
  // type Query {
  //   messages(channelId: Int!) : [Message!]!
  // }

  // there's a sub-query inside the type Message called user
  // automatic query
  // recieve parent as first params
  Message: {
    user: function user(_ref, args, _ref2) {
      var _user = _ref.user,
          userId = _ref.userId;
      var models = _ref2.models;

      if (_user) {
        return _user;
      }

      return models.User.findOne({ where: { id: userId } }, { raw: true });
    }
  },

  Subscription: {
    newChannelMessage: {
      subscribe: _permissions.requiresTeamAccess.createResolver((0, _graphqlSubscriptions.withFilter)(function () {
        return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE);
      }, function (payload, args) {
        return payload.channelId === args.channelId;
      }))
    }
  },

  Query: {
    messages: _permissions2.default.createResolver(function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, _ref4, _ref5) {
        var channelId = _ref4.channelId,
            offset = _ref4.offset;
        var models = _ref5.models;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', models.Message.findAll({
                  order: [['created_at', 'DESC']],
                  where: { channelId: channelId },
                  limit: 20,
                  offset: offset
                }, { raw: true }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
      };
    }())
  },

  Mutation: {
    createMessage: _permissions2.default.createResolver(function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(parent, args, _ref7) {
        var models = _ref7.models,
            user = _ref7.user;
        var message, asyncFunc;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return models.Message.create((0, _extends3.default)({}, args, {
                  userId: user.id
                }));

              case 3:
                message = _context3.sent;

                asyncFunc = function () {
                  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                    var currentUser;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return models.User.findOne({
                              where: {
                                id: user.id
                              }
                            });

                          case 2:
                            currentUser = _context2.sent;


                            pubsub.publish(NEW_CHANNEL_MESSAGE, {
                              channelId: args.channelId,
                              newChannelMessage: (0, _extends3.default)({}, message.dataValues, {
                                user: currentUser.dataValues
                              })
                            });

                          case 4:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, undefined);
                  }));

                  return function asyncFunc() {
                    return _ref8.apply(this, arguments);
                  };
                }();

                asyncFunc();

                return _context3.abrupt('return', true);

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3['catch'](0);

                console.log(_context3.t0);
                return _context3.abrupt('return', false);

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[0, 9]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref6.apply(this, arguments);
      };
    }())
  }
};

// Message: {
//     user: ({ user, userId }, args, { models }) => {
//       if (user) {
//         return user;
//       }
//       return models.User.findOne({ where: { id: userId } }, { raw: true });
//     },
//   },

//   Query: {
//     messages: requiresAuth.createResolver(async (parent, { channelId }, { models }) =>
//       models.Message.findAll(
//         { order: [['created_at', 'ASC']], where: { channelId } },
//         { raw: true },
//       )),
//   },
//   Mutation: {
//     createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
//       try {
//         const message = await models.Message.create({
//           ...args,
//           userId: user.id,
//         });

//         const asyncFunc = async () => {
//           const currentUser = await models.User.findOne({
//             where: {
//               id: user.id,
//             },
//           });

//           pubsub.publish(NEW_CHANNEL_MESSAGE, {
//             channelId: args.channelId,
//             newChannelMessage: {
//               ...message.dataValues,
//               user: currentUser.dataValues,
//             },
//           });
//         };

//         asyncFunc();

//         return true;
//       } catch (err) {
//         console.log(err);
//         return false;
//       }
//     }),
//   },

//   Subscription: {
//     newChannelMessage: {
//       subscribe: withFilter(
//         () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
//         // args is (subscription query)'s args
//         (payload, args) => payload.channelId === args.channelId,
//       ),
//     },
//   },