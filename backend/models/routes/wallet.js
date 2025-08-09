const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// GET Wallet Balance & Transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallet transactions');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// BUY Crypto (mock)
router.post('/buy', authMiddleware, async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.wallet.balance += amount;
    user.transactions.push({
      type: 'buy',
      amount,
      currency,
      date: new Date()
    });
    await user.save();
    res.json({ success: true, wallet: user.wallet, transactions: user.transactions });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// SELL Crypto (mock)
router.post('/sell', authMiddleware, async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }
    user.wallet.balance -= amount;
    user.transactions.push({
      type: 'sell',
      amount,
      currency,
      date: new Date()
    });
    await user.save();
    res.json({ success: true, wallet: user.wallet, transactions: user.transactions });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
