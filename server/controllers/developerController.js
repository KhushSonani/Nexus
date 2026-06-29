import { Client } from '../models/Client.js';
import { Project } from '../models/Project.js';
import { Milestone } from '../models/Milestone.js';
import { HourLog } from '../models/HourLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Helper to get client assigned to this developer
const getAssignedClient = async (developerId) => {
  return await Client.findOne({ assignedDeveloper: developerId });
};

// Helper to get project for the assigned client
const getDeveloperProject = async (clientId) => {
  return await Project.findOne({ client: clientId });
};

export const getDashboard = asyncHandler(async (req, res) => {
  const client = await getAssignedClient(req.user._id);
  
  let project = null;
  let hoursThisMonth = 0;
  let upcomingMilestones = [];

  if (client) {
    project = await getDeveloperProject(client._id);
    
    if (project) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const hoursData = await HourLog.aggregate([
        { $match: { project: project._id, developer: req.user._id, month: currentMonth, year: currentYear } },
        { $group: { _id: null, totalHours: { $sum: '$hoursLogged' } } }
      ]);
      hoursThisMonth = hoursData.length > 0 ? hoursData[0].totalHours : 0;

      upcomingMilestones = await Milestone.find({ 
        project: project._id, 
        status: { $in: ['pending', 'in-progress'] } 
      }).sort({ dueDate: 1 });
    }
  }

  res.status(200).json(new ApiResponse(200, {
    client,
    project,
    hoursThisMonth,
    upcomingMilestones
  }, 'Developer dashboard fetched successfully'));
});

export const logHours = asyncHandler(async (req, res) => {
  const { date, hoursLogged, taskDescription } = req.body;
  
  if (hoursLogged < 0.5 || hoursLogged > 10) {
    throw new ApiError(400, 'Hours logged must be between 0.5 and 10');
  }

  const client = await getAssignedClient(req.user._id);
  if (!client) {
    throw new ApiError(400, 'No client assigned to you');
  }

  const project = await getDeveloperProject(client._id);
  if (!project) {
    throw new ApiError(400, 'No project found for your assigned client');
  }

  const logDate = date ? new Date(date) : new Date();

  const hourLog = await HourLog.create({
    project: project._id,
    developer: req.user._id,
    date: logDate,
    hoursLogged,
    taskDescription,
    month: logDate.getMonth() + 1,
    year: logDate.getFullYear()
  });

  res.status(201).json(new ApiResponse(201, hourLog, 'Hours logged successfully'));
});

export const getHours = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const filter = { developer: req.user._id };

  if (month) filter.month = parseInt(month);
  if (year) filter.year = parseInt(year);

  const hourLogs = await HourLog.find(filter).sort({ date: -1 });
  res.status(200).json(new ApiResponse(200, hourLogs, 'Hour logs fetched successfully'));
});

export const getTasks = asyncHandler(async (req, res) => {
  const client = await getAssignedClient(req.user._id);
  if (!client) return res.status(200).json(new ApiResponse(200, [], 'No tasks found'));

  const project = await getDeveloperProject(client._id);
  if (!project) return res.status(200).json(new ApiResponse(200, [], 'No tasks found'));

  const tasks = await Milestone.find({ project: project._id }).sort({ dueDate: 1 });
  res.status(200).json(new ApiResponse(200, tasks, 'Tasks fetched successfully'));
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    throw new ApiError(400, 'Invalid status update. Allowed values: pending, in-progress, completed');
  }

  const client = await getAssignedClient(req.user._id);
  const project = await getDeveloperProject(client._id);
  
  if (!project) {
    throw new ApiError(403, 'Not authorized');
  }

  const milestone = await Milestone.findOne({ _id: id, project: project._id });
  if (!milestone) {
    throw new ApiError(404, 'Task not found');
  }

  milestone.status = status;
  if (status === 'completed') {
    milestone.completedAt = new Date();
  }

  await milestone.save();
  res.status(200).json(new ApiResponse(200, milestone, 'Task updated successfully'));
});
