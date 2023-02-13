import React from 'react'

const RegistrationNotif = ({mode, changeMode}) => {
  return (
    <div className='flex mt-10'>
      <div className='bg-green-300'>Registration Success</div>
      <button onClick={changeMode} className='bg-blue-400 tezt-white'>Login</button>
    </div>
  )
}

export default RegistrationNotif