import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  techStack: [{ type: String }],
  repoUrl: { type: String },
  status: { type: String, enum: ['scoping', 'active', 'review', 'completed', 'on-hold'], default: 'scoping' },
  monthlyHoursTarget: { type: Number, default: 168 },
  startDate: { type: Date },
  targetDate: { type: Date }
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
