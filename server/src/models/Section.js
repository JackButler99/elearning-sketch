import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema

const lessonSchema = new mongoose.Schema ({
  title: {
    type: String, 
    trim: true, 
    // required: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  video: {
    type: String,
    default: '',
  },
  contentNumber: {
    type: Number,
   
  },
  freePreview: {
    type: Boolean,
    default: false
  }
})

const sectionSchema = new mongoose.Schema({
  title: {
    type: String, 
    trim: true, 
    // required: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  lessons: [lessonSchema]
})

export default mongoose.model("Section", sectionSchema);