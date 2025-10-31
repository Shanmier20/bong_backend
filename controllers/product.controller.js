// controllers/product.controller.js
const Product = require("../models/product.model");

// ✅ Custom error handler for consistent JSON responses
const handleError = (res, message, status = 500, detail = null) => {
  console.error(message, detail || "");
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== "production" && detail ? { detail } : {}),
  });
};

// -------------------------------------------------------------------
// POST /api/products
// CREATE
// -------------------------------------------------------------------
exports.create = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      error: "Name and price are required fields.",
    });
  }

  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue <= 0) {
    return res.status(400).json({
      error: "Price must be a valid positive number.",
    });
  }

  try {
    const newProduct = await Product.create({
      name,
      description,
      price: priceValue,
      quantity,
    });

    // ✅ Send JSON explicitly — prevents HTML fallback
    res.status(201).json(newProduct);
  } catch (err) {
    handleError(res, "Could not create product.", 500, err.message);
  }
};

// -------------------------------------------------------------------
// GET /api/products
// READ all
// -------------------------------------------------------------------
exports.findAll = async (req, res) => {
  try {
    const products = await Product.findAll();

    // ✅ Always return JSON (even if empty)
    res.status(200).json(products || []);
  } catch (err) {
    handleError(res, "Could not retrieve products.", 500, err.message);
  }
};

// -------------------------------------------------------------------
// GET /api/products/:id
// READ one
// -------------------------------------------------------------------
exports.findOne = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: `Product with id ${id} not found.` });
    }

    res.status(200).json(product);
  } catch (err) {
    handleError(res, `Error retrieving product with id ${id}.`, 500, err.message);
  }
};

// -------------------------------------------------------------------
// PUT /api/products/:id
// UPDATE
// -------------------------------------------------------------------
exports.update = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  if (!name || !price) {
    return res.status(400).json({
      error: "Name and price are required fields for update.",
    });
  }

  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue <= 0) {
    return res.status(400).json({
      error: "Price must be a valid positive number.",
    });
  }

  try {
    const success = await Product.update(id, {
      name,
      description,
      price: priceValue,
      quantity,
    });

    if (!success) {
      return res.status(404).json({
        error: `Cannot update product with id ${id}. Maybe it was not found.`,
      });
    }

    res.status(200).json({ message: "Product updated successfully." });
  } catch (err) {
    handleError(res, `Error updating product with id ${id}.`, 500, err.message);
  }
};

// -------------------------------------------------------------------
// DELETE /api/products/:id
// DELETE
// -------------------------------------------------------------------
exports.delete = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const success = await Product.delete(id);

    if (!success) {
      return res.status(404).json({
        error: `Cannot delete product with id ${id}. Maybe it was not found.`,
      });
    }

    // ✅ Explicitly send no JSON body (prevents frontend JSON.parse errors)
    res.status(204).send();
  } catch (err) {
    handleError(res, `Could not delete product with id ${id}.`, 500, err.message);
  }
};
