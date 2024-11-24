const exchangeService = require('../services/exchangeService');

const resolvers = {
  Query: {
    getExchangeRate: async (_, { src, tgt }) => {
      return await exchangeService.getExchangeRate(src, tgt);
    },
  },
  Mutation: {
    postExchangeRate: async (_, { info }) => {
      return await exchangeService.postExchangeRate(info);
    },
    deleteExchangeRate: async (_, { info }) => {
      return await exchangeService.deleteExchangeRate(info);
    },
  },
};

module.exports = resolvers;
