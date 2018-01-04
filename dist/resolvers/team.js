'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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
  Query: {
    getTeamMembers: _permissions2.default.createResolver(function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, _ref2, _ref3) {
        var teamId = _ref2.teamId;
        var models = _ref3.models;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', models.sequelize.query('select * from users as u join members as m on m.user_id = u.id where m.team_id = ?', {
                  replacements: [teamId],
                  model: models.User,
                  raw: true
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }()),

    allTeams: _permissions2.default.createResolver(function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(parent, args, _ref5) {
        var models = _ref5.models,
            user = _ref5.user;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', models.Team.findAll({ where: { owner: user.id } }, { raw: true }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x4, _x5, _x6) {
        return _ref4.apply(this, arguments);
      };
    }()),

    inviteTeams: _permissions2.default.createResolver(function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(parent, args, _ref7) {
        var models = _ref7.models,
            user = _ref7.user;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', models.Team.findAll({
                  include: [{
                    model: models.User,
                    where: { id: user.id }
                  }]
                }, { raw: true }));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function (_x7, _x8, _x9) {
        return _ref6.apply(this, arguments);
      };
    }())
  },

  Mutation: {
    createTeam: _permissions2.default.createResolver(function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(parent, args, _ref9) {
        var models = _ref9.models,
            user = _ref9.user;
        var response;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return models.sequelize.transaction(function () {
                  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(transaction) {
                    var team;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return models.Team.create((0, _extends3.default)({}, args), { transaction: transaction });

                          case 2:
                            team = _context4.sent;
                            _context4.next = 5;
                            return models.Channel.create({ name: 'bugs', public: true, teamId: team.id }, { transaction: transaction });

                          case 5:
                            _context4.next = 7;
                            return models.Member.create({ teamId: team.id, userId: user.id, admin: true }, { transaction: transaction });

                          case 7:
                            return _context4.abrupt('return', team);

                          case 8:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, undefined);
                  }));

                  return function (_x13) {
                    return _ref10.apply(this, arguments);
                  };
                }());

              case 3:
                response = _context5.sent;
                return _context5.abrupt('return', {
                  ok: true,
                  team: response
                });

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5['catch'](0);

                console.log(_context5.t0);
                return _context5.abrupt('return', {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context5.t0, models)
                });

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined, [[0, 7]]);
      }));

      return function (_x10, _x11, _x12) {
        return _ref8.apply(this, arguments);
      };
    }()),
    addTeamMember: _permissions2.default.createResolver(function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(parent, _ref12, _ref13) {
        var email = _ref12.email,
            teamId = _ref12.teamId;
        var models = _ref13.models,
            user = _ref13.user;

        var memberPromise, userToAddPromise, _ref14, _ref15, member, userToAdd;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                memberPromise = models.Member.findOne({ where: { teamId: teamId, userId: user.id } }, { raw: true });
                userToAddPromise = models.User.findOne({ where: { email: email } }, { raw: true });
                _context6.next = 5;
                return _promise2.default.all([memberPromise, userToAddPromise]);

              case 5:
                _ref14 = _context6.sent;
                _ref15 = (0, _slicedToArray3.default)(_ref14, 2);
                member = _ref15[0];
                userToAdd = _ref15[1];

                if (member.admin) {
                  _context6.next = 11;
                  break;
                }

                return _context6.abrupt('return', {
                  ok: false,
                  errors: [{
                    path: 'email',
                    message: 'You cannot add members to the team'
                  }]
                });

              case 11:
                if (userToAdd) {
                  _context6.next = 13;
                  break;
                }

                return _context6.abrupt('return', {
                  ok: false,
                  errors: [{
                    path: 'email',
                    message: 'Could not find user with this email'
                  }]
                });

              case 13:
                _context6.next = 15;
                return models.Member.create({ userId: userToAdd.id, teamId: teamId });

              case 15:
                return _context6.abrupt('return', {
                  ok: true
                });

              case 18:
                _context6.prev = 18;
                _context6.t0 = _context6['catch'](0);

                console.log(_context6.t0);
                return _context6.abrupt('return', {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context6.t0, models)
                });

              case 22:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, undefined, [[0, 18]]);
      }));

      return function (_x14, _x15, _x16) {
        return _ref11.apply(this, arguments);
      };
    }())
  },
  Team: {
    channels: function channels(_ref16, args, _ref17) {
      var id = _ref16.id;
      var models = _ref17.models;
      return models.Channel.findAll({ where: { teamId: id } });
    },
    directMessageMembers: function directMessageMembers(_ref18, args, _ref19) {
      var id = _ref18.id;
      var models = _ref19.models,
          user = _ref19.user;
      return models.sequelize.query('select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId', {
        replacements: { currentUserId: user.id, teamId: id },
        model: models.User,
        raw: true
      });
    }
  }
};