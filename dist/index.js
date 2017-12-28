'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _apolloServerExpress = require('apollo-server-express');

var _graphqlTools = require('graphql-tools');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mergeGraphqlSchemas = require('merge-graphql-schemas');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _http = require('http');

var _graphql = require('graphql');

var _graphqlSubscriptions = require('graphql-subscriptions');

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _auth = require('./auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, './schema')));

var resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, './resolvers')));

var SECRET = 'sdfdsfsdf435jk3l4j53l4';
var SECRET2 = 'sdfdsfsdfd309450834509jdjs';

var schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: typeDefs,
  resolvers: resolvers
});

var graphqlEndpoint = '/graphql';
var app = (0, _express2.default)();
app.use((0, _cors2.default)('*`'));

var addUser = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var token, _jwt$verify, user, refreshToken, newTokens;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers['x-token'];

            if (!token) {
              _context.next = 15;
              break;
            }

            _context.prev = 2;

            // encrypt the token with user.id, decode the token
            _jwt$verify = _jsonwebtoken2.default.verify(token, SECRET), user = _jwt$verify.user;

            req.user = user;
            _context.next = 15;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](2);
            refreshToken = req.headers['x-refresh-token'];

            // POTENTIAL BUGS

            _context.next = 12;
            return (0, _auth.refreshTokens)(token, refreshToken, _models2.default, SECRET, SECRET2);

          case 12:
            newTokens = _context.sent;

            if (newTokens.token && newTokens.refreshToken) {
              // send back to client
              res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
              res.set('x-token', newTokens.token);
              res.set('x-refresh-token', newTokens.refreshToken);
            }
            req.user = newTokens.user;

          case 15:
            next();

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 7]]);
  }));

  return function addUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

app.use(addUser);
app.use('/files', _express2.default.static('files'));

// pass context as default params to resolver function
app.use(graphqlEndpoint, _bodyParser2.default.json(), (0, _apolloServerExpress.graphqlExpress)(function (req) {
  return {
    schema: schema,
    context: {
      models: _models2.default,
      user: req.user,
      SECRET: SECRET,
      SECRET2: SECRET2
    }
  };
}));

// add endpoint here
app.use('/graphiql', (0, _apolloServerExpress.graphiqlExpress)({
  endpointURL: graphqlEndpoint,
  subscriptionsEndpoint: 'ws://localhost:8888/subscriptions'
}));

var server = (0, _http.createServer)(app);

_models2.default.sequelize.sync({}).then(function () {
  // app.listen(8888);
  server.listen(8888, function () {
    // eslint-disable-next-line
    new _subscriptionsTransportWs.SubscriptionServer({
      execute: _graphql.execute,
      subscribe: _graphql.subscribe,
      schema: schema,
      onConnect: function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref3, webSocket) {
          var token = _ref3.token,
              refreshToken = _ref3.refreshToken;

          var _jwt$verify2, user, newTokens;

          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(token && refreshToken)) {
                    _context2.next = 12;
                    break;
                  }

                  _context2.prev = 1;
                  _jwt$verify2 = _jsonwebtoken2.default.verify(token, SECRET), user = _jwt$verify2.user;
                  return _context2.abrupt('return', { models: _models2.default, user: user });

                case 6:
                  _context2.prev = 6;
                  _context2.t0 = _context2['catch'](1);
                  _context2.next = 10;
                  return (0, _auth.refreshTokens)(token, refreshToken, _models2.default, SECRET, SECRET2);

                case 10:
                  newTokens = _context2.sent;
                  return _context2.abrupt('return', { models: _models2.default, user: newTokens.user });

                case 12:
                  return _context2.abrupt('return', { models: _models2.default });

                case 13:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, undefined, [[1, 6]]);
        }));

        return function onConnect(_x4, _x5) {
          return _ref2.apply(this, arguments);
        };
      }()
    }, {
      server: server,
      path: '/subscriptions'
    });
  });
});
// models.sequelize.sync({ force: true }).then(() => {
//   app.listen(8888);
// });