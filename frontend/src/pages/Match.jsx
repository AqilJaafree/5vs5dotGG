import React from 'react'
import Button from '../components/ui/Button'

const Match = () => {
  return (
    <div className="">
      <div className="flex justify-center items-center pt-4">
        <div className="w-72 h-125 outline-2 outline-white rounded-xl">

        </div>
      </div>

      {/* Join, Create and Find Match Button */}
      <div className="flex justify-center items-center">
        <div className="absolute bottom-18">
          <div className="flex justify-center items-center gap-6 pb-2">
            <Button text="Join Match" variant="primary"/>      
            <Button text="Create Match" variant="primary"/>   
            <Button text="Find Match" variant="primary"/>        
          </div>
        </div>
      </div>
    </div>
  )
}

export default Match