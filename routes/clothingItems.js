const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

router.get("/", getClothingItems);

router.post("/", auth, validateClothingItem, createClothingItem);

router.delete("/:itemId", auth, validateId, deleteClothingItem);

router.delete("/:itemId/likes", auth, validateId, dislikeItem);

router.put("/:itemId/likes", auth, validateId, likeItem);

module.exports = router;
