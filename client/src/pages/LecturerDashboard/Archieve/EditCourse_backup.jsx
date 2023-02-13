import React, {useState, useEffect} from 'react'
import LecturerDashboard from './LecturerDashboard'
import Sidebar from './LecturerDashboard'
import Layout from '../../components/layout/Layout'

import axios from 'axios'
import { redirect, useNavigate, useParams } from 'react-router-dom'

import Select from 'react-select'
import { Badge } from 'antd'
import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify'
import MyPlayer from '../../components/VideoPlayer/MyPlayer'

import 'react-toastify/dist/ReactToastify.css'

axios.defaults.headers.common = {
  "Content-Type": "application/json"
}

const targetStudent = [
  {value: "Professional", label:"Professional"},
  {value: "Entrepreneur", label:"Entrepreneur"},
  {value: "Academic Student", label:"Academic Student"},
  {value: "Marketer", label:"Marketer"},
  {value: "Project Manager", label:"Project Manager"},
] 

const EditCourse = () => {
  const params = useParams()
  const navigate = useNavigate()

  const fetchCourse = async() => {
    axios.get(`http://localhost:5005/api/course/${params.slug}`)
    .then ((res)=> {      
      setData(res.data)
      console.log('data:', data)    
    })
  }
  const [data, setData ] = useState({}) 
  const [isPaid, setIsPaid]=useState(false)
  const [courseUpdated, setCourseUpdated] =useState(false)
  const [showVideo, setShowVideo] = useState(false)

  useEffect (()=> {
    fetchCourse()
  }, [params])

  const handleChangeTitle =(e)=>{
    setData({ ...data, title: e.target.value})
    setIsTitleValid(e.target.value !== '')
  }

  const handleChangeDesc =(e)=>{
    setData({ ...data, desc: e.target.value})
    setIsDescValid(e.target.value !== '')
  }

  const submitForm = async (e) => {
    e.preventDefault()
    try {
      const {payload} = await axios.put(`http://localhost:5005/api/course/${params.slug}/edit`, data)
      setCourseUpdated(true)
      onClose()
            
    } catch (error) {
      console.log(error)
    }
  }
  
  console.log(data)

  // Handling the Title and Description Form
  const [isTitleValid, setIsTitleValid]= useState(true)
  const [isDescValid, setIsDescValid]= useState(true)
  
  // Handling the Outline Form
  const [addOutline, setAddOutline] = useState(false)
  const [outlineFormValue, setOutlineFormValue] = useState('')
  const [updateOutline, setUpdateOutline]=useState([])
   
  useEffect(()=>{
    const test= new Array(data?.outlines?.length).fill(false)
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

// Handling Image Form
  const handleImage= async (e)=> {
    let file = e.target.files[0]

    setData({...data, loading: true})  
      try {
        let formData = new FormData()
        formData.append("image", file)
        fetch("http://localhost:5005/api/course/upload-image", {
          method: "POST", 
          body: formData,
        })
      .then((res)=>res.json())
      .then((payload)=> {        
        setData({ ...data, image: payload?.url, loading: false})
      })
      } catch (err){
        console.log(err)
        setData({...data, loading: false})
      }
  }
  
  const handleImageRemove = async () => {
    try {
      setData({ ...data, loading: true })
      const res = await axios.post("http://localhost:5005/api/course/remove-image", { image: data.image, slug: data.slug}) 
      setData({ ...data, image:'', loading: false })
    } catch (error) {
      setData({ ...data, loading: false });
      toast("Image remove failed. Try later.")
    }
  }
  
  //Handling the Video Form  
  const handleVideoChange = async(e)=>{
    let file = e.target.files[0]
    setData({...data, loading: true})  
      try {
        let formData = new FormData()
        formData.append("previewVideo", file)
        fetch("http://localhost:5005/api/course/upload-video", {
          method: "POST", 
          body: formData,
        })
      .then((res)=>res.json())
      .then((payload)=> {        
        setData({ ...data, previewVideo: payload.url, loading: false})        
      })
      } catch (err){
        console.log(err)
        setData({...data, loading: false})
      }
  }   
  
  const handleRemoveVideo= async(e)=>{
    e.preventDefault()
    try {
      setData({ ...data, loading: true })
      const res = await axios.post("http://localhost:5005/api/course/remove-video", { previewVideo: data.previewVideo}) 
      setData({ ...data, previewVideo:'', loading: false })
    } catch (error) {
      setData({ ...data, loading: false });
      toast("Video remove failed. Try later.")
    }
  }
    
  //Handling the Price Form
  

  //Handling the Authors Form
   const [addAuthor, setAddAuthor] = useState(false)
   const [authorFormValue, setAuthorFormValue] = useState('')
   const [updateAuthor, setUpdateAuthor]=useState([])
    

   useEffect(()=>{
     const test= new Array(data?.authors?.length).fill(false)
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

  const onClose = () => {
    navigate(-1)
  }

  return (
  <>
    <div className='flex flex-col'>
      <div className="flex justify-between ">
        <div className='text-xl font-bold p-4'>Create a Course</div>
        <button onClick={onClose} className='p-5'>X</button>
      </div>
      
      <form className='pl-4 font-semibold'>
        <h3>Course Name:</h3>
        <input type='text' defaultValue={data?.title} name='title' onChange={handleChangeTitle} className={`w-[450px] h-[40px] px-2 border-2 ${!isTitleValid? 'border-red-300':'border-green-300'} ` } placeholder='Course Title'></input>
        {!isTitleValid? (
          <div className='text-red-500 text-xs'>
            The Title is Empty
          </div>):<></> 
          }
        <h3>Course Description:</h3>
        <textarea name='desc' defaultValue={data?.desc} onChange={handleChangeDesc} className={`w-[450px] h-[80px] px-2 border-2 border-gray-300 ${!isDescValid? 'border-red-300':'border-green-300'}`} placeholder='Course Description'></textarea>
        {!isDescValid? (
          <div className='text-red-500 text-xs'>
            The Description is Empty
          </div>):<></> 
          }

        <h3>Course Outlines:</h3>
        <div className=" py-2">          
          {
            data?.outlines?.map((outline, id)=>{          
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
        <Select value={data?.target} onChange={(value)=> setData({...data, target:  value})} isMulti options={targetStudent} className="w-[450px] h-[40px]  " placeholder='Target Student'/>
        {/* <Select name='target' onChange={(value)=> console.log(e)} isMulti options={targetStudent} className="w-[450px] h-[40px]  " placeholder='Target Student'/> */}

        <div className="flex flex-col">
          <h3>Course Cover Image:</h3>
            <label className='bg-blue-500 text-center w-[120px] text-white cursor-pointer p-1'> Upload Image
              <input type="file"
                id="image" name="image"
                accept="image/*, gif/*"
                onChange={handleImage}  
                hidden
              >
              </input>
            </label>
            {data?.image !== ''&& 
              <Badge count="X" onClick={handleImageRemove} className="pointer">
                <img style={{width:'140px', }} src={data?.image} />
              </Badge>
            }
        </div>
        <div className="flex flex-col"> 
          <h3>Course Preview Video:</h3>
          {data?.previewVideo === '' &&
            <label className='bg-blue-500 text-center w-[120px] text-white cursor-pointer p-1'> Upload Video
              <input type="file"
                id="previewVideo" name="previewVideo"
                accept="audio/*,  video/*, gif/*"
                onChange={(e)=>handleVideoChange(e)}  
                hidden
              >
              </input>
            </label>
          }
          { data?.previewVideo !=='' &&
            <>
            <div className='flex gap-1'>
              <button className='p-1 mb-2 border-black border-2 bg-red-400 w-[60px]' onClick={(e)=>handleRemoveVideo(e)}><DeleteIcon/></button>
              <button className='p-1 mb-2 border-black border-2 bg-red-400 w-[60px]' onClick={(e)=> {e.preventDefault(); setShowVideo(!showVideo)}}> {showVideo? "Hide Video": "Show Video"  }</button>
            </div>  
            { showVideo && (  
              <MyPlayer source={data?.previewVideo}/>
              )
            }
            </>
          }
        </div>
        <h3>Price:</h3>
        <div >
          <div>
            <input checked={!isPaid} onChange={()=>{setIsPaid(false); setData({...data, price: Number(0) })}}  type='radio' name='price' value='free' className="border-2 border-gray-300" />Free
          </div>
          <div className='flex items-center'>
            <input onChange={()=> setIsPaid(true)} type='radio' name='price' value='paid' className="border-2 border-gray-300" />Paid
            {isPaid && 
            <input type='number' className="ml-[20px] w-[300px] h-[40px] px-2 border-2 border-gray-300" placeholder='Price' onChange={(e)=>setData({...data, price: Number(e.target.value)})}></input>
            }
            
            </div>
        </div>
        <h3>Authors:</h3>
        <div className=" py-2">          
          {
            data?.authors?.map((author, id)=>{          
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
        
        <button type='submit' disabled={!isDescValid || !isTitleValid || addAuthor || addOutline} onClick={submitForm} className={`text-white  ${!isDescValid || !isTitleValid || addAuthor || addOutline ? 'bg-blue-300' :'bg-[#0056d2]'}  p-2 mt-3 `} >Save Course</button>          
        
      </form>
    </div>
  </>
  )
}


export default EditCourse