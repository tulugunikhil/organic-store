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
    _id: "sample-1a",
    name: "Sona Masoori Rice",
    description: "Light, fluffy rice ideal for regular family meals and biryani.",
    price: 529,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001f7d?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-1b",
    name: "Brown Rice",
    description: "Whole-grain rice rich in fiber, nutrients, and a nutty flavor.",
    price: 459,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1604908556855-8d0f8b1c3d13?auto=format&fit=crop&w=800&q=80",
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
    _id: "sample-2a",
    name: "Green Gram",
    description: "Naturally nutritious split green gram for dals and healthy soups.",
    price: 299,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-2b",
    name: "Chickpeas",
    description: "Creamy, fiber-rich chickpeas for hummus, curries, and salads.",
    price: 289,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1519098053891-0c8f18f3fdbb?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-3",
    name: "Fresh Bananas",
    description: "Naturally sweet bananas packed with potassium and energy.",
    price: 199,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-3a",
    name: "Citrus Oranges",
    description: "Juicy oranges with a bright flavor and refreshing sweetness.",
    price: 349,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-3b",
    name: "Red Apples",
    description: "Crisp, juicy apples with naturally sweet and tangy notes.",
    price: 429,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-3c",
    name: "Alphonso Mangoes",
    description: "Premium seasonal mangoes known for rich aroma and sweetness.",
    price: 699,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-4",
    name: "Farm Spinach",
    description: "Tender spinach leaves perfect for smoothies, curries, and salads.",
    price: 249,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1576045051382-3c5e9e9d7e55?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-4a",
    name: "Organic Carrots",
    description: "Sweet and crunchy carrots harvested fresh for everyday cooking.",
    price: 219,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-4b",
    name: "Baby Potatoes",
    description: "Small, buttery potatoes great for roasting and pan-frying.",
    price: 279,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba656?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-4c",
    name: "Bell Peppers",
    description: "Crunchy capsicum for colorful curries, salads, and roasting.",
    price: 259,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-5",
    name: "Cold Pressed Groundnut Oil",
    description: "Rich in aroma and perfect for everyday cooking and tadka.",
    price: 499,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-5a",
    name: "Virgin Coconut Oil",
    description: "Smooth, flavorful oil for cooking and wellness routines.",
    price: 579,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-5b",
    name: "Sesame Oil",
    description: "Traditional sesame oil with a deep, nutty flavor.",
    price: 549,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1600335895229-6f7d0f5f7d2e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-6",
    name: "Farm Fresh Milk",
    description: "Creamy, naturally rich milk from trusted local farms.",
    price: 269,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-6a",
    name: "Organic Paneer",
    description: "Soft and protein-packed paneer for curries and snacks.",
    price: 399,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-6b",
    name: "A2 Cow Ghee",
    description: "Pure, aromatic ghee rich in taste and nutrition.",
    price: 649,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1628088305723-7a2d4d0a5fd8?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "sample-6c",
    name: "Fresh Curd",
    description: "Slow-set curd for smoothies, meals, and healthy bowls.",
    price: 239,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
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
