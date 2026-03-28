const Account = require('./accounts-model');

// 1. checkAccountId Tanımlaması
const checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById(req.params.id);
    if (!account) {
      res.status(404).json({ message: "account not found" });
    } else {
      req.account = account;
      next();
    }
  } catch (err) {
    next(err);
  }
};

// 2. checkAccountPayload Tanımlaması
const checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;
  if (name === undefined || budget === undefined) {
    res.status(400).json({ message: "name and budget are required" });
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    res.status(400).json({ message: "name of account must be between 3 and 100" });
  } else if (typeof budget !== 'number' || isNaN(budget)) {
    res.status(400).json({ message: "budget of account must be a number" });
  } else if (budget < 0 || budget > 1000000) {
    res.status(400).json({ message: "budget of account is too large or too small" });
  } else {
    next();
  }
};

// 3. checkAccountNameUnique Tanımlaması
const checkAccountNameUnique = async (req, res, next) => {
  try {
    const { name } = req.body;
    const accounts = await Account.getAll();
    const isTaken = accounts.find(acc => acc.name.trim() === name.trim());
    
    if (isTaken) {
      res.status(400).json({ message: "that name is taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkAccountId,
  checkAccountPayload,
  checkAccountNameUnique,
};