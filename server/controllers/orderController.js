const Order = require("../models/Order");

const demoOrders = [];

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
    const { account, items, delivery, payment, subtotal, deliveryFee, total } = req.body;
    if (!account?.name || !account?.email || !items?.length || !delivery?.name || !delivery?.address || !payment?.method) {
      return res.status(400).json({ message: "Account, items, delivery, and payment details are required." });
    }

    const orderData = {
      userId: String(req.user.id),
      userEmail: req.user.email,
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

    let order;
    try {
      if (Order.db.readyState !== 1) throw new Error("MongoDB is not connected");
      order = await Order.create(orderData);
    } catch (error) {
      order = { id: `demo-order-${Date.now()}`, ...orderData, createdAt: new Date().toISOString() };
      demoOrders.push(order);
    }

    res.status(201).json(sanitizeOrder(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    let orders;
    try {
      if (Order.db.readyState !== 1) throw new Error("MongoDB is not connected");
      orders = await Order.find({ userId: String(req.user.id) }).sort({ createdAt: -1 });
    } catch (error) {
      orders = demoOrders.filter((order) => order.userId === String(req.user.id)).reverse();
    }

    res.json(orders.map(sanitizeOrder));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
