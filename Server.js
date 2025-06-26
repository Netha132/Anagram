// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 3001;

// app.use(cors());
// app.use(bodyParser.json());

// const DATA_FILE = path.join(__dirname, 'leaderboard.json');

// // Initialize leaderboard file if it doesn't exist
// if (!fs.existsSync(DATA_FILE)) {
//   fs.writeFileSync(DATA_FILE, JSON.stringify([]));
// }

// // Utility: Read leaderboard data
// const readData = () => {
//   try {
//     return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
//   } catch (err) {
//     console.error('Read error:', err);
//     return [];
//   }
// };

// // Utility: Write leaderboard data
// const writeData = (data) => {
//   try {
//     fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
//   } catch (err) {
//     console.error('Write error:', err);
//   }
// };

// // Submit score endpoint
// app.post('/api/submit-score', (req, res) => {
//   try {
//     const { fullName, companyName, score } = req.body;

//     if (!fullName || typeof score !== 'number') {
//       return res.status(400).json({ error: 'Invalid data' });
//     }

//     const data = readData();
//     const timestamp = Date.now();

//     const existingIndex = data.findIndex(
//       p => p.fullName === fullName && p.companyName === companyName
//     );

//     if (existingIndex !== -1) {
//       data[existingIndex] = { fullName, companyName, score, timestamp };
//     } else {
//       data.push({ fullName, companyName, score, timestamp });
//     }

//     writeData(data);
//     res.json({ success: true, message: 'Score submitted successfully' });
//   } catch (error) {
//     console.error('Error submitting score:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get leaderboard (top 5 + current player)
// app.get('/api/get-leaderboard', (req, res) => {
//   try {
//     const currentPlayerName = req.query.currentPlayer;
//     const currentCompanyName = req.query.currentCompany || '';

//     const data = readData();

//     // Remove duplicates (latest timestamp wins)
//     const map = new Map();
//     data.sort((a, b) => b.timestamp - a.timestamp).forEach(entry => {
//       const key = `${entry.fullName}__${entry.companyName}`;
//       if (!map.has(key)) {
//         map.set(key, entry);
//       }
//     });

//     const uniquePlayers = [...map.values()];
//     const sorted = uniquePlayers.sort((a, b) => b.score - a.score);

//     const currentKey = `${currentPlayerName}__${currentCompanyName}`;
//     const currentPlayer = sorted.find(
//       p => `${p.fullName}__${p.companyName}` === currentKey
//     );

//     // Start building final list
//     let top5 = sorted.slice(0, 5);
//     const isInTop5 = top5.some(
//       p => `${p.fullName}__${p.companyName}` === currentKey
//     );

//     let finalList = [...top5];
//     if (!isInTop5 && currentPlayer) {
//       finalList.push(currentPlayer); // Ensures 6 rows
//     }

//     const result = finalList.map(p => ({
//       name: p.fullName,
//       company: p.companyName,
//       score: p.score,
//       isCurrentPlayer: `${p.fullName}__${p.companyName}` === currentKey
//     }));

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching leaderboard:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });



// === server.js ===
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const scoreSchema = new mongoose.Schema({
  fullName: String,
  companyName: String,
  jobTitle: String,
  score: Number,
  email: String,
  contact: String,
  timestamp: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/api/submit-score', async (req, res) => {
  try {
    const { fullName, companyName, jobTitle, score, email, contact } = req.body;
    console.log('[POST] /api/submit-score received:', req.body);

    const newScore = new Score({ fullName, companyName, jobTitle, score, email, contact });
    const saved = await newScore.save();
    console.log('→ Saved entry:', saved);

    res.json({ success: true, message: 'Score submitted successfully' });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/get-leaderboard', async (req, res) => {
  try {
    const currentPlayerName = req.query.currentPlayer || '';
    const currentCompanyName = req.query.currentCompany || '';

    const topScores = await Score.find().sort({ score: -1 }).limit(6);
    console.log('[GET] /api/get-leaderboard → Top scores:', topScores);

    let currentPlayer = null;
    if (currentPlayerName) {
      currentPlayer = await Score.findOne({ fullName: currentPlayerName, companyName: currentCompanyName }).sort({ score: -1 });
    }

    const response = topScores.map(score => ({
      name: score.fullName,
      company: score.companyName,
      jobTitle: score.jobTitle,
      score: score.score,
      isCurrentPlayer: score.fullName === currentPlayerName && score.companyName === currentCompanyName
    }));

    if (currentPlayer && !topScores.some(s => s._id.equals(currentPlayer._id))) {
      response.push({
        name: currentPlayer.fullName,
        company: currentPlayer.companyName,
        jobTitle: currentPlayer.jobTitle,
        score: currentPlayer.score,
        isCurrentPlayer: true
      });
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://viveknetha12:Vivek1920@mern2409cluster.5l0l1.mongodb.net/Leaderboard?retryWrites=true&w=majority&appName=MERN2409cluster");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectToMongoDB();
