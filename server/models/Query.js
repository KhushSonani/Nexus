import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-review', 'resolved'], default: 'open' },
  adminReply: { type: String },
  repliedAt: { type: Date }
}, { timestamps: true });

export const Query = mongoose.model('Query', querySchema);
