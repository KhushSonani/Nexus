import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  getDashboard,
  logHours,
  getHours,
  getTasks,
  updateTask
} from '../controllers/developerController.js';

const router = express.Router();

router.use(protect, allowRoles('developer'));

router.get('/dashboard', getDashboard);
router.route('/hours')
  .post(logHours)
  .get(getHours);
router.route('/tasks')
  .get(getTasks);
router.route('/tasks/:id')
  .put(updateTask);

export default router;
