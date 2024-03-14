const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.post("/signin", login);

router.post("/signup", createUser);

router.use("/users", userRouter);

router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
