const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLNonNull, GraphQLInputObjectType } = require('graphql');
const resolvers = require('./resolvers');

const ExchangeInfoType = new GraphQLObjectType({
  name: 'ExchangeInfo',
  fields: {
    src: { type: GraphQLNonNull(GraphQLString) },
    tgt: { type: GraphQLNonNull(GraphQLString) },
    rate: { type: GraphQLNonNull(GraphQLFloat) },
    date: { type: GraphQLNonNull(GraphQLString) },
  },
});

const InputUpdateExchangeInfo = new GraphQLInputObjectType({
  name: 'InputUpdateExchangeInfo',
  fields: {
    src: { type: GraphQLNonNull(GraphQLString) },
    tgt: { type: GraphQLNonNull(GraphQLString) },
    rate: { type: GraphQLNonNull(GraphQLFloat) },
    date: { type: GraphQLString },
  },
});

const InputDeleteExchangeInfo = new GraphQLInputObjectType({
  name: 'InputDeleteExchangeInfo',
  fields: {
    src: { type: GraphQLNonNull(GraphQLString) },
    tgt: { type: GraphQLNonNull(GraphQLString) },
    date: { type: GraphQLNonNull(GraphQLString) },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getExchangeRate: {
      type: ExchangeInfoType,
      args: {
        src: { type: GraphQLNonNull(GraphQLString) },
        tgt: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: resolvers.getExchangeRate,
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    postExchangeRate: {
      type: ExchangeInfoType,
      args: {
        info: { type: GraphQLNonNull(InputUpdateExchangeInfo) },
      },
      resolve: resolvers.postExchangeRate,
    },
    deleteExchangeRate: {
      type: ExchangeInfoType,
      args: {
        info: { type: GraphQLNonNull(InputDeleteExchangeInfo) },
      },
      resolve: resolvers.deleteExchangeRate,
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
