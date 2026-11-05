// server/src/seed.js
// Run this file ONCE to put the 11 chats and their threads into MongoDB.
// Command (from the server folder): node src/seed.js

import mongoose from 'mongoose'
import process from 'node:process'
import { connectDB } from './db.js'
import Conversation from './models/conversation.model.js'
import { conversations } from '../data/conversations.js'
import { threads } from '../data/threads.js'

async function seed() {
  await connectDB()

  // Join each chat with its thread (same id). Chats without a thread get no messages.
  const documents = conversations.map((chat) => {
    const thread = threads[chat.id]
    return {
      ...chat,
      phone: thread?.phone,
      status: thread?.status,
      invoice: thread?.invoice,
      messages: thread?.messages ?? [],
    }
  })

  // Delete old documents first, so running the seed twice never creates duplicates.
  // This only touches OUR collection (whatsapp_conversations), nobody else's data.
  await Conversation.deleteMany({})
  const saved = await Conversation.insertMany(documents)

  console.log(`Seeded ${saved.length} conversations`)
  await mongoose.disconnect()
}

seed().catch((error) => {
  console.error('Seed failed:', error.message)
  process.exit(1)
})