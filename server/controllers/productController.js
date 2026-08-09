const Product = require("../models/Product");

const fallbackProducts = [
  {
    _id: "sample-1",
    name: "Royal Basmati Rice",
    description: "Fragrant long-grain rice perfect for daily meals and festive dishes.",
    price: 599,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1516684731961-8d1cbf0d0b9f?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-2",
    name: "Organic Red Lentils",
    description: "Protein-rich lentils ideal for soups, curries, and hearty bowls.",
    price: 329,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1574484284002-952d924569dd?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-3",
    name: "Chickpeas",
    description: "Creamy, fiber-rich chickpeas for hummus, curries, and salads.",
    price: 289,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1519098053891-0c8f18f3fdbb?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-4",
    name: "Fresh Bananas",
    description: "Naturally sweet bananas packed with potassium and energy.",
    price: 199,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-5",
    name: "Citrus Oranges",
    description: "Juicy oranges with a bright flavor and refreshing sweetness.",
    price: 349,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-6",
    name: "Farm Spinach",
    description: "Tender spinach leaves perfect for smoothies, curries, and salads.",
    price: 249,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1576045051382-3c5e9e9d7e55?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-7",
    name: "Baby Potatoes",
    description: "Small, buttery potatoes great for roasting and pan-frying.",
    price: 279,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba656?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-8",
    name: "Organic Carrots",
    description: "Sweet and crunchy carrots harvested fresh for everyday cooking.",
    price: 2.19,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",
  },
];

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    if (products.length === 0) {
      return res.json(fallbackProducts);
    }
    res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message, products: fallbackProducts });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
