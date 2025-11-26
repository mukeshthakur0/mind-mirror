const express = require('express');
const router = express.Router();
const Journal = require('../models/journals');

// @route   GET /api/journals/user/:userId
// @desc    Get all journal entries for a user
// @access  Public (Add auth middleware later)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const journals = await Journal.find({ userId })
      .sort({ date: -1 })
      .lean();
    
    res.json(journals);
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ error: 'Failed to fetch journals', message: error.message });
  }
});

// @route   GET /api/journals/:id
// @desc    Get a single journal entry by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    res.json(journal);
  } catch (error) {
    console.error('Error fetching journal:', error);
    res.status(500).json({ error: 'Failed to fetch journal', message: error.message });
  }
});

// @route   POST /api/journals
// @desc    Create a new journal entry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { userId, date, title, content, mood } = req.body;
    
    // Validation
    if (!userId || !date || !title || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['userId', 'date', 'title', 'content']
      });
    }
    
    // Check if entry already exists for this user and date
    const existingEntry = await Journal.findOne({ 
      userId, 
      date: new Date(date).setHours(0, 0, 0, 0)
    });
    
    if (existingEntry) {
      return res.status(409).json({ 
        error: 'Entry already exists for this date',
        existingEntry 
      });
    }
    
    // Create new journal entry
    const journal = new Journal({
      userId,
      date: new Date(date),
      title: title.trim(),
      content: content.trim(),
      mood: mood || '🙂 Neutral',
    });
    
    const savedJournal = await journal.save();
    res.status(201).json(savedJournal);
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({ error: 'Failed to create journal', message: error.message });
  }
});

// @route   PUT /api/journals/:id
// @desc    Update a journal entry
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { title, content, mood, date } = req.body;
    
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    // Update fields
    if (title !== undefined) journal.title = title.trim();
    if (content !== undefined) journal.content = content.trim();
    if (mood !== undefined) journal.mood = mood;
    if (date !== undefined) journal.date = new Date(date);
    
    const updatedJournal = await journal.save();
    res.json(updatedJournal);
  } catch (error) {
    console.error('Error updating journal:', error);
    res.status(500).json({ error: 'Failed to update journal', message: error.message });
  }
});

// @route   DELETE /api/journals/:id
// @desc    Delete a journal entry
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journal entry deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).json({ error: 'Failed to delete journal', message: error.message });
  }
});

// @route   GET /api/journals/user/:userId/stats
// @desc    Get journal statistics for a user
// @access  Public
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const journals = await Journal.find({ userId });
    
    // Calculate stats
    const totalEntries = journals.length;
    
    // Mood counts
    const moodCounts = journals.reduce((acc, journal) => {
      acc[journal.mood] = (acc[journal.mood] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate streak
    const sortedDates = journals
      .map(j => new Date(j.date).setHours(0, 0, 0, 0))
      .sort((a, b) => b - a);
    
    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    
    if (sortedDates.length > 0) {
      const lastEntry = sortedDates[0];
      const dayDiff = Math.floor((today - lastEntry) / (1000 * 60 * 60 * 24));
      
      if (dayDiff <= 1) {
        streak = 1;
        for (let i = 0; i < sortedDates.length - 1; i++) {
          const diff = Math.floor((sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }
    
    res.json({
      totalEntries,
      moodCounts,
      streak,
      mostFrequentMood: Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});
module.exports = router;