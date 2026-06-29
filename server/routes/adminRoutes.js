import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  getDashboard,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getDevelopers,
  createDeveloper,
  getProjects,
  createProject,
  updateProject,
  getMilestones,
  createMilestone,
  updateMilestone,
  getDeliverables,
  createDeliverable,
  getQueries,
  replyToQuery
} from '../controllers/adminController.js';

const router = express.Router();

// Apply middleware to all admin routes
router.use(protect, allowRoles('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Clients
router.route('/clients')
  .get(getClients)
  .post(createClient);
router.route('/clients/:id')
  .put(updateClient)
  .delete(deleteClient);

// Developers
router.route('/developers')
  .get(getDevelopers)
  .post(createDeveloper);

// Projects
router.route('/projects')
  .get(getProjects)
  .post(createProject);
router.route('/projects/:id')
  .put(updateProject);

// Milestones
router.route('/milestones')
  .get(getMilestones)
  .post(createMilestone);
router.route('/milestones/:id')
  .put(updateMilestone);

// Deliverables
router.route('/deliverables')
  .get(getDeliverables)
  .post(createDeliverable);

// Queries
router.route('/queries')
  .get(getQueries);
router.put('/queries/:id/reply', replyToQuery);

export default router;
