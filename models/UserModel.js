const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  walletAddress: {
    type: String,
  },
  fundraiser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FundraiserModel",
    },
  ],
  donations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationModel",
    },
  ],
});
module.exports = mongoose.model("UserModel", userSchema);
