import mongoose from "mongoose"
const { Schema } = mongoose;
const { ObjectId } = Schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNum: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: [String],
    default: ["Student"],
    enum: ["Student", "Instructor", "Admin"],
  },
  img: {
    type: String
  },
  subscribers:{
    type: Number, 
    default: 0,
  },
  subscribedUsers: {
    type: [String],
  },
  fromGoogle: {
    type: Boolean,
    default: false
  },
  profile: {
    fullname : {
      type: String,
    },
    headline: {
      type: String
    },
    bio:{
      type: String
    },
    website: {
      type: String
    },
    twitter: {
      type: String
    },
    linkedIn: {
      type: String
    },
    facebook: {
      type: String
    }, 
    discord: {
      type: String
    }
  },
  courses: [{ type: ObjectId, ref: "Course" }],
},{timestamps: true})

export default mongoose.model("User", UserSchema)