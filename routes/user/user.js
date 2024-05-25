const express = require("express");
const router = express.Router();
require("dotenv").config();

const { authenticateToken } = require("./functions/authenticate");
const {
  createUser,
  loginUser,
  getUser,
  logoutUser,
} = require("../../controllers/user.controller");

const {
  createFundraiser,
  getFundraiserDetails,
  updateFundraiserAmount,
  getDonations,
} = require("../../controllers/fundraiser.controller");

router.post("/create", createUser);
router.post("/login", loginUser);

//~~~~~~~~~~~~~~~~~~~~ Secured Routes ~~~~~~~~~~~~~~~~~~~~~~~~

router.get("/logout", authenticateToken, logoutUser);
router.get("/u/:id", authenticateToken, getUser);
router.post("/createFund", authenticateToken, createFundraiser);
router.get("/f/:title", authenticateToken, getFundraiserDetails);
router.post("/updateFund", authenticateToken, updateFundraiserAmount);
router.get("/allDonations", authenticateToken, getDonations);

module.exports = {
  router,
};
