import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
    enum: ["Physics", "Chemistry", "Biology", "Math", "Computer"],
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  fileUrl: {
    type: String,
    required: true,
  },

  coverUrl: {
    type: String,
    default: "",
  },

  pageCount: {
    type: Number,
    default: 0,
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: true,
  },

  purchasedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],

  isPublished: {
    type: Boolean,
    default: true,
  },

  isapproved: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export const Notes = mongoose.model("Notes", notesSchema);
