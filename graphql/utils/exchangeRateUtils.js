const ExchangeRate = require('../../models/ExchangeRate'); // 환율 모델


async function calculateReverseRate(src, tgt) {

    const reverseRate = await ExchangeRate.findOne({ src: tgt, tgt: src }).sort({ date: -1 });

    if (!reverseRate) {
      throw new Error(`No exchange rate found for ${tgt} to ${src}`);
    }

    return {
      src,
      tgt,
      rate: 1 / reverseRate.rate, 
      date: reverseRate.date, 
    };
  } catch (error) {
    console.error(`[calculateReverseRate Error] ${error.message}`);
    throw new Error(`Failed to calculate reverse exchange rate for ${src} to ${tgt}`);
  }
}

module.exports = {
  calculateReverseRate,
};