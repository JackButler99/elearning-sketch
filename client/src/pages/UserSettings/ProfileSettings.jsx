import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { current } from '@reduxjs/toolkit'

const URL = "http://localhost:8080/api/"
// const URL = "https://elearning-back-test.as.r.appspot.com/api/"
// const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"


const ProfileSettings = () => {  
  const  thisUser  = useSelector((state) => state.user.currentUser)
  const [currentUser, setCurrentUser] = useState({})
  
  useEffect (()=> {
    fetchUserData()
  }, [])

  const fetchUserData = async() =>{
    axios.get( URL + `user/getUser/${thisUser?.username}`)
    .then ((res)=> {      
      setCurrentUser(res.data)
      setProfileForm({
        fullname: res?.data?.profile?.fullname,
        headline: res?.data?.profile?.headline,
        bio: res?.data?.profile?.bio,
        website: res?.data?.profile?.website,
        twitter: res?.data?.profile?.twitter,
        linkedIn: res?.data?.profile?.linkedIn,
        facebook: res?.data?.profile?.facebook,
        discord: res?.data?.profile?.discord
      })    
    })
  }


  const [profileForm, setProfileForm] = useState({})
  const [profileUpdated, setProfileUpdated] = useState(false)
  
  
  const editProfile = async(e) => {
    e.preventDefault()
    axios.post(URL + `user/editProfile/${currentUser?._id}`, profileForm)
    .then ((res)=> {      
      setCurrentUser(res.data)
      setProfileUpdated(true)    
    })
  }
  return (
    <div className='flex flex-col'>
      <form>
        <div className='flex md:flex-row flex-col md:gap-16'>
          <div className='flex flex-col  w-full md:w-[40%]'>
            <h1 className='font-semibold'>Full Name: </h1>
            <input defaultValue={currentUser?.profile?.fullname} onChange={(e)=>setProfileForm({...profileForm, fullname: e.target.value})} className='w-full p-2 border-2 border-gray-300' type={'text'} placeholder='Fullname'></input>
          </div>
          <div className='flex flex-col w-full md:w-[40%] justify-center'>
            <h1 className='font-semibold'>Headline: </h1>
            <input defaultValue={currentUser?.profile?.headline} onChange={(e)=>setProfileForm({...profileForm, headline: e.target.value})} className='w-full p-2 border-2 border-gray-300' type={'text'} placeholder='A sentence that describe you the most..'></input>
          </div>
        </div>
        <div className="mt-4 md:flex-row flex  flex-col md:gap-16">
          <div className="flex flex-col w-full md:w-[40%] justify-center">
            <h1 className='font-semibold'>Bio: </h1>
            <textarea defaultValue={currentUser?.profile?.bio} onChange={(e)=>setProfileForm({...profileForm, bio: e.target.value})} className='w-full p-4 border-2 border-gray-300' type={'text'} placeholder='Tell us about yourself....'></textarea>
          </div>
          <div className="flex flex-col w-full md:w-[40%] justify-center">
            <h1 className='font-semibold'>Website: </h1>
            <input defaultValue={currentUser?.profile?.website} onChange={(e)=>setProfileForm({...profileForm, website: e.target.value})} className='w-full p-2 border-2 border-gray-300' type={'text'} placeholder='URL'></input>
          </div>
        </div> 
        <div className="md:mt-4 flex gap-8 md:gap-16">
          <div className="flex flex-col w-full  justify-center text-sm">
            <h1 className='font-semibold'>Social Media: </h1>
            <div className='flex gap-2 py-2'>
              <div className='font-sm font-semibold w-[70px]'>Twitter</div>
              <input defaultValue={currentUser?.profile?.twitter} onChange={(e)=>setProfileForm({...profileForm, twitter: e.target.value})} className='w-full p-1 border-2 border-gray-300' type={'text'} placeholder=''></input> 
            </div>
            <div className='flex gap-2 py-2'>
              <div className='font-sm font-semibold w-[70px]'>LinkedIn</div>
              <input defaultValue={currentUser?.profile?.linkedIn} onChange={(e)=>setProfileForm({...profileForm, linkedIn: e.target.value})} className='w-full p-1 border-2 border-gray-300' type={'text'} placeholder=''></input> 
            </div>
            <div className='flex gap-2 py-2'>
              <div className='font-sm font-semibold w-[70px]'>Facebook</div>
              <input defaultValue={currentUser?.profile?.facebook} onChange={(e)=>setProfileForm({...profileForm, facebook: e.target.value})} className='w-full p-1 border-2 border-gray-300' type={'text'} placeholder=''></input> 
            </div>
            <div className='flex gap-2 py-2'>
              <div className='font-sm font-semibold w-[70px]'>Discord</div>
              <input defaultValue={currentUser?.profile?.discord} onChange={(e)=>setProfileForm({...profileForm, discord: e.target.value})} className='w-full p-1 border-2 border-gray-300' type={'text'} placeholder='Discord ID or Channel'></input> 
            </div>
          </div>
        </div>     
        <button type='submit' onClick={(e)=>editProfile(e)} className='self-start mt-8  bg-blue-600 text-white p-2'>Save</button>
      </form>
    </div>
  )
}

export default ProfileSettings