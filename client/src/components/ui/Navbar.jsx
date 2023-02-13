import React, {useState, useEffect, useCallback} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AiOutlineMenu } from 'react-icons/ai'
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined" 

import NavbarOption from './NavbarOption'
import NavbarMenu from './NavbarMenu'
import { useStateContext } from '../../context/ContexProvider'
import RegisterModal from './RegisterModal'
import { useSelector } from "react-redux";
import { logout } from '../../redux/userReducer'
import { useDispatch } from 'react-redux'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const {screenSize, setScreenSize} = useStateContext()
  const [listMenu, setListMenu] = useState(false)
  const [isMenuClicked, setIsMenuClicked] = useState(false)
  const [isSignInClicked, setIsSignInClicked] = useState(false)
  const { currentUser } = useSelector((state) => state.user);
  const [isUserClicked, setIsUserClicked] = useState(false)


  useEffect(()=> {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [setScreenSize])

  useEffect(()=>{
    if (screenSize <= 900) {
      setListMenu(false)
    }else {
      setListMenu(true)
    }

  }, [screenSize, listMenu])
  
  useEffect(()=>{
    console.log(currentUser)
  }, [currentUser])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
    <div className='sticky bg-white top-0 z-10 pt-2 '>
      <div className=' flex items-center justify-end py-2 px-4 relative'>
        <h1 className='p-6 text-2xl font-bold'>Logo</h1>
        <div className='w-5/12 m-auto flex items-center justify-between border-solid border-2 border-[#ccc]
                          rounded-md text-skin-base p-2' >
          <input 
            className='border-none bg-transparent outline-none text-skin-base w-1/2'
            placeholder='Search Courses'
            onChange={(e)=> setSearchQuery(e.target.value)}
          />
        <SearchOutlinedIcon className= 'ml-1 cursor-pointer' onClick={()=>navigate(`/search?searchQuery=${searchQuery}`)}/>
        </div>
        <div className='flex'>
          {listMenu ?  
            <div className='flex pr-5'>
            <NavbarOption  to='/courses' text="Courses" />
            <NavbarOption  onClick={null} text="Blog" />
            <NavbarOption  onClick={null} text="Community" />
            <NavbarOption  onClick={null} text="Events" />
          </div> : 
          <div 
            onClick= {()=> setIsMenuClicked(!isMenuClicked)}
            className={`p-5 cursor-pointer hover:bg-gray-300 hover:scale-110 transition ease-out ${isMenuClicked? 'bg-gray-300': ''}`}>
            <AiOutlineMenu />
          </div>
          }
           {isMenuClicked && 
            <div className='flex-col rounded-xl fixed nav-item top-[80px] right-[40px] bg-gray-300 w-32'>
              <NavbarMenu to={`/courses`} text="Courses" />
              <NavbarMenu onClick={null} text="Blog" />
              <NavbarMenu onClick={null} text="Community" />
              <NavbarMenu onClick={null} text="Events" />
            </div>
          }
        </div>
        {currentUser? 
        <>
          <div 
            onClick ={()=>setIsUserClicked(!isUserClicked)}
            className= {`p-2 cursor-pointer hover:bg-gray-300 hover:scale-110 transition ease-out ${isUserClicked? 'bg-gray-400': ''}`}
          >
            {currentUser?.username}
          </div>
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
          
        </>: 
          <div className='pr-5 text-sm' onClick={()=>setIsSignInClicked(true)} >
            <button className=' hover:bg-blue-800 hover:scale-110 transition ease-out text-sm px-2 py-2 border-solid border-2 bg-[#0056d2] text-[#fff] rounded font-medium cursor-pointer flex items-center '>
              SIGN IN
            </button>
        </div>}
        
      </div>
    </div>
    <div>
    {isSignInClicked && (
      <div className='z-50'>
      <RegisterModal 
        isShowing = {isSignInClicked}
        onClose ={()=> setIsSignInClicked(false)}
      />
      </div>
    )}
    </div>
    </>
  )
}

export default Navbar