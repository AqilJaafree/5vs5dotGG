import React from 'react'
import Logo from '../../src/assets/img/5vs5dotgg_logo.png'
import Rules from '../components/Rules'


const Home = () => {
  return (
    <div className="">
        <div className="h-[calc(100svh-8rem)] flex-1 mx-auto w-full bg-black rounded-xl outline-white/20 outline-2 shadow-xl">
        <div className="flex justify-center items-center pt-4">
          <img src={Logo} alt="logo" className="w-20" />
        </div>

        <Rules />
        </div>
    </div>
  )
}

export default Home