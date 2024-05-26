const express = require("express");
const router = express.Router();
require("dotenv").config();

const { authenticateToken } = require("./functions/authenticate");
const {
  createUser,
  loginUser,
  getUser,
  logoutUser,
  setWalletAddress,
} = require("../../controllers/user.controller");

const {
  createFundraiser,
  getFundraiserDetails,
  updateFundraiserAmount,
  getDonations,
  getAllFundraisers,
  getFundraiserById,
  deleteFundraiser,
} = require("../../controllers/fundraiser.controller");

router.post("/create", createUser);
router.post("/login", loginUser);

//~~~~~~~~~~~~~~~~~~~~ Secured Routes ~~~~~~~~~~~~~~~~~~~~~~~~

router.get("/logout", authenticateToken, logoutUser);
router.get("/u/:id", authenticateToken, getUser);
router.patch("/u/walletAddress", authenticateToken, setWalletAddress);
router.post("/createFund", authenticateToken, createFundraiser);
// router.get("/f/:title", authenticateToken, getFundraiserDetails);
router.get("/f/:id", authenticateToken, getFundraiserById);
router.get("/f", authenticateToken, getAllFundraisers);
router.post("/updateFund", authenticateToken, updateFundraiserAmount);
router.get("/allDonations", authenticateToken, getDonations);
router.post("/deleteFund", authenticateToken, deleteFundraiser);

module.exports = {
  router,
};
