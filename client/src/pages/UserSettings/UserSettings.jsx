import React, {useState} from 'react'

import UserSidebar from '../../components/ui/UserSidebar'
import UserTopbar from '../../components/ui/UserTopbar'
import UserNavbar from '../../components/ui/UserNavbar'



const UserSettings = () => {
  const [page, setPage] = useState("Profile Settings")
  return (
    <div >
      <div>
        <UserNavbar />
      </div>
      <div>
        <UserSidebar />
      </div>
      <div className='ml-24'>
        <div className='p-2'>
          <h1 className='text-3xl'>Settings</h1>  
        </div>
        <UserTopbar page={page} setPage={setPage} />        

      </div>                    
      
    </div>
  )
}

export default UserSettings