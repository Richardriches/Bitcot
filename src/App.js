import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [btcPrice, setBtcPrice] = useState(null);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPrice();
  }, []);

  const fetchPrice = async () => {
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      setBtcPrice(res.data.bitcoin.usd);
    } catch (error) {
      console.error('Failed to fetch BTC price', error);
    }
  };

  const buyBitcoin = () => {
    if (amount <= 0) return setMessage('Enter a valid amount.');
    const cost = amount * btcPrice;
    if (cost > balance) {
      setMessage('Insufficient balance.');
    } else {
      setBalance(balance - cost);
      setMessage(`Bought ${amount} BTC for $${cost.toFixed(2)}`);
    }
  };

  const deposit = () => {
    const depositAmount = parseFloat(prompt('Enter USD amount to deposit:'));
    if (depositAmount > 0) {
      setBalance(balance + depositAmount);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Crypto Exchange - Buy Bitcoin</h1>
      <p>Current BTC Price: <strong>${btcPrice || 'Loading...'}</strong></p>
      <p>Your USD Balance: <strong>${balance.toFixed(2)}</strong></p>

      <input
        type="number"
        placeholder="Amount of BTC"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%' }}
      />

      <div>
        <button onClick={buyBitcoin} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>Buy BTC</button>
        <button onClick={deposit} style={{ padding: '0.5rem 1rem' }}>Deposit USD</button>
      </div>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default App;
