import React, { useState, useRef, useEffect } from 'react'
import {Link} from "react-router-dom"
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const RegisterModal = ({isShowing, onClose}) => {
  const modalRef = useRef() 
  const [mode, setMode] = useState('Login')
  
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
    <div className='z-50 bg-gray-900 bg-opacity-60 fixed w-full h-full top-0 left-0'>
      <div ref={modalRef} className='fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[400px] min-w-[231px] w-[45%] h-[85%] min-h-[410px] bg-white color-white rounded-xl'> 
        <div className=' w-full h-full flex flex-col items-center justify-center'> 
          <div className='w-[101%] flex h-[64%] flex-col justify-center items-center  p-2'>
            <div 
              className=' z-50 shadow-sm shadow-blue-300 fixed top-0 right-0 w-[100%] h-[20%] flex flex-col rounded-xl border-solid border-1 border-blue-800 bg-gradient-to-tr from-blue-900 via-cyan-500 to-cyan-200'
              style={{borderRadius: '3% 4% 0% 100% / 10% 0% 62% 50% '}}
            > 
              <button className='fixed p-1 top-0 right-0' onClick={onClose}>&nbsp; X &nbsp;</button>
            </div>
            <br />
            { mode === 'Login' ?  
              <LoginForm 
                currentMode= {mode} 
                changeMode={()=> setMode('Register')}/> 
              : null
            }
            { mode ==='Register'?
              <RegisterForm 
                currentMode= {mode}
                changeMode={()=> setMode('Login')}  
              /> : null
            }
            { mode ==='RegisterSuccess'?
              <RegisterForm 
                currentMode= {mode}
                changeMode={()=> setMode('Login')}  
              /> : null
            }
          </div>          
        </div>
      </div>
    </div>
  </>
  )
    
}

export default RegisterModal