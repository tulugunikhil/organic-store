const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    account: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
    },
    items: [
      {
        productId: String,
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    delivery: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
    payment: {
      method: { type: String, required: true },
      cardLast4: { type: String, default: "" },
      upiId: { type: String, default: "" },
      status: { type: String, default: "Pending" },
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "Placed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
