'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var demo = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('Taking a break...');
            _context.next = 3;
            return sleep(2000);

          case 3:
            console.log('Two second later');

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function demo() {
    return _ref.apply(this, arguments);
  };
}();

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _tls = require('tls');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new _promise2.default(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

exports.default = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
  var max, connected, sequelize, models;
  return _regenerator2.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          max = 20;
          connected = false;
          sequelize = new _sequelize2.default('slack', 'postgres', 'postgres', {
            dialect: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            define: {
              underscored: true
            }
          });

        case 3:
          if (!(!connected && max)) {
            _context2.next = 18;
            break;
          }

          _context2.prev = 4;
          _context2.next = 7;
          return sequelize.authenticate();

        case 7:
          connected = true;
          _context2.next = 16;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2['catch'](4);

          console.log('err');
          _context2.next = 15;
          return sleep(1000);

        case 15:
          max -= 1;

        case 16:
          _context2.next = 3;
          break;

        case 18:
          if (connected) {
            _context2.next = 20;
            break;
          }

          return _context2.abrupt('return', null);

        case 20:
          models = {
            User: sequelize.import('./user'),
            Channel: sequelize.import('./channel'),
            Message: sequelize.import('./message'),
            Team: sequelize.import('./team'),
            Member: sequelize.import('./member'),
            DirectMessage: sequelize.import('./directMessage')
          };


          (0, _keys2.default)(models).forEach(function (modelName) {
            if ('associate' in models[modelName]) {
              models[modelName].associate(models);
            }
          });

          models.sequelize = sequelize;
          models.Sequelize = _sequelize2.default;

          return _context2.abrupt('return', models);

        case 25:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined, [[4, 10]]);
}));

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