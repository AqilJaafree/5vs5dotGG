import React from 'react'
import Button from './ui/Button'

const InsertToken = () => {
  return (
    <div className="flex justify-center items-center pt-6">
        <div className="bg-black shadow-lg w-80 h-auto rounded-xl">
            <div className="flex justify-around items-center py-4">
                <div className="text-center">
                    <span className="text-lg">Available SOL</span>
                    <h1 className="text-3xl font-[Poppins]">0.00 </h1>
                    <span>SOL</span>
                </div>
                <div className="text-center">
                    <span className="text-lg">Available Credit</span>
                    <h1 className="text-3xl font-[Poppins]">0.00</h1>
                    <span>credit</span>
                </div>
            </div>
            <div className="flex justify-center items-center pb-2">
                <Button text="Insert Token" variant="secondary" size="large"/>
            </div>
        </div>
    </div>
  )
}

export default InsertToken