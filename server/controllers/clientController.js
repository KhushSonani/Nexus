import { Client } from '../models/Client.js';
import { Project } from '../models/Project.js';
import { Milestone } from '../models/Milestone.js';
import { HourLog } from '../models/HourLog.js';
import { Deliverable } from '../models/Deliverable.js';
import { Query } from '../models/Query.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Helper to get client record for the current user
const getClientRecord = async (userId) => {
  const client = await Client.findOne({ user: userId });
  if (!client) {
    throw new ApiError(404, 'Client record not found for this user');
  }
  return client;
};

// Helper to get project for the client record
const getClientProject = async (clientId) => {
  return await Project.findOne({ client: clientId });
};

export const getDashboard = asyncHandler(async (req, res) => {
  const client = await Client.findOne({ user: req.user._id }).populate('assignedDeveloper', 'name email avatar');
  if (!client) {
    throw new ApiError(404, 'Client record not found');
  }

  const project = await getClientProject(client._id);
  
  let hoursThisMonth = 0;
  let activeMilestones = [];
  let recentDeliverables = [];
  let openQueriesCount = 0;

  if (project) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const hoursData = await HourLog.aggregate([
      { $match: { project: project._id, month: currentMonth, year: currentYear } },
      { $group: { _id: null, totalHours: { $sum: '$hoursLogged' } } }
    ]);
    hoursThisMonth = hoursData.length > 0 ? hoursData[0].totalHours : 0;

    activeMilestones = await Milestone.find({ project: project._id, status: { $ne: 'completed' } }).sort({ dueDate: 1 });
    
    recentDeliverables = await Deliverable.find({ project: project._id, visibleToClient: true })
      .sort({ createdAt: -1 })
      .limit(3);
      
    openQueriesCount = await Query.countDocuments({ project: project._id, raisedBy: req.user._id, status: 'open' });
  }

  res.status(200).json(new ApiResponse(200, {
    client,
    project,
    hoursThisMonth,
    activeMilestones,
    recentDeliverables,
    openQueriesCount
  }, 'Client dashboard fetched successfully'));
});

export const getProject = asyncHandler(async (req, res) => {
  const client = await getClientRecord(req.user._id);
  const project = await Project.findOne({ client: client._id }).populate('developer', 'name email avatar');
  
  if (!project) {
    throw new ApiError(404, 'No project found for this client');
  }

  res.status(200).json(new ApiResponse(200, project, 'Project fetched successfully'));
});

export const getMilestones = asyncHandler(async (req, res) => {
  const client = await getClientRecord(req.user._id);
  const project = await getClientProject(client._id);
  
  if (!project) {
    return res.status(200).json(new ApiResponse(200, [], 'No milestones found'));
  }

  const milestones = await Milestone.find({ project: project._id }).sort({ dueDate: 1 });
  res.status(200).json(new ApiResponse(200, milestones, 'Milestones fetched successfully'));
});

export const getDeliverables = asyncHandler(async (req, res) => {
  const client = await getClientRecord(req.user._id);
  const project = await getClientProject(client._id);
  
  if (!project) {
    return res.status(200).json(new ApiResponse(200, [], 'No deliverables found'));
  }

  const deliverables = await Deliverable.find({ project: project._id, visibleToClient: true })
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, deliverables, 'Deliverables fetched successfully'));
});

export const getQueries = asyncHandler(async (req, res) => {
  const queries = await Query.find({ raisedBy: req.user._id }).populate('project', 'title').sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, queries, 'Queries fetched successfully'));
});

export const createQuery = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  
  const client = await getClientRecord(req.user._id);
  const project = await getClientProject(client._id);
  
  if (!project) {
    throw new ApiError(400, 'Cannot create query without an assigned project');
  }

  const query = await Query.create({
    project: project._id,
    raisedBy: req.user._id,
    subject,
    message
  });

  res.status(201).json(new ApiResponse(201, query, 'Query created successfully'));
});
