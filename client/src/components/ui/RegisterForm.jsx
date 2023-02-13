import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {registerFailure, registerStart, registerSuccess } from '../../redux/userReducer'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import RegistrationNotif from './RegistrationNotif'


const RegisterForm = ({mode, changeMode}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { watch, register, handleSubmit, formState:{errors}} = useForm({mode: 'onChange'})
  const [ isRegSuccess, setIsRegSuccess] = useState(false)

  const URL = "http://localhost:8080/api/"
  // const URL = "https://elearning-back-test.as.r.appspot.com/api/"
  // const URL = "https://us-central1-elearning-back-test.cloudfunctions.net/api/api/"
  
  useEffect(()=> {
    console.log('Reg Success', isRegSuccess)
  }, [isRegSuccess])
  

  const handleRegister = async (data) => {
    dispatch(registerStart())
    try{
      const res = await axios.post(URL + "auth/signup", data)
      dispatch(registerSuccess(res.data))
      setIsRegSuccess(true)
      return(<div className='fixed top-0 bg-green-300'>Registration Completed</div>)
    }catch (err){
      dispatch(registerFailure())
      console.log(err)
    } 
  }

  return (
    <>
      <div className='mt-10 flex flex-col p-5' >
        <h1 className='text-lg font-bold mt-4'>Create new account</h1>
        <p className='text-sm'>Please fill the form below</p>
      </div>
      <form onSubmit={handleSubmit(handleRegister)} className='flex flex-col gap-2 w-full px-2 py-1 mb-8'>
          <input className={`${errors.username?"bg-red-100 border-red-400":""} rounded-lg text-sm border-2 border-gray-300 w-full py-1 px-3`}
            {...register("username", 
            {
              required:'This field is required', 
              minLength:{value: 3, message:'Username should not less than 3 characters'},
              pattern: {value:/^[A-Za-z0-9]*$/, message:"Username should not have a special character"}
            }
            )}
            type="text"
            placeholder='Username'
          />
          <p className='text-red-400 text-xs'>{errors.username?.message}</p>

          <input className={`${errors.email?"bg-red-100 border-red-400":""} rounded-lg text-sm border-2 border-gray-300 w-full py-1 px-3`}   
            {...register("email", 
              {
              required:'This field is required',
              pattern: {value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message:"Email invalid"}
              }
            )}
            type="text"
            placeholder='Email'
          />
          <p className='text-red-400 text-xs'>{errors.email?.message}</p>
          
          <input className={`${errors.password?"border-red-400 bg-red-100":""} rounded-lg text-sm border-2 border-gray-300 w-full py-1 px-3`}
            {...register("password", {
              required:'This field is required', 
              minLength:{value: 8, message:'Password should not less than 8 characters'},
              pattern: {value:/^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, message:"Password should include at least 1 Uppercase,  1 undercase, 1 number, and 1 special character" }
            })}
            
            type="password"
            placeholder='Password'
          />
          <p className='text-red-400 text-xs'>{errors.password?.message}</p>
          
          <input className={`${errors.username?"border-red-400 bg-red-100":""} rounded-lg text-sm border-2 border-gray-300 w-full py-1 px-3`}
            type="password"
            placeholder='Confirm Password'
            {...register("confirmPassword", 
              {
                required:'This field is required', 
                validate: (val) => {
                  if (watch('password') != val) {
                    return "Your passwords do no match";
                  }
                } 
              }
            )}
          />
          <p className='text-red-400 text-xs'>{errors.confirmPassword?.message}</p>
          
          <div className='flex text-sm p-1 items-start justify-start'>
            <input 
              className='mt-2'
              required
              type="checkbox"
            />
            <p className='ml-2'>I agree with the <a href={null} className='underlined text-blue-500 cursor-pointer hover:text-blue-700'>user terms and agreement</a></p>
          </div>
          <button type='submit' className='bg-cyan-500 w-full text-white py-1 mt-2'>Register</button>
          
          <div className='flex'>
            <p className='text-xs'>Already Have an Account?</p>
            <button onClick={changeMode} to={null} className='text-sm pl-1 underline hover:text-blue-500' ><strong>Login</strong> {" "}</button>
          </div>
          { isRegSuccess? 
          <div className='bg-green-500 flex text-sm p-1'>
              <p>Registration Success please</p>
              <button onClick={changeMode} to={null} className='text-sm pl-1 underline hover:text-blue-500' ><strong>Login</strong> {" "}</button>
          </div> : null
          }
      </form>
    </>
  )
}

export default RegisterForm