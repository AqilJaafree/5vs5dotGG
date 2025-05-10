import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUsers } from '@fortawesome/free-solid-svg-icons'

// TeamBox can represent either an existing team or a "create new team" button
const TeamBox = ({ id, teamName, memberCount, isAddButton = false, onClick }) => {
  const navigate = useNavigate();
  
  // Handle team click to view details
  const handleTeamClick = () => {
    if (isAddButton) {
      // If this is the add button, use the provided onClick handler
      if (onClick) onClick();
    } else {
      // Otherwise navigate to team details
      navigate(`/home/${id}`);
    }
  };
  
  // If this is an "add team" button with no team data
  if (isAddButton || (!teamName && !id)) {
    return (
      <div 
        className="w-20 h-20 rounded-xl outline-1 outline-white flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
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
      className="w-20 h-20 rounded-xl outline-1 outline-white bg-gray-800 flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={handleTeamClick}
    >
      {/* Team initials/avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-1">
        <span className="text-xs font-bold">
          {teamName ? teamName.substring(0, 2).toUpperCase() : "T"}
        </span>
      </div>
      
      {/* Member count - tiny indicator */}
      <div className="flex items-center text-xs text-gray-300">
        <FontAwesomeIcon icon={faUsers} className="mr-1" size="xs" />
        <span>{memberCount || 0}</span>
      </div>
    </div>
  );
};

export default TeamBox;