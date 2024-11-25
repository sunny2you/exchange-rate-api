const mongoose = require('mongoose');

function enforceSameCurrencyRate(doc) {
  if (doc.src === doc.tgt) {
    doc.rate = 1;
  }
}

const exchangeRateSchema = new mongoose.Schema({
  src: { type: String, required: true },
  tgt: { type: String, required: true },
  rate: { type: Number, required: true },
  date: { type: String, required: true },
});

exchangeRateSchema.index({ src: 1, tgt: 1, date: 1 }, { unique: true });

exchangeRateSchema.pre('save', function (next) {
  enforceSameCurrencyRate(this); 
  next();
});

exchangeRateSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  enforceSameCurrencyRate(update); 
  next();
});

module.exports = mongoose.model('ExchangeRate', exchangeRateSchema);
