const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./functions/authenticate");

const user = require("../../models/UserModel");
router.post("/create", async (req, res) => {
  try {
    console.log({ body: req.body });
    const data = req.body;
    const { name, email, username, password } = data;
    const new_user = new user({
      name: name,
      email: email,
      username: username,
      password: password,
    });
    await new_user.save();
    console.log(new_user);
    const check = await user.findOne({ name: new_user.name });
    console.log({ check });
    res.send({ success: true, data: check.data });
  } catch (error) {
    res.json(error);
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const savedUser = await user.findOne({
      username: username,
    });
    if (password === savedUser.password) {
      const token = jwt.sign(
        { username: req.body.username },
        process.env.ACCESS_WEB_TOKEN
      );
      return res.json({
        success: true,
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
});
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    return res.json({ success: true, id: id, username: req.username });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

module.exports = {
  router,
};
