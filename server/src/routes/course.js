import express from "express";
import formidable from "express-formidable";
import Multer from "multer";
import { uploadFile } from "../middlewares/index.js";

import cors from "cors"

const app = express()
const router = express.Router();


const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5 MB
    headerPairs: 50000
  },
})

// middleware
import { requireSignin, isInstructor, isEnrolled } from "../middlewares/index.js";

// controllers
import {
  course,
  uploadPreviewVideo,
  removePreviewVideo,
  uploadLessonVideo,
  create,
  read,
  uploadImage,
  removeImage,
  update,
  addSection,
  removeSection,
  updateSection,
  addLesson,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  courses,
  checkEnrollment,
  freeEnrollment,
  // paidEnrollment,
  // stripeSuccess,
  userCourses,
  markCompleted,
  listCompleted,
  markIncomplete,
  removeLessonVideo,

} from "../controllers/course.js";

router.get("/courses", courses);

router.get("/:slug", read);
router.get("/learn/:courseId", course);

// image
router.post("/upload-image", multer.single("image"), uploadImage);
router.post("/remove-image", removeImage);
// preview Video
router.post("/upload-video", multer.single("previewVideo"), uploadPreviewVideo);
router.post("/remove-video", removePreviewVideo);

// course
// router.post("/course", requireSignin, isInstructor, create);
router.post("/createCourse",  create);
// router.put("/:slug", requireSignin, update);
router.put("/:slug/edit", update);


router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  // uploadVideo
);
// router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);

// publish unpublish
router.put("/publish/:courseId", publishCourse)
router.put("/unpublish/:courseId", unpublishCourse)
// router.put("/course/publish/:courseId", requireSignin, publishCourse);
// router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

// `/api/course/lesson/${slug}/${course.instructor._id}`,
//router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson)
router.post("/:slug/addSection", addSection)
router.put("/:slug/updateSection", updateSection)
router.put("/:slug/:sectionId/remove", removeSection)
router.post("/:slug/:sectionId/addLesson", addLesson)
router.put("/:slug/:sectionId/:lessonId/update", updateLesson)
router.put("/:slug/:sectionId/:lessonId/remove", removeLesson);
router.post("/:slug/:sectionId/:lessonId/upload", multer.single("video"), uploadLessonVideo)
router.put("/:slug/:sectionId/:lessonId/removeLessonVideo", removeLessonVideo )
// router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);
// router.put("/course/:slug/:lessonId", requireSignin, removeLesson);

router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

// enrollment
// router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
// router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);
// router.get("/stripe-success/:courseId", requireSignin, stripeSuccess);

router.get("/user-courses", requireSignin, userCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, read);

// mark completed
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/list-completed", requireSignin, listCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);

export default router

