import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

// MOBA roles constants
const ROLES = {
  TOP: 'Top Lane',
  MID: 'Mid Lane',
  BOT: 'Bot Lane',
  JUNGLER: 'Jungler',
  SUPPORT: 'Support'
};

const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch team details
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual API call
        // const response = await fetch(`/api/teams/${teamId}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockTeam = {
          id: parseInt(teamId),
          name: `Team Alpha ${teamId}`,
          description: 'A balanced team with strong lane presence and team fight capabilities.',
          createdAt: new Date().toISOString(),
          wins: Math.floor(Math.random() * 20),
          losses: Math.floor(Math.random() * 10),
          heroes: [
            {
              id: 1,
              name: 'Hero #1',
              image: 'https://via.placeholder.com/150?text=Hero1',
              rarity: 'Legendary',
              class: 'Tank',
              role: 'TOP',
              stats: {
                power: 85,
                defense: 90,
                speed: 45
              }
            },
            {
              id: 2,
              name: 'Hero #2',
              image: 'https://via.placeholder.com/150?text=Hero2',
              rarity: 'Epic',
              class: 'Mage',
              role: 'MID',
              stats: {
                power: 95,
                defense: 30,
                speed: 60
              }
            },
            {
              id: 3,
              name: 'Hero #3',
              image: 'https://via.placeholder.com/150?text=Hero3',
              rarity: 'Epic',
              class: 'Marksman',
              role: 'BOT',
              stats: {
                power: 90,
                defense: 25,
                speed: 70
              }
            },
            {
              id: 4,
              name: 'Hero #4',
              image: 'https://via.placeholder.com/150?text=Hero4',
              rarity: 'Rare',
              class: 'Assassin',
              role: 'JUNGLER',
              stats: {
                power: 80,
                defense: 40,
                speed: 85
              }
            },
            {
              id: 5,
              name: 'Hero #5',
              image: 'https://via.placeholder.com/150?text=Hero5',
              rarity: 'Uncommon',
              class: 'Support',
              role: 'SUPPORT',
              stats: {
                power: 50,
                defense: 60,
                speed: 65
              }
            }
          ]
        };
        
        // Simulate API delay
        setTimeout(() => {
          setTeam(mockTeam);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching team details:', err);
        setError('Failed to load team details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchTeamDetails();
  }, [teamId]);
  
  // Navigate back to teams list
  const handleBack = () => {
    navigate('/teams');
  };
  
  // Join a match with this team
  const handleJoinMatch = () => {
    navigate(`/match/join/${teamId}`);
  };
  
  // Edit this team
  const handleEditTeam = () => {
    navigate(`/teams/edit/${teamId}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-red-900 text-white p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Button 
            text="Go Back" 
            variant="outline" 
            onClick={handleBack} 
          />
        </div>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Team Not Found</h2>
          <p className="mb-6">The team you're looking for doesn't exist or has been deleted.</p>
          <Button 
            text="Go Back to Teams" 
            variant="primary" 
            onClick={handleBack} 
          />
        </div>
      </div>
    );
  }
  
  // Calculate team stats
  const teamStats = {
    power: team.heroes.reduce((total, hero) => total + (hero.stats?.power || 0), 0) / team.heroes.length,
    defense: team.heroes.reduce((total, hero) => total + (hero.stats?.defense || 0), 0) / team.heroes.length,
    speed: team.heroes.reduce((total, hero) => total + (hero.stats?.speed || 0), 0) / team.heroes.length,
    winRate: team.wins + team.losses > 0 
      ? Math.round((team.wins / (team.wins + team.losses)) * 100) 
      : 0
  };
  
  return (
    <div className="h-[calc(100svh-9.5rem)] text-white flex flex-col overflow-hidden ">
      {/* Fixed header with navigation */}
      <div className="p-4 border-b border-gray-800 bg-gray-900 z-10 flex justify-between items-center">
        <Button 
          text="← Back" 
          variant="outline" 
          onClick={handleBack} 
        />
        <h1 className="text-xl font-bold">{team.name}</h1>
        <div className="flex gap-2">
          <Button 
            text="Edit" 
            variant="outline" 
            size="small"
            onClick={handleEditTeam} 
          />
          <Button 
            text="Join Match" 
            variant="primary" 
            size="small"
            onClick={handleJoinMatch} 
          />
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 scrollbar-hide">
        {/* Team description and stats */}
        <div className="bg-gray-800 rounded-lg p-4 my-4">
          <p className="text-gray-400 mb-3">{team.description || 'No description'}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="text-purple-400 mr-2">Team Rating:</div>
              <div className="font-semibold">{Math.floor((teamStats.power + teamStats.defense + teamStats.speed) / 3)}</div>
            </div>
            <div className="flex items-center">
              <div className="text-purple-400 mr-2">Win Rate:</div>
              <div className="font-semibold">{teamStats.winRate}%</div>
            </div>
            <div className="flex items-center">
              <div className="text-purple-400 mr-2">Record:</div>
              <div className="font-semibold">{team.wins}W - {team.losses}L</div>
            </div>
          </div>
        </div>
        
        {/* Team stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-3">
            <h3 className="text-lg font-semibold mb-2 text-center">Team Power</h3>
            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-1">
              <div 
                className="absolute top-0 left-0 h-full bg-red-500"
                style={{ width: `${teamStats.power}%` }}
              ></div>
            </div>
            <div className="text-center text-sm">{Math.round(teamStats.power)}/100</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <h3 className="text-lg font-semibold mb-2 text-center">Team Defense</h3>
            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-1">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500"
                style={{ width: `${teamStats.defense}%` }}
              ></div>
            </div>
            <div className="text-center text-sm">{Math.round(teamStats.defense)}/100</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <h3 className="text-lg font-semibold mb-2 text-center">Team Speed</h3>
            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-1">
              <div 
                className="absolute top-0 left-0 h-full bg-green-500"
                style={{ width: `${teamStats.speed}%` }}
              ></div>
            </div>
            <div className="text-center text-sm">{Math.round(teamStats.speed)}/100</div>
          </div>
        </div>
        
        {/* MOBA map visualization */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 ">
          <h2 className="text-xl font-bold mb-3">Lane Assignments</h2>
          <div className="relative h-72 bg-gray-900 rounded-lg border border-gray-700">
            {/* Top lane */}
            <div className="absolute top-0 left-0 w-1/2 h-1/3 flex justify-center items-center border-r border-b border-gray-700">
              <div className="text-center">
                <div className="mb-1 text-sm text-gray-400">Top Lane</div>
                {team.heroes.find(h => h.role === 'TOP') ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={team.heroes.find(h => h.role === 'TOP').image} 
                      alt={team.heroes.find(h => h.role === 'TOP').name}
                      className="w-14 h-14 rounded-full border-2 border-purple-500 mb-1"
                    />
                    <div className="text-xs font-semibold">
                      {team.heroes.find(h => h.role === 'TOP').name}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">Empty</div>
                )}
              </div>
            </div>
            
            {/* Mid lane */}
            <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 flex justify-center items-center border border-gray-700">
              <div className="text-center">
                <div className="mb-1 text-sm text-gray-400">Mid Lane</div>
                {team.heroes.find(h => h.role === 'MID') ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={team.heroes.find(h => h.role === 'MID').image} 
                      alt={team.heroes.find(h => h.role === 'MID').name}
                      className="w-14 h-14 rounded-full border-2 border-purple-500 mb-1"
                    />
                    <div className="text-xs font-semibold">
                      {team.heroes.find(h => h.role === 'MID').name}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">Empty</div>
                )}
              </div>
            </div>
            
            {/* Bot lane */}
            <div className="absolute bottom-0 right-0 w-1/2 h-1/3 flex justify-center items-center border-l border-t border-gray-700">
              <div className="text-center">
                <div className="mb-1 text-sm text-gray-400">Bot Lane</div>
                {team.heroes.find(h => h.role === 'BOT') ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={team.heroes.find(h => h.role === 'BOT').image} 
                      alt={team.heroes.find(h => h.role === 'BOT').name}
                      className="w-14 h-14 rounded-full border-2 border-purple-500 mb-1"
                    />
                    <div className="text-xs font-semibold">
                      {team.heroes.find(h => h.role === 'BOT').name}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">Empty</div>
                )}
              </div>
            </div>
            
            {/* Jungler */}
            <div className="absolute top-1/4 right-3/4 w-1/4 h-1/4 flex justify-center items-center">
              <div className="text-center">
                <div className="mb-1 text-xs text-gray-400">Jungler</div>
                {team.heroes.find(h => h.role === 'JUNGLER') ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={team.heroes.find(h => h.role === 'JUNGLER').image} 
                      alt={team.heroes.find(h => h.role === 'JUNGLER').name}
                      className="w-10 h-10 rounded-full border-2 border-purple-500 mb-1"
                    />
                    <div className="text-xs font-semibold">
                      {team.heroes.find(h => h.role === 'JUNGLER').name}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 text-xs">Empty</div>
                )}
              </div>
            </div>
            
            {/* Support */}
            <div className="absolute bottom-1/4 left-3/4 w-1/4 h-1/4 flex justify-center items-center">
              <div className="text-center">
                <div className="mb-1 text-xs text-gray-400">Support</div>
                {team.heroes.find(h => h.role === 'SUPPORT') ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={team.heroes.find(h => h.role === 'SUPPORT').image} 
                      alt={team.heroes.find(h => h.role === 'SUPPORT').name}
                      className="w-10 h-10 rounded-full border-2 border-purple-500 mb-1"
                    />
                    <div className="text-xs font-semibold">
                      {team.heroes.find(h => h.role === 'SUPPORT').name}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 text-xs">Empty</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Team heroes details */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Team Heroes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.heroes.map(hero => (
              <div key={hero.id} className="bg-gray-800 rounded-lg p-3 flex">
                <img 
                  src={hero.image} 
                  alt={hero.name} 
                  className="w-20 h-20 rounded-lg mr-3 object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold">{hero.name}</h3>
                  <div className="text-sm text-purple-400 mb-1">{hero.class} • {hero.rarity}</div>
                  {hero.role && (
                    <div className="text-sm text-gray-400 mb-2">
                      Role: {ROLES[hero.role]}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-400">POW</div>
                      <div className="font-semibold">{hero.stats?.power || 0}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">DEF</div>
                      <div className="font-semibold">{hero.stats?.defense || 0}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">SPD</div>
                      <div className="font-semibold">{hero.stats?.speed || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team match history */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-3">Recent Matches</h2>
          {team.wins + team.losses > 0 ? (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-2 px-3 text-left">Result</th>
                    <th className="py-2 px-3 text-left">Opponent</th>
                    <th className="py-2 px-3 text-left">Score</th>
                    <th className="py-2 px-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock match history data */}
                  {Array(5).fill().map((_, index) => {
                    const isWin = Math.random() > 0.4;
                    const date = new Date();
                    date.setDate(date.getDate() - index);
                    
                    return (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            isWin ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                          }`}>
                            {isWin ? 'WIN' : 'LOSS'}
                          </span>
                        </td>
                        <td className="py-2 px-3">Team {['Beta', 'Gamma', 'Delta', 'Omega', 'Sigma'][index]}</td>
                        <td className="py-2 px-3">
                          {isWin 
                            ? `${Math.floor(Math.random() * 10) + 20} - ${Math.floor(Math.random() * 15)}`
                            : `${Math.floor(Math.random() * 15)} - ${Math.floor(Math.random() * 10) + 20}`
                          }
                        </td>
                        <td className="py-2 px-3">{date.toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-800 text-center py-6 rounded-lg">
              <p className="text-gray-400">No matches played yet</p>
            </div>
          )}
        </div>

        {/* CSS for hiding scrollbar */}
        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;     /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;             /* Chrome, Safari and Opera */
          }
        `}</style>
      </div>
    </div>
  );
};

export default TeamDetailsPage;