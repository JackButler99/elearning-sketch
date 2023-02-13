import Users from "../models/Users.js"
import Courses from "../models/Courses.js"


export const currentInstructor = async (req, res) => {
  try {
    let user = await Users.findById(req.user._id).select("-password").exec()
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (error) {
    console.log(err)
  }
}

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Courses.find({instructor: req.user._id })
      .sort({ createdAt: -1})
      .exec()
  } catch (error) {
    console.log(err)
  }
}

export const studentCount = async (req, res) => {
  try {
    const users = await Users.find({ courses: req.body.courseId })
      .select("_id")
      .exec();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};