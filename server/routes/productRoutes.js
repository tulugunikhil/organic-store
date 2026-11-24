const express = require("express");
const { getProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");
const router = express.Router();

router.get("/", getProducts);
router.post("/", authMiddleware, requireAdmin, createProduct);
router.put("/:id", authMiddleware, requireAdmin, updateProduct);
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

module.exports = router;
