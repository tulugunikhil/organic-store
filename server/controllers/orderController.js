const Order = require("../models/Order");

const sanitizeOrder = (order) => ({
  id: order._id || order.id,
  userId: order.userId,
  userEmail: order.userEmail,
  account: order.account,
  items: order.items,
  delivery: order.delivery,
  payment: order.payment,
  subtotal: order.subtotal,
  deliveryFee: order.deliveryFee,
  total: order.total,
  status: order.status,
  createdAt: order.createdAt || new Date().toISOString(),
});

exports.createOrder = async (req, res) => {
  try {
    if (Order.db.readyState !== 1) {
      return res.status(503).json({ message: "Order storage is unavailable. Please try again later." });
    }

    const { account, items, delivery, payment, subtotal, deliveryFee, total } = req.body;
    if (!/^\d{6}$/.test(delivery?.pincode || "")) {
      return res.status(400).json({ message: "A valid six-digit PIN code is required." });
    }

    if (!account?.name || !account?.email || !items?.length || !delivery?.name || !delivery?.address || !payment?.method) {
      return res.status(400).json({ message: "Account, items, delivery, and payment details are required." });
    }

    const latitude = Number(delivery.location?.latitude);
    const longitude = Number(delivery.location?.longitude);
    const location = Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : undefined;

    const orderData = {
      userId: String(req.user.id),
      userEmail: req.user.email || account.email,
      account: {
        name: account.name,
        email: account.email,
        phone: account.phone || "",
      },
      items: items.map((item) => ({
        productId: item.productId || item._id || "",
        name: item.name,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
      })),
      delivery: {
        name: delivery.name,
        address: delivery.address,
        pincode: delivery.pincode,
        ...(location && { location }),
      },
      payment: {
        method: payment.method,
        cardLast4: payment.cardLast4 || "",
        upiId: payment.upiId || "",
        status: payment.method === "Cash on Delivery" ? "Pending" : "Confirmed",
      },
      subtotal: Number(subtotal || 0),
      deliveryFee: Number(deliveryFee || 0),
      total: Number(total || 0),
      status: "Placed",
    };

    const order = await Order.create(orderData);
    res.status(201).json(sanitizeOrder(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    if (Order.db.readyState !== 1) {
      return res.status(503).json({ message: "Order storage is unavailable. Please try again later." });
    }

    const orders = await Order.find({ userId: String(req.user.id) }).sort({ createdAt: -1 });
    res.json(orders.map(sanitizeOrder));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
