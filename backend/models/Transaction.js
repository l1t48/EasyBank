const mongoose = require("mongoose");
const generateTransactionId = require("../utils/generateTransactionId");

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true, index: true },
  transactionType: { type: String, required: true }, // "deposit", "withdrawal", "transfer"
  amount: { type: Number, required: true },
  state: { type: String, default: "Pending" }, // "pending", "approved", "rejected", "canceled"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetAccountNumber: { type: String },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Ensure a transactionId exists
transactionSchema.pre("validate", function (next) {
  if (!this.transactionId) {
    this.transactionId = generateTransactionId();
  }
  next();
});


module.exports = mongoose.model("Transaction", transactionSchema);
