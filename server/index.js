const express = require('express');
const cors = require('cors');
const { Connection, PublicKey } = require('@solana/web3.js');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Solana devnet
const connection = new Connection('https://api.devnet.solana.com');

// Mock player data
let players = [
  { id: 1, name: 'Player1', kills: 10, deaths: 5, score: 100 },
  { id: 2, name: 'Player2', kills: 8, deaths: 7, score: 80 },
];

// API endpoints
app.get('/api/players', (req, res) => {
  res.json(players);
});

app.post('/api/transaction', async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    // Verify transaction on Solana
    const tx = await connection.getTransaction(transactionId);
    if (!tx) {
      return res.status(400).json({ error: 'Invalid transaction' });
    }
    
    // Process game logic (e.g. NFT minting, token transfer)
    res.json({ status: 'success', message: 'Transaction processed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});