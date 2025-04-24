// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Data file paths
// const dataPath = path.join(__dirname, 'data.json');
// const userDataPath = path.join(__dirname, 'userData.json');

// // Initialize data files if they don't exist
// if (!fs.existsSync(dataPath)) {
//   fs.writeFileSync(dataPath, JSON.stringify({ items: [] }));
// }

// if (!fs.existsSync(userDataPath)) {
//   fs.writeFileSync(userDataPath, JSON.stringify({ users: [] }));
// }

// // Helper functions for data
// const readData = () => {
//   const data = fs.readFileSync(dataPath);
//   return JSON.parse(data);
// };

// const writeData = (data) => {
//   fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
// };

// // Helper functions for user data
// const readUserData = () => {
//   const data = fs.readFileSync(userDataPath);
//   return JSON.parse(data);
// };

// const writeUserData = (data) => {
//   fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
// };

// // Authentication middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const verified = jwt.verify(token, JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token' });
//   }
// };

// // AUTHENTICATION ROUTES

// // Register a new user
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { username, password, email } = req.body;
    
//     // Validate input
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required' });
//     }
    
//     // Check if username already exists
//     const userData = readUserData();
//     const existingUser = userData.users.find(user => user.username === username);
    
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }
    
//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
    
//     // Create new user
//     const newUser = {
//       id: Date.now().toString(),
//       username,
//       email: email || '',
//       password: hashedPassword,
//       createdAt: new Date().toISOString()
//     };
    
//     // Add to users array
//     userData.users.push(newUser);
//     writeUserData(userData);
    
//     // Create and assign token
//     const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
    
//     // Return success without password
//     const { password: _, ...userWithoutPassword } = newUser;
//     res.status(201).json({ user: userWithoutPassword, token });
    
//   } catch (err) {
//     console.error('Error registering user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login user
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
    
//     // Validate input
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required' });
//     }
    
//     // Find user
//     const userData = readUserData();
//     const user = userData.users.find(user => user.username === username);
    
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }
    
//     // Check password
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }
    
//     // Create and assign token
//     const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
//     // Return success without password
//     const { password: _, ...userWithoutPassword } = user;
//     res.json({ user: userWithoutPassword, token });
    
//   } catch (err) {
//     console.error('Error logging in:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // CRUD ROUTES (protected)

// // GET all items
// app.get('/api/items', authenticateToken, (req, res) => {
//   const data = readData();
//   res.json(data.items);
// });

// // GET a single item by id
// app.get('/api/items/:id', authenticateToken, (req, res) => {
//   const data = readData();
//   const item = data.items.find(item => item.id === req.params.id);
  
//   if (!item) {
//     return res.status(404).json({ message: 'Item not found' });
//   }
  
//   res.json(item);
// });

// // POST a new item
// app.post('/api/items', authenticateToken, (req, res) => {
//   const data = readData();
//   const newItem = {
//     id: Date.now().toString(),
//     userId: req.user.id, // Associate item with the user
//     ...req.body,
//     createdAt: new Date().toISOString()
//   };
  
//   data.items.push(newItem);
//   writeData(data);
  
//   res.status(201).json(newItem);
// });

// // PUT (update) an item
// app.put('/api/items/:id', authenticateToken, (req, res) => {
//   const data = readData();
//   const index = data.items.findIndex(item => item.id === req.params.id);
  
//   if (index === -1) {
//     return res.status(404).json({ message: 'Item not found' });
//   }
  
//   // Optional: Check if user owns this item
//   if (data.items[index].userId && data.items[index].userId !== req.user.id) {
//     return res.status(403).json({ message: 'Access denied' });
//   }
  
//   data.items[index] = {
//     ...data.items[index],
//     ...req.body,
//     updatedAt: new Date().toISOString()
//   };
  
//   writeData(data);
//   res.json(data.items[index]);
// });

// // DELETE an item
// app.delete('/api/items/:id', authenticateToken, (req, res) => {
//   const data = readData();
  
//   // Optional: Check if user owns this item
//   const item = data.items.find(item => item.id === req.params.id);
//   if (item && item.userId && item.userId !== req.user.id) {
//     return res.status(403).json({ message: 'Access denied' });
//   }
  
//   const filteredItems = data.items.filter(item => item.id !== req.params.id);
  
//   if (filteredItems.length === data.items.length) {
//     return res.status(404).json({ message: 'Item not found' });
//   }
  
//   data.items = filteredItems;
//   writeData(data);
  
//   res.json({ message: 'Item deleted successfully' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});