import { Router } from "express";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";
import {
  createChapter, getAllChapters, getTeacherChapters, deleteChapter, getStudentChapters,
  createNotes, getAllNotes, getTeacherNotes, deleteNotes, getStudentNotes,
  updateCoursePrice, getStoreCoourses,
  payForChapter, confirmChapterPayment,
  payForNotes, confirmNotesPayment,
} from "../controllers/store.controller.js";

const router = Router();

// ── Courses (store listing + price update) ──────────────────────────────────
router.route("/courses").get(getStoreCoourses);
router.route("/course/:courseId/price").patch(authTeacher, updateCoursePrice);

// ── Recorded Chapters ────────────────────────────────────────────────────────
router.route("/chapters").get(getAllChapters);
router.route("/chapter/create/:teacherId").post(authTeacher, createChapter);
router.route("/chapters/teacher/:teacherId").get(authTeacher, getTeacherChapters);
router.route("/chapter/:chapterId/teacher/:teacherId").delete(authTeacher, deleteChapter);
router.route("/student/:studentId/chapters").get(authSTD, getStudentChapters);

// ── Notes ────────────────────────────────────────────────────────────────────
router.route("/notes").get(getAllNotes);
router.route("/notes/create/:teacherId").post(authTeacher, createNotes);
router.route("/notes/teacher/:teacherId").get(authTeacher, getTeacherNotes);
router.route("/notes/:notesId/teacher/:teacherId").delete(authTeacher, deleteNotes);
router.route("/student/:studentId/notes").get(authSTD, getStudentNotes);

// ── Payments ─────────────────────────────────────────────────────────────────
router.route("/pay/chapter/:chapterId").post(authSTD, payForChapter);
router.route("/pay/chapter/:chapterId/confirm").post(authSTD, confirmChapterPayment);
router.route("/pay/notes/:notesId").post(authSTD, payForNotes);
router.route("/pay/notes/:notesId/confirm").post(authSTD, confirmNotesPayment);

export default router;
