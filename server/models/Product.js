const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "general" },
    image: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    sellerId: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
