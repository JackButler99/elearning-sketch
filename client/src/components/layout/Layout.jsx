import React from 'react'
import Navbar from '../ui/Navbar'

class Layout extends React.Component{
  render(){
    return (
      <>
        <Navbar  className='z-50'/>
        <main>
          {this.props.children}
        </main>
      </>
      
    )
  }
}

export default Layout