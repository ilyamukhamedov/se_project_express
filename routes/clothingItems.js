const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");

router.get("/", getClothingItems);

router.post("/", auth, createClothingItem);

router.delete("/:itemId", auth, deleteClothingItem);

router.delete("/:itemId/likes", auth, dislikeItem);

router.put("/:itemId/likes", auth, likeItem);

module.exports = router;
