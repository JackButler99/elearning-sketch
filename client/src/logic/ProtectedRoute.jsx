import React, {useState, useEffect} from 'react'
import { Route, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import LoginGate from '../pages/LoginGate'

const ProtectedRoute = (props) => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const userToken = useSelector((state) => state.user.currentUser)

  const checkUserToken = () => {
    if (!userToken || userToken === undefined) {
      setIsLoggedIn(false)
      navigate('/login')
    }
    setIsLoggedIn(true)
  }

  useEffect(()=>{
    
    checkUserToken()
  }, [isLoggedIn, userToken])
  
  return (
    <>{isLoggedIn ? props.children : null}</>
  )
}

export default ProtectedRoute