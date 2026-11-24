const express = require("express");
const { getProducts, getMyProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");
const requireSellerOrAdmin = require("../middleware/requireSellerOrAdmin");
const router = express.Router();

router.get("/", getProducts);
router.get("/mine", authMiddleware, requireSellerOrAdmin, getMyProducts);
router.post("/", authMiddleware, requireSellerOrAdmin, createProduct);
router.put("/:id", authMiddleware, requireAdmin, updateProduct);
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

module.exports = router;
