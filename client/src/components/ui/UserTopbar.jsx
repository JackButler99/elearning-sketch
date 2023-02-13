import React, {useState} from 'react'
import { useSelector } from 'react-redux'

import ProfileSettings from '../../pages/UserSettings/ProfileSettings'
import Preferences from '../../pages/UserSettings/Preferences'
import Help from '../../pages/UserSettings/Help'
import AccountSettings from '../../pages/UserSettings/AccountSettings'

const Menus = [
  {
    id:1,
    title:"Profile Settings",
    component:ProfileSettings
  },
  {
    id:2,
    title:"Preferences",
    component: Preferences
  },
  {
    id:3,
    title:"Help",
    component: Help
  },
  {
    id:4,
    title:"Account Settings",
    component: AccountSettings
  },

]

const UserTopbar = ({page, setPage}) => {
  return(    
    <div className="flex flex-col">
      <div className="pt-2 w-[100%] pb-0 flex gap-8 border-b-2 border-b-gray-300">
        {Menus.map((menu, id)=> (
           <div key={id} className={`${page === menu.title? 'border-b-gray-500' : ''} border-b-2 cursor-pointer p-2  hover:bg-gray-400`} id= {menu.id}  onClick={()=>setPage(menu.title)}>
           {menu.title}
        </div>
        ))}
      </div>     
      {Menus.map((menu, id)=> {
        if (menu.title === page){
        return(
        <div key={id} className={`mt-4 p-2`} id= {menu.id}  onClick={()=>setPage(menu.title)}>
          <menu.component/>
        </div>
        )}})}
    </div>
  )
}

export default UserTopbar