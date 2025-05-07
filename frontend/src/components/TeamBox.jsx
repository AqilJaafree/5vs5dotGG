import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUsers } from '@fortawesome/free-solid-svg-icons'

// TeamBox can represent either an existing team or a "create new team" button
const TeamBox = ({ teamName, memberCount, isAddButton = false, onClick }) => {
  // If this is an "add team" button with no team data
  if (isAddButton || (!teamName && !memberCount)) {
    return (
      <div 
        className="w-25 h-25 rounded-xl outline-1 outline-white flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={onClick}
      >
        <FontAwesomeIcon 
          icon={faPlus} 
          size="lg" 
          style={{
            color: "#ffffff",
          }} 
          className="flex items-center justify-center"
        />
      </div>
    );
  }
  
  // Regular team box with minimal team information (due to smaller size)
  return (
    <div 
      className="w-25 h-25 rounded-xl outline-1 outline-white bg-gray-800 flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      {/* Team initials/avatar */}
      <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center mb-1">
        <span className="text-lg font-bold">
          {teamName ? teamName.substring(0, 2).toUpperCase() : "T"}
        </span>
      </div>
      
      {/* Member count - tiny indicator */}
      <div className="flex items-center text-lg text-gray-300">
        <FontAwesomeIcon icon={faUsers} className="mr-1" size="xs" />
        <span>{memberCount}</span>
      </div>
    </div>
  );
};

export default TeamBox