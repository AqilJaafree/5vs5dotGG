import React, { useEffect, useState } from 'react';
import Logo from '../../src/assets/img/5vs5dotgg_logo.png'

const SplashScreen = ({ onComplete }) => {
  const [animation, setAnimation] = useState(false);
  
  useEffect(() => {
    // Start animation after component mounts
    setTimeout(() => {
      setAnimation(true);
    }, 500);
    
    // Call onComplete callback after animation
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 bg-gradient-to-tr from-purple-800 via-blue-700 to-purple-900"
          style={{
            backgroundSize: '400% 400%',
            animation: 'gradient-animation 8s ease infinite',
          }}
        ></div>
      </div>
      
      {/* Logo container with animation */}
      <div className={`relative flex flex-col items-center transition-all duration-1000 ${
        animation ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}>
        {/* App logo */}
        <div className="w-40 h-40 mb-8 flex items-center justify-center overflow-hidden">
          <div className="">
            <img src={Logo} alt="logo" />
          </div>
        </div>
        
        {/* App name */}
        <p className="text-purple-300 text-lg">NFT Battle Arena</p>
        
        {/* Loading animation */}
        <div className="mt-12 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;