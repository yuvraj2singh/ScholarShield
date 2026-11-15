import mongoose from 'mongoose'

const ScamReportSchema = new mongoose.Schema(
  {
    scholarshipName:{ type: String, required: true },
    orgName:        { type: String, required: true },
    url:            { type: String },
    channel:        { type: String, default: 'Unknown' },
    indicators:     [{ type: String }],
    amount:         { type: Number },
    paymentMethod:  { type: String },
    notes:          { type: String },
    submitterRole:  { type: String, default: 'Unknown' },
    submitterName:  { type: String },
    submitterEmail: { type: String },
    anonymous:      { type: Boolean, default: true },
    fileCount:      { type: Number, default: 0 },
    priorityScore:  { type: Number, default: 0, min: 0, max: 100 },
    reviewStatus:   {
      type:    String,
      enum:    ['PENDING', 'UNDER_REVIEW', 'CONFIRMED', 'DISMISSED'],
      default: 'PENDING',
    },
    analystId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Analyst' },
    resolvedAt:     { type: Date },
    scholarshipId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' },
  },
  { timestamps: true }
)

ScamReportSchema.index({ reviewStatus: 1 })
ScamReportSchema.index({ priorityScore: -1 })
ScamReportSchema.index({ createdAt: -1 })

export default mongoose.models.ScamReport ||
  mongoose.model('ScamReport', ScamReportSchema)

