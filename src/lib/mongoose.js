/**
 * Mongoose connection singleton
 * Safe for Next.js hot-reload (stores connection on global)
 * Usage: import dbConnect from '@/lib/mongoose'
 *        await dbConnect()
 */

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scholarguard'

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local')
}

let cached = global._mongooseCache

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null }
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}

export function isConnected() {
  return mongoose.connection.readyState === 1
}

