import React, {useState} from 'react'
import LoginForm from '../components/ui/LoginForm'
import RegisterForm from '../components/ui/RegisterForm'

const LoginGate = () => {
  const [mode, setMode] = useState('Login')
  
  
  return (
    <div className='flex flex-col p-12 justify-center items-center'>
      <h1 className='font-bold text-xl'>Please Login to Continue</h1>
      <div>
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
  )
}

export default LoginGate