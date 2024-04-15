const ClothingItem = require("../models/clothingItem");
const { OK, CREATED } = require("../utils/errors");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

// GET /items

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(OK).send(items);
    })
    .catch((err) => {
      console.error(err);

      next(err);
    });
};

// POST /items

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(CREATED).send(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }

      next(err);
    });
};

// DELETE /items/:itemId

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById({ _id: itemId })
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError("This is not your item"));
      }

      return ClothingItem.deleteOne({ _id: itemId }).then(() =>
        res.status(OK).send({ message: "Item successfully deleted." }),
      );
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document Not Found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(err);
    });
};

// PUT /items/:itemId/likes

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((items) => {
      res.status(OK).send(items);
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

// DELETE /items/:itemId/likes

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((items) => {
      res.status(OK).send(items);
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

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
