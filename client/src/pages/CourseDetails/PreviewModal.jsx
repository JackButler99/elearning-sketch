import React, { useState, useRef, useEffect } from 'react'
import {Link} from "react-router-dom"

import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import { courses } from '../Courses/courses_list'


const PreviewModal = ({isShowing, onClose, currentCourse}) => {
  const modalRef = useRef() 
  
  

  const defaultOption = {
    autoplay: false,
    controls: true,
    poster: currentCourse?.image,   
    sources: [{
      src: currentCourse?.previewVideo,
      type: 'video/mp4'
    }]
  
  }

  console.log(currentCourse.previewVideo)
  console.log(defaultOption)

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
      
    }, [isShowing, onClose] )
  
  if (!isShowing) return null
  return (
  <>
    <div className='z-50 bg-black bg-opacity-80 fixed w-full h-full top-0 left-0'>
      <div ref={modalRef} className=' bg-gradient-to-b from-[#101010] to-[#2F2E2E] via-[#202020] flex flex-col fixed text-gray-200 z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[680px] min-w-[231px] w-[85%]  min-h-[410px] color-white rounded-xl'> 
        <div className=' flex flex-col '> 
          <div className=" p-3 pb-0 font-semibold ml-4 mt-4 text-sm text-gray-300">Course Preview</div>              
          <div className=" p-3 pt-1 pb-0 font-bold ml-4 text-xl ">{currentCourse.title}</div>
          <button className='fixed p-1 top-0 right-0' onClick={onClose}>&nbsp; X &nbsp;</button>
          <div id='video_Player' className='flex bg-black justify-around'>         
            <VideoPlayer options={defaultOption}/> 
          </div>
          
        </div>
      </div>          
    </div>            
    
  </>
  )
    
}

export default PreviewModal