import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String, enum: ["Happy", "Sad", "Neutral", "Angry", "Excited"], default: "Neutral" },
  date: { type: Date, default: Date.now }
});

const Journal = mongoose.model("Journal", journalSchema);
export default Journal;
