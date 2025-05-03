import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      setIsLoading(true);
      try {
        // Get teams from localStorage
        const teams = JSON.parse(localStorage.getItem('playerTeams') || '[]');
        
        // Find the team with the matching ID
        const foundTeam = teams.find(t => t.id === id);
        
        // Simulate network delay
        setTimeout(() => {
          if (foundTeam) {
            setTeam(foundTeam);
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching team details:", error);
        setIsLoading(false);
      }
    };
    
    fetchTeamDetails();
  }, [id]);

  const handleDeleteTeam = () => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        // Get current teams from localStorage
        const teams = JSON.parse(localStorage.getItem('playerTeams') || '[]');
        
        // Filter out the team to delete
        const updatedTeams = teams.filter(t => t.id !== id);
        
        // Save updated teams back to localStorage
        localStorage.setItem('playerTeams', JSON.stringify(updatedTeams));
        
        // Navigate back to teams list
        navigate('/player/teams');
      } catch (error) {
        console.error("Error deleting team:", error);
      }
    }
  };

  // Get rarity color for NFT badges
  const getRarityColor = (rarity) => {
    const rarityColors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500',
      mythic: 'bg-red-500'
    };
    
    return rarityColors[rarity?.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <Link to="/player/teams" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Teams
        </Link>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <svg 
              className="animate-spin h-10 w-10 text-purple-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : !team ? (
          <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 text-center">
            <svg 
              className="h-16 w-16 text-gray-500 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Team Not Found</h3>
            <p className="text-gray-400 mb-6">
              The team you're looking for doesn't exist or has been deleted.
            </p>
            <Link to="/player/teams">
              <Button>
                View All Teams
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Team Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                {team.logo ? (
                  <img 
                    src={team.logo} 
                    alt={`${team.name} logo`}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-700 to-purple-700 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-white">
                      {team.name.split(' ').map(word => word[0]).join('')}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                  <p className="text-gray-400">Created on {new Date(team.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link to={`/player/teams/${id}/edit`}>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                      />
                    </svg>
                    Edit Team
                  </Button>
                </Link>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteTeam}
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Team Description */}
              <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                <p className="text-gray-300 mb-6">
                  {team.description || "No description available."}
                </p>
                
                <h3 className="text-lg font-semibold text-white mb-3">Match History</h3>
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-green-500 text-2xl font-bold">{team.matches.won}</p>
                    <p className="text-gray-400 text-sm">Wins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-500 text-2xl font-bold">{team.matches.lost}</p>
                    <p className="text-gray-400 text-sm">Losses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white text-2xl font-bold">{team.matches.total}</p>
                    <p className="text-gray-400 text-sm">Matches</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 text-2xl font-bold">
                      {team.matches.total > 0 
                        ? Math.round((team.matches.won / team.matches.total) * 100) 
                        : 0}%
                    </p>
                    <p className="text-gray-400 text-sm">Win Rate</p>
                  </div>
                </div>
              </div>
              
              {/* Team Stats */}
              <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Team Stats</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Attack</span>
                      <span className="text-white font-medium">{team.stats.attack}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${(team.stats.attack / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Defense</span>
                      <span className="text-white font-medium">{team.stats.defense}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${(team.stats.defense / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Speed</span>
                      <span className="text-white font-medium">{team.stats.speed}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${(team.stats.speed / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Health</span>
                      <span className="text-white font-medium">{team.stats.health}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-purple-500 h-2.5 rounded-full" 
                        style={{ width: `${(team.stats.health / 1200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Mana</span>
                      <span className="text-white font-medium">{team.stats.mana}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-cyan-500 h-2.5 rounded-full" 
                        style={{ width: `${(team.stats.mana / 1000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Team Completion</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Members</span>
                    <span className="text-white font-medium">
                      {team.members.filter(m => m !== null).length}/5
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(team.members.filter(m => m !== null).length / 5) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    Battle Now
                  </Button>
                  
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                      />
                    </svg>
                    Enter Tournament
                  </Button>
                  
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                      />
                    </svg>
                    Team Analysis
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-white font-medium mb-3">Team Code</h3>
                  <div className="bg-gray-900 p-3 rounded-md">
                    <code className="text-lime-400 break-all text-sm">
                      {btoa(team.id + '-' + team.name.replace(/\s/g, '_'))}
                    </code>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Share this code with friends to let them play against your team!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Team Members */}
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Team Members</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {team.members.map((member, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                    {member ? (
                      <>
                        <div className="relative">
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className={`absolute top-2 right-2 ${getRarityColor(member.rarity)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                            {member.rarity}
                          </div>
                          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded-md">
                            Slot {index + 1}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="text-white font-bold truncate">{member.name}</h3>
                          <p className="text-gray-400 text-sm truncate">{member.id}</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <div className="bg-gray-700 rounded-full p-3 mb-2">
                          <svg 
                            className="w-8 h-8 text-gray-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                            />
                          </svg>
                        </div>
                        <p className="text-gray-400">Empty Slot {index + 1}</p>
                        <Link to={`/player/teams/${id}/edit`} className="mt-2 text-blue-400 text-sm">
                          Assign NFT
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default TeamDetails;