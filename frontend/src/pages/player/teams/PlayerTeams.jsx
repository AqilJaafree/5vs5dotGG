import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TeamCard from '../../../components/TeamCard';
import Button from '../../../components/ui/Button';

const PlayerTeams = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        // Check localStorage for saved teams first
        const localStorageTeams = JSON.parse(localStorage.getItem('playerTeams') || '[]');
        
        // If no teams in localStorage, use the mock data
        if (localStorageTeams.length === 0) {
          // Simulated data for demonstration
          const mockData = [
            {
              id: '1',
              name: 'Cyber Dominators',
              description: 'A team of high-tech warriors with enhanced cybernetic abilities.',
              logo: 'https://via.placeholder.com/150x150?text=CD',
              createdAt: '2025-04-15',
              stats: {
                attack: 82,
                defense: 75,
                speed: 70,
                health: 780,
                mana: 650
              },
              members: [
                {
                  id: '1',
                  name: 'Cyber Samurai',
                  image: 'https://via.placeholder.com/100x100?text=Cyber+Samurai',
                  rarity: 'Epic'
                },
                {
                  id: '4',
                  name: 'Quantum Knight',
                  image: 'https://via.placeholder.com/100x100?text=Quantum+Knight',
                  rarity: 'Epic'
                },
                {
                  id: '6',
                  name: 'Neon Assassin',
                  image: 'https://via.placeholder.com/100x100?text=Neon+Assassin',
                  rarity: 'Uncommon'
                },
                null,
                null
              ],
              matches: {
                won: 12,
                lost: 5,
                total: 17
              }
            },
            {
              id: '2',
              name: 'Mystic Guardians',
              description: 'Ancient defenders with mystical powers and timeless wisdom.',
              logo: 'https://via.placeholder.com/150x150?text=MG',
              createdAt: '2025-04-18',
              stats: {
                attack: 70,
                defense: 92,
                speed: 65,
                health: 950,
                mana: 850
              },
              members: [
                {
                  id: '2',
                  name: 'Mystic Dragon',
                  image: 'https://via.placeholder.com/100x100?text=Mystic+Dragon',
                  rarity: 'Legendary'
                },
                {
                  id: '5',
                  name: 'Ancient Guardian',
                  image: 'https://via.placeholder.com/100x100?text=Ancient+Guardian',
                  rarity: 'Mythic'
                },
                null,
                null,
                null
              ],
              matches: {
                won: 7,
                lost: 3,
                total: 10
              }
            }
          ];
          
          // Save mock data to localStorage for future use
          localStorage.setItem('playerTeams', JSON.stringify(mockData));
          
          // Simulate network delay
          setTimeout(() => {
            setTeams(mockData);
            setIsLoading(false);
          }, 1000);
        } else {
          // Use teams from localStorage
          setTimeout(() => {
            setTeams(localStorageTeams);
            setIsLoading(false);
          }, 500); // Shorter delay for localStorage data
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        setIsLoading(false);
      }
    };
    
    fetchTeams();
  }, []);

  // Filter teams based on active filter
  const getFilteredTeams = () => {
    if (activeFilter === 'all') return teams;
    if (activeFilter === 'full') return teams.filter(team => team.members.every(member => member !== null));
    if (activeFilter === 'partial') return teams.filter(team => {
      const filledSlots = team.members.filter(member => member !== null).length;
      return filledSlots > 0 && filledSlots < 5;
    });
    return teams;
  };

  const filteredTeams = getFilteredTeams();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Teams</h1>
          <Link to="/player/teams/create">
            <Button>
              Create New Team
            </Button>
          </Link>
        </div>
        
        {/* Filters */}
        <div className="flex mb-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All Teams
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeFilter === 'full' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveFilter('full')}
          >
            Full Teams (5 NFTs)
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeFilter === 'partial' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveFilter('partial')}
          >
            Partial Teams
          </button>
        </div>
        
        {/* Loading State */}
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
        ) : (
          <>
            {teams.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">No Teams Yet</h3>
                <p className="text-gray-400 mb-6">
                  You haven't created any teams yet. Create your first team to get started!
                </p>
                <Link to="/player/teams/create">
                  <Button>
                    Create Your First Team
                  </Button>
                </Link>
              </div>
            ) : filteredTeams.length === 0 ? (
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
                <h3 className="text-xl font-bold text-white mb-2">No Matching Teams</h3>
                <p className="text-gray-400 mb-4">
                  No teams match your current filter selection.
                </p>
                <Button
                  onClick={() => setActiveFilter('all')}
                >
                  Show All Teams
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTeams.map(team => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PlayerTeams;