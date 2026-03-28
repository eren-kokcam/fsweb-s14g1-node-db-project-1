const router = require('express').Router()
const Account = require('./accounts-model')
const { 
  checkAccountId, 
  checkAccountPayload, 
  checkAccountNameUnique 
} = require('./accounts-middleware')
console.log("Middleware Test:", { checkAccountPayload, checkAccountNameUnique });
router.get('/', async (req, res, next) => {
  try {
    const accounts = await Account.getAll()
    res.json(accounts)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', checkAccountId, (req, res) => {
  // checkAccountId middleware'i hesabı req.account'a eklemiş olmalı
  res.json(req.account)
})

router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const newAccount = await Account.create({ 
      name: req.body.name.trim(), 
      budget: req.body.budget 
    })
    res.status(201).json(newAccount)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try {
    const updatedAccount = await Account.updateById(req.params.id, {
      name: req.body.name.trim(),
      budget: req.body.budget
    })
    res.json(updatedAccount)
  } catch (err) {
    next(err)
  }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    const deletedAccount = await Account.deleteById(req.params.id)
    res.json(deletedAccount)
  } catch (err) {
    next(err)
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  })
})

module.exports = router;