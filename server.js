const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./route/UserRoute');
const courseRoutes = require('./route/CourseRoute');
const branchRoutes = require('./route/BranchRoute');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: ["https://institute-frontend-t1z5.vercel.app",'http://localhost:3000', 'http://localhost:5173'],
   methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));
app.use(express.json()); 

// Serve uploads from root-level 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/users', userRoutes);
app.use('/api/login', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', branchRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});