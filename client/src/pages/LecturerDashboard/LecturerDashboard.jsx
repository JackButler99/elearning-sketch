import React, {useState, useEffect} from 'react'
import { useStateContext } from '../../context/ContexProvider'
import Layout from '../../components/layout/Layout'
import CourseCards from "./CourseCards"
import AddCourse from './AddCourse'
import {useNavigate} from 'react-router-dom' 
import axios from 'axios'
import UserSettings from '../UserSettings/UserSettings'
import UserTopbar from '../../components/ui/UserTopbar'

const URL = "http://localhost:8080/api/"
// const URL = "https://elearning-back-test.as.r.appspot.com/api/"
// const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"

const Course = () => {
  const navigate = useNavigate()
  const [addCourse, setAddCourse]= useState(false)
  const [courseCreated, setCourseCreated] = useState(false)
  const [courses, setCourses] = useState([])
  
  const fetchCourses=async()=>{
    try {
      axios.get( URL + "course/courses")
        .then((payload)=>{
          setCourses(payload.data)
        })    
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    fetchCourses()
  }, [addCourse])
  return(
    <>
    { addCourse ? 
      <AddCourse
        isShowing = {addCourse}
        onClose ={()=> {setAddCourse(false); window.scrollTo(0, 0)}}
        setCourseCreated={setCourseCreated}
      />
    :
    <>
      <div className="">
        {courseCreated &&<div className="bg-green-200 p-2">Course Successfuly Created</div>}
        <div className="flex p-2">
          <button onClick={()=> setAddCourse(true)}  className="bg-blue-500 text-white px-2 py-1">Add New Course</button>
        </div>      
        <div className='flex flex-wrap'>
          {courses.map((course, id)=>{
            return(
              <CourseCards 
                key = {id}
                course={course}
                onClick = {()=>navigate(`/course/${course?.slug}`)}
                
              />
            )
          })}        
        </div>       
      </div>
    </>
  }
    
    </>
  )  
}

const Revenue = () => {
  return(
    <div className="">Revenue</div>
  )  
}

const Profile = () => {
  return(
    <div className="">Profile</div>
  )  
}

const Feedback =() =>{
  return(
    <div className="">Your Feedback</div>
  )
}

const Notif =() => {
  return (
   <div className="">Notification</div>
  )
}
const Menus = [
  {
    id:1,
    title:"Your Courses",
    component:Course
  },
  {
    id:2,
    title:"Course Feedbacks",
    component: Feedback
  },
  {
    id:3,
    title:"Revenue",
    component: Revenue
  },
  {
    id:4,
    title:"Notifications",
    component: Notif
  },
  {
    id:5,
    title:"Profile",
    component: Profile
  },
]

export const Sidebar = () => {
  const [state, setState] = useState("Your Courses")
  const [isHover, setIsHover] = useState(false)
  
  const [page, setPage] = useState('Profile Settings')
  return(    
    <div className="  ">
      <div 
        onMouseOver={()=>setIsHover(true)} onMouseOut={()=>setIsHover(false)}  
        className="z-2 fixed h-[100%] top-[20%] left-0 bg-black text-gray-200 ">
          {Menus.map((menu, id)=> (
            <div key={id} className={`${state === menu.title? 'bg-gray-700' : ''} cursor-pointer p-2 hover:bg-gray-700`} id= {menu.id}  onClick={()=>setState(menu.title)}>
            {menu.title}
          </div>
          ))}
          <br/>
          <div className={`${state === "Settings"? 'bg-gray-700' : ''} cursor-pointer p-2 hover:bg-gray-700`} id= {0} onClick={()=>setState("Settings")}>Settings</div>
        </div>     
        {Menus.map((menu, id)=> {
          if (menu.title === state){
          return(
          <div key={id} className={`ml-40 p-2`} id= {menu.id}  onClick={()=>setState(menu.title)}>
            <menu.component/>
          </div>
        )}})}
        {(state === "Settings") && (
          <div className='ml-40'>
            <div className='p-2'>
              <h1 className='text-3xl'>Settings</h1>  
            </div>
            <UserTopbar page={page} setPage={setPage} />        
  
        </div>
        )}
    </div>
  )
}

const LecturerDashboard = () => {
  const {screenSize, setScreenSize} = useStateContext()
  const [listMenu, setListMenu] = useState(false)
  const [state, setState]= useState("")

  useEffect(()=> {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [setScreenSize])

  useEffect(()=>{
    if (screenSize <= 900) {
      setListMenu(false)
    }else {
      setListMenu(true)
    }

  }, [screenSize, listMenu])

  return (
    <div>
      <Layout>
        <Sidebar />
      </Layout>
      
    </div>
  )
}

export default LecturerDashboard