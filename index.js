const express = require("express");
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors())
require("dotenv").config();

const mongoose = require("mongoose");
const { router } = require("./routes/user/user");
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then((res) => console.log("connected"));
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("database connected"));

app.listen(2000, () => {
  console.log("running");
});
app.use('/user',router)
