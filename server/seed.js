import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Client } from './models/Client.js';
import { Project } from './models/Project.js';
import { Milestone } from './models/Milestone.js';
import { HourLog } from './models/HourLog.js';
import { Deliverable } from './models/Deliverable.js';
import { Query } from './models/Query.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear all collections
    await User.deleteMany();
    await Client.deleteMany();
    await Project.deleteMany();
    await Milestone.deleteMany();
    await HourLog.deleteMany();
    await Deliverable.deleteMany();
    await Query.deleteMany();

    console.log('Collections cleared');

    // 1 Admin
    const admin = await User.create({ name: 'Admin', email: 'admin@nexus.com', password: 'Admin@123', role: 'admin' });

    // 3 Developers
    const rahul = await User.create({ name: 'Rahul Mehta', email: 'rahul@nexus.com', password: 'Dev@123', role: 'developer' });
    const priya = await User.create({ name: 'Priya Shah', email: 'priya@nexus.com', password: 'Dev@123', role: 'developer' });
    const arjun = await User.create({ name: 'Arjun Kumar', email: 'arjun@nexus.com', password: 'Dev@123', role: 'developer' });

    // 3 Client Users
    const johnUser = await User.create({ name: 'John Smith', email: 'john@techcorp.com', password: 'Client@123', role: 'client' });
    const sarahUser = await User.create({ name: 'Sarah Lee', email: 'sarah@bloomlabs.com', password: 'Client@123', role: 'client' });
    const mikeUser = await User.create({ name: 'Mike Chen', email: 'mike@nexwave.com', password: 'Client@123', role: 'client' });

    // Dates
    const today = new Date();
    const ago3Months = new Date(today); ago3Months.setMonth(today.getMonth() - 3);
    const ago2Months = new Date(today); ago2Months.setMonth(today.getMonth() - 2);
    const ago5Days = new Date(today); ago5Days.setDate(today.getDate() - 5);
    const fromNow3Months = new Date(today); fromNow3Months.setMonth(today.getMonth() + 3);

    // 3 Client Records
    const client1 = await Client.create({ user: johnUser._id, companyName: 'TechCorp Inc.', industry: 'SaaS', country: 'USA', timezone: 'EST', assignedDeveloper: rahul._id, status: 'active', engagementStart: ago3Months });
    const client2 = await Client.create({ user: sarahUser._id, companyName: 'Bloom Labs', industry: 'HealthTech', country: 'UK', timezone: 'GMT', assignedDeveloper: priya._id, status: 'trial', engagementStart: ago5Days });
    const client3 = await Client.create({ user: mikeUser._id, companyName: 'Nexwave Digital', industry: 'E-commerce', country: 'Singapore', timezone: 'SGT', assignedDeveloper: arjun._id, status: 'active', engagementStart: ago2Months });

    // 3 Projects
    const project1 = await Project.create({ title: 'TechCorp Platform', client: client1._id, developer: rahul._id, techStack: ['React', 'Node.js', 'MongoDB'], status: 'active', monthlyHoursTarget: 168, startDate: ago3Months, targetDate: fromNow3Months });
    const project2 = await Project.create({ title: 'Bloom Health App', client: client2._id, developer: priya._id, techStack: ['React Native', 'Python', 'PostgreSQL'], status: 'scoping', monthlyHoursTarget: 168 });
    const project3 = await Project.create({ title: 'Nexwave Store', client: client3._id, developer: arjun._id, techStack: ['Next.js', 'Node.js', 'MongoDB'], status: 'review', monthlyHoursTarget: 168, startDate: ago2Months });

    // 5 Milestones
    await Milestone.create([
      { project: project1._id, title: 'MVP Release', description: 'Core features for SaaS', dueDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000), status: 'in-progress' },
      { project: project1._id, title: 'Beta Testing', description: 'Internal testing phase', dueDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000), status: 'pending' },
      { project: project2._id, title: 'Requirements Gathering', description: 'Finalizing scope', dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), status: 'in-progress' },
      { project: project3._id, title: 'Design Handoff', description: 'Figma to code', dueDate: ago5Days, status: 'completed', completedAt: ago5Days },
      { project: project3._id, title: 'Frontend Integration', description: 'Next.js components', dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), status: 'in-progress' }
    ]);

    // HourLogs
    const hourLogs = [];
    for (let i = 1; i <= 18; i++) {
      hourLogs.push({ project: project1._id, developer: rahul._id, date: new Date(today.getFullYear(), today.getMonth(), Math.min(i, 28)), hoursLogged: 8, taskDescription: `Development day ${i}` });
    }
    for (let i = 1; i <= 20; i++) {
      hourLogs.push({ project: project3._id, developer: arjun._id, date: new Date(today.getFullYear(), today.getMonth(), Math.min(i, 28)), hoursLogged: 8, taskDescription: `Store integration day ${i}` });
    }
    for (let i = 1; i <= 5; i++) {
      hourLogs.push({ project: project2._id, developer: priya._id, date: new Date(today.getFullYear(), today.getMonth(), Math.min(i, 28)), hoursLogged: 8, taskDescription: `Scoping and research day ${i}` });
    }
    await HourLog.create(hourLogs);

    // 2 Deliverables for project 1
    await Deliverable.create([
      { project: project1._id, title: 'Architecture Diagram', description: 'Initial AWS setup diagram', fileUrl: 'https://example.com/arch.pdf', uploadedBy: rahul._id },
      { project: project1._id, title: 'Database Schema', description: 'MongoDB collections', fileUrl: 'https://example.com/schema.png', uploadedBy: rahul._id }
    ]);

    // 1 Query from John
    await Query.create({
      project: project1._id,
      raisedBy: johnUser._id,
      subject: 'When is the MVP ready?',
      message: 'Hi Rahul, just checking the timeline for the MVP.',
      status: 'open'
    });

    console.log('--- Seed complete ---');
    console.log('Created Credentials:');
    console.log('Admin: admin@nexus.com / Admin@123');
    console.log('Developers:');
    console.log('  - rahul@nexus.com / Dev@123');
    console.log('  - priya@nexus.com / Dev@123');
    console.log('  - arjun@nexus.com / Dev@123');
    console.log('Clients:');
    console.log('  - john@techcorp.com / Client@123');
    console.log('  - sarah@bloomlabs.com / Client@123');
    console.log('  - mike@nexwave.com / Client@123');

    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
