import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const TeamCard = ({ team }) => {
  // Count filled team slots
  const filledSlots = team.members.filter(member => member !== null).length;
  
  // Calculate team completion percentage
  const completionPercentage = (filledSlots / 5) * 100;
  
  // Calculate win rate
  const winRate = team.matches.total > 0 
    ? Math.round((team.matches.won / team.matches.total) * 100) 
    : 0;

  return (
    <motion.div
      className="bg-gray/50 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl outline-1 outline-white/20"
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="md:flex">
        {/* Team Logo and Basic Info */}
        <div className="md:w-1/3 bg-gradient-to-br from-blue-900 to-purple-900 p-6 flex flex-col items-center justify-center">
          {team.logo ? (
            <img 
              src={team.logo} 
              alt={`${team.name} logo`}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">
                {team.name.split(' ').map(word => word[0]).join('')}
              </span>
            </div>
          )}
          <h2 className="text-white text-xl font-bold text-center mb-1">{team.name}</h2>
          <p className="text-gray-300 text-sm text-center">Created {new Date(team.createdAt).toLocaleDateString()}</p>
          
          {/* Team Completion */}
          <div className="mt-4 w-full">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Team Completion</span>
              <span>{filledSlots}/5 NFTs</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Team Details */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-gray-400 text-sm">Win Rate</h3>
              <p className="text-white font-medium">{winRate}% ({team.matches.won}W/{team.matches.lost}L)</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Total Matches</h3>
              <p className="text-white font-medium">{team.matches.total}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Members</h3>
              <p className="text-white font-medium">{filledSlots}/5</p>
            </div>
          </div>
          
          {/* Team Description */}
          <p className="text-gray-300 mb-4 line-clamp-2">
            {team.description}
          </p>
          
          {/* Team Stats */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <p className="text-red-400 text-xs">ATK</p>
              <p className="text-white font-medium">{team.stats.attack}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <p className="text-blue-400 text-xs">DEF</p>
              <p className="text-white font-medium">{team.stats.defense}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <p className="text-green-400 text-xs">SPD</p>
              <p className="text-white font-medium">{team.stats.speed}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <p className="text-purple-400 text-xs">HP</p>
              <p className="text-white font-medium">{team.stats.health}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <p className="text-cyan-400 text-xs">MANA</p>
              <p className="text-white font-medium">{team.stats.mana}</p>
            </div>
          </div>
          
          {/* Team Members */}
          <div className="mb-4">
            <h3 className="text-white font-medium mb-2">Team Members</h3>
            <div className="flex space-x-2">
              {team.members.map((member, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full overflow-hidden ${!member && 'border-2 border-dashed border-gray-600'}`}
                >
                  {member ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">+</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link to={`/player/teams/${team.id}`} className="flex-1">
              <Button>
                View Details
              </Button>
            </Link>
            <Link to={`/player/teams/${team.id}/edit`} className="flex-1">
              <Button>
                Edit Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;