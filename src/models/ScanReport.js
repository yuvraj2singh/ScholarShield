import mongoose from 'mongoose'

const ScanReportSchema = new mongoose.Schema(
  {
    url:           { type: String, required: true },
    hostname:      { type: String },
    threatIndex:   { type: Number, required: true, min: 0, max: 100 },
    status:        {
      type: String,
      enum: ['VERIFIED', 'SUSPICIOUS', 'HIGH_RISK', 'FRAUD', 'CAUTION', 'UNVERIFIED'],
    },
    engine:        { type: String, default: 'js-builtin' },      // 'js-builtin' | 'python-fastapi'
    pillars:       [mongoose.Schema.Types.Mixed],                 // array of pillar objects
    flags:         [{ type: String }],
    feeKeywords:   [{ type: String }],
    coercionWords: [{ type: String }],
    hasSSN:        { type: Boolean, default: false },
    hasRouting:    { type: Boolean, default: false },
    auditRef:      { type: String, unique: true },
    scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' },
  },
  { timestamps: true }
)

ScanReportSchema.index({ url: 1 })
ScanReportSchema.index({ threatIndex: -1 })
ScanReportSchema.index({ createdAt: -1 })

export default mongoose.models.ScanReport ||
  mongoose.model('ScanReport', ScanReportSchema)

