const ExchangeRate = require('../models/ExchangeRate');
const { calculateReverseRate } = require('./utils/exchangeRateUtils.js');

async function getExchangeRate(_, { src, tgt }) {
  try {
    if (src === tgt) {
      return {
        src,
        tgt,
        rate: 1,
        date: new Date().toISOString().split('T')[0],
      };
    }

    const latestRate = await ExchangeRate.findOne({ src, tgt }).sort({ date: -1 });

    if (latestRate) {
      return latestRate; 
    }

    const reverseRate = await calculateReverseRate(src, tgt);

    if (!reverseRate) {
      throw new Error(`Exchange rate for ${src} to ${tgt} could not be calculated.`);
    }

    return reverseRate;
  } catch (error) {
    console.error(`[getExchangeRate Error] ${error.message}`);
    throw new Error(`Failed to retrieve exchange rate for ${src} to ${tgt}.`);
  }
}

async function postExchangeRate(_, { info }) {
  const { src, tgt, rate, date } = info;
  const currentDate = date || new Date().toISOString().split('T')[0];

  const updatedRate = await ExchangeRate.findOneAndUpdate(
    { src, tgt, date: currentDate }, 
    { src, tgt, rate, date: currentDate }, 
    { upsert: true, new: true } 
  );
  return updatedRate;
}

async function deleteExchangeRate(_, { info }) {
  const { src, tgt, date } = info;
  const deletedRate = await ExchangeRate.findOneAndDelete({ src, tgt, date });

  if (!deletedRate) {
    throw new Error(`No exchange rate found for ${src} to ${tgt} on ${date}`);
  }
  return deletedRate;
}

module.exports = {
  getExchangeRate,
  postExchangeRate,
  deleteExchangeRate,
};
