const express = require("express");
const { register, login, getUsers, requestSellerOtp, verifySellerOtp, requestBuyerOtp, verifyBuyerOtp } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/seller/request-otp", requestSellerOtp);
router.post("/seller/verify-otp", verifySellerOtp);
router.post("/buyer/request-otp", requestBuyerOtp);
router.post("/buyer/verify-otp", verifyBuyerOtp);
router.get("/users", authMiddleware, requireAdmin, getUsers);

module.exports = router;
