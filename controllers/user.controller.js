const user = require("../models/UserModel");
const jwt = require("jsonwebtoken");
//~~~~~~~~~~~~~~~~~~~~~ Create New User ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const createUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const userExists = await user.findOne({
      $or: [{ username }, { email }],
    });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this username or email already exists",
      });
    }
    const new_user = new user({
      name: name,
      email: email,
      username: username,
      password: password,
    });
    await new_user.save();
    const check = await user.findOne({ username: new_user.username });
    console.log({ check });
    return res.status(201).json({ success: true, data: check.data });
  } catch (error) {
    res.json(error);
  }
};

//~~~~~~~~~~~~~~~~~~~~~~ Login User ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const savedUser = await user.findOne({
      username,
    });
    if (password === savedUser.password) {
      const token = jwt.sign(
        { username: req.body.username },
        process.env.ACCESS_WEB_TOKEN
      );
      savedUser.password = '';
      return res.cookie("token", token).json({
        success: true,
        user: savedUser,
        authToken: token,
      });
    } else {
      console.log({ saved: savedUser }, { password });
      return res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

//~~~~~~~~~~~~~~~~~~~~~~ Login User ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const logoutUser = async (req, res) => {
  return res
    .status(200)
    .clearCookie("token")
    .json({ success: true, message: "User Looged Out" });
};

//~~~~~~~~~~~~~~~~~~~~~~ Get User ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const User = await user.findById(id);

    return res.json({ success: true, user: User });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const setWalletAddress = async (req, res) => {
  try {
    const id = req.user.id;
    const { walletAddress } = req.body;
    const updatedUser = await user.findByIdAndUpdate(
      id,
      { walletAddress: walletAddress },
      { new: true, runValidators: true } // Options to return the updated document and run validators
    );

    // Check if the user exists
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

module.exports = { createUser, loginUser, getUser, logoutUser, setWalletAddress };
