const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const auth = async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      console.log("Auth Header:", authHeader); 
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Please authenticate.' });
      }
  
      const token = authHeader.replace('Bearer ', '');
      console.log("Token:", token); 
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); 
  
      const user = await User.findById(decoded.id);
      console.log("User  Found:", user);
  
      if (!user) {
        return res.status(401).json({ error: 'User  not found.' });
      }
  
      req.user = user; 
      next();
    } catch (err) {
      console.error("Authentication Error:", err);
      res.status(401).json({ error: 'Please authenticate.' });
    }
  };

module.exports = auth;
