import React, {useState, useEffect} from 'react'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'


export const Accordions = ({id, parent, children, updateLesson, handleUpdateLesson, handleChangeLesson, closeLessonUpdate, openLessonUpdate, handleDeleteLesson, handleAddsubCourse, handleChangeSubCourse, data, setData}) => {
  const [expanded, setExpanded] = useState(false);

  const [addSubCourse, setAddSubCourse]= useState(false)
  
  const handleAddTitle = () => {
    setAddSubCourse(false)
    handleAddsubCourse()
  } 

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)  
  }

  const handleClick = () => {
    
  }

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

  return (
    <Accordion className=' border-b-1 border-b-gray-400' expanded={expanded === id} onChange={handleChange(id)}>   
      <AccordionSummary
        key={id}
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${id}-content`}
        id={`panel-${id}-content`}
      >
        <div key={id} className='flex p-1 py-0 text-sm justify-between'>
          {updateLesson[id] === true ? (
            <div className="flex items-center">
              <textarea type='text' onChange={handleChangeLesson} defaultValue={parent} className="w-[300px] h-[55px] px-2 border-2 border-gray-300" placeholder='Lesson Section'></textarea>
              <CheckIcon onClick={()=>handleUpdateLesson(id)} className='m-2 bg-green-500'/>
              <CloseIcon onClick={()=>closeLessonUpdate(id)} className='bg-red-500' />
            </div>        
          ) : <div>{parent}</div> }
          
        <div>   
          <EditIcon key={id} className='cursor-pointer ml-2 hover:scale-125' fontSize='inherit'
            onClick={()=>openLessonUpdate(id)}  
          />
          <DeleteIcon onClick={handleDeleteLesson} className='cursor-pointer hover:scale-125 ml-2' fontSize='inherit'/>
        </div>
      </div>
      </AccordionSummary>
      <div className="flex items-center">
        <AddBoxIcon className='cursor-pointer' onClick={()=>setAddSubCourse(true)} color='primary' fontSize='large' />
        <div className="p-2">Add a SubLesson </div>          
      </div>
      {addSubCourse &&
        <div className="flex flex-col">
          <div className="flex items-center">
            <textarea type='text' onChange={handleChangeSubCourse} className="w-[380px] h-[40px] px-2 border-2 border-gray-300" placeholder='Sub Lesson Title'></textarea>
            <CheckIcon onClick={handleAddTitle} className='m-2 bg-green-500'/>
            <CloseIcon onClick={()=> setAddSubCourse(false)} className='bg-red-500' />
          </div>
          <h3>Video:</h3>
          {!videoOptions.sources[0].src &&
            <input type="file"
              id="avatar" name="avatar"
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
      </div>}      
      {children?.map((child, index)=> {
        return(
          <div key={index} onClick= {()=> handleClick(child)} className="cursor-pointer ml-3 text-sm hover:bg-gray-300">
            <AccordionDetails >          
            {child.title}
            </AccordionDetails>
            <AccordionDetails >          
            Sometext here 
            </AccordionDetails>
          </div>
          
        )  
      })}
      
    </Accordion>
  )
}


export default Accordions