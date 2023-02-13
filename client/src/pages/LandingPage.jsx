import React from 'react'
import Layout from '../components/layout/Layout'
import HeroPict from '../assets/image/hero/hero.jpg'
import {Link} from 'react-router-dom'
import Card from '../components/ui/Card'
import CourseLogo from'../assets/image/courses/course-logo.jpg'

const breakPoints = [
  { width: 1, itemsToShow: 2 },
  { width: 480, itemsToShow: 3, itemsToScroll: 2 },
  { width: 640, itemsToShow: 4 },
  { width: 980, itemsToShow: 5 }
]

const LandingPage = () => {
  return (
    <Layout >
      <div className='flex justify-between items-center p-4 -z-[2]'>
         <div className='flex flex-col justify-end items-end p-1 md:p-6 '>
            <h1 className='font-bold  md:text-[48px] lg:text-[68px] text-[24px] text-right '>Build the Future <br/> with <span className='text-red-700'>Us</span></h1>   
            <div className='flex flex-col gap-2 items-end justify-center py-4 w-full '>
              <Link  to="register" style={{ textDecoration: "none"}}>
                <button className='hover:bg-blue-900 hover:scale-110 transition ease-out shadow-sm shadow-black text-[12px] lg:text-sm px-2 py-3  bg-[#0056d2] text-[#fff] rounded font-semibold cursor-pointer flex items-center '>
                  Join for Free
                </button>
              </Link>
              <Link to="register" style={{ textDecoration: "none"}}>
                <button className='hover:bg-gray-300 hover:scale-110 transition ease-out shadow-sm shadow-black text-[12px] lg:text-sm px-2 py-3 border-solid border-2 border-[#0056d2] text-[#0056d2] bg-[#fff] rounded font-semibold cursor-pointer flex items-center '>
                  Try Our Unlimited Pass
                </button>
              </Link>
            </div>
            
        </div>
        <div className='flex justify-start items-start p-0 md:p-6 pt-0'>
          <img className=' shadow-xl shadow-black min-w-[80px]' style={{borderRadius:"81% 0% 0% 90% / 100% 10% 10% 0% "}} src={HeroPict} alt="Hero" width="720" />  
        </div>
      </div>
      <div className='flex flex-col p-6 lg:p-10'> 
        <h1 className='text-3xl font-bold text-[#0056d2] '>Our Products</h1>
        <h1 className='text-2xl font-bold'> Product Headings 1</h1>
        <h2 className='text-xl font-semibold'> Product Headings 2</h2>
        <div className={`flex gap-2 justify-between`}>
          {/* <Carousel breakPoints={breakPoints} >
              <Card title={'Course 1'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 2'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 3'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 4'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 5'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 6'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 7'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 8'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 9'} description={'This is the course description'} image={CourseLogo}/>
              <Card title={'Course 10'} description={'This is the course description'} image={CourseLogo}/>
          </Carousel> */}
        </div>
      </div>
    </Layout>
  )
}

export default LandingPage