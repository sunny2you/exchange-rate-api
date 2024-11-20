// utils/exchangeRateUtils.js

const ExchangeRate = require('../../models/ExchangeRate'); // 환율 모델

/**
 * 반대 방향 환율을 계산하는 함수
 * @param {String} src - 소스 통화 (예: KRW)
 * @param {String} tgt - 대상 통화 (예: USD)
 * @returns {Object} 계산된 반대 방향 환율 객체
 */
async function calculateReverseRate(src, tgt) {
  try {
    // 1. 반대 방향 환율 조회
    const reverseRate = await ExchangeRate.findOne({ src: tgt, tgt: src }).sort({ date: -1 });

    // 2. 반대 방향 환율이 없으면 에러 처리
    if (!reverseRate) {
      throw new Error(`No exchange rate found for ${tgt} to ${src}`);
    }

    // 3. 반대 방향 환율을 기반으로 계산
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
