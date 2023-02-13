import React, {useState, useRef, useEffect} from 'react'
import Sidebar from './LecturerDashboard'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckIcon from '@mui/icons-material/Check'

import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'

import PreviewModal from '../CourseDetails/PreviewModal';
import LessonVideo from './LessonVideo'

axios.defaults.headers.common = {
  "Content-Type": "application/json"
}

const URL = "http://localhost:8080/api/"
// const URL = "https://elearning-back-test.as.r.appspot.com/api/"
// const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"

const EditLesson = ({index, lesson, setCourse, sectionId, courseSlug, sectionIndex})=>{
  const [isEditLesson, setIsEditLesson] = useState(false)
  const [isViewVideo, setIsViewVideo] = useState(false)
  const [lessonFormValue, setLessonFormValue] = useState({lessonId: lesson._id, title:'', freePreview: lesson.freePreview, video:''})
  const navigate = useNavigate()
  
  const closeVideo = () => {
    setIsViewVideo(false)
  }
  const deleteLesson = async(e) => {
    e.preventDefault()
    // if (lessons.length !== 0) {alert("Please Empty your lessons in this section first !")}
    try {
      const {data} = await axios.put( URL +  `course/${courseSlug}/${sectionId}/${lesson._id}/remove`) 
      console.log(data) 
      setCourse(data)
      navigate(0)             
    } catch (error) {
      console.log(error.response)
    }
  }
  
  const handleChangeLessons = async(e)=> {
      setLessonFormValue({...lessonFormValue, [e.target.name]: e.target.value, })
  }
  
  const handleSubmitLessons = async(e)=> {   
    e.preventDefault()
    try {
      const {data} = await  axios.put( URL + `course/${courseSlug}/${sectionId}/${lesson?.id}/delete`, lessonFormValue)
      setIsEditLesson(false)
      setCourse(data)
      
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleUploadVideo = async(e)=> {
    let file = e.target.files[0]  
    console.log(file)
      try {
        let formData = new FormData()
        formData.append("video", file)
        fetch( URL + `course/${courseSlug}/${sectionId}/${lesson?._id}/upload`, {
          method: "POST", 
          body: formData,
        })
      .then((res)=>res.json())
        .then((payload)=> {       
          console.log(payload) 
          setCourse(payload)        
        })
      console.log(lesson)
      } catch (err){
        console.log(err)
      }
  }

  const handleDeleteVideo = async() =>{
    try {
      const {data} = await axios.put( URL + `course/${courseSlug}/${sectionId}/${lesson._id}/removeLessonVideo`, lesson) 
      
      setCourse(data)
      navigate(0)             
    } catch (error) {
      console.log(error.response)
    }
  }
 
  return(
    <>
    <div key={index} className='flex my-2 '>                        
    { isEditLesson ? 
      (
      <div className='flex flex-col'>
        <h2 className='p-1 px-3 font-semibold'>{`Lecture ${sectionIndex+1}.${index+1}: ${lesson.title}`}</h2>
        <form>
          <div className='ml-6 flex flex-col'>
            <label> Lesson Title: 
              <input onChange={(e)=>{handleChangeLessons(e)}} defaultValue={lesson.title} name='title' className='m-1 p-1 rounded-md w-[50%] border-2 border-gray-300' type='text' placeholder='Lesson Title'></input>
            </label>
            <label> Available for Free Preview: 
              <div className='flex'>
                <input defaultChecked={lesson.freePreview} onChange={(e)=>{handleChangeLessons(e)}} name='freePreview' value={true} className='m-1 p-1 rounded-md border-2 border-gray-300' type='radio'></input>
                <div>Yes</div>
                <input defaultChecked={!lesson.freePreview} onChange={(e)=>{handleChangeLessons(e)}} name='freePreview' value={false} className='m-1 p-1 rounded-md border-2 border-gray-300' type='radio'></input>
                <div>No</div>
              </div>
            </label>
            <div className='flex justify-center'>
              <button onClick={()=>setIsEditLesson(false)} className=' p-2 rounded-xl border-2 border-gray-600 bg-gray-300'>Cancel</button>
              <button onClick={(e)=>handleSubmitLessons(e)}className=' p-2 rounded-xl border-2 border-blue-600 text-white bg-blue-500'>Submit</button>
            </div>
          </div>
        </form>
      </div>
    ):(
    <div className='flex items-center '>                    
      <h2 className='p-1 px-3 font-semibold'>{`Lecture ${sectionIndex+1}.${index+1}: ${lesson.title}`}</h2>
      { lesson?.video?.length === 0 ? 
        (
        <label className='ml-10
          text-sm bg-blue-500 text-white p-1'>Upload Video
          <input type="file"
            id="video" name="video"
            accept="audio/*,  video/*, gif/*"
            onChange={(e)=>handleUploadVideo(e)}  
            hidden
          >
          </input>  
        </label>
        ):(
        <>
          <div className='flex gap-6'>
            <div onClick={()=>setIsViewVideo(true)} className="cursor-pointer flex flex-col justify-center p-1">          
              <div className="p-1 text-center text-white text-sm font-semibold bg-black">View Video</div>
            </div>
            <div className='relative flex flex-col top-[-15px] group items-center'>
              <div className='relative text-sm bg-gray-800 text-gray-200 px-1 rounded-lg invisible group-hover:visible'>Delete Video</div>
              <button onClick={(e)=>handleDeleteVideo(e)} className='pl-5'><DeleteIcon fontSize='medium' className='bg-gray-800 relative left-[-20px] text-gray-300 hover:scale-[125%]' /></button>
            </div>
            
          </div>
        { isViewVideo && (
          <LessonVideo 
            isShowing={isViewVideo}
            onClose={closeVideo}
            lesson = {lesson}
          />
        )}
        </>
      )}
      <button className='group relative top-[-15px] pl-16'>
      <div className=' invisible  group-hover:visible rounded-lg font-semibold px-1 text-sm'> Edit Lesson </div>
        <EditIcon onClick={()=>setIsEditLesson(true)} fontSize='' className='hover:scale-[125%]'/></button> 
      <button onClick={(e)=>deleteLesson(e)} className='pl-5 top-[-15px] group relative'>
        <div className='bg-red-400 invisible group-hover:visible rounded-lg font-semibold px-1 text-sm'>Delete Lesson</div>
        <DeleteIcon  fontSize='medium' className='bg-red-400  hover:scale-[125%]' /></button> 
      </div>
    )}
    </div>
  </>
  )
  
}
const Accordions= ({id, setCourse, courseSlug, subCourse, lessons, sectionId }) =>{
  const [isEditSection, setIsEditSection] = useState(false)  
  const [sectionForm, setSectionForm]=useState({id: sectionId, title:'', lessons:[]}) 
  const navigate = useNavigate()
  
  const [addLesson, setAddLesson]= useState(false)
  const [lessonFormValue, setLessonFormValue] = useState({title:'', freePreview:false})

  const handleChangeLessons = (e) => {
    setLessonFormValue({...lessonFormValue, [e.target.name]: e.target.value, })
  }
  const handleSubmitLessons = async(e)=> {
    e.preventDefault()
    try {
      const {data} = await axios.post(URL + `course/${courseSlug}/${sectionId}/addLesson`, lessonFormValue)
      setAddLesson(false)
      setCourse(data)
      console.log(data)
    } catch (error) {
      console.log(error.response)
    }
  }
  const submitSectionTitle = async(e)=> {
    e.preventDefault()
    try {
      const {data} = await axios.put(URL + `course/${courseSlug}/updateSection`, sectionForm) 
      setIsEditSection(false) 
      setCourse(data)       
    } catch (error) {
      console.log(error.response)
    }
  } 
  const deleteSection= async(e)=> {
    e.preventDefault()
    // if (lessons.length !== 0) {alert("Please Empty your lessons in this section first !")}
    try {
      const {data} = await axios.put(URL + `course/${courseSlug}/${sectionId}/remove`) 
      console.log(data) 
      setCourse(data)
      navigate(0)             
    } catch (error) {
      console.log(error.response)
    }
  }
  return (
    <Accordion key={id} className=' border-b-1 border-b-gray-400' >
      <AccordionSummary 
        key={id}
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${id}-content`}
        id={`panel-${id}-header`}
      > 
          <div key={id} className='flex p-1 py-0 text-sm justify-between'>
            {!isEditSection? (
              <div className='flex w-full items-center'>
                <h2 className='font-bold pr-4'>Section {id + 1} : {subCourse}</h2>
                <div className='pl-16'><EditIcon onClick={()=>setIsEditSection(true)} fontSize='' className='hover:scale-[125%]'/></div>                
              </div>              
            ) :(
              <div className="flex items-center">
                <textarea autoFocus type='text' defaultValue={subCourse} onChange={(e)=>setSectionForm({ ...sectionForm, title: e.target.value})} className="w-[380px] h-[55px] px-2 border-2 border-gray-300" placeholder='Course Section'></textarea>
                <CheckIcon onClick={(e)=>submitSectionTitle(e)} className='m-2 bg-green-500 hover:scale-[110%]'/>
                <CloseIcon onClick={()=>{setSectionForm({...sectionForm, title:''}) ;setIsEditSection(false)}} className='bg-red-500 hover:scale-[110%]' />
                <div onClick={(e)=>deleteSection(e)} className='pl-5'><DeleteIcon fontSize='medium' className='bg-red-400 hover:scale-[125%]' /></div>
              </div>
            )}                       
          </div>
      </AccordionSummary>
      <AccordionDetails>
        { 
          addLesson ? (
            <div className='flex flex-col'>
              <form>
                <div className='flex flex-col'>
                  <label> Lesson Title: 
                    <input onChange={(e)=>{handleChangeLessons(e)}} name='title' className='m-1 p-1 rounded-md w-[50%] border-2 border-gray-300' type='text' placeholder='Lesson Title'></input>
                  </label>
                  <label> Available for Free Preview: 
                    <div className='flex'>
                      <input onChange={(e)=>{handleChangeLessons(e)}} name='freePreview' value={true} className='m-1 p-1 rounded-md border-2 border-gray-300' type='radio'></input>
                      <div>Yes</div>
                      <input defaultChecked onChange={(e)=>{handleChangeLessons(e)}} name='freePreview' value={false} className='m-1 p-1 rounded-md border-2 border-gray-300' type='radio'></input>
                      <div>No</div>
                    </div>
                  </label>
                  <div className='flex justify-center'>
                    <button onClick={()=>setAddLesson(false)} className=' p-2 rounded-xl border-2 border-gray-600 bg-gray-300'>Cancel</button>
                    <button onClick={(e)=>handleSubmitLessons(e)}className=' p-2 rounded-xl border-2 border-blue-600 text-white bg-blue-500'>Submit</button>
                  </div>
                </div>       
              </form>
            </div>
          ) : (
          <>
            <div className='p-1 items-center flex'>
            <div><AddBoxIcon  className='cursor-pointer' onClick={()=>setAddLesson(true)} color='primary'  /> </div>
              <h2 className='font-semibold'>Add a Lesson</h2>
            </div>            
            <div>              
              {lessons?.map((lesson, index)=>{
                return(
               <EditLesson
                index={index}
                lesson={lesson}                
                courseSlug = {courseSlug}
                sectionId = {sectionId}
                setCourse={setCourse}
                sectionIndex={id}
               />               
            )})}  
            </div>
          </>
          )         
        }        
      </AccordionDetails>
    </Accordion>
  )
}

const CourseDescription =({course, setCourse, handleChange})=> {
  const [isShowPreview, setIsShowPreview] = useState(false)
  const [isEditPreview, setIsEditPreview] = useState(false)
  
  //Handling the Video Form  
  const handleVideoChange = async(e)=>{
    let file = e.target.files[0]
    setCourse({...course, loading: true})  
      try {
        let formData = new FormData()
        formData.append("previewVideo", file)
        formData.append("slug", course?.slug)
        fetch(URL + "course/upload-video", {
          method: "POST", 
          body: formData,
        })
      .then((res)=>res.json())
      .then((payload)=> {        
        setCourse({ ...course, previewVideo: payload.url, loading: false})        
      })
      } catch (err){
        console.log(err)
        setCourse({...course, loading: false})
      }
  }   
  
  const handleRemoveVideo= async(e)=>{
    e.preventDefault()
    try {
      setCourse({ ...course, loading: true })
      const res = await axios.post(URL + "course/remove-video", { ...course, previewVideo: course.previewVideo}) 
      setCourse({...course, loading:false, previewVideo:''})
    } catch (error) {
      setCourse({ ...course, loading: false });
      console.log("Video remove failed. Try later.")
    }
  }
  return (
    <>
    <div className="flex flex-col p-2 w-full">
      <div className='flex justify-between'>
        <div className='flex self-start flex-col'>
          <h1 className='font-bold text-lg'>{course?.title}</h1>
          <div className="">
            <p className=''>{course?.desc}</p>
            <h2 className='pt-2 font-bold'>Course Outlines:</h2>
            {course?.outlines?.map((outline, index)=>(
              <div key={index}>* {outline}</div>
            ))}     
          </div>  
        </div>
        { course.previewVideo !== '' ? (
        <div className="flex flex-col">
          {isEditPreview? 
          (
            <div className='flex justify-between'>
              <button className='bg-red-300' onClick={()=>setIsEditPreview(false)}> <CloseIcon /> </button> 
              <button onClick={(e)=>handleRemoveVideo(e)}><DeleteIcon className='hover:bg-gray-300'/></button>
            </div>
          )
          :(
          <div className="">
            <button onClick={()=>setIsEditPreview(true)} className=''><EditIcon className=' p-1' /> </button>  
          </div>
          )}
          <div onClick={()=>setIsShowPreview(true)} className="relative cursor-pointer bg-black flex flex-col items-center p-2">
            <div className='text-gray-600 hover:scale-[130%] text-[60px] absolute top-[25%]'>
              <SmartDisplayIcon fontSize="inherit"/>
            </div>
            <img src={course?.image} className='max-w-[200px] ' />
            <div className="text-white font-semibold">Preview Video</div>
          </div>
        </div>
      ): (
        <>
          <div className="flex flex-col">
            <h1 className='font-bold p-2'>Course Preview: </h1>
            <div className="pt-2 pl-3">
              <label className='bg-blue-500 text-center text-white cursor-pointer p-1'> Upload Video
                <input type="file"
                  id="previewVideo" name="previewVideo"
                  accept="audio/*,  video/*, gif/*"
                  onChange={(e)=>handleVideoChange(e)}  
                  hidden
                >
                </input>
            </label>
            </div>          
        </div>
        </>
      )
    }      
    </div>
  </div>
    {isShowPreview && (
      <div className='z-50'>
      <PreviewModal 
        isShowing = {isShowPreview}
        onClose ={()=> setIsShowPreview(false)}
        currentCourse = {course}
      />
      </div>      
      )}
    </>
  )
}

const AddLessons = () => {
  const [showModal, setShowModal] = useState(true)
  const modalRef = useRef()
  const [course, setCourse ] = useState(null)
  const [addSection, setAddSection] = useState(false)
  const [subCourseData, setSubCourseData]= useState({})
  const [isValid, setIsValid]=useState(false)

  const navigate = useNavigate()
  const params = useParams()

  const fetchCourse = async() => {
    axios.get(URL + `course/${params.slug}`)
    .then ((res)=> {      
      setCourse(res.data)    
    })
  }
  

  const onClose = () => {
    navigate(`/lecturer`)
    setShowModal(false)
  }

  const handleChangeSubcourse =(e)=>{
    setSubCourseData({ ...subCourseData, title: e.target.value})
    setIsValid(e.target.value !== '')
  }

  const handleSubmitSubcourse = async(e) =>{
    e.preventDefault()
    try {
      const {data} = await axios.post(URL + `course/${params.slug}/addSection`, subCourseData)
      console.log(data)
      setCourse(data)
      setAddSection(false)        
    } catch (error) {
      console.log(error.response)
    }
  }

  // const handleAddSection = () => {
  //   setAddSection(false)
  //   setCourse({...course, outlines: [...data.outlines , outlineFormValue]})
  // }
  // const handleUpdateSection = (index) => {
  //   closeOutlineUpdate(index)
  //   const newData = {...data}
  //   newData.outlines[index]= outlineFormValue
  //   setData(newData)
    
  // }
  
  useEffect (()=> {
    fetchCourse()
  }, [params, ])

  useEffect(()=> {
    let handler = (e)=>{
      if (!modalRef.current.contains(e.target)){
        onClose()
      }
    }
    document.addEventListener("mousedown", handler)
    return() => {
      document.removeEventListener("mousedown", handler)
    } 
    }, [showModal, onClose] )

  return (
  <>
  <Sidebar />
    { showModal && 
    <div className='z-50 bg-gray-900 bg-opacity-60 fixed w-full h-full top-0 left-0'>
      <div ref={modalRef} className='fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95%] h-full min-h-[410px] bg-white color-white rounded-xl'> 
        <div className=' overflow-auto w-full h-full flex flex-col '>
            <div className="flex">
              <button className='fixed p-1 top-0 right-0' onClick={onClose}>&nbsp; X &nbsp;</button>
              <div className="p-2 flex flex-col w-full ">
                <h1 className='font-bold text-xl'>Edit Course Content</h1>
                { course  &&
                <CourseDescription 
                  course = {course}
                  setCourse = {setCourse}
                />
                }
              </div>
            </div>
                                         
          <div className='p-2 flex flex-col'>
            <h1 className='font-bold'>Course Contents</h1>
            <div className='p-1 items-center flex'>
              <AddBoxIcon className='cursor-pointer' onClick={()=>setAddSection(true)} color='primary' fontSize='large' />
              <h2 className='font-semibold'>Add a Course Section</h2>
            </div>
            {addSection &&
              <div className="flex items-center">
                <textarea type='text' onChange={handleChangeSubcourse} className="w-[380px] h-[55px] px-2 border-2 border-gray-300" placeholder='Course Section'></textarea>
                <CheckIcon onClick={(e)=>handleSubmitSubcourse(e)} className='m-2 bg-green-500'/>
                <CloseIcon onClick={()=> setAddSection(false)} className='bg-red-500' />
              </div>}  
              { course?.contents?.map((subCourse, id)=>{
              return(
               <Accordions id={id} setCourse={setCourse} key={id} courseSlug={params.slug} handleChange={handleChangeSubcourse} subCourse={subCourse.title} sectionId={subCourse._id} lessons={subCourse.lessons} />
            )})}
          </div>
        </div>
        
      </div>
    </div>
    }
  </>
  
  )}
    
  

export default AddLessons