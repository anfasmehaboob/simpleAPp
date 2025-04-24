const bcrypt = require('bcryptjs');
const { readUserData, writeUserData } = require('../utils/fileHelper');

const User = {
  findByUsername: (username) => {
    const userData = readUserData();
    return userData.users.find(user => user.username === username);
  },
  
  create: async (userData) => {
    const { username, password, email } = userData;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email: email || '',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Add to users array
    const allUserData = readUserData();
    allUserData.users.push(newUser);
    writeUserData(allUserData);
    
    return newUser;
  },
  
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = User;
