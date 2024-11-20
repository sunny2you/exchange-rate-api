const mongoose = require('mongoose');

// 헬퍼 함수: 동일 통화일 경우 rate를 1로 설정
function enforceSameCurrencyRate(doc) {
  if (doc.src === doc.tgt) {
    doc.rate = 1;
  }
}

// Schema 정의
const exchangeRateSchema = new mongoose.Schema({
  src: { type: String, required: true },
  tgt: { type: String, required: true },
  rate: { type: Number, required: true },
  date: { type: String, required: true },
});

// 유니크 키 설정
exchangeRateSchema.index({ src: 1, tgt: 1, date: 1 }, { unique: true });

// Pre-save Hook
exchangeRateSchema.pre('save', function (next) {
  enforceSameCurrencyRate(this); // 저장 전에 동일 통화 체크
  next();
});

// Pre-update Hook
exchangeRateSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  enforceSameCurrencyRate(update); // 업데이트 전에 동일 통화 체크
  next();
});

// Model 생성
module.exports = mongoose.model('ExchangeRate', exchangeRateSchema);
