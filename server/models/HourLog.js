import mongoose from 'mongoose';

const hourLogSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  hoursLogged: { type: Number, required: true, min: 0.5, max: 10 },
  taskDescription: { type: String },
  month: { type: Number },
  year: { type: Number }
}, { timestamps: true });

hourLogSchema.pre('save', function() {
  if (this.date) {
    this.month = this.date.getMonth() + 1;
    this.year = this.date.getFullYear();
  }
});

export const HourLog = mongoose.model('HourLog', hourLogSchema);
