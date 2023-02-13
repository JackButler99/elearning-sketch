import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import Layout from '../../components/layout/Layout'
import Select from 'react-select'
import CourseCard from './CourseCard'

import Pagination from '@mui/material/Pagination'

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined" 

const TopicOptions = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const sortOptions = [
  { value: 'Most Relevant', label: 'Most Relevant' },
  { value: 'Rating', label: 'Rating' },
  { value: 'Reviewed', label: 'Reviewed' },
  { value: 'Price',  label: 'Price'},
]

const Courses = () => {
  const [courses, setCourses] =useState([])
  
  const URL = "http://localhost:8080/api/"
  // const URL = "https://elearning-back-test.as.r.appspot.com/api/"
  // const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"
  
  const fetchCourses = async()=> {
    try {
      axios.get(URL + "course/courses")
        .then((payload)=>{
          setCourses(payload?.data?.filter(course=> course?.published === true))
        })    
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect (()=>{
    fetchCourses()
    
    console.log(courses)
  }, [])

  const navigate = useNavigate()
  //Pagination
  const pageSize= 2
  const [pagination, setPagination] = useState({
    count: 0, 
    from: 0,
    to: pageSize
  })

  const [coursesSliced, setCoursesSliced] = useState(courses.slice(pagination.from, pagination.to))
  const handlePageChange = (event, page) => {
    const from = (page-1)* pageSize
    const to = (page - 1) * pageSize + pageSize
    setPagination({ ...pagination, from:from, to:to})
  }

  useEffect(()=>{
    setPagination({... pagination, count: courses.length})
    setCoursesSliced(courses.slice(pagination.from, pagination.to))
  }, [courses, pagination.from, pagination.to])
  
  // Filters
  const [activeBar, setActiveBar] = useState('Popular Courses')
  
  //Sort
  const [ascending, setAscending] = useState(true)

  return (
    <>
      <Layout >
        <div className= 'flex flex-col max-h-[320px] h-[30%] w-full bg-[#0fbfbf] items-center justify-center'>
          <div className='font-bold text-gray-100  p-14'>
            <h1 className='text-3xl'> World-class Courses are Available <br /> only for you  </h1>
            <p className='mt-5 text-gray-200'>Grow and Become a <strong>World Class Expert</strong> with Us</p>  
          </div>            
        </div>
        <div className='w-full bg-yellow-600'>
          <div className='flex justify-center'>
            <div className='flex  justify-center content-center w-full' >
              <div className='flex self-center justify-end w-[90%]'>
                <Select 
                  className='w-[90%] max-w-[480px] pl-3 py-3'
                  placeholder = 'Search Courses/Topics'
                  isMulti
                  options ={TopicOptions}
                />              
                <div className='py-3 ml-1'>
                  <button className='bg-yellow-800 mt-1 mr-1 p-1 rounded-lg text-white' ><SearchOutlinedIcon className= 'ml-1 cursor-pointer'/></button>
                </div>
              </div>
              <div className='flex self-center justify-start w-[90%]'>
                <Select 
                  className='w-[50%] max-w-[480px] p-3 px-1'
                  placeholder = 'Sort by'
                  options ={sortOptions}                  
                />
                <div className='px-1 py-3'>
                  <button onClick={()=>setAscending(!ascending) } className='bg-yellow-800 py-2 px-1 md:px-2 rounded-lg text-white' >{ascending? 'Asc':'Desc'}</button>
                  <button onClick={null} className='bg-yellow-800 py-2 px-1 md:px-2 rounded-lg text-white ml-1' >Sort</button>
                </div>
              </div>            
            </div>
          </div>
          <div className='flex justify-center  w-full'>
              <Select 
                className='md:w-[40%] w-[30%] lg:w-[35%] pl-3 py-3'
                placeholder = 'Topics'
                isMulti
                options ={TopicOptions}
              />
              <div className='p-1 ml-1 pt-0'>
                <Select 
                className=' max-w-[480px] p-3 px-1'
                placeholder = 'Level'
                options ={sortOptions}                  
                isClearable
                />
              </div>
              <div className='p-1 ml-1 pt-0'>
                <Select 
                className=' max-w-[480px] p-3 px-1'
                placeholder = 'Price'
                options ={sortOptions}                  
                isClearable
                />
              </div>
              <div className='p-1 ml-1 pt-0'>
                <Select 
                className=' max-w-[480px] p-3 px-1'
                placeholder = 'Ratings'
                options ={sortOptions}
                isClearable                  
                />
              </div>
              <div className='p-1 ml-1 pt-0 hidden md:block'>
                <Select 
                className=' max-w-[480px] p-3 px-1'
                placeholder = 'Language'
                options ={sortOptions}                  
                isClearable
                />
              </div>
              <div className='p-1 ml-1 pt-0'>
                <button onClick={()=>setAscending(!ascending) } className='bg-yellow-800 my-3 py-2 px-3 rounded-lg text-white ml-1' >Filter</button>
              </div>
          </div>
        </div>
        
        <div className='flex  flex-row  w-full text-yellow-800 font  font-semibold bg-yellow-500'>
          <div className={`${activeBar==="Popular Courses"? 'hover:bg-yellow-800 bg-yellow-600 text-white':''}  p-3 cursor-pointer hover:bg-yellow-600 `} onClick={()=>setActiveBar('Popular Courses')}>Popular Courses</div>
          <div className={`${activeBar==="New Courses"? 'hover:bg-yellow-800 bg-yellow-600 text-white':''}  p-3 cursor-pointer hover:bg-yellow-600`} onClick={()=>setActiveBar('New Courses')}>New Courses</div>
          <div className={`${activeBar==="My Courses"? 'hover:bg-yellow-800 bg-yellow-600 text-white':''}  p-3 cursor-pointer hover:bg-yellow-600`} onClick={()=>setActiveBar('My Courses')}>My Courses</div>         
        </div>
        <div className='flex text-left'>
          {coursesSliced.map((data, key)=>(
            <CourseCard 
              key = {key}
              course = {data}
              onClick = {()=>navigate(`/course/${data.slug}`)}
            />
          ))}
        </div>
        <div className='flex content-center justify-center p-3'>
          <Pagination 
            count={Math.ceil(pagination.count / pageSize)} 
            variant="outlined" 
            color="primary"
            onChange={handlePageChange}
          />
        </div>
      </Layout>
    </>
  )
}

export default Courses