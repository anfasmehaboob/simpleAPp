const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data file path
const dataPath = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({ items: [] }));
}

// Helper function to read data
const readData = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

// Helper function to write data
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// GET all items
app.get('/api/items', (req, res) => {
  const data = readData();
  res.json(data.items);
});

// GET a single item by id
app.get('/api/items/:id', (req, res) => {
  const data = readData();
  const item = data.items.find(item => item.id === req.params.id);
  
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  res.json(item);
});

// POST a new item
app.post('/api/items', (req, res) => {
  const data = readData();
  const newItem = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  data.items.push(newItem);
  writeData(data);
  
  res.status(201).json(newItem);
});

// PUT (update) an item
app.put('/api/items/:id', (req, res) => {
  const data = readData();
  const index = data.items.findIndex(item => item.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  data.items[index] = {
    ...data.items[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  writeData(data);
  res.json(data.items[index]);
});

// DELETE an item
app.delete('/api/items/:id', (req, res) => {
  const data = readData();
  const filteredItems = data.items.filter(item => item.id !== req.params.id);
  
  if (filteredItems.length === data.items.length) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  data.items = filteredItems;
  writeData(data);
  
  res.json({ message: 'Item deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});