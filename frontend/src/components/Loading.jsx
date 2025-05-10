import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Loading spinner */}
        <div className="relative w-20 h-20 mb-4">
          {/* Outer circle */}
          <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          
          {/* Middle circle */}
          <div className="absolute inset-2 border-4 border-r-blue-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Inner circle */}
          <div className="absolute inset-4 border-4 border-b-purple-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        
        {/* Loading text */}
        <div className="text-white text-lg font-medium">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;