import React, {useState, useEffect} from 'react'
import Rating from '@mui/material/Rating'
import {Link, } from 'react-router-dom'
import axios from 'axios'

const URL = "http://localhost:8080/api/"
// const URL = "https://elearning-back-test.as.r.appspot.com/api/"
// const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"
  
const CourseCard = ({onClick, course}) => {
  const [isPublished, setIsPublished] = useState(course?.published)
  
  const handlePublishCourse =async()=> {
    const {data} = await axios.put( URL + `course/publish/${course._id}`)
    console.log(data.published)
    setIsPublished(data?.published)  
  }

  const handleUnpublishCourse =async() =>{
    const {data} = await axios.put( URL + `course/unpublish/${course._id}`)
    console.log(data.published)
    setIsPublished(data?.published)
  }

  return (
    <div  className='flex  cursor-pointer m-2 flex-col justify-center content-center shadow-lg hover:shadow-black hover:bg-gray-300 p-3 pl-4 max-w-[210px]'>
      <div onClick={onClick} className="">
      <img className= 'w-[75%] self-center ' src={course?.image}/>
      <h1 className='font-bold p-1 text-left text-lg leading-tight'>{course?.title}</h1>
      {course?.authors?.map((author,id)=> (
        <div className='ml-2 font-normal hover:underline cursor-pointer' key={id}>{author},</div>
      ))}
      <div className='flex text-xs px-5 p-1 justify-center'>
        <p className='pr-2 text-red-900 font-bold'>{course?.rating}</p>
        <Rating size='small' value={Number(course?.rating)} precision={0.5} readOnly />
        <p>({course?.reviewer.length !== 0 ? course?.reviewer?.length : '0'})</p>
      </div>
      <div className='w-full'>  
        <div className='text-lg font-semibold'>{course?.price !== 0? course?.price : 'Free'}</div>
        <div className='flex flex-wrap gap-1 justify-start items-stretch content-between'> 
          
          { course?.specialTag.map((tag)=> (
            <div className=' text-sm bg-yellow-200 border-solid border-yellow-200 px-1'>
              {tag}
            </div>))           
          }
        </div>  
      </div>
      </div>
      <div className='flex flex-col justify-center items-end m-3 gap-2'>
          <Link to ={`/course/${course?.slug}/edit`}>
            <button onClick={null} className='bg-purple-600 hover:scale-[1.1] hover:bg-purple-800 border-solid border-2 border-black text-white text-sm p-1'>Edit Course</button>
          </Link>
          <Link to ={`/course/${course?.slug}/addlessons`}>
            <button onClick={null} className='bg-purple-600 hover:scale-[1.1] hover:bg-purple-800 border-solid border-2 border-black text-white text-sm p-1'>Edit Lessons</button>
          </Link>
        </div>
        { isPublished?  (
          <button onClick={handleUnpublishCourse}className='bg-blue-600 text-white rounded-lg p-1'>Unpublish Course</button>
        ) : (
          <button onClick={handlePublishCourse} className='bg-blue-600 text-white rounded-lg p-1'>Publish Course</button>
        )
        }
    </div>
  )
}

export default CourseCard