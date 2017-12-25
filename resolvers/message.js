import requiresAuth from '../permissions';

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
  // recieve parent as first params

  Message: {
    user: ({ userId }, args, { models }) =>
      models.User.findOne({ where: { id: userId } }, { raw: true }),
  },

  Query: {
    messages: requiresAuth.createResolver(async (parent, { channelId }, { models }) =>
      models.Message.findAll(
        { order: [['created_at', 'ASC']], where: { channelId } },
        { raw: true },
      )),
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        await models.Message.create({
          ...args,
          userId: user.id,
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }),
  },
};
