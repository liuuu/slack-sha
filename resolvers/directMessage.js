import { withFilter } from 'graphql-subscriptions';
import chalk from 'chalk';
import requiresAuth, { directMessageSubscription } from '../permissions';

import pubsub from '../pubSub';

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

export default {
  Subscription: {
    newDirectMessage: {
      subscribe: directMessageSubscription.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
        (payload, args, { user }) => {
          console.log(chalk.red(payload));
          console.log(chalk.red(args.userId));
          return (
            payload.teamId === args.teamId &&
              ((payload.senderId === user.id && payload.receiverId === args.userId) ||
                (payload.senderId === args.userId && payload.receiverId === user.id))
          );
        },
      )),
    },
  },
  // sub-query of return type DirectMessage
  DirectMessage: {
    sender: ({ sender, senderId }, args, { models }) => {
      if (sender) {
        return sender;
      }

      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    },
  },

  Query: {
    directMessages: requiresAuth.createResolver(async (parent, { teamId, otherUserId }, { models, user }) =>
      models.DirectMessage.findAll(
        {
          order: [['created_at', 'ASC']],
          where: {
            teamId,
            [models.sequelize.Op.or]: [
              {
                [models.sequelize.Op.and]: [{ receiverId: otherUserId }, { senderId: user.id }],
              },
              {
                [models.sequelize.Op.and]: [{ receiverId: user.id }, { senderId: otherUserId }],
              },
            ],
          },
        },
        { raw: true },
      )),
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const directMessage = await models.DirectMessage.create({
          ...args,
          senderId: user.id,
        });

        pubsub.publish(NEW_DIRECT_MESSAGE, {
          teamId: args.teamId,
          senderId: user.id,
          receiverId: args.receiverId,
          newDirectMessage: {
            ...directMessage.dataValues,
            sender: {
              username: user.username,
            },
          },
        });

        // asyncFunc();

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }),
  },
};
