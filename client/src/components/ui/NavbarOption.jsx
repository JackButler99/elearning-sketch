import React from "react";
import { Link } from "react-router-dom";

function NavbarOption({ to, text}) {
  return (
    <Link to={`${to}`}>
      <div  
        className= {`
          px-2 py-4 text-sm font-semibold bg-white
          flex flex-row rounded-xl items-center cursor-pointer 
          hover:bg-gray-400 hover:scale-110 transition 
          ease-out 
        `}>
        <h2 className='pl-1'>{text}</h2>
    </div>
    </Link>
    
  );
}

export default NavbarOption;
