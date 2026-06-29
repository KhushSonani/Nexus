import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  industry: { type: String },
  country: { type: String },
  timezone: { type: String, default: 'UTC' },
  engagementStart: { type: Date },
  trialEndDate: { type: Date },
  monthlyRate: { type: Number, default: 2000 },
  assignedDeveloper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['trial', 'active', 'paused', 'ended'], default: 'trial' }
}, { timestamps: true });

export const Client = mongoose.model('Client', clientSchema);
