import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import Models
import './models/User.js';
import './models/Client.js';
import './models/Project.js';
import './models/Milestone.js';
import './models/HourLog.js';
import './models/Deliverable.js';
import './models/Query.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import { authRoutes } from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import developerRoutes from './routes/developerRoutes.js';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/developer', developerRoutes);

import { errorHandler } from './middleware/errorMiddleware.js';

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Nexus server running on port ${PORT}`);
});
