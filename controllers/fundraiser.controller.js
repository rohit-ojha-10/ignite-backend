const fundraiserModel = require("../models/FundraiserModel");
const donationModel = require("../models/DonationModel");
const UserModel = require("../models/UserModel");
//~~~~~~~~~~~~~~~~~~~~~~~~~~ Create Fundraiser ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const createFundraiser = async (req, res) => {
  const payload = {
    ...req.body,
    raisedAmount: 0,
    createdBy: req.user._id,
    walletAddress: req.user.walletAddress,
  };
  try {
    const newFundRaiser = await fundraiserModel.create({ ...payload });
    const Fundraiser = await fundraiserModel.findById(newFundRaiser._id);
    if (!Fundraiser) {
      res.json({
        success: false,
        message: "Error while creating Fundraiser",
      });
    }
    await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          fundraiser: Fundraiser._id,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Fundraiser created successfully",
      Fundraiser,
    });
  } catch (error) {
    res.json(error);
  }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~ Get Fundraiser Details ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const getFundraiserDetails = async (req, res) => {
  const { title } = req.params;
  const fundraiserExists = await fundraiserModel.findOne({ title });
  if (!fundraiserExists) { 
    return res.status(400).json({
      success: false,
      message: "Nothing that matches the given title",
    });
  }
  const fundraiser = await fundraiserModel.aggregate([
    {
      $match: {
        title,
      },
    },
    {
      $addFields: {
        totalDonations: {
          $size: "$donatedBy",
        },
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: "Fundraiser fetched successfully",
    fundraiser,
  });
};
const getFundraiserById = async (req, res) => {
  const { id } = req.params;
  const fundraiserExists = await fundraiserModel.findById(id);
  if (!fundraiserExists) { 
    return res.status(400).json({
      success: false,
      message: "Nothing that matches the given id",
    });
  }
  const fundraiser = await fundraiserModel.aggregate([
    {
      $match: {
        id,
      },
    },
    {
      $addFields: {
        totalDonations: {
          $size: "$donatedBy",
        },
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: "Fundraiser fetched successfully",
    data:fundraiserExists,
  });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~ update Fundraiser ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const updateFundraiserAmount = async (req, res) => {
  const { fundraiser_id, amountIncreased } = req.body;
  const fundraiser = await fundraiserModel.findByIdAndUpdate(
    fundraiser_id,
    {
      $inc: {
        raisedAmount: amountIncreased,
      },
      $push: {
        donatedBy: {
          donator: req.user._id,
          amountDonated: amountIncreased,
        },
      },
    },
    {
      new: true,
    }
  );
  if (!fundraiser) {
    return res.status(400).json({
      success: false,
      message: "Invalid fundraiser ID",
    });
  }

  const donation = await donationModel.create({
    donatedFrom: req.user._id,
    donatedTo: fundraiser_id,
    donatedAmount: amountIncreased,
  });

  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        donations: donation._id,
      },
    },
    {
      new: true,
    }
  );
  return res.status(200).json({
    success: true,
    message: "Fundraiser updated successfully",
    fundraiser,
  });
};
const getAllFundraisers = async (_, res) => {
  const allFundraisers = await fundraiserModel.find({});
  return res.status(200).json({
    allFundraisers
  });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~ update Fundraiser ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const getDonations = async (req, res) => {
  const allDonations = await donationModel.find({});
  return res.json({
    allDonations,
  });
};

module.exports = {
  createFundraiser,
  getFundraiserDetails,
  updateFundraiserAmount,
  getDonations,
  getAllFundraisers,
  getFundraiserById
};
