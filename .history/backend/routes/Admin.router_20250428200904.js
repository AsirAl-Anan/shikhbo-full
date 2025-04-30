import express from 'express';
import { 
  adminSignin, 
  addCq, 
  getDashboardStats 
} from '../controllers/Admin.controller.js';

const adminRouter = express.Router();

// Authentication route
adminRouter.post('/signin', adminSignin);

// Protected admin routes
adminRouter.post('/cq', addCq);
adminRouter.get('/dashboard-stats', getDashboardStats);
adminRouter.get('/subject', getSubjects);
adminRouter.post('/', createSubject);
adminRouter.put('/:id', updateSubject);
adminRouter.delete('/:id', deleteSubject);
export default adminRouter;