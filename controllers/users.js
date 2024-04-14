const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const { BAD_REQUEST, OK, CREATED } = require("../utils/errors");

const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(OK).send({ token });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Authorization Error"));
      }

      next(err);
    });
};

// PATCH /users/me

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      console.log(user);
      return user;
    })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document Not Found"));
      }

      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }

      next(err);
    });
};

// GET /users/me

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document Not Found"));
      }

      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }

      next(err);
    });
};

// POST /users

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res
        .status(CREATED)
        .send({ name: user.name, avatar: user.avatar, email: user.email }),
    )
    .catch((err) => {
      console.error(err);

      if (err.code === 11000) {
        next(new ConflictError("User with this email is already exists."));
      }

      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }

      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};

// const login = (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(BAD_REQUEST).send({ message: "Invalid data" });
//   }

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//         expiresIn: "7d",
//       });
//       res.status(OK).send({ token });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.message === "Incorrect email or password") {
//         return res
//           .status(UNAUTHORIZED)
//           .send({ message: "Authorization Error" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// // PATCH /users/me

// const updateUser = (req, res) => {
//   const { name, avatar } = req.body;
//   const userId = req.user._id;

//   User.findByIdAndUpdate(
//     userId,
//     { name, avatar },
//     { new: true, runValidators: true },
//   )
//     .orFail()
//     .then((user) => {
//       console.log(user);
//       return user;
//     })
//     .then((user) => {
//       res.status(OK).send(user);
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: "Document Not Found" });
//       }
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid data" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// // GET /users/me

// const getCurrentUser = (req, res) => {
//   const userId = req.user._id;

//   User.findById(userId)
//     .orFail()
//     .then((user) => {
//       res.status(OK).send(user);
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: "Document Not Found" });
//       }
//       if (err.name === "CastError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid data" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// // POST /users

// const createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;

//   bcrypt
//     .hash(password, 10)
//     .then((hash) => User.create({ name, avatar, email, password: hash }))
//     .then((user) =>
//       res
//         .status(CREATED)
//         .send({ name: user.name, avatar: user.avatar, email: user.email }),
//     )
//     .catch((err) => {
//       console.error(err);
//       if (err.code === 11000) {
//         return res
//           .status(CONFLICT)
//           .send({ message: "User with this email is already exists." });
//       }
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid data" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// module.exports = {
//   createUser,
//   login,
//   getCurrentUser,
//   updateUser,
// };
