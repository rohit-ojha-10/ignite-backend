const jwt = require("jsonwebtoken");
const UserModel = require("../../../models/UserModel");
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]; //  Using Cookies for token
    const authToken = authHeader && authHeader.split(" ")[1];
    const token = req.cookies?.token || authToken;
    if (token == null)
      return res.json({ success: false, message: "Invalid Token" });

    const payload = jwt.verify(token, process.env.ACCESS_WEB_TOKEN);
    const user = await UserModel.findOne({ username: payload.username }).select(
      "-password"
    );
    if (!user) {
      return res.json({ success: false, message: "Invalid Token" });
    }
    req.user = user;
    req.authenticated = { success: true, payload: payload };
    next();
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

module.exports = {
  authenticateToken,
};
