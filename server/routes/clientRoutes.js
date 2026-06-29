import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  getDashboard,
  getProject,
  getMilestones,
  getDeliverables,
  getQueries,
  createQuery
} from '../controllers/clientController.js';

const router = express.Router();

router.use(protect, allowRoles('client'));

router.get('/dashboard', getDashboard);
router.get('/project', getProject);
router.get('/milestones', getMilestones);
router.get('/deliverables', getDeliverables);
router.route('/queries')
  .get(getQueries)
  .post(createQuery);

export default router;
