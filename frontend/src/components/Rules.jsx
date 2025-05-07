import React, { useState } from 'react'
import Button from './ui/Button'
import { Link } from 'react-router-dom'

const Rules = () => {
    const [showModal, setShowModal] = useState(false);

    const handleModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

  return (
    <div className="pt-20"> 
        <div className="h-[calc(100svh-20rem)] flex-1 mx-auto w-80 bg-black rounded-xl outline-white/20 outline-2 shadow-white">
            <div className="flex justify-end pr-4 pt-4">
                <Button text="X" variant="primary" size="small" onClick={closeModal}/>
            </div>
                <div className="text-center p-4">
                    <h1 className="text-3xl">Game Rules</h1>
                </div>
            <div className="text-justify">
                <div className="text-lg px-10 py-4">
                    <span>
                        1. Connect your Wallet
                    </span>
                    <br/>
                    <span>
                        2. Insert amount of token that you want to stake
                    </span>
                    <br/>
                    <span>
                        3. Claim players in marketplace
                    </span>
                    <br/>
                    <span>
                        4. Create a team 
                    </span> 
                    <br/>
                    <span>
                        5. Join match to compete with other players 
                    </span>                         
                </div>
            </div>
        </div>
    </div>
  )
}

export default Rules