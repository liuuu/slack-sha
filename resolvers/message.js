import { PubSub, withFilter } from 'graphql-subscriptions';

import requiresAuth, { requiresTeamAccess } from '../permissions';

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
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
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }

      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },

  Subscription: {
    newChannelMessage: {
      subscribe: requiresTeamAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId,
      )),
    },
  },

  Query: {
    messages: requiresAuth.createResolver(async (parent, { channelId, offset }, { models }) =>
      models.Message.findAll(
        {
          order: [['created_at', 'ASC']],
          where: { channelId },
          limit: 20,
          offset,
        },
        { raw: true },
      )),
  },

  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const message = await models.Message.create({
          ...args,
          userId: user.id,
        });

        const asyncFunc = async () => {
          const currentUser = await models.User.findOne({
            where: {
              id: user.id,
            },
          });

          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: {
              ...message.dataValues,
              user: currentUser.dataValues,
            },
          });
        };

        asyncFunc();

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }),
  },
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
