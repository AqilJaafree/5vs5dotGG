import React from 'react'

const InsertTokenButton = () => {
  return (
    <div>                
        {/* <div className="text-lg text-blue-300">
            Insert token to play
        </div> */}
            <div className="flex justify-center items-center p-4">
        <button className="rounded-lg bg-gradient-to-b from-indigo-900 to-indigo-950 px-4 py-2 shadow-2xl">
            <div >
                <h1 className="text-xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.5)]">
                    Insert Token
                </h1>
            </div>
        </button>
            </div>
    </div>
  )
}

export default InsertTokenButton