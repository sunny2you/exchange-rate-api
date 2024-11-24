const ExchangeRate = require('../../models/ExchangeRate'); // 환율 모델

async function calculateReverseRate(src, tgt) {
  try {
  
    const reverseRate = await ExchangeRate.findOne({ src: tgt, tgt: src }).sort({ date: -1 });

    if (!reverseRate) {
      throw new Error(`No exchange rate found for ${tgt} to ${src}`);
    }

    return {
      src,
      tgt,
      rate: 1 / reverseRate.rate, // 반대 방향 환율 계산
      date: reverseRate.date, // 동일 기준일 사용
    };
  } catch (error) {
    console.error(`[calculateReverseRate Error] ${error.message}`);
    throw new Error(`Failed to calculate reverse exchange rate for ${src} to ${tgt}`);
  }
}

module.exports = {
  calculateReverseRate,
};