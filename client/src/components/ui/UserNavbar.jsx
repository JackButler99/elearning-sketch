import React, {useState, useEffect} from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/userReducer'
import { Link } from 'react-router-dom'

const UserNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [isUserClicked, setIsUserClicked] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className='p-2 bg-white flex justify-end'>
      <div className='p-2 pr-10 cursor-pointer hover:bg-gray-300'>{currentUser?.role}</div>
      <div className='p-2 cursor-pointer hover:bg-gray-300'> <NotificationsIcon/></div>
      <div onClick ={()=>setIsUserClicked(!isUserClicked)} className='p-2 cursor-pointer hover:bg-gray-300'>{currentUser?.username}</div>
      {isUserClicked && 
            <div className='z-50 flex flex-col top-[4rem] right-[1rem] fixed bg-white w-[10%] '>
              <div 
                onClick ={()=>setIsUserClicked(!isUserClicked)}
                className= {`p-2 cursor-pointer hover:bg-gray-300 hover:scale-110 transition ease-out `}
              >
                {currentUser?.username}
              </div>
              <div 
                className= {`p-2 cursor-pointer relative r-10 hover:bg-gray-300 hover:scale-110 transition ease-out `}>
                <Link to='/userSettings'>
                  Settings
                </Link>                
              </div>

            <div 
              onClick={()=>handleLogout()}
              className= {`p-2 cursor-pointer relative r-10 hover:bg-gray-300 hover:scale-110 transition ease-out `}>
              Logout
            </div>
          </div>
            
          }
    </div>
  )
}

export default UserNavbar