const Food = require('../models/Food');

// Get all foods with pagination and search
exports.getAllFoods = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const foods = await Food.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await Food.countDocuments(query);

    res.json({
      foods,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search foods with autocomplete
exports.searchFoods = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const foods = await Food.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get food by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get foods by category
exports.getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foods = await Food.find({ category }).sort({ name: 1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new food (admin)
exports.addFood = async (req, res) => {
  try {
    const { name, category, servingSize, calories, protein, carbohydrates, fat, fiber, imageUrl, description } =
      req.body;

    const food = new Food({
      name,
      category,
      servingSize,
      calories,
      protein,
      carbohydrates,
      fat,
      fiber,
      imageUrl,
      description,
    });

    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update food
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete food
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json({ message: 'Food deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
