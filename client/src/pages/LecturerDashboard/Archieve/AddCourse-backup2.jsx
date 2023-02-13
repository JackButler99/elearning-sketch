import React, {useState, useEffect} from 'react'
import Layout from '../../components/layout/Layout'
import Select from 'react-select'
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import { useParams } from 'react-router-dom'

import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { toast } from 'react-toastify'

import {Accordions} from './Accordions'
import CourseCreateForm from './Archieve/CourseCreateForm'

axios.defaults.headers.common = {
  "Content-Type": "application/json"
}

var formData = {
  title: '',
  desc:'',
  outlines:[],
  target: [],
  image: '',
  previewVideo:'',
  price:0,
  authors:[],
  contents:[{'title':'', 'subCourses': []}],
  loading: false
}
const targetStudent = [
  {value: "Professional", label:"Professional"},
  {value: "Entrepreneur", label:"Entrepreneur"},
  {value: "Academic Student", label:"Academic Student"},
  {value: "Marketer", label:"Marketer"},
  {value: "Project Manager", label:"Project Manager"},
] 

const AddCourse2 = () => {
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image")

  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const [values, setValues]= useState(formData)
  
  const handleChange =(e)=>{
    setValues({ ...values, [e.target.name]: e.target.value})
  }

  const handleImage= async (e)=> {
    let file = e.target.files[0]
    console.log("file", file)
    setValues({...values, loading: true})
    // Resize
      try {
        let formData = new FormData()
        formData.append("image", file)
        fetch("http://localhost:5005/api/course/upload-image", {
          method: "POST", 
          body: formData,
        })
      .then((res)=>res.json())
      .then((data)=> {        
        setValues({ ...values, image: data.url, loading: false})
      })
      } catch (err){
        console.log(err)
        setValues({...values, loading: false})
        toast("Image upload failed. Please Try Again.")
      }
  }
  
  const handleImageRemove = async () => {
    try {
      setValues({ ...values, loading: true })
      const res = await axios.post("http://localhost:5005/api/course/remove-image", { image: values.image})
      setUploadButtonText("Upload Image")
      setValues({ ...values, image:'', loading: false })
    } catch (error) {
      setValues({ ...values, loading: false });
      toast("Image remove failed. Try later.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post("http://localhost:5005/api/course/createCourse", values)
      console.log(data)
      return (<h1> Course Added, You can start adding lessons </h1>)
    } catch (error) {
      console.log(error.response.data)
    }
  }
  
  return (
    <>
    <h1 className="jumbotron text-center square">Create Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
    </>
  )

}


const AddCourse = ({isShowing, onClose}) => {
  const [data, setData ] = useState(formData)
  
  
  console.log(data)

  // Handling the Outline Form
  const [addOutline, setAddOutline] = useState(false)
  const [outlineFormValue, setOutlineFormValue] = useState('')
  const [updateOutline, setUpdateOutline]=useState([])
   
  useEffect(()=>{
    const test= new Array(data?.outlines.length).fill(false)
    setUpdateOutline(test)
  }, [data])
  
  const handleChangeOutline =(e)=>{
    e.preventDefault()
    setOutlineFormValue(e.target.value)
  }
  const handleAddOutline = () => {
    setAddOutline(false)
    setData({...data, outlines: [...data.outlines , outlineFormValue]})
    
  }
  const handleUpdateOutline = (index) => {
    closeOutlineUpdate(index)
    const newData = {...data}
    newData.outlines[index]= outlineFormValue
    setData(newData)
    
  } 
  const openOutlineUpdate = (index) => {
    const newState = [...updateOutline]
    newState[index] = true
    setUpdateOutline(newState)
  };
  const closeOutlineUpdate = (index) => {
    const newState = [...updateOutline]
    newState[index] = false
    setUpdateOutline(newState)
  };
  
  //Handling the Video Form
  const [videoFormValue, setVideoFormValue]= useState('')
  const defaultVideoOptions = {
    autoplay: false,
    controls: true,   
    sources: [{
      src: null,
      type: 'video/mp4'
    }]
    }
  
  
  const [videoOptions, setVideoOptions] = useState(defaultVideoOptions)
  
  const handleVideoChange = async(e)=>{
    setVideoFormValue(URL.createObjectURL(e.target.files[0]))
    setData({...data, previewVideo: URL.createObjectURL(e.target.files[0])})
  } 
  
  useEffect(()=>{
    const newSrc = {...videoOptions}
    newSrc.sources[0].src = videoFormValue
    setVideoOptions(newSrc)
    
  }, [videoFormValue])

  const handleRemoveVideo=(e)=>{
    e.preventDefault()
    setVideoFormValue(null)
    
  }
  

  
  //Handling the Price Form
  const priceChange = (event)=>{
    setData({...data, price: event.target.value})
  }


  //Handling the Authors Form
   const [addAuthor, setAddAuthor] = useState(false)
   const [authorFormValue, setAuthorFormValue] = useState('')
   const [updateAuthor, setUpdateAuthor]=useState([])
    
   useEffect(()=>{
     const test= new Array(data?.authors.length).fill(false)
     setUpdateAuthor(test)
   }, [data])
   
   const handleChangeAuthor =(e)=>{
     e.preventDefault()
     setAuthorFormValue(e.target.value)
   }
   const handleAddAuthor = () => {
     setAddAuthor(false)
     setData({...data, authors: [...data.authors , authorFormValue]})
     
   }
   const handleUpdateAuthor = (index) => {
     closeAuthorUpdate(index)
     const newData = {...data}
     newData.authors[index]= authorFormValue
     setData(newData)
     
   } 
   const openAuthorUpdate = (index) => {
     const newState = [...updateAuthor]
     newState[index] = true
     setUpdateAuthor(newState)
   }
   const closeAuthorUpdate = (index) => {
    const newState = [...updateAuthor]
    newState[index] = false
    setUpdateAuthor(newState)
   }

  

  // Handle Lessons Form
  const [addLesson, setAddLesson] = useState(false)
  const [lessonFormValue, setLessonFormValue] = useState('')
  const [updateLesson, setUpdateLesson]=useState([])

  useEffect(()=>{
    const test= new Array(data?.contents.length).fill(false)
    setUpdateLesson(test)
  }, [data])

  const handleChangeLesson =(e)=>{
    e.preventDefault()
    setLessonFormValue(e.target.value)
  }
  const handleAddLesson = () => {  
    setAddLesson(false)
    setData({...data, contents: [...data.contents,{...data.contents.title , title: lessonFormValue}]})
    
  }

  const handleUpdateLesson = (index) => {
    closeLessonUpdate(index)
    const newData = {...data}
    newData.contents[index].title= lessonFormValue
    setData(newData)
    
  }
  const openLessonUpdate = (index) => {
    const newState = [...updateLesson]
    newState[index] = true
    setUpdateLesson(newState)
  };

  const closeLessonUpdate = (index) => {
    const newState = [...updateLesson]
    newState[index] = false
    setUpdateLesson(newState)
  };
  
  const handleDeleteLesson = (index)=>{
    setData({...data, contents: data?.contents.filter((cont=> cont.title!== data?.contents[index].title))})
  }

/// Adding subLesson Form
const [addSubLesson, setAddSubLesson] = useState(false)
const [subCourseFormValue, setSubCourseFormValue] = useState('')
// const [updateLesson, setUpdateLesson]=useState([])

  const handleAddSubCourse = (id) => {      
    let newData = {...data}
    const section =[...data.contents]
    section[id] = {...section[id], subCourses:[...section[id].subCourses, {title: subCourseFormValue}]}
    //                [...data.contents,{...data.contents.title , title: lessonFormValue}]})
    newData = {...data, contents: section}
    console.log('section', section)
    setData(newData)  
  }

  const handleChangeSubCourse =(e)=>{
    e.preventDefault()
    setSubCourseFormValue(e.target.value)
    console.log(e.target.value)
  }  
  console.log('Form Value', subCourseFormValue)
  return (
  <>
    <div className='flex flex-col'>
      <div className="flex justify-between ">
        <div className='text-xl font-bold p-4'>Create a Course</div>
        <button onClick={onClose} className='p-5'>X</button>
      </div>
      
      <form className='pl-4 font-semibold'>
        <h3>Course Name:</h3>
        <input type='text' className="w-[450px] h-[40px] px-2 border-2 border-gray-300" placeholder='Course Title'></input>
        
        <h3>Course Description:</h3>
        <textarea className="w-[450px] h-[80px] px-2 border-2 border-gray-300" placeholder='Course Description'></textarea>
        
        <h3>Course Outlines:</h3>
        <div className=" py-2">          
          {
            data?.outlines.map((outline, id)=>{          
              return(
              <div key={id} className='flex p-1 py-0 text-sm justify-between'>
                {updateOutline[id] === true ? (
                  <div className="flex items-center">
                    <textarea type='text' onChange={handleChangeOutline} defaultValue={outline} className="w-[300px] h-[55px] px-2 border-2 border-gray-300" placeholder='Course Outlines'></textarea>
                    <CheckIcon onClick={()=>handleUpdateOutline(id)} className='m-2 bg-green-500'/>
                    <CloseIcon onClick={()=> closeOutlineUpdate(id)} className='bg-red-500' />
                  </div>        
                ) : <div>{outline}</div> }
                
                <div>   
                  <EditIcon key={id} className='cursor-pointer ml-2' fontSize='inherit'
                    onClick={()=>openOutlineUpdate(id)}  
                  />
                  <DeleteIcon onClick={()=>setData({ ...data, outlines: data?.outlines.filter((ot=> ot!== outline))})} className='cursor-pointer ml-2' fontSize='inherit'/>
                </div>
              </div>
          )})}
          <div className="flex items-center">
            <AddBoxIcon className='cursor-pointer' onClick={()=>setAddOutline(true)} color='primary' fontSize='large' />
            <div className="p-2">Add an Outline</div>
          </div>
        </div>
          
          {addOutline &&
          <div className="flex items-center">
            <textarea type='text' onChange={handleChangeOutline} className="w-[380px] h-[55px] px-2 border-2 border-gray-300" placeholder='Course Outlines'></textarea>
            <CheckIcon onClick={handleAddOutline} className='m-2 bg-green-500'/>
            <CloseIcon onClick={()=> setAddOutline(false)} className='bg-red-500' />
        </div>}  
          
        
        <h3>Target Student:</h3>
        <Select isMulti options={targetStudent} className="w-[450px] h-[40px]  " placeholder='Target Student'/>
        
        <h3>Cover Image:</h3>
          <input type="file"
            id="avatar" name="avatar"
            accept="image/*, gif/*"
            onChange={(e)=>setData({...data, image: URL.createObjectURL(e.target.files[0])}) }  
          >
          </input>
          <Badge count="X" onClick={handleImageRemove} className="pointer">
            <img style={{width:'60px', }} src={values.image} />
          </Badge>

        <h3>Preview Video:</h3>
        {!videoOptions.sources[0].src &&
          <input type="file"
            id="previewVideo" name="previewVideo"
            accept="audio/*, image/*, video/*, gif/*"
            onChange={(e)=>handleVideoChange(e)}  
          >
          </input>
        }
        { videoOptions.sources[0].src &&
          <>
          <button className='p-1 mb-2 border-black border-2 bg-red-400' onClick={(e)=>handleRemoveVideo(e)}><DeleteIcon/></button>
          <VideoPlayer id="previewPlayer" options={videoOptions} />
          </>
        }
        <h3>Price:</h3>
        <div onChange= {(e)=>priceChange(e)}>
          <div>
            <input type='radio' name='prices' value='free' className="border-2 border-gray-300" />Free
          </div>
          <div className='flex items-center'>
            <input type='radio' name='price' value='paid' className="border-2 border-gray-300" />Paid
            {data.price !== 0 && 
            <input type='number' className="ml-[20px] w-[300px] h-[40px] px-2 border-2 border-gray-300" placeholder='Price' onChange={(e)=>setData({...data, price: e.target.value})}></input>
            }
            
            </div>
        </div>
        <h3>Authors:</h3>
        <div className=" py-2">          
          {
            data?.authors.map((author, id)=>{          
              return(
              <div key={id} className='flex p-1 py-0 text-sm justify-between'>
                {updateAuthor[id] === true ? (
                  <div className="flex items-center">
                    <textarea type='text' onChange={handleChangeAuthor} defaultValue={author} className="w-[300px] h-[55px] px-2 border-2 border-gray-300" placeholder='Course Outlines'></textarea>
                    <CheckIcon onClick={()=>handleUpdateAuthor(id)} className='m-2 bg-green-500'/>
                    <CloseIcon onClick={()=> closeAuthorUpdate(id)} className='bg-red-500' />
                  </div>        
                ) : <div>{author}</div> }
                
                <div>   
                  <EditIcon key={id} className='cursor-pointer ml-2' fontSize='inherit'
                    onClick={()=>openAuthorUpdate(id)}  
                  />
                  <DeleteIcon onClick={()=>setData({...data, authors: data.authors.filter((aut=> aut!== author))})} className='cursor-pointer ml-2' fontSize='inherit'/>
                </div>
              </div>
          )})}
          <div className="flex items-center">
            <AddBoxIcon className='cursor-pointer' onClick={()=>setAddAuthor(true)} color='primary' fontSize='large' />
            <div className="p-2">Add an Author</div>          
          </div>
        </div>
       
        {addAuthor &&
          <div className="flex items-center">
            <textarea type='text' onChange={handleChangeAuthor} className="w-[380px] h-[40px] px-2 border-2 border-gray-300" placeholder='Author'></textarea>
            <CheckIcon onClick={handleAddAuthor} className='m-2 bg-green-500'/>
            <CloseIcon onClick={()=> setAddAuthor(false)} className='bg-red-500' />
        </div>}
       
        <div className='flex'> Lessons: </div>
        {data?.contents.map((content, id)=>{
          return(
          <>
            <Accordions 
              key={id}
              id={id}
              parent= {`${content?.title}`}
              children= {content?.subCourses}          
              handleChangeLesson= {(e)=>handleChangeLesson(e)}
              handleUpdateLesson = {()=>handleUpdateLesson(id)}
              handleDeleteLesson = {()=>handleDeleteLesson(id)}
              openLessonUpdate = {()=> openLessonUpdate(id)}
              closeLessonUpdate= {()=>closeLessonUpdate(id)}
              updateLesson = {updateLesson}
              handleAddsubCourse = {()=>handleAddSubCourse(id)}
              handleChangeSubCourse = {(e)=>handleChangeSubCourse(e)}
            />

            </>
          )
        })}
        <div className="flex items-center">
          <AddBoxIcon className='cursor-pointer' onClick={()=>setAddLesson(true)} color='primary' fontSize='large' />
          <div className="p-2">Add a Lesson Section</div>          
        </div>
        {addLesson &&
          <div className="flex items-center">
            <textarea type='text' onChange={handleChangeLesson} className="w-[380px] h-[40px] px-2 border-2 border-gray-300" placeholder='Add A Lesson Section'></textarea>
            <CheckIcon onClick={handleAddLesson} className='m-2 bg-green-500'/>
            <CloseIcon onClick={()=> setAddLesson(false)} className='bg-red-500' />
        </div>}

        <div>
          <button >Save Course</button>
          <button >Publish Course</button>
        </div>
        <div> This is Danger Section
          <button>Delete Course</button>
        </div>
      </form>
    </div>
  </>
  )
}

export default AddCourse2