const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true, trim: true },
    mname: { type: String, default: "", trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], default: "staff", required: true },
    status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active", required: true }
  },
  { timestamps: true }
);

// FIX: Inalis ang 'next' dahil naka-async function tayo
userSchema.pre("save", async function () {
  // Kung hindi binago ang password, huminto na rito (parang return next() noon)
  if (!this.isModified("password")) return; 

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // HINDI na kailangan ng next() dito, kusa itong magpapatuloy kapag natapos ang async block
  } catch (err) {
    // I-throw ang error para mahuli ng try-catch block sa iyong routes (userRoutes.js)
    throw err; 
  }
});

// Format para tugma sa frontend UI mo
userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id; 
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Tago ang password!
    ret.created = ret.createdAt ? ret.createdAt.toISOString().split("T")[0] : "";
  }
});

module.exports = mongoose.model("User", userSchema);