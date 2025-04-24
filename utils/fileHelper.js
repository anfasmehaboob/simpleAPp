const fs = require('fs');
const { dataPath, userDataPath } = require('../config/db');

// Initialize data files if they don't exist
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({ items: [] }));
}

if (!fs.existsSync(userDataPath)) {
  fs.writeFileSync(userDataPath, JSON.stringify({ users: [] }));
}

// Helper functions for data
const readData = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Helper functions for user data
const readUserData = () => {
  const data = fs.readFileSync(userDataPath);
  return JSON.parse(data);
};

const writeUserData = (data) => {
  fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
};

module.exports = {
  readData,
  writeData,
  readUserData,
  writeUserData
};