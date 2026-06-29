import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'delayed'], default: 'pending' },
  completedAt: { type: Date },
  notifyClient: { type: Boolean, default: true }
}, { timestamps: true });

export const Milestone = mongoose.model('Milestone', milestoneSchema);
