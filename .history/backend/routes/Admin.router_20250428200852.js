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
router.get('/', getSubjects);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);
export default adminRouter;