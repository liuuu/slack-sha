import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';

// import models from './models';
import getModels from './models';
import { refreshTokens } from './auth';
import { resolve } from 'url';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));

const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const SECRET = 'sdfdsfsdf435jk3l4j53l4';
const SECRET2 = 'sdfdsfsdfd309450834509jdjs';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlEndpoint = '/graphql';
const app = express();
app.use(cors('*`'));

app.use('/files', express.static('files'));

// pass context as default params to resolver function

// add endpoint here
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: graphqlEndpoint,
    subscriptionsEndpoint: 'ws://localhost:8888/subscriptions',
  }),
);

const server = createServer(app);

getModels().then((models) => {
  if (!models) {
    console.log('could not');
    return null;
  }

  models.sequelize.sync({}).then(() => {
    // app.listen(8888);
    server.listen(8888, () => {
      // eslint-disable-next-line
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema,
          onConnect: async ({ token, refreshToken }, webSocket) => {
            if (token && refreshToken) {
              try {
                const { user } = jwt.verify(token, SECRET);
                return { models, user };
              } catch (err) {
                const newTokens = await refreshTokens(
                  token,
                  refreshToken,
                  models,
                  SECRET,
                  SECRET2,
                );
                return { models, user: newTokens.user };
              }
            }

            return { models };
          },
        },
        {
          server,
          path: '/subscriptions',
        },
      );
    });
  });
  const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
      try {
        // encrypt the token with user.id, decode the token
        const { user } = jwt.verify(token, SECRET);
        req.user = user;
      } catch (err) {
        const refreshToken = req.headers['x-refresh-token'];

        // POTENTIAL BUGS
        const newTokens = await refreshTokens(
          token,
          refreshToken,
          models,
          SECRET,
          SECRET2,
        );
        if (newTokens.token && newTokens.refreshToken) {
          // send back to client
          res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
          res.set('x-token', newTokens.token);
          res.set('x-refresh-token', newTokens.refreshToken);
        }
        req.user = newTokens.user;
      }
    }
    next();
  };

  app.use(addUser);
  app.use(
    graphqlEndpoint,
    bodyParser.json(),
    graphqlExpress(req => ({
      schema,
      context: {
        models,
        user: req.user,
        SECRET,
        SECRET2,
      },
    })),
  );
});

// models.sequelize.sync({}).then(() => {
//   // app.listen(8888);
//   server.listen(8888, () => {
//     // eslint-disable-next-line
//     new SubscriptionServer(
//       {
//         execute,
//         subscribe,
//         schema,
//         onConnect: async ({ token, refreshToken }, webSocket) => {
//           if (token && refreshToken) {
//             try {
//               const { user } = jwt.verify(token, SECRET);
//               return { models, user };
//             } catch (err) {
//               const newTokens = await refreshTokens(
//                 token,
//                 refreshToken,
//                 models,
//                 SECRET,
//                 SECRET2,
//               );
//               return { models, user: newTokens.user };
//             }
//           }

//           return { models };
//         },
//       },
//       {
//         server,
//         path: '/subscriptions',
//       },
//     );
//   });
// });

// models.sequelize.sync({ force: true }).then(() => {
//   app.listen(8888);
// });
