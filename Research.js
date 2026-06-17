const mongoose = require("mongoose");

const ResearchSchema = new mongoose.Schema({
  category:          { type: String, default: "" },
  researchTitle:     { type: String, default: "" },
  referenceId:       { type: String, default: "" },
  department:        { type: String, default: "" },
  authors:           { type: [String], default: [] },
  status:            { type: String, default: "Submitted to IPO" },
  date:              { type: String, default: "" },  // keep as String — frontend sends "YYYY-MM-DD"
  googleDriveLink:   { type: String, trim: true, default: "" },  // Google Drive link for related documents

  // Formality Defect tracking (for patent)
  defectNoticeDate:  { type: String, default: "" },  // "YYYY-MM-DD" string
  defectNoticeDate2: { type: String, default: "" },  // "YYYY-MM-DD" string
  defectNoticeDate3: { type: String, default: "" },  // "YYYY-MM-DD" string
  defectNoticeDate4: { type: String, default: "" },  // "YYYY-MM-DD" string
  defectNoticeDate5: { type: String, default: "" },  // "YYYY-MM-DD" string
  defectConfirmed:  { type: Boolean, default: false },
  defectConfirmed2:  { type: Boolean, default: false },
  defectConfirmed3:  { type: Boolean, default: false },
  defectConfirmed4:  { type: Boolean, default: false },
  defectConfirmed5:  { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("Research", ResearchSchema);