'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatErrors = require('../formatErrors');

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permissions = require('../permissions');

var _permissions2 = _interopRequireDefault(_permissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Mutation: {
    createChannel: _permissions2.default.createResolver(function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, args, _ref2) {
        var models = _ref2.models,
            user = _ref2.user;
        var member, channel;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return models.Member.findOne({ where: { teamId: args.teamId, userId: user.id } }, { raw: true });

              case 3:
                member = _context.sent;

                if (member.admin) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', {
                  ok: false,
                  errors: [{
                    path: 'name',
                    message: 'You have to be the owner of the team to create channels'
                  }]
                });

              case 6:
                _context.next = 8;
                return models.Channel.create(args);

              case 8:
                channel = _context.sent;
                return _context.abrupt('return', {
                  ok: true,
                  channel: channel
                });

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0);
                return _context.abrupt('return', {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context.t0)
                });

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[0, 12]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }())
  }
};