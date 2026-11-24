const express = require("express");
const { createOrder, getMyOrders, getAllOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/mine", authMiddleware, getMyOrders);
router.get("/", authMiddleware, requireAdmin, getAllOrders);

module.exports = router;
