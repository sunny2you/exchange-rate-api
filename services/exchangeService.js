const ExchangeRate = require('../models/ExchangeRate');
const { calculateReverseRate } = require('../utils/exchangeRateUtils');
const { startSession } = require('mongoose');

async function getExchangeRate(src, tgt) {
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
}

async function postExchangeRate(info) {
  const { src, tgt, rate, date } = info;
  const currentDate = date || new Date().toISOString().split('T')[0];

  const session = await startSession();
  session.startTransaction();

  try {
    const updatedRate = await ExchangeRate.findOneAndUpdate(
      { src, tgt, date: currentDate },
      { src, tgt, rate, date: currentDate },
      { upsert: true, new: true, session }
    );

    const reverseRate = rate !== 0 ? 1 / rate : 0;
    const updatedReverseRate = await ExchangeRate.findOneAndUpdate(
      { src: tgt, tgt: src, date: currentDate },
      { src: tgt, tgt: src, rate: reverseRate, date: currentDate },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      src,
      tgt,
      rate,
      date: currentDate,
      reverseRate,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Failed to upsert exchange rate for ${src} to ${tgt}: ${error.message}`);
  }
}

async function deleteExchangeRate(info) {
  const { src, tgt, date } = info;

  const session = await ExchangeRate.startSession();
  session.startTransaction();

  try {
    const deletedRate = await ExchangeRate.findOneAndDelete({ src, tgt, date }, { session });

    if (!deletedRate) {
      throw new Error(`No exchange rate found for ${src} to ${tgt} on ${date}`);
    }

    const reverseDeletedRate = await ExchangeRate.findOneAndDelete(
      { src: tgt, tgt: src, date },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      deletedRate,
      reverseDeletedRate,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Failed to delete exchange rate for ${src} to ${tgt}: ${error.message}`);
  }
}

module.exports = {
  getExchangeRate,
  postExchangeRate,
  deleteExchangeRate,
};
