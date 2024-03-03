const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

const routes = require("./routes");

app.use((req, res, next) => {
  req.user = {
    _id: "65e4b0cfaffed1225e705c32",
  };
  next();
});
app.use(express.json());
app.use(routes);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App is listetning at port ${PORT}`);
});
