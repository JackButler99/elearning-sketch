import React from 'react'
import Rating from '@mui/material/Rating'

const CourseCard = ({onClick, course}) => { 
  return (
    <div onClick = {onClick} className='flex  cursor-pointer m-2 flex-col justify-center content-center shadow-lg hover:shadow-black hover:bg-gray-300 p-3 pl-4 max-w-[210px]'>
      <img className= 'w-[75%] self-center ' src={course?.image}/>
      <h1 className='font-bold p-1 text-left text-lg leading-tight'>{course?.title}</h1>
      {course.authors.map((author,id)=> (
              <div className='ml-2 font-normal hover:underline cursor-pointer' key={id}>{author},</div>
            ))}
      <div className='flex p-1'>
        <p className='pr-2 text-red-900 font-bold'>{course?.rating}</p>
        <Rating value={Number(course?.rating)} precision={0.5} readOnly />
        <p>({course?.reviewer?.length})</p>
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
        <div className='flex justify-end m-3'>
          <button className='bg-purple-600 hover:scale-[1.1] hover:bg-purple-800 border-solid border-2 border-black text-white p-1'>Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard