const mongoose = require("mongoose");

const ResearchSchema = new mongoose.Schema({
  category: String,
  researchTitle: String,
  referenceId: String,
  department: String,
  authors: [String],
  status: {
    type: String,
    default: "Pending"
  },
  date: String
}, { timestamps: true });

module.exports = mongoose.model("Research", ResearchSchema);