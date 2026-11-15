import mongoose from 'mongoose'

const ScholarshipSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    org:         { type: String, required: true, trim: true },
    url:         { type: String, required: true, trim: true },
    award:       { type: String, default: 'Amount not specified' },
    status:      {
      type:    String,
      enum:    ['VERIFIED', 'SUSPICIOUS', 'HIGH_RISK', 'FRAUD', 'CAUTION', 'UNVERIFIED'],
      default: 'UNVERIFIED',
    },
    threat:      { type: Number, default: 0, min: 0, max: 100 }, // threatIndex 0-100
    domain:      { type: String },
    irs:         { type: Boolean, default: false },              // IRS 501(c)(3) compliant
    vectors:     [{ type: String }],                             // fraud vector IDs
    notes:       [{ type: String }],
    date:        { type: String },                               // ISO date string
    irsCompliant:{ type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON:  { virtuals: true },
    toObject:{ virtuals: true },
  }
)

ScholarshipSchema.index({ status: 1 })
ScholarshipSchema.index({ threat: -1 })
ScholarshipSchema.index({ name: 'text', org: 'text', url: 'text' })

export default mongoose.models.Scholarship ||
  mongoose.model('Scholarship', ScholarshipSchema)

