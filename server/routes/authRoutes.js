const express = require("express");
const { register, login, getUsers, requestSellerOtp, verifySellerOtp, requestBuyerOtp, verifyBuyerOtp } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access is required." });
  }
  next();
};

router.post("/register", register);
router.post("/login", login);
router.post("/seller/request-otp", requestSellerOtp);
router.post("/seller/verify-otp", verifySellerOtp);
router.post("/buyer/request-otp", requestBuyerOtp);
router.post("/buyer/verify-otp", verifyBuyerOtp);
router.get("/users", authMiddleware, requireAdmin, getUsers);

module.exports = router;
