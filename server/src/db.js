// server/src/db.js
// This file connects our Express server to MongoDB.

import 'dotenv/config' // reads server/.env so process.env.MONGO_URI works
import process from 'node:process'
import dns from 'node:dns'
import mongoose from 'mongoose'

// Some home routers refuse the DNS lookup that Atlas links need (querySrv ECONNREFUSED).
// We ask public DNS servers (Google and Cloudflare) instead.
dns.setServers(['8.8.8.8', '1.1.1.1'])

export async function connectDB() {
  const uri = process.env.MONGO_URI

  // Stop early with a clear message if the secret link is missing
  if (!uri) {
    console.error('MONGO_URI is missing. Add it to server/.env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}