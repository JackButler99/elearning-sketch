import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import MyPlayer from '../../components/VideoPlayer/MyPlayer'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export const Accordions = ({id, parent, children, currentCourse, currentContents, currentLesson}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate()
 
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)  
  }

  const handleClick = (child) => {
    navigate(`/course/${currentCourse._id}/learning/${child._id}`)
    window.location.reload(false)
  }

  return (
    <Accordion className=' border-b-1 border-b-gray-400' expanded={expanded === id} onChange={handleChange(id)}>
      
      <AccordionSummary
        key={id}
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${id}-content`}
        id={"panel-${id}-content"}
      >
        {parent}
      </AccordionSummary>
      {children?.map((child, index)=> {
        return(
          <div key={index} onClick= {()=> handleClick(child)} className="cursor-pointer ml-3 text-sm hover:bg-gray-300">
            <AccordionDetails >          
            {`Lesson ${id+1}.${index +1} : ${child.title}`}
          </AccordionDetails>
          </div>
          
        )  
      })}
      
    </Accordion>
  )
}
export const CourseContent = ({currentCourse, currentContents, currentLesson}) =>{ 
  return(
      <>
        <div className="m-1 mb-0 pb-0">Course Contents:</div>
        <div className='mt-2 flex justify-start'>
          <div className="flex w-full border-t-2 border-t-gray-300">
            <div className='w-full'>              
              { 
                currentCourse?.contents?.map((content, index)=>{
                  return(
                    <Accordions 
                      key={index}
                      id={index}
                      parent= {`Section ${index + 1}: ${content?.title}`}
                      children= {content?.lessons}
                      currentCourse = {currentCourse}
                      currentContents = {currentContents}
                      currentLesson = {currentLesson}
                    />
                  )
                })
              }
            </div>
          </div>
        </div>
      </>
      )
    }

const CourseOverview = () =>{
  return(
    <>
      <div>This is The Course Overview Section</div>
    </>
  )
}

const QnA = () =>{
  return(
    <>
      <div>This is The QnA Section</div>
    </>
  )
}

const Notes = () =>{
  return(
    <>
      <div>This is The Notes Section</div>
    </>
  )
}

const Announcement = () =>{
  return(
    <>
      <div>This is The Announcement Section</div>
    </>
  )
}

const Review = () =>{
  return(
    <>
      <div>This is The Review Section</div>
    </>
  )
}


const menus = [
  {
    id: 1,
    title: 'Course Content',
    component: CourseContent,
  },
  {
    id: 2,
    title: 'Course Overview',
    component: CourseOverview,
  },
  {
    id: 3,
    title: 'Q&A',
    component: QnA,
  }, 
  {
    id: 4,
    title: 'Notes',
    component: Notes,
  },
  {
    id: 5,
    title: 'Announcement',
    component: Announcement
  },
  {
    id: 6,
    title: 'Reviews',
    component: Review
  }
]

const Learning = () => {
  const {courseId, lessonId} = useParams()
  const navigate = useNavigate()
  const [currentCourse, setCurrentCourse] = useState({})
  
  const URL = "http://localhost:8080/api/"
  // const URL = "https://elearning-back-test.as.r.appspot.com/api/"
  // const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"
  
  useEffect(()=>{
    const noRightClick = document.getElementById("video_Player")
    noRightClick?.addEventListener("contextmenu", e => e.preventDefault())
  },[])
  
  const fetchCourse = async () => {
    axios.get(URL + `course/learn/${courseId}`)
    .then ((res)=> {
      setCurrentCourse(res.data)
    })
  }

  useState(()=> {
    fetchCourse()
  }, [courseId])

  const [state, setState]= useState("Course Content")
  
  const currentLesson =  currentCourse?.contents?.flatMap(content=> content?.lessons.filter(lesson => lesson._id === lessonId))[0]
  console.log(currentLesson?.video)
  const currentContents = currentCourse?.contents?.flatMap(content=> content?.lessons?.map(subCourse => subCourse))
  
  const nextVideo =  currentContents?.filter(content=> content?.contentNum === currentLesson?.contentNum + 1)[0]
  const nextVideoURL = nextVideo?.videoId

  const prevVideo =  currentContents?.filter(content=> content?.contentNum === currentLesson?.contentNum - 1)[0]
  const prevVideoURL = prevVideo?.videoId
  
  const defaultOption  = {
    autoplay: false,
    controls: true, 
    sources: [{
      src: currentLesson?.video,
      type: 'video/mp4'
    }]
  }
  


  const next= () => {
    navigate(`/course/${currentCourse.id}/learning/${nextVideoURL}`)
    window.location.reload(false)
  }
  const prev= () => {
    navigate(`/course/${currentCourse.id}/learning/${prevVideoURL}`)
    window.location.reload(false)
  }

  
  
  return (
    <>
      <div id='video_Player' className='flex bg-black justify-around'>
        <div onClick= {prev} className={`${!prevVideoURL? 'pointer-events-none': ''} hover:bg-gray-500 cursor-pointer flex self-center px-3 py-3 top-[50%] text-white`}> <NavigateBeforeIcon  /> </div>
         { currentLesson && 
          <VideoPlayer className='cursor-pointer ' options={defaultOption}/>
          }
        
        <div onClick={next} className={`${!nextVideoURL? 'pointer-events-none': ''} hover:bg-gray-500 cursor-pointer flex self-center px-3 py-3 top-[50%] text-white`}> <NavigateNextIcon /> </div>
      </div>
      <div className='font-bold border-b-2 border-b-gray-300 flex justify-around'>
        {menus.map((menu, key)=>{
          return (
            <div key={key} className={`${state === menu.title? 'border-b-2 border-b-black' : ''} p-2 hover:bg-gray-400`} id= {menu.id}  onClick={()=>setState(menu.title)}>
              {menu.title}
           </div>
          )})}
      </div>
      <div className='font-bold mt-4 '>
        {menus.map((menu, key)=>{
          if (state === menu.title){
            return (
              <menu.component key={key} currentCourse={currentCourse} currentLesson= {currentLesson} currentContents={currentContents}/>
            )
  
          }})}
      </div>

    </>
  )
}

export default Learning