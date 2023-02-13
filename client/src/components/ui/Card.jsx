import React from 'react'

function Card({title, description, image}) {
  return (
    <div  
      className= {`
        relative -z-[0] px-2 py-4 text-sm font-semibold bg-white
        flex flex-col  items-center cursor-pointer 
        hover:bg-gray-400 hover:scale-110 transition 
        ease-out shadow-xl shadow-gray-900 rounded-xl
        `}>
        <h2 className='pl-1'>{title}</h2>
        <img className=''  src={image} alt="course Logo" width="100" height="50" />
        <p className=''>{description}</p>
        <div className='self-end py-2 px-3 text-right bottom-0 bg-red-900 text-white' style={{borderRadius:"70% 0% 0% 0% / 63% 10% 10% 10% "}}>Top Course</div>
    </div>
  );
}

export default Card