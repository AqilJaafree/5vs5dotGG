import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUsers, faClock, faTrophy } from '@fortawesome/free-solid-svg-icons';

const MatchCard = ({ match, onJoinMatch }) => {
  const navigate = useNavigate();
  
  // Format date and time
  const formatMatchDateTime = () => {
    const matchDate = new Date(match.matchDateTime);
    
    // Format date
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = matchDate.toLocaleDateString(undefined, dateOptions);
    
    // Format time
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedTime = matchDate.toLocaleTimeString(undefined, timeOptions);
    
    return { formattedDate, formattedTime };
  };
  
  // Calculate time until match starts
  const getTimeUntilMatch = () => {
    const matchDate = new Date(match.matchDateTime);
    const now = new Date();
    const timeDiff = matchDate - now;
    
    // If match time is in the past
    if (timeDiff < 0) {
      return 'Ended';
    }
    
    // Convert to hours and minutes
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format the display
    if (hours < 24) {
      return `${hours}h ${minutes}m`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
  };
  
  // Handle join match click
  const handleJoinMatch = () => {
    if (onJoinMatch) {
      onJoinMatch(match.id);
    } else {
      navigate(`/match/${match.id}/join`);
    }
  };
  
  // Handle view match details click
  const handleViewMatch = () => {
    navigate(`/matches/${match.id}`);
  };
  
  // Destructure formatted date and time
  const { formattedDate, formattedTime } = formatMatchDateTime();
  
  return (
    <div className="bg-[#191825] rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors">
      {/* Match status indicator */}
      <div className="bg-[#191825] border-b border-b-gray-500 text-white px-3 py-1 flex items-center justify-between">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faTrophy} className="mr-2" />
          <span className="font-medium">Match</span>
        </div>
        {match.isPrivate && (
          <div className="flex items-center text-yellow-300">
            <FontAwesomeIcon icon={faLock} className="mr-1" />
            <span className="text-xs">Private</span>
          </div>
        )}
      </div>
      
      {/* Match details */}
      <div className="p-4">
        <h3 className="text-white font-bold mb-2 text-md">{match.name}</h3>
        
        <div className="space-y-2 mb-4">
          {/* Teams info */}
          <div className="flex items-center text-gray-300">
            <FontAwesomeIcon icon={faUsers} className="w-5 text-center mr-2" />
            <span>
              {match.teamsJoined || 0} / {match.teamQuota} teams
            </span>
          </div>
          
          {/* Time info */}
          <div className="flex items-center text-gray-300">
            <FontAwesomeIcon icon={faClock} className="w-5 text-center mr-2" />
            <div className="flex flex-col">
              <span>{formattedDate} at {formattedTime}</span>
              <span className="text-xs text-purple-400">
                {getTimeUntilMatch()} until match
              </span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-1 gap-2">
          <Button 
            text="Join Match" 
            variant="primary"
            size="small" 
            onClick={handleJoinMatch}
            disabled={match.teamsJoined >= match.teamQuota}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchCard;