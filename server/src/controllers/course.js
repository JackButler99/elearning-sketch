// import {nanoid} from "nanoid"

import Completed from "../models/Completed.js"
import slugify from "slugify"
import { readFileSync } from "fs"
import Users from "../models/Users.js"
import Courses from "../models/Courses.js"
import Section from "../models/Section.js"
import Multer from "multer"
import {Storage} from '@google-cloud/storage'



const gcsConfig = new Storage ({
  projectId: "direct-keel-308419",
  keyFilename: "./gcKey.json",
})

const bucket = gcsConfig.bucket("elearning-bucket-profiles")
const lessonBucket = gcsConfig.bucket("lessons-video1")

export const uploadFile = async (req, res) => {
  try {
    // if (req.user._id != req.params.instructorId) {
    //   return res.status(400).send("Unauthorized Action")
    // }
    
    if (!req.file) return res.status(400).send("No Video")
    
    const file = req.file
    //  const type = file?.mimetype.split("/")[1]

    const blob = bucket.file(req.file.originalname)
    const blobStream = blob.createWriteStream()

    blobStream.on("finish", async()=> {
      res.status(200)
      res.json({...file, url: "https://storage.googleapis.com/elearning-bucket-profiles/" + file.originalname})
      console.log("Upload Success")
    })
    blobStream.end(req.file.buffer)
  } catch (error) {
    res.status(500).send(error)
    console.log(error)
  }
}

export const uploadImage = async (req, res) => {
  try {
    const file = req.file
    uploadFile(req, res)
    
  } catch (error){
    res.status(500).send(error)
    console.log(error)
  }
}
export const removeImage = async (req, res)=> {
  try {
    const filename = req.body?.image?.split('/')[4]  
    const course = await Courses.findOneAndUpdate({slug: req.body.slug}, {image:''})
    
    bucket.file(filename).delete( (err, data)=> {
      if (err){
        console.log(err)
        res.sendStatus(400)
      }
      res.json(course)  
       console.log(`file ${filename} deleted`);
    })  
  } catch (error) {
    res.status(500).send(error)
    console.log(error)
  }
}

export const uploadPreviewVideo = async (req, res) => {
  try {
    const file = req.file
    uploadFile(req, res)
    const course = await Courses.findOneAndUpdate({slug: req.body.slug}, {previewVideo:"https://storage.googleapis.com/elearning-bucket-profiles/" + file.originalname}).exec()
    
  } catch (error){
    res.status(500).send(error)
    console.log(error)
  }
}

export const uploadLessonVideo = async (req, res) => {
  try {
    const { slug, sectionId, lessonId } = req.params
    
    const file = req.file
    // if (req.user._id != req.params.instructorId) {
    //   return res.status(400).send("Unauthorized Action")
    // }
    
    if (!req.file) return res.status(400).send("No Video")
    
    //  const type = file?.mimetype.split("/")[1]

    const blob = lessonBucket.file(req.file.originalname)
    const blobStream = blob.createWriteStream()

    blobStream.on("finish", async()=> {
      const updatedSection= await Section.findOneAndUpdate(
        {"lessons._id": lessonId}, 
        {$set: {"lessons.$.video": "https://storage.googleapis.com/lessons-video1/" + file.originalname}},
        {new:true}).exec()
      
      const updated = await Courses.findOne(
        {"slug": slug },
      ).populate("contents").exec()

      res.json(updated)
      console.log("Upload Success")
    })

    blobStream.end(req.file.buffer)
        

    
  } catch (error) {
    res.status(500).send(error)
    console.log(error)
  }
}
    
export const removeLessonVideo = async (req, res) => {
  try {
    const { slug, sectionId, lessonId } = req.params
    const file = req.body
    
    const filename = file?.video?.split('/')[4]
    const deletedSection = await Section.findOneAndUpdate(
      {"lessons._id": lessonId},
      {$set: {"lessons.$.video": ""}}, 
      {new:true}).exec()
      
      console.log(deletedSection)

    const deletedCourse = await Courses.findOne(
      {"slug": slug },
    ).populate("contents")

    lessonBucket.file(filename).delete( async (err, data)=> {
      if (err){
        console.log(err)
        res.sendStatus(400)
      }
      console.log(`file ${filename} deleted`);
      res.json(deletedCourse)
      
    })
  } catch (error) {
    console.log(error)
  }
}



export const removePreviewVideo = async (req, res)=> {
  try {
    const file = req.body
    const filename = file?.previewVideo.split('/')[4]  
    const course = await Courses.findOneAndUpdate({slug: req.body.slug}, {previewVideo:''})
    
    
    bucket.file(filename).delete( (err, data)=> {
      if (err){
        console.log(err)
        res.sendStatus(400)
      }
      res.json(course)  
      console.log(`file ${filename} deleted`);
    })  
  } catch (error) {
    res.status(500).send(error)
    console.log(error)
  }
}

export const create = async (req, res) => {
  try {
    const alreadyExist = await Courses.findOne({
      slug: slugify(req.body.title.toLowerCase()),
    })
    if (alreadyExist) return res.status(400).send("Title is already exist, Please use another title")

    const course = await new Courses ({
      slug: slugify(req.body.title),
      // instructor: req.user._id, 
      ...req.body,
    }).save()

    res.json(course)
  } catch (err) {
    console.log(err)
    res.status(400).send("Creating Course failed. Please try again")
  }
}

export const read = async (req, res) => {
  try {
    const course = await Courses.findOne({slug: req.params.slug})
    .populate("contents")
      .exec()
    res.json(course)
  } catch (err) {
    console.log(err)
  }
}


export const addLesson = async (req, res)=>{
  try {
    // const { slug, instructorId } = req.params
    
    const { slug, sectionId } = req.params
    const { title, freePreview  } = req.body
    
    // if (req.user._id != instructorId){
    //   return res.status(400).send("Unauthorized Action")
    // }
    const updatedSection = await Section.findOneAndUpdate({ _id: sectionId},
      {
        $push: {lessons : {title, slug: slugify(title), freePreview }}
      },
      {new: true}  
    ) 

    const updated = await Courses.findOne(
      {"slug": slug },
    ).populate("contents").exec()
      
      res.json(updated)
      

  } catch (error) {
    console.log(error)
    return res.status(400).send("Add lesson failed")
  }
}

export const addSection = async (req, res)=>{
  try {
    // const { slug, instructorId } = req.params
    
    const { slug } = req.params
    const { title } = req.body

    // if (req.user._id != instructorId){
    //   return res.status(400).send("Unauthorized Action")
    // }
  
    const newSection = await new Section({...req.body, slug: slugify(title)}).save()

    const updated = await Courses.findOneAndUpdate(
      {slug},
      {
        $push: {contents : newSection}
      }, 
      {new: true}
    )
      .populate("contents")
      .exec()
    
    res.json(updated)

    
    
  } catch (error) {
    console.log(error)
    return res.status(400).send("Add Section failed")
  }
}


export const update = async (req, res) => {
  try {
    const { slug } = req.params;
    // console.log(slug);
    const course = await Courses.findOne({ slug }).exec();
    // console.log("COURSE FOUND => ", course);
    // if (req.user._id != course.instructor) {
    //   return res.status(400).send("Unauthorized");
    // }

    const updated = await Courses.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
}

export const removeSection = async (req, res) => {

  const { slug, sectionId } = req.params;
  const course = await Courses.findOne({ slug }).exec();
  // if (req.user._id != course.instructor) {
  //   return res.status(400).send("Unauthorized");
  // }
  const deletedSection = await Section.findByIdAndDelete(sectionId)
  const deletedCourse = await Courses.findByIdAndUpdate(course._id, {
    $pull: { contents: { _id: sectionId } },
  }).exec();

  res.json(deletedCourse)
}

export const updateSection = async (req, res)=> {
  try {
    const { slug } = req.params
    const { id, title } = req.body
    const course = await Courses.findOne({ slug }).exec()    
    // if (course.instructor._id != req.user._id){
    //   return res.status(400).send("Unauthorized Action")
    // }   
    const updatedSection = await Section.findByIdAndUpdate(
      id, 
      {
        $set: { title: title, slug: slugify(title)}
      }, 
      {new: true}).exec() 
    
      

    const updated = await Courses.findOne(
      {"slug": slug },
    ).populate("contents")
    
    
    res.json(updated)

  } catch (error) {
    console.log(error)
    return res.status(400).send("Update lesson failed")
  }
}

export const removeLesson = async (req, res) => {
  const { slug, sectionId, lessonId } = req.params;
  
  console.log (req.params)
  // if (req.user._id != course.instructor) {
  //   return res.status(400).send("Unauthorized");
  // }

  const deletedSection = await Section.findByIdAndUpdate(
    sectionId,
    {
      $pull: {lessons: {_id: lessonId}} 
    }).exec()
  
  const deletedCourse = await Courses.findOne(
    {"slug": slug },
  ).populate("contents")

  res.json(deletedCourse)
}

export const updateLesson = async (req, res)=> {
  try {
    const { slug, sectionId } = req.params;
    const { lessonId, title, freePreview } = req.body
    // const course = await Courses.findOne({ slug }).exec()
    
    // if (course.instructor._id != req.user._id){
    //   return res.status(400).send("Unauthorized Action")
    // }
    
    console.log(req.body)
    const updatedSection = await Section.findOneAndUpdate(
      {"lessons._id": lessonId},
      {$set: {
        "lessons.$.title": title,
        "lessons.$.freePreview": freePreview,
     }}, 
     {new: true}
    ).exec()

    const updated = await Courses.findOne(
      {"slug": slug },
    ).populate("contents").exec()

    // const updated = await Courses.updateOne(
    //   {"lessons._id": _id},
    //   {
    //     $set: {
    //       "lessons.$.title": title,
    //       "lessons.$.video": video,
    //       "lessons.$.freePreview": freePreview,
    //     },
    //   },
    //   {new : true}
    // ).exec()
    
   res.json(updated)
  } catch (error) {
    console.log(error)
    return res.status(400).send("Update lesson failed")
  }
}

export const publishCourse = async(req, res)=> {
  try {
    const { courseId } = req.params
    const course = await Courses.findById(courseId).select("instructor").exec()

    // if (course.instructor._id != req.user._id){
    //   return res.status(400).send("Unauthorized Action")
    // }

    const updated = await Courses.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec();
    res.json(updated)

  } catch (error) {
    console.log(err)
    return res.status(400).send("Publish course failed")
  }
}

export const unpublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Courses.findById(courseId).select("instructor").exec()

    // if (course.instructor._id != req.user._id) {
    //   return res.status(400).send("Unauthorized")
    // }

    const updated = await Courses.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec()
    res.json(updated)
    
  } catch (err) {
    console.log(err)
    return res.status(400).send("Unpublish course failed")
  }
}

export const courses = async (req, res) => {
  const all = await Courses.find()
    // .populate("instructor", "_id name")   
  res.json(all)
}

export const course = async (req, res) => {
  
  const thisCourse = await Courses.findById(req.params.courseId)
    .populate("contents")
    .exec()   
    console.log(thisCourse)
    res.json(thisCourse)
}

export const checkEnrollment = async (req, res)=> {
  const { courseId } = req.params
  // find courses of the currently logged in user
  const user = await Users.findById(req.user._id).exec()
  // Check if course id is found in user courses array
  let ids = []
  let length = user.courses && user.courses.length
  for (let i = 0; i < length; i++){
    ids.push(user.courses[i].toString())
  }
  res.json({
    status: ids.includes(courseId),
    course: await Courses.findById(courseId).exec(),
  })
}

export const freeEnrollment = async (req, res)=> {
  try {
    const course = await Courses.findById(req.params.courseId).exec()
    if (course.paid) return
    
    const result = await Users.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {courses: course._id},
      },
      {new: true}
    ).exec()
    res.json({
      message: "Enrollment successful",
      course,
    })
  } catch (error) {
    console.log("enrollment failed", error);
    return res.status(400).send("Enrollment failed")
  }
}
export const userCourses = async (req, res)=> {
  const user = await Users.findById(req.user._id)
  const courses = await Courses.find({_id: { $in: user.courses }})
    .populate("instructor", "_id name")
    .exec()
  res.json(courses)
}

export const markCompleted = async (req, res)=> {
  const { courseId, lessonId } = req.body
  const existing = await Completed.findOne(
    {
      user: req.user._id, 
      course: courseId,
    }
  ).exec()

  if (existing) {
    //update
    const updated = await Completed.findOne(
      {
        user: req.user._id,
        course: courseId
      },
      {
        $addToSet: { lessons: lessonId}
      }
    ).exec()
    res.json({ok: true})
  } else {
    // create
    const created = await new Completed({
      user: req.user._id,
      course: courseId,
      lessons: lessonId,
    }).save()
    res.json({ok: true})
  }
}

export const listCompleted = async (req, res)=> {
  try {
    const list = await Completed.findOne({
      user: req.user._id, 
      course: req.body.courseId,
    }).exec()
    list && res.json(list.lessons)
  } catch (error) {
    console.log(err)
  }
}

export const markIncomplete = async (req, res)=> {
  try{
    const {courseId, lessonId} = req.body
    const updated = await Completed.findOne(
      {
        user: req.user._id,
        course: courseId,
      },
      {
        $pull: {lessons: lessonId}
      }
    ).exec()
    res.json({ok: true})
  }catch (error) {
    console.log(error)
  }
}