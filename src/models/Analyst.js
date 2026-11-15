import mongoose from 'mongoose'

const AnalystSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true, lowercase: true },
    password:   { type: String, required: true },            // bcrypt hash
    role:       { type: String, default: 'Analyst' },
    avatar:     { type: String },
    casesTotal: { type: Number, default: 0 },
    casesDone:  { type: Number, default: 0 },
    active:     { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Analyst ||
  mongoose.model('Analyst', AnalystSchema)

