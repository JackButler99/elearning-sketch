import React, {createContext, useContext, useState} from 'react'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState()
  const [listMenu, setListMenu] = useState(false)
    return (
    <StateContext.Provider value={{ listMenu, setListMenu, screenSize, setScreenSize }}>
      {children}
    </StateContext.Provider>    
  )
}


export const useStateContext = () => useContext(StateContext)