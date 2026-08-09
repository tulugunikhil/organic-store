const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = authMiddleware;
