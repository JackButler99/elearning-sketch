import mongoose from "mongoose"

const { ObjectId }= mongoose.Schema.Types

const courseSchema = new mongoose.Schema({
  title: {
    type: String, 
    trim: true, 
    // required: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  desc: {
    type: String,
    // required: true,
  },
  language: {
    type: [String],
    default: []
  },
  published: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  price:{
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  previewVideo: {
    type: String,
    default: '',
  },  
  rating : {
    type: [Number], 
    default: [],
  },
  reviewer: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String], 
    default: [],
  },
  specialTag: {
    type: [String],
    default: [],
  },
  enrolledBy: {
    type: [String],
    default: []
  },
   authors: {
    type: [String],
    default: []
    //   type: ObjectId,
    //   ref: "User",
    //   // required: true
   },
  outlines: {
    type: [String],
    default: []
  },
  target: {
    type: {},
    default: []
  }, 
  contents: [{ type: ObjectId, ref: "Section" }],
}, 
  {timestamps: true}
)


export default mongoose.model("Course", courseSchema);