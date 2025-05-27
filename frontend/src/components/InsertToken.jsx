import React, { useState } from 'react'

// Demo Button component to match your UI
const Button = ({ text, variant = "primary", size = "medium", onClick }) => {
  const baseClasses = "font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 focus:ring-blue-500"
  }
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

const InsertToken = () => {
  const [solBalance, setSolBalance] = useState(2.47)
  const [creditBalance, setCreditBalance] = useState(156.23)
  const [isLoading, setIsLoading] = useState(false)

  const handleInsertToken = () => {
    setIsLoading(true)
    // Simulate token insertion
    setTimeout(() => {
      setSolBalance(prev => prev + Math.random() * 5)
      setCreditBalance(prev => prev + Math.random() * 100)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex justify-center items-center pt-6">
      <div className="bg-[#865DFF] shadow-lg w-80 h-auto rounded-xl text-white">
        <div className="flex justify-around items-center py-4">
          <div className="text-center">
            <span className="text-md opacity-90">Available SOL</span>
            <h1 className="text-3xl font-bold">
              {isLoading ? "..." : solBalance.toFixed(2)}
            </h1>
            <span className="text-sm opacity-75">SOL</span>
          </div>
          <div className="text-center">
            <span className="text-md opacity-90">Available Credit</span>
            <h1 className="text-3xl font-bold">
              {isLoading ? "..." : creditBalance.toFixed(2)}
            </h1>
            <span className="text-sm opacity-75">credit</span>
          </div>
        </div>
        <div className="flex justify-center items-center pb-4">
          <Button 
            text={isLoading ? "Processing..." : "Insert Token"} 
            variant="secondary" 
            size="medium"
            onClick={handleInsertToken}
          />
        </div>
      </div>
    </div>
  )
}

export default InsertToken