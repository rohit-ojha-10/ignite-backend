const mongoose = require("mongoose");
const fundraiserModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    raisingAmount: {
      type: Number,
      required: true,
    },
    raisedAmount: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    donatedBy: [
      {
        donator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserModel",
        },
        amountDonated: {
          type: Number,
        },
      },
    ],
    walletAddress: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("FundraiserModel", fundraiserModel);
