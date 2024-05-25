const mongoose = require("mongoose");
const donationModel = new mongoose.Schema({
  donatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FundraiserModel",
  },
  donatedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  donatedAmount: {
    type: Number,
  },
});

module.exports = mongoose.model("DonationModel", donationModel);
