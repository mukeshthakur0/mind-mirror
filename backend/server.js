const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ["https://mind-mirror-pi.vercel.app/"], // frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mind_mirror:Mitu2004@resume-analyzer.4tmgaxp.mongodb.net/?appName=resume-analyzer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/journals', require('./routes/journals'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Journal API is running' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// ❌ REMOVE app.listen()
// ✅ Instead export app
module.exports = app;
