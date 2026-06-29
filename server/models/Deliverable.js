import mongoose from 'mongoose';

const deliverableSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  visibleToClient: { type: Boolean, default: true }
}, { timestamps: true });

export const Deliverable = mongoose.model('Deliverable', deliverableSchema);
