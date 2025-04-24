const { readData, writeData } = require('../utils/fileHelper');

const Item = {
  findAll: () => {
    const data = readData();
    return data.items;
  },
  
  findById: (id) => {
    const data = readData();
    return data.items.find(item => item.id === id);
  },
  
  create: (itemData, userId) => {
    const data = readData();
    const newItem = {
      id: Date.now().toString(),
      userId: userId,
      ...itemData,
      createdAt: new Date().toISOString()
    };
    
    data.items.push(newItem);
    writeData(data);
    
    return newItem;
  },
  
  update: (id, itemData) => {
    const data = readData();
    const index = data.items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    data.items[index] = {
      ...data.items[index],
      ...itemData,
      updatedAt: new Date().toISOString()
    };
    
    writeData(data);
    return data.items[index];
  },
  
  delete: (id) => {
    const data = readData();
    const originalLength = data.items.length;
    const filteredItems = data.items.filter(item => item.id !== id);
    
    if (filteredItems.length === originalLength) {
      return false;
    }
    
    data.items = filteredItems;
    writeData(data);
    
    return true;
  }
};

module.exports = Item;