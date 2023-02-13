import React, {useState} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { loginFailure, loginStart, loginSuccess } from '../../redux/userReducer'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"

const LoginForm = ({mode, changeMode}) => {
  const {watch, register, handleSubmit} = useForm()
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const URL = "http://localhost:8080/api/"
  // const URL = "https://elearning-back-test.as.r.appspot.com/api/"
  // const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"

  const handleLogin = async (data) => {
    dispatch(loginStart())
    try{
      const res = await axios.post( URL + "auth/signin", data)
      dispatch(loginSuccess(res.data))
      navigate(0)
    }catch(err){
      if (err.response){
        setError(err.response.data.message)
      }
      dispatch(loginFailure())
    }
  }

  return (
    <>
      <div className='mt-10 flex flex-col p-5' >
        <h1 className='text-lg font-bold mt-4'>Welcome Back,</h1>
        <p className='text-sm'>Please login to continue.</p>
      </div>
      <div className='flex flex-col gap-2 w-full px-2 py-1 mb-8'>
        <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-2 w-full px-2 py-1 mb-8'>
          <input className='w-full py-1 px-2'
            {...register("email")}
            type="email"
            placeholder='Email'
          />
          <input className='w-full py-1 px-2'
            {...register("password")}
            type="password"
            placeholder='Password'
          />
          <Link to={null} className='text-sm hover:text-blue-500 hover underline'> Forgot Password ? </Link>
          {error && <div className='w-11/12  m-1 text-sm  text-red-500 rounded-lg'>{error}</div>}
          <button className='bg-cyan-500 w-full text-white py-1 mt-2'>Login</button>
          <div className='flex'>
            <p className='text-xs'>Don't Have an Account?</p>
            <button onClick={changeMode} className='text-sm pl-1 underline hover:text-blue-500' ><strong>Register</strong> {" "}</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginForm