import express from 'express';
import { 
  adminSignin, 
  addCq, 
  getDashboardStats 
} from '../controllers/Admin.controller.js';

const router = express.Router();

// Authentication route
router.post('/signin', adminSignin);

// Protected admin routes
router.post('/cq', addCq);
router.get('/dashboard-stats', getDashboardStats);

export default router;