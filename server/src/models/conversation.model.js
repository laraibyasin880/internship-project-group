// MongoDB model for one WhatsApp Hub conversation (chat).
// One document = one chat. The messages of the chat are stored INSIDE the document,
// because we always load a chat together with its messages.
import mongoose from 'mongoose'

// A quote or invoice card shown inside a message bubble
const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    total: { type: String, required: true },
  },
  { _id: false }
)

// The invoice details shown in the payment strip (invoice chats only)
const invoiceSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true },
    total: { type: String, required: true },
    dueDate: { type: String, required: true },
    daysOverdue: Number,
    paidOn: String,
  },
  { _id: false }
)

// One message in the chat
const messageSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true }, // number of the message inside this chat
    from: { type: String, enum: ['tradesperson', 'customer', 'system'], required: true },
    text: { type: String, default: '' },
    time: String, // display text such as "9:41 AM" (grey system notes have no time)
    ticks: { type: String, enum: ['sent', 'delivered', 'read'] }, // only for Ali's messages
    card: cardSchema, // optional
  },
  { _id: false, id: false }
)

const conversationSchema = new mongoose.Schema(
  {
    // Same number id as before, so React and the routes do not change
    id: { type: Number, required: true, unique: true },
    customer: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['quote', 'invoice', 'review', 'job', 'certificate'],
      required: true,
    },
    label: String, // small uppercase text such as "Quote sent"
    lastMessage: String,
    time: String, // display text such as "10:42" or "Yesterday"
    unread: { type: Number, default: 0 }, // 0 = already read
    starred: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 }, // reviews only

    // Thread part (only quote and invoice chats have it)
    phone: String,
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Approved', 'Declined', 'Paid', 'Overdue'],
    },
    invoice: invoiceSchema, // invoice chats only
    messages: [messageSchema],
  },
  { timestamps: true, id: false } // timestamps adds createdAt and updatedAt automatically
)

// MongoDB turns "Conversation" into a collection named "conversations"
export default mongoose.model('Conversation', conversationSchema)