import React, {useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux'
import PhoneInput from 'react-phone-input-2'
import axios from 'axios'
import 'react-phone-input-2/lib/high-res.css'

const URL = "http://localhost:8080/api/"
// const URL = "https://elearning-back-test.as.r.appspot.com/api/"
// const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"

const initPswrdForm = {
  'newPassword': '',
  'confirmPassword': ''
} 


const initVerificationForm = {
  'confirmPassword': ''
}

const AccountSettings = () => {
  const [phoneNum, setPhoneNum] = useState({phoneNum:''})
  const [isChangePswrd, setIsChangePswrd] = useState(false)
  const [isPswrdVerified, setIsPswrdVerified] = useState(false)
  const [PswrdChanged, setIsPswrdChanged]= useState(false)

  const [pswrd, setPswrd] = useState(initPswrdForm)
  const [verificationForm, setVerificationForm]= useState(initVerificationForm)
  
  const modalRef = useRef()
  const  thisUser  = useSelector((state) => state.user.currentUser)
  const [currentUser, setCurrentUser] = useState({})
  const [error, setError] = useState('')

  useEffect (()=> {
    fetchUserData()
  }, [])
  

  const fetchUserData = async() =>{
    axios.get( URL + `user/getUser/${thisUser?.username}`)
    .then ((res)=> {      
      setCurrentUser(res.data)
      setPhoneNum(res?.data?.phoneNum)
    })
  }

  const [accountUpdated, setAccountUpdated] = useState(false)
    
  const editPhoneNum = async(e) => {
    e.preventDefault()
    axios.post(URL + `user/editPhoneNum/${currentUser?._id}`, phoneNum)
    .then ((res)=> {      
      setCurrentUser(res.data)
      setAccountUpdated(true)    
    })
  }

  const editPassword = async(e) => {
    e.preventDefault()
    axios.post(URL + `user/editAccount/${currentUser?._id}`, pswrd)
    .then ((res)=> {      
      setCurrentUser(res.data)
      setAccountUpdated(true)    
    })
  }

  useEffect(()=> {
    let handler = (e)=>{
      if (!modalRef?.current?.contains(e.target)){
        setIsChangePswrd(false)
      }
    }

    document.addEventListener("mousedown", handler)
    return() => {
      document.removeEventListener("mousedown", handler)
    }
  }, [isChangePswrd] )

  const handleSubmit = async(e) => {
    e.preventDefault()
    axios.post(URL + `user/changePassword/${currentUser?._id}`, pswrd)
    .then((res)=>{
      setIsChangePswrd(false)
      setIsPswrdChanged(true)
    })
    
  }

  const handleSubmitVerification = async(e)=> {
    e.preventDefault()
    axios.post(URL + `user/verifyPassword/${currentUser?._id}`, verificationForm)
    .then((res)=>{
      setIsPswrdVerified(true)
    }).catch((error)=>{setError(error.response.data.message)})
  }

  return (
    <div className='flex flex-col'>
      <div className='flex gap-8 md:gap-16'>
        <div className='flex flex-col w-[40%]'>
          <h1 className='font-semibold'>Email Address: </h1>
          <input defaultValue={currentUser?.email} className='w-full p-2 border-2 border-gray-300 cursor-not-allowed' type={'text'} disabled ></input>
        </div>
        <div className='flex flex-col w-[40%]'>
          <h1 className='font-semibold'>Username: </h1>
          <input defaultValue={currentUser?.username} className='w-full p-2 border-2 border-gray-300 cursor-not-allowed' type={'text'} disabled ></input>
        </div>    
      </div>
      <div className='py-4'>
        <div className='flex flex-col w-[40%] justify-center'>
          <h1 className='font-semibold'>Phone Number: </h1>
          <PhoneInput masks={{id:'(...) .... .....'}} value={currentUser?.phoneNum} onChange={(value)=>setPhoneNum({...phoneNum, phoneNum: value})} country={'id'}/> 
          <button onClick={(e)=>editPhoneNum(e)} className='mt-2 bg-blue-600 text-white w-[80px] text-sm p-1'>Submit</button>
        </div>  
        <div className=" flex pt-4 flex-col w-[40%] justify-center">
          <h1 className='font-semibold'>Password: </h1>
          <button onClick={()=>setIsChangePswrd(true)} className='mt-2 bg-blue-600 text-white w-[120px] text-sm p-1'>Change Password</button>
        </div>
        { isChangePswrd && (
          <div className='z-50 bg-gray-900 bg-opacity-60 fixed w-full h-full top-0 left-0'>
            <div ref={modalRef} className='p-4 fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[800px] min-w-[231px] w-[75%] bg-white color-white rounded-xl'>
              <h1 className='font-bold text-xl'>Change Password</h1>
              <button className='fixed p-1 top-0 right-0' onClick={()=>setIsChangePswrd(false)}>&nbsp; X &nbsp;</button>
              {!isPswrdVerified && (
               
                <form className="">
                <div className='mt-4 flex  gap-8 md:gap-16'>
                  <div className="flex flex-col w-[60%] justify-center">
                    <h1 className='font-semibold'>Verify Password: </h1>
                    <input onChange={(e)=> setVerificationForm({...verificationForm, confirmPassword: e.target.value})} className='w-full p-2 border-2 border-gray-300' type={'password'} placeholder='Password'></input>
                  </div>
                </div>
                {error && <div className='w-11/12  m-1 text-sm  text-red-500 rounded-lg'>{error}</div>}
                <button onClick={(e)=>handleSubmitVerification(e)} className='mt-4  ml-8 p-1 bg-blue-600 text-white w-[80px]'>Confirm</button>
              </form>
              )}
              {isPswrdVerified && (<form className="">
                <div className='mt-4 flex justify-center gap-8 md:gap-16'>
                  <div className="flex flex-col w-[40%] justify-center">
                    <h1 className='font-semibold'>Type New Password: </h1>
                    <input  onChange={(e)=>setPswrd({...pswrd, newPassword: e.target.value})} className='w-full p-2 border-2 border-gray-300' type={'password'} placeholder='New Password'></input>
                  </div>
                  <div className="flex flex-col w-[40%] justify-center">
                    <h1 className='font-semibold'>Re-Type Password: </h1>
                    <input onChange={(e)=>setPswrd({...pswrd, confirmPassword: e.target.value})} className='w-full p-2 border-2 border-gray-300' type={'password'} placeholder='Confirm Password'></input>
                  </div>
                </div>
                { (pswrd.newPassword.length!==0 &&(pswrd.newPassword !== pswrd.confirmPassword)) && (<div className='w-11/12  m-1 text-sm  text-red-500 rounded-lg'>Passwords didn't match</div>)}
                <button onClick={(e)=>handleSubmit(e)} disabled={pswrd.newPassword !== pswrd.confirmPassword} className='mt-4  ml-8 p-1 bg-blue-600 text-white w-[80px]'>Confirm</button>
              </form>
            )}
              
            </div>
          </div>
        )}
      </div>
    </div>
    
  )
}

export default AccountSettings