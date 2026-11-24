const requireSellerOrAdmin = (req, res, next) => {
  if (!["admin", "seller"].includes(req.user.role)) {
    return res.status(403).json({ message: "Seller or admin access is required." });
  }
  next();
};

module.exports = requireSellerOrAdmin;
