import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Plan { id: ID!, name: String!, price: Int!, currency: String!, interval: String! }
  type SubscriptionInfo { status: String!, currentPeriodEnd: String, planId: String }
  type Order { id: ID!, amount: Int!, currency: String!, providerOrderId: String! }

  type Query {
    ping: String!
    plans: [Plan!]!
    mySubscription: SubscriptionInfo!
  }

  type Mutation {
    createOrder(planId: ID!): Order!
    verifyPayment(providerOrderId: String!, paymentId: String!, signature: String!): Boolean!
    cancelSubscription: Boolean!
  }
`;
