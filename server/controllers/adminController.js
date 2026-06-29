import { User } from '../models/User.js';
import { Client } from '../models/Client.js';
import { Project } from '../models/Project.js';
import { Milestone } from '../models/Milestone.js';
import { HourLog } from '../models/HourLog.js';
import { Deliverable } from '../models/Deliverable.js';
import { Query } from '../models/Query.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendEmail } from '../utils/sendEmail.js';
import { welcomeEmail, milestoneCompleteEmail, queryReplyEmail } from '../utils/emailTemplates.js';

// Dashboard
export const getDashboard = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [
    totalClients,
    activeProjects,
    totalDevelopers,
    recentMilestones,
    clients,
    hoursData
  ] = await Promise.all([
    Client.countDocuments(),
    Project.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'developer' }),
    Milestone.find().sort({ updatedAt: -1 }).limit(5).populate('project', 'title'),
    Client.find().populate('assignedDeveloper', 'name email').populate('user', 'name email avatar').lean(),
    HourLog.aggregate([
      { $match: { month: currentMonth, year: currentYear } },
      { $group: { _id: null, totalHours: { $sum: '$hoursLogged' } } }
    ])
  ]);

  const totalHoursLogged = hoursData.length > 0 ? hoursData[0].totalHours : 0;

  // Populate projects for clients manually since project is linked from Project to Client
  const populatedClients = await Promise.all(clients.map(async (client) => {
    const project = await Project.findOne({ client: client._id }).select('title status');
    return { ...client, project };
  }));

  res.status(200).json(new ApiResponse(200, {
    totalClients,
    activeProjects,
    totalDevelopers,
    totalHoursLogged,
    recentMilestones,
    clients: populatedClients
  }, 'Dashboard metrics fetched successfully'));
});

// Clients
export const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find()
    .populate('user', 'name email avatar')
    .populate('assignedDeveloper', 'name email');
  res.status(200).json(new ApiResponse(200, clients, 'Clients fetched successfully'));
});

export const createClient = asyncHandler(async (req, res) => {
  const { name, email, password, companyName, industry, country, monthlyRate } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    throw new ApiError(400, 'User with this email already exists');
  }

  user = await User.create({
    name,
    email,
    password,
    role: 'client'
  });

  const client = await Client.create({
    user: user._id,
    companyName,
    industry,
    country,
    monthlyRate
  });

  await sendEmail({
    to: email,
    subject: 'Welcome to Nexus',
    html: welcomeEmail(name, email, password, companyName)
  });

  const populatedClient = await Client.findById(client._id)
    .populate('user', 'name email avatar')
    .populate('assignedDeveloper', 'name email');

  res.status(201).json(new ApiResponse(201, populatedClient, 'Client created successfully'));
});

export const updateClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const client = await Client.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .populate('user', 'name email avatar')
    .populate('assignedDeveloper', 'name email');

  if (!client) {
    throw new ApiError(404, 'Client not found');
  }

  res.status(200).json(new ApiResponse(200, client, 'Client updated successfully'));
});

export const deleteClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);

  if (!client) {
    throw new ApiError(404, 'Client not found');
  }

  client.status = 'ended';
  await client.save();

  await User.findByIdAndUpdate(client.user, { isActive: false });

  res.status(200).json(new ApiResponse(200, {}, 'Client deleted successfully'));
});

// Developers
export const getDevelopers = asyncHandler(async (req, res) => {
  const developers = await User.find({ role: 'developer' }).select('-password').lean();
  
  const populatedDevelopers = await Promise.all(developers.map(async (dev) => {
    const assignedClient = await Client.findOne({ assignedDeveloper: dev._id })
      .populate('user', 'name email companyName');
    return { ...dev, assignedClient };
  }));

  res.status(200).json(new ApiResponse(200, populatedDevelopers, 'Developers fetched successfully'));
});

export const createDeveloper = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    throw new ApiError(400, 'User with this email already exists');
  }

  user = await User.create({
    name,
    email,
    password,
    role: 'developer'
  });

  const devResponse = user.toObject();
  delete devResponse.password;

  res.status(201).json(new ApiResponse(201, devResponse, 'Developer created successfully'));
});

// Projects
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate('client', 'companyName')
    .populate('developer', 'name');
  res.status(200).json(new ApiResponse(200, projects, 'Projects fetched successfully'));
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, client, developer, techStack, repoUrl, monthlyHoursTarget, targetDate } = req.body;

  const project = await Project.create({
    title,
    description,
    client,
    developer,
    techStack,
    repoUrl,
    monthlyHoursTarget,
    targetDate
  });

  const populatedProject = await Project.findById(project._id)
    .populate('client', 'companyName')
    .populate('developer', 'name');

  res.status(201).json(new ApiResponse(201, populatedProject, 'Project created successfully'));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .populate('client', 'companyName')
    .populate('developer', 'name');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  res.status(200).json(new ApiResponse(200, project, 'Project updated successfully'));
});

// Milestones
export const getMilestones = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find().populate({
    path: 'project',
    select: 'title client',
    populate: { path: 'client', select: 'companyName' }
  });
  res.status(200).json(new ApiResponse(200, milestones, 'Milestones fetched successfully'));
});

export const createMilestone = asyncHandler(async (req, res) => {
  const { project, title, description, dueDate, notifyClient } = req.body;

  const milestone = await Milestone.create({
    project,
    title,
    description,
    dueDate,
    notifyClient
  });

  res.status(201).json(new ApiResponse(201, milestone, 'Milestone created successfully'));
});

export const updateMilestone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, title, description, dueDate, notifyClient } = req.body;

  const milestone = await Milestone.findById(id).populate('project');

  if (!milestone) {
    throw new ApiError(404, 'Milestone not found');
  }

  milestone.title = title !== undefined ? title : milestone.title;
  milestone.description = description !== undefined ? description : milestone.description;
  milestone.dueDate = dueDate !== undefined ? dueDate : milestone.dueDate;
  milestone.notifyClient = notifyClient !== undefined ? notifyClient : milestone.notifyClient;

  if (status && status !== milestone.status) {
    milestone.status = status;
    if (status === 'completed') {
      milestone.completedAt = new Date();
      if (milestone.notifyClient) {
        const clientObj = await Client.findById(milestone.project.client).populate('user');
        if (clientObj && clientObj.user) {
          await sendEmail({
            to: clientObj.user.email,
            subject: `Milestone Completed: ${milestone.title}`,
            html: milestoneCompleteEmail(clientObj.user.name, clientObj.project?.title || 'Your Project', milestone.title)
          });
        }
      }
    }
  }

  await milestone.save();
  const updatedMilestone = await Milestone.findById(id).populate({
    path: 'project',
    select: 'title client',
    populate: { path: 'client', select: 'companyName' }
  });

  res.status(200).json(new ApiResponse(200, updatedMilestone, 'Milestone updated successfully'));
});

// Deliverables
export const getDeliverables = asyncHandler(async (req, res) => {
  const deliverables = await Deliverable.find()
    .populate('project', 'title')
    .populate('uploadedBy', 'name');
  res.status(200).json(new ApiResponse(200, deliverables, 'Deliverables fetched successfully'));
});

export const createDeliverable = asyncHandler(async (req, res) => {
  const { project, title, description, fileUrl, visibleToClient } = req.body;

  const deliverable = await Deliverable.create({
    project,
    title,
    description,
    fileUrl,
    visibleToClient,
    uploadedBy: req.user._id
  });

  res.status(201).json(new ApiResponse(201, deliverable, 'Deliverable created successfully'));
});

// Queries
export const getQueries = asyncHandler(async (req, res) => {
  const queries = await Query.find()
    .populate('raisedBy', 'name email')
    .populate('project', 'title');
  res.status(200).json(new ApiResponse(200, queries, 'Queries fetched successfully'));
});

export const replyToQuery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { adminReply } = req.body;

  const query = await Query.findById(id).populate('raisedBy');

  if (!query) {
    throw new ApiError(404, 'Query not found');
  }

  query.adminReply = adminReply;
  query.repliedAt = new Date();
  query.status = 'in-review';
  
  await query.save();

  await sendEmail({
    to: query.raisedBy.email,
    subject: `Reply to your query: ${query.subject}`,
    html: queryReplyEmail(query.raisedBy.name, query.subject, adminReply)
  });

  res.status(200).json(new ApiResponse(200, query, 'Replied to query successfully'));
});
