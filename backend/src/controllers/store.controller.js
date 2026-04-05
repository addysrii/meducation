import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { RecordedChapter } from "../models/recordedChapter.model.js";
import { Notes } from "../models/notes.model.js";
import { course } from "../models/course.model.js";
import { Teacher } from "../models/teacher.model.js";
import { instance } from "../app.js";
import crypto from "crypto";

// ─── RECORDED CHAPTERS ──────────────────────────────────────────────────────

/** POST /api/store/chapter/create/:teacherId */
const createChapter = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  if (String(teacher._id) !== req.params.teacherId)
    throw new ApiError(403, "Not authorised");

  const {
    title, description, subject, price,
    videoUrl, sampleVideoUrl, thumbnailUrl, duration,
    notesUrl, practiceSheetUrl,
  } = req.body;

  if ([title, description, subject, videoUrl].some((f) => !f?.trim()))
    throw new ApiError(400, "title, description, subject, videoUrl are required");

  if (price === undefined || price < 0)
    throw new ApiError(400, "price must be >= 0");

  const chapter = await RecordedChapter.create({
    title, description, subject, price,
    videoUrl, sampleVideoUrl, thumbnailUrl, duration,
    notesUrl, practiceSheetUrl,
    teacher: teacher._id,
  });

  return res.status(201).json(new ApiResponse(201, chapter, "Chapter created"));
});

/** GET /api/store/chapters  – all published chapters (public) */
const getAllChapters = asyncHandler(async (req, res) => {
  const { subject } = req.query;
  const filter = { isPublished: true, isapproved: "approved" };
  if (subject) filter.subject = subject;

  const chapters = await RecordedChapter.find(filter)
    .populate("teacher", "Firstname Lastname Email")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, chapters, "Chapters fetched"));
});

/** GET /api/store/chapters/teacher/:teacherId – teacher's own chapters */
const getTeacherChapters = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  if (String(teacher._id) !== req.params.teacherId)
    throw new ApiError(403, "Not authorised");

  const chapters = await RecordedChapter.find({ teacher: teacher._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, chapters, "Teacher chapters fetched"));
});

/** DELETE /api/store/chapter/:chapterId/teacher/:teacherId */
const deleteChapter = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  const chapter = await RecordedChapter.findById(req.params.chapterId);
  if (!chapter) throw new ApiError(404, "Chapter not found");
  if (String(chapter.teacher) !== String(teacher._id))
    throw new ApiError(403, "Not authorised");

  await chapter.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, "Chapter deleted"));
});

/** GET /api/store/student/:studentId/chapters – chapters bought by student */
const getStudentChapters = asyncHandler(async (req, res) => {
  const student = req.Student;
  const chapters = await RecordedChapter.find({ purchasedBy: student._id })
    .populate("teacher", "Firstname Lastname");
  return res.status(200).json(new ApiResponse(200, chapters, "Purchased chapters"));
});

// ─── NOTES ──────────────────────────────────────────────────────────────────

/** POST /api/store/notes/create/:teacherId */
const createNotes = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  if (String(teacher._id) !== req.params.teacherId)
    throw new ApiError(403, "Not authorised");

  const { title, description, subject, price, fileUrl, coverUrl, pageCount } = req.body;

  if ([title, description, subject, fileUrl].some((f) => !f?.trim()))
    throw new ApiError(400, "title, description, subject, fileUrl are required");

  if (price === undefined || price < 0)
    throw new ApiError(400, "price must be >= 0");

  const notes = await Notes.create({
    title, description, subject, price,
    fileUrl, coverUrl, pageCount: pageCount || 0,
    teacher: teacher._id,
  });

  return res.status(201).json(new ApiResponse(201, notes, "Notes created"));
});

/** GET /api/store/notes  – all published notes (public) */
const getAllNotes = asyncHandler(async (req, res) => {
  const { subject } = req.query;
  const filter = { isPublished: true, isapproved: "approved" };
  if (subject) filter.subject = subject;

  const allNotes = await Notes.find(filter)
    .populate("teacher", "Firstname Lastname Email")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, allNotes, "Notes fetched"));
});

/** GET /api/store/notes/teacher/:teacherId – teacher's own notes */
const getTeacherNotes = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  if (String(teacher._id) !== req.params.teacherId)
    throw new ApiError(403, "Not authorised");

  const notes = await Notes.find({ teacher: teacher._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, notes, "Teacher notes fetched"));
});

/** DELETE /api/store/notes/:notesId/teacher/:teacherId */
const deleteNotes = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  const notes = await Notes.findById(req.params.notesId);
  if (!notes) throw new ApiError(404, "Notes not found");
  if (String(notes.teacher) !== String(teacher._id))
    throw new ApiError(403, "Not authorised");

  await notes.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, "Notes deleted"));
});

/** GET /api/store/student/:studentId/notes – notes bought by student */
const getStudentNotes = asyncHandler(async (req, res) => {
  const student = req.Student;
  const notes = await Notes.find({ purchasedBy: student._id })
    .populate("teacher", "Firstname Lastname");
  return res.status(200).json(new ApiResponse(200, notes, "Purchased notes"));
});

// ─── PRICED COURSES (update price / list with price) ────────────────────────

/** PATCH /api/store/course/:courseId/price */
const updateCoursePrice = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  const { price, thumbnail } = req.body;

  if (price === undefined || price < 0)
    throw new ApiError(400, "price must be >= 0");

  const c = await course.findOne({ _id: req.params.courseId, enrolledteacher: teacher._id });
  if (!c) throw new ApiError(404, "Course not found or not yours");

  c.price = price;
  if (thumbnail) c.thumbnail = thumbnail;
  await c.save();

  return res.status(200).json(new ApiResponse(200, c, "Course price updated"));
});

/** GET /api/store/courses  – all approved courses with price (public) */
const getStoreCoourses = asyncHandler(async (req, res) => {
  const courses = await course.find({ isapproved: true })
    .populate("enrolledteacher", "Firstname Lastname Email")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, courses, "Store courses fetched"));
});

// ─── PAYMENTS for Chapter & Notes ───────────────────────────────────────────

/** POST /api/store/pay/chapter/:chapterId  – create razorpay order */
const payForChapter = asyncHandler(async (req, res) => {
  const chapter = await RecordedChapter.findById(req.params.chapterId);
  if (!chapter) throw new ApiError(404, "Chapter not found");

  const alreadyBought = chapter.purchasedBy.includes(req.Student._id);
  if (alreadyBought) throw new ApiError(400, "Already purchased");

  if (chapter.price === 0) {
    // free – just add to purchased list
    chapter.purchasedBy.push(req.Student._id);
    await chapter.save();
    return res.status(200).json(new ApiResponse(200, { free: true }, "Access granted (free)"));
  }

  const options = {
    amount: chapter.price * 100, // paise
    currency: "INR",
    receipt: `chapter_${chapter._id}`,
  };
  const order = await instance.orders.create(options);
  return res.status(200).json(new ApiResponse(200, { order, chapter }, "Order created"));
});

/** POST /api/store/pay/chapter/:chapterId/confirm */
const confirmChapterPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const student = req.Student;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    throw new ApiError(400, "Payment verification failed");

  const chapter = await RecordedChapter.findById(req.params.chapterId);
  if (!chapter) throw new ApiError(404, "Chapter not found");

  if (!chapter.purchasedBy.includes(student._id)) {
    chapter.purchasedBy.push(student._id);
    await chapter.save();

    // Credit teacher balance
    await Teacher.findByIdAndUpdate(chapter.teacher, {
      $inc: { Balance: chapter.price * 0.8 }, // 80% to teacher
    });
  }

  return res.status(200).json(new ApiResponse(200, chapter, "Chapter purchase confirmed"));
});

/** POST /api/store/pay/notes/:notesId  – create razorpay order */
const payForNotes = asyncHandler(async (req, res) => {
  const notes = await Notes.findById(req.params.notesId);
  if (!notes) throw new ApiError(404, "Notes not found");

  const alreadyBought = notes.purchasedBy.includes(req.Student._id);
  if (alreadyBought) throw new ApiError(400, "Already purchased");

  if (notes.price === 0) {
    notes.purchasedBy.push(req.Student._id);
    await notes.save();
    return res.status(200).json(new ApiResponse(200, { free: true }, "Access granted (free)"));
  }

  const options = {
    amount: notes.price * 100,
    currency: "INR",
    receipt: `notes_${notes._id}`,
  };
  const order = await instance.orders.create(options);
  return res.status(200).json(new ApiResponse(200, { order, notes }, "Order created"));
});

/** POST /api/store/pay/notes/:notesId/confirm */
const confirmNotesPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const student = req.Student;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    throw new ApiError(400, "Payment verification failed");

  const notes = await Notes.findById(req.params.notesId);
  if (!notes) throw new ApiError(404, "Notes not found");

  if (!notes.purchasedBy.includes(student._id)) {
    notes.purchasedBy.push(student._id);
    await notes.save();

    // Credit teacher balance
    await Teacher.findByIdAndUpdate(notes.teacher, {
      $inc: { Balance: notes.price * 0.8 },
    });
  }

  return res.status(200).json(new ApiResponse(200, notes, "Notes purchase confirmed"));
});

export {
  createChapter, getAllChapters, getTeacherChapters, deleteChapter, getStudentChapters,
  createNotes, getAllNotes, getTeacherNotes, deleteNotes, getStudentNotes,
  updateCoursePrice, getStoreCoourses,
  payForChapter, confirmChapterPayment,
  payForNotes, confirmNotesPayment,
};
