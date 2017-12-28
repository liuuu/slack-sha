"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n\n  type Message {\n    id: Int!\n    text: String!\n    user: User!\n    channel: Channel!\n    created_at: String!\n  }\n\n  type Mutation {\n    createMessage(channelId: Int!, text: String!): Boolean!\n  }\n\n  type Query {\n    messages(channelId: Int!, offset: Int!) : [Message!]!\n  }\n\n  type Subscription {\n    newChannelMessage(channelId:Int!) :Message!\n  }\n\n";