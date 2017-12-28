'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphqlSubscriptions = require('graphql-subscriptions');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _permissions = require('../permissions');

var _permissions2 = _interopRequireDefault(_permissions);

var _pubSub = require('../pubSub');

var _pubSub2 = _interopRequireDefault(_pubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

exports.default = {
  Subscription: {
    newDirectMessage: {
      subscribe: _permissions.directMessageSubscription.createResolver((0, _graphqlSubscriptions.withFilter)(function () {
        return _pubSub2.default.asyncIterator(NEW_DIRECT_MESSAGE);
      }, function (payload, args, _ref) {
        var user = _ref.user;

        console.log(_chalk2.default.red(payload));
        console.log(_chalk2.default.red(args.userId));
        return payload.teamId === args.teamId && (payload.senderId === user.id && payload.receiverId === args.userId || payload.senderId === args.userId && payload.receiverId === user.id);
      }))
    }
  },
  // sub-query of return type DirectMessage
  DirectMessage: {
    sender: function sender(_ref2, args, _ref3) {
      var _sender = _ref2.sender,
          senderId = _ref2.senderId;
      var models = _ref3.models;

      if (_sender) {
        return _sender;
      }

      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    }
  },

  Query: {
    directMessages: _permissions2.default.createResolver(function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, _ref5, _ref6) {
        var teamId = _ref5.teamId,
            otherUserId = _ref5.otherUserId;
        var models = _ref6.models,
            user = _ref6.user;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', models.DirectMessage.findAll({
                  order: [['created_at', 'ASC']],
                  where: (0, _defineProperty3.default)({
                    teamId: teamId
                  }, models.sequelize.Op.or, [(0, _defineProperty3.default)({}, models.sequelize.Op.and, [{ receiverId: otherUserId }, { senderId: user.id }]), (0, _defineProperty3.default)({}, models.sequelize.Op.and, [{ receiverId: user.id }, { senderId: otherUserId }])])
                }, { raw: true }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x, _x2, _x3) {
        return _ref4.apply(this, arguments);
      };
    }())
  },
  Mutation: {
    createDirectMessage: _permissions2.default.createResolver(function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(parent, args, _ref10) {
        var models = _ref10.models,
            user = _ref10.user;
        var directMessage;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return models.DirectMessage.create((0, _extends3.default)({}, args, {
                  senderId: user.id
                }));

              case 3:
                directMessage = _context2.sent;


                _pubSub2.default.publish(NEW_DIRECT_MESSAGE, {
                  teamId: args.teamId,
                  senderId: user.id,
                  receiverId: args.receiverId,
                  newDirectMessage: (0, _extends3.default)({}, directMessage.dataValues, {
                    sender: {
                      username: user.username
                    }
                  })
                });

                // asyncFunc();

                return _context2.abrupt('return', true);

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](0);

                console.log(_context2.t0);
                return _context2.abrupt('return', false);

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined, [[0, 8]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref9.apply(this, arguments);
      };
    }())
  }
};