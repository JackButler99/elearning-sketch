import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import Layout from '../../components/layout/Layout'
import { CourseContent } from '../Learning/Learning'
import PreviewModal from './PreviewModal'

import Rating from '@mui/material/Rating'
import CheckIcon from '@mui/icons-material/Check'
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'

const CourseDetails = () => {
  const {slug} = useParams()
  const navigate = useNavigate()
  const [isShowPreview, setIsShowPreview] = useState(false)
  const [currentCourse, setCurrentCourse]= useState({})
  
  const URL = "http://localhost:8080/api/"
  // const URL = "https://elearning-back-test.as.r.appspot.com/api/"
  // const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"

  const fetchCourse = async() => {
    axios.get( URL + `course/${slug}`)
    .then ((res)=> {
      setCurrentCourse(res.data)
    })
  } 
  useEffect (()=> {
      fetchCourse()
    }, [slug])
  return (
    <Layout>
      <div className='flex justify-around p-4 bg-gradient-to-r from-[#534666] to-[#cd7672] w-full h-[65%] text-white'>
        <div className='w-[65%] lg:w-[50%]'>  
          <h1 className='mt-3 font-semibold text-2xl'>{currentCourse?.title}</h1>
          <h2 className='px-4 py-2 '>{currentCourse?.briefDesc}</h2>
          <div className="flex ">
            { currentCourse?.tags?.map((tg, id)=>(
              <div key={id} className='ml-5 px-3 border-2 border-white'>{tg}</div>
              ))
            }
          </div>
          <div className='flex ml-2 py-2 p-4 text-sm'>
            <p className='pr-2 text-white font-bold'>{currentCourse?.rating}</p>
            <Rating size='small' readOnly value={currentCourse?.rating ? Number(currentCourse?.rating) : 0 } precision={0.5}  />
            <p>({currentCourse?.reviewer?.length !== 0? currentCourse?.reviewer?.length : 'No Reviewer' })</p>
            <div className='ml-5 font-semibold'>{`Enrolled By: ${currentCourse?.enrolledBy?.length} students`}</div>
          </div>
          <div className='flex font-semibold'>Author(s):
            {currentCourse?.authors?.map((author,id)=> (
              <div className='ml-2 font-normal hover:underline cursor-pointer' key={id}>{author},</div>
            ))}
          </div>
          <div className='flex font-semibold'>Last Updated:
              <div className='ml-2 font-normal '>{currentCourse?.updatedAt?.split('T')[0]} </div>
          </div>
          <div className='flex font-semibold'>Language:
              <div className='ml-2 font-normal '>{currentCourse?.language}</div>
          </div>
          <div className='text-lg font-semibold p-3 ml-3'>Price: {currentCourse?.price !==0? currentCourse?.price : 'FREE !!' }</div>
          <div className="ml-4 flex gap-2">
            <button className='border-4 py-1 p-2 border-solid border-white font-bold hover:bg-gray-800 hover:scale-110' >Buy Now</button>
            <button className='border-4 py-1 p-2 border-solid border-white font-bold hover:bg-gray-800 hover:scale-110'>Add to Cart</button>
            <button className='border-4 py-1 p-2 border-solid border-white font-bold hover:bg-gray-800 hover:scale-110'>Apply Coupons</button>
          </div> 
          <div className="flex justify-center">
          <div className='pt-1 text-sm flex '>Full Lifetime Access</div>
          </div>
        </div>
        <div 
          onClick={()=>setIsShowPreview(!isShowPreview)}
          className='hover:scale-[102%] p-1 mx-2 border-2 border-white flex flex-col content-center'
        >
          <div className="relative cursor-pointer bg-black flex flex-col items-center p-2">
            <div className='text-gray-600 hover:scale-[130%] text-[60px] absolute top-[25%]'>
              <SmartDisplayIcon fontSize="inherit"/>
            </div>
            <img src={currentCourse?.image} className='max-w-[200px] ' />
            <div className="text-white font-semibold">Preview this course</div>
          </div>
          <div className="mt-2 font-semibold flex pl-0 pt-1 p-3">This course is designed for:</div>
          <div className='flex flex-wrap justify-center gap-2'>
          {currentCourse?.target?.map((tgt, id)=> (
            <div className='border-2 border-white p-1'>{tgt.value}</div>
          ))}
          </div>
          <div className='flex'>
            <div className="w-[60%] flex flex-wrap gap-2 mt-4 ml-3">
              {currentCourse?.specialTag?.map((tag, id)=>(
                <div className='rounded-lg text-xs p-2 bg-green-800 h-[35px]'>{tag}</div>
              ))}         
            </div>
            <div className="flex mt-3">
              <button className='font-semibold border-2 border-black py-2 px-[3px] text-black hover:bg-blue-300 hover:scale-110'>Add to Cart</button>
            </div>
          </div>
          
        </div>
      </div>
      <div className='flex flex-col font-bold'>
        <div className="m-2 border-2 border-gray-700">
          <div className="p-4 pb-2">What will you learn in this course:</div>
          {currentCourse?.outlines?.map((outline, id)=> (
            <>
            <div className="flex ml-4">
              <CheckIcon />
              <div className="py-1 pl-2">{outline}</div>
            </div>
            </>
          ))}
        </div>
        <div className="mt-3">
          <CourseContent currentCourse={currentCourse} />
        </div>
      </div>
      <button onClick={()=> navigate(`learning/${slug}`)}>Unlock Course (Development Only)</button>
      {isShowPreview && (
      <div className='z-50'>
      <PreviewModal 
        isShowing = {isShowPreview}
        onClose ={()=> setIsShowPreview(false)}
        currentCourse = {currentCourse}
      />
      </div>
      )}
    </Layout>
  )
}

export default CourseDetails