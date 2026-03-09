const mongoose = require("mongoose");

const MonthlySetupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, 
  income: { type: Number, required: true },
  budgetLimit: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("MonthlySetup", MonthlySetupSchema);