import React, {useState} from 'react'

const UserSidebar = () => {
  const [isHover, setIsHover] = useState(false)

  return (
    <div  
      onMouseOver={()=>setIsHover(true)} onMouseOut={()=>setIsHover(false)}  
      className="z-2 fixed h-[100%] top-0 left-0 bg-black "
    >  
      {isHover? (
        <div className='p-4 pt-2'>
          <div className="p-2 text-gray-100">Logo</div>
          <div className="p-2 text-gray-100">Test</div>
          <div className="p-2 text-gray-100">Test</div>
          <div className="p-2 text-gray-100">Test</div>
        </div>
      ): (
      <div className='p-4 pt-2'>
        <div className="p-2 text-gray-100">L</div>
        <div className="p-2 text-gray-100">T</div>
        <div className="p-2 text-gray-100">T</div>
        <div className="p-2 text-gray-100">T</div>
      </div>
      )
    }
    </div>


  )
}

export default UserSidebar