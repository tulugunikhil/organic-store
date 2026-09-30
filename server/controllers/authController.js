const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const demoUsers = [];
const pendingOtps = new Map();

const mailTransport = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  : null;

const sanitizeUser = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role || "buyer",
  gstNumber: user.gstNumber || "",
});

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (user) return user;
  } catch (error) {
    // Fall through to demo users when MongoDB is not configured.
  }

  return demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
};

const createUserRecord = async (data) => {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    const demoUser = {
      id: `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...data,
    };
    demoUsers.push(demoUser);
    return demoUser;
  }
};

const findOrCreateLoginUser = async ({ email, password, role, gstNumber }) => {
  let user = await findUserByEmail(email);

  if (!user || user.password !== password) {
    const demoAdminEmail = "admin@pureharvest.com";
    const demoSellerEmail = "seller@pureharvest.com";

    if (email && password && email.toLowerCase() === demoAdminEmail && password === "admin123") {
      user = await createUserRecord({ name: "Admin", email: demoAdminEmail, password: "admin123", role: "admin", gstNumber: "" });
    } else if (email && password && email.toLowerCase() === demoSellerEmail && password === "seller123") {
      user = await createUserRecord({ name: "Seller", email: demoSellerEmail, password: "seller123", role: "seller", gstNumber: gstNumber || "" });
    } else {
      return null;
    }
  }

  if ((role || user.role) === "seller" && gstNumber) {
    user.gstNumber = gstNumber;
    try {
      await User.findOneAndUpdate({ email: user.email }, { gstNumber }, { new: true, upsert: true });
    } catch (error) {
      const storedUser = demoUsers.find((entry) => entry.email.toLowerCase() === user.email.toLowerCase());
      if (storedUser) storedUser.gstNumber = gstNumber;
    }
  }

  return user;
};

const sendOtpEmail = async (email, otp) => {
  if (!mailTransport) return false;

  await mailTransport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Your PureHarvest login code",
    text: `Your PureHarvest login code is ${otp}. It expires in 10 minutes.`,
  });
  return true;
};

const createTokenResponse = (user) => ({
  token: jwt.sign({ id: user._id || user.id, role: user.role }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" }),
  user: sanitizeUser(user),
});

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, gstNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if ((role || "buyer") === "seller" && !gstNumber) {
      return res.status(400).json({ message: "GST number is required for sellers." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUserRecord({
      name,
      email,
      phone: phone || "",
      password,
      role: role || "buyer",
      gstNumber: gstNumber || "",
    });

    const token = jwt.sign({ id: user._id || user.id, role: user.role }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role, gstNumber } = req.body;
    const user = await findOrCreateLoginUser({ email, password, role, gstNumber });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.json(createTokenResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestSellerOtp = async (req, res) => {
  try {
    const { email, password, gstNumber } = req.body;
    if (!email || !password || !gstNumber) {
      return res.status(400).json({ message: "Seller email, password, and GST number are required." });
    }

    const user = await findOrCreateLoginUser({ email, password, role: "seller", gstNumber });
    if (!user || user.role !== "seller") return res.status(401).json({ message: "Invalid seller credentials" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    pendingOtps.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    const sent = await sendOtpEmail(email, otp);

    res.json({
      message: sent ? "OTP sent to your email." : "SMTP is not configured. Use the development OTP to continue.",
      email,
      delivery: sent ? "email" : "development",
      ...(sent || process.env.NODE_ENV === "production" ? {} : { developmentOtp: otp }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifySellerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pendingOtp = pendingOtps.get(email?.toLowerCase());

    if (!pendingOtp || pendingOtp.expiresAt < Date.now() || pendingOtp.otp !== String(otp)) {
      return res.status(401).json({ message: "Invalid or expired OTP." });
    }

    pendingOtps.delete(email.toLowerCase());
    const user = await findUserByEmail(email);
    if (!user || user.role !== "seller") return res.status(401).json({ message: "Seller account not found." });

    res.json(createTokenResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestBuyerOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    let user = await findOrCreateLoginUser({ email, password, role: "buyer" });
    if (!user && !process.env.MONGO_URI) {
      user = await createUserRecord({ name: email.split("@")[0], email, password, role: "buyer", gstNumber: "" });
    }
    if (!user || user.role !== "buyer") return res.status(401).json({ message: "Invalid buyer credentials" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    pendingOtps.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    const sent = await sendOtpEmail(email, otp);

    res.json({
      message: sent ? "OTP sent to your email." : "SMTP is not configured. Use the development OTP to continue.",
      email,
      delivery: sent ? "email" : "development",
      ...(sent || process.env.NODE_ENV === "production" ? {} : { developmentOtp: otp }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyBuyerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pendingOtp = pendingOtps.get(email?.toLowerCase());

    if (!pendingOtp || pendingOtp.expiresAt < Date.now() || pendingOtp.otp !== String(otp)) {
      return res.status(401).json({ message: "Invalid or expired OTP." });
    }

    pendingOtps.delete(email.toLowerCase());
    const user = await findUserByEmail(email);
    if (!user || user.role !== "buyer") return res.status(401).json({ message: "Buyer account not found." });

    res.json(createTokenResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    let users = [];
    try {
      users = await User.find().select("-password").sort({ createdAt: -1 });
    } catch (error) {
      users = demoUsers.map((user) => ({ ...user, password: undefined }));
    }

    res.json(users.map((user) => sanitizeUser(user)).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
