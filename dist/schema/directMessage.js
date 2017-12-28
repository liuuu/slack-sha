"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type DirectMessage {\n    id: Int!\n    text: String!\n    sender: User!\n    receiverId: Int!\n    created_at: String!\n  }\n  type Query {\n    directMessages(teamId: Int!, otherUserId: Int!): [DirectMessage!]!\n  }\n  type Mutation {\n    createDirectMessage(receiverId: Int!, text: String!, teamId: Int!): Boolean!\n  }\n   type Subscription {\n    newDirectMessage(teamId:Int!, userId:Int) :DirectMessage!\n  }\n";