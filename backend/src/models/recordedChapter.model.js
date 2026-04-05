import mongoose from "mongoose";

const recordedChapterSchema = new mongoose.Schema({
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

  // Full paid video
  videoUrl: {
    type: String,
    required: true,
  },

  // Free sample / preview clip (publicly accessible without purchase)
  sampleVideoUrl: {
    type: String,
    default: "",
  },

  thumbnailUrl: {
    type: String,
    default: "",
  },

  duration: {
    type: String,
    default: "",
  },

  // Supplementary materials (unlocked after purchase)
  notesUrl: {
    type: String,
    default: "",
  },

  practiceSheetUrl: {
    type: String,
    default: "",
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

export const RecordedChapter = mongoose.model("RecordedChapter", recordedChapterSchema);
