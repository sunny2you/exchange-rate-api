const ExchangeRate = require('../models/ExchangeRate');
const { calculateReverseRate } = require('./utils/exchangeRateUtils');

// 환율 조회

async function getExchangeRate(_, { src, tgt }) {
  try {
    // 1. 동일 통화 처리 (성능 최적화)
    if (src === tgt) {
      return {
        src,
        tgt,
        rate: 1,
        date: new Date().toISOString().split('T')[0],
      };
    }

    // 2. DB에서 직접 조회
    const latestRate = await ExchangeRate.findOne({ src, tgt }).sort({ date: -1 });

    if (latestRate) {
      return latestRate; // DB에 있으면 빠르게 반환
    }

    // 3. 반대 방향 환율 계산 (Lazy Evaluation)
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

// 환율 등록/업데이트
async function postExchangeRate(_, { info }) {
  const { src, tgt, rate, date } = info;
  const currentDate = date || new Date().toISOString().split('T')[0];

  const updatedRate = await ExchangeRate.findOneAndUpdate(
    { src, tgt, date: currentDate }, //찾아서 
    { src, tgt, rate, date: currentDate }, //업데이트
    { upsert: true, new: true } //upsert가 true면 없으면 생성, new가 true면 업데이트된, 또는 새로 생성된 값을 반환
  );
  return updatedRate;
}

// 환율 삭제
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
