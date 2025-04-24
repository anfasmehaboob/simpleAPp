const Item = require('../models/Item');

const getAllItems = (req, res) => {
  try {
    const items = Item.findAll();
    res.json(items);
  } catch (err) {
    console.error('Error getting items:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getItemById = (req, res) => {
  try {
    const item = Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error('Error getting item:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createItem = (req, res) => {
  try {
    const newItem = Item.create(req.body, req.user.id);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateItem = (req, res) => {
  try {
    // First check if item exists
    const item = Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns this item
    if (item.userId && item.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update the item
    const updatedItem = Item.update(req.params.id, req.body);
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteItem = (req, res) => {
  try {
    // First check if item exists and if user owns it
    const item = Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns this item
    if (item.userId && item.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete the item
    const result = Item.delete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};