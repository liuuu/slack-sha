// CRUD
// Create
// Read
// Update
// Delete

export default `

  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors:[Error!]
  }

  type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
  }

  type Mutation {
    register(username:String!,email:String!, password:String!): RegisterResponse!
  }

  

`;
