const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const NotFoundError = require("../errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const { validateUserLogin, validateUserInfo } =
  require("../middlewares/validation").default;

router.post("/signin", validateUserLogin, login);

router.post("/signup", validateUserInfo, createUser);

router.use("/users", userRouter);

router.use("/items", itemRouter);

router.use(() => {
  throw new NotFoundError("Router Not Found");
});

module.exports = router;
