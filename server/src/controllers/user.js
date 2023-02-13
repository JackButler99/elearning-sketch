import Users from "../models/Users.js"
import Courses from "../models/Courses.js"
import { createError } from '../error.js'
import bcrypt from 'bcryptjs'

export const fetchCurrentUser = async (req, res) => {
  try {
    const user = await Users.findOne({username: req.params.username}).select("-password").exec();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const editProfile = async (req,res)=> {
  try{
    const {id} = req.params
    const user = await Users.findByIdAndUpdate(id, 
      { $set: {profile: req.body}},
      {new:true}).exec()
    res.json(user)
  }catch (error){
    console.log(error)
  }
}

export const editPhoneNum = async (req,res)=> {
  try{
    const {id} = req.params
    const user = await Users.findByIdAndUpdate(id, 
      { $set: {phoneNum: req.body.phoneNum}},
      {new:true}).exec()
    res.json(user)
  }catch (error){
    console.log(error)
  }
}

export const verifyPassword= async (req,res, next) => {
  try{
    const {id} = req.params
    const user = await Users.findById(id)

    const isCorrect = await bcrypt.compare(req.body.confirmPassword, user.password)
    if (!isCorrect) return next(createError(400, "Password incorrect"))

    res.status(200).send('Verification Succesfull')
  }catch (error){
    console.log(error)
  }
}

export const changePassword= async (req,res, next) => {
  try{
    const {id} = req.params
    const salt = await bcrypt.genSaltSync(10)
    const hash = await bcrypt.hashSync(req.body.newPassword, salt)

    const user = await Users.findByIdAndUpdate(id, 
      { $set: {password: hash}},
      {new:true}  
    ).exec()
      
    res.status(200).send('Verification Succesfull')

  }catch (error){
    console.log(error)
  }
}

export const fetchUserCourse = async (req,res) => {
  null
}

// export const userCourses = async (req, res) => {
//   try {
//     const courses = await Courses.find({instructor: req.user._id })
//       .sort({ createdAt: -1})
//       .exec()
//   } catch (error) {
//     console.log(err)
//   }
// }


