import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import models from './models';
import { refreshTokens } from './auth';

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
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
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

// pass context as default params to resolver function
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

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));

models.sequelize.sync({}).then(() => {
  app.listen(8888);
});
