import React from 'react'
import Logo from '../../src/assets/img/5vs5dotgg_logo.png'

const Match = () => {
  return (
    <div className="">
        <div className="h-[calc(100svh-8rem)] flex-1 mx-auto w-full bg-black rounded-xl">
        <div className="flex justify-center items-center pt-4">
          <img src={Logo} alt="logo" className="w-20" />
        </div>            
        </div>
    </div>
  )
}

export default Match