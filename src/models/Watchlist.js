import mongoose from 'mongoose'

const WatchlistSchema = new mongoose.Schema(
  {
    url:      { type: String, required: true, unique: true },
    hostname: { type: String, required: true },
    reason:   { type: String, required: true },
    addedBy:  { type: String },
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
)

WatchlistSchema.index({ hostname: 1 })

export default mongoose.models.Watchlist ||
  mongoose.model('Watchlist', WatchlistSchema)

