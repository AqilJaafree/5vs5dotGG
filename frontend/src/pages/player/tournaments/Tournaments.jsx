import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);

  // Load tournaments from localStorage
  useEffect(() => {
    const fetchTournaments = async () => {
      setIsLoading(true);
      try {
        // Check localStorage for existing tournaments
        const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
        
        // If no tournaments exist, create mock data
        if (storedTournaments.length === 0) {
          // Current date for comparison
          const currentDate = new Date();
          
          // Create some mock tournaments
          const mockTournaments = [
            {
              id: 't1',
              name: 'Battle of Legends',
              description: 'The ultimate test of skill and strategy. Prove your worth among the best players.',
              startDate: new Date(currentDate.getTime() + 0 * 0 * 0 * 0 * 0).toISOString(), // 3 days from now
              endDate: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
              entryFee: 50,
              prizePool: 5000,
              maxParticipants: 64,
              currentParticipants: 28,
              createdBy: 'GameMaster',
              status: 'registration',
              rules: 'Single elimination bracket. Best of 3 matches.',
              registeredTeams: [],
              teamRequired: true,
              rewards: [
                { position: '1st', reward: '2500 ₮' },
                { position: '2nd', reward: '1250 ₮' },
                { position: '3rd-4th', reward: '625 ₮' }
              ]
            },
            {
              id: 't2',
              name: 'Weekly Showdown',
              description: 'Weekly tournament for players of all skill levels. Great way to test your teams!',
              startDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
              endDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // 7 days + 8 hours
              entryFee: 20,
              prizePool: 1000,
              maxParticipants: 32,
              currentParticipants: 14,
              createdBy: 'TournamentBot',
              status: 'registration',
              rules: 'Double elimination bracket. Best of 1 matches until finals.',
              registeredTeams: [],
              teamRequired: true,
              rewards: [
                { position: '1st', reward: '500 ₮' },
                { position: '2nd', reward: '300 ₮' },
                { position: '3rd', reward: '200 ₮' }
              ]
            },
            {
              id: 't3',
              name: 'Mystic Masters Invitational',
              description: 'Elite competition for the top-ranked players. Spectator-friendly event with live commentary.',
              startDate: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
              endDate: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
              entryFee: 100,
              prizePool: 10000,
              maxParticipants: 16,
              currentParticipants: 16,
              createdBy: 'GameMaster',
              status: 'in_progress',
              rules: 'Single elimination bracket. Best of 5 matches.',
              registeredTeams: [],
              teamRequired: true,
              rewards: [
                { position: '1st', reward: '5000 ₮' },
                { position: '2nd', reward: '2500 ₮' },
                { position: '3rd-4th', reward: '1250 ₮' }
              ]
            },
            {
              id: 't4',
              name: 'Beginner\'s Playground',
              description: 'Tournament specifically for new players. Learn and compete in a friendly environment.',
              startDate: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
              endDate: new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
              entryFee: 10,
              prizePool: 500,
              maxParticipants: 32,
              currentParticipants: 8,
              createdBy: 'NewPlayerLobby',
              status: 'registration',
              rules: 'Swiss format, 5 rounds. No eliminations until final top 8.',
              registeredTeams: [],
              teamRequired: true,
              rewards: [
                { position: '1st', reward: '200 ₮' },
                { position: '2nd', reward: '150 ₮' },
                { position: '3rd', reward: '100 ₮' },
                { position: '4th', reward: '50 ₮' }
              ]
            },
            {
              id: 't5',
              name: 'Champion\'s Arena',
              description: 'High-stakes tournament for the most dedicated players. Show your skill and earn bragging rights.',
              startDate: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
              endDate: new Date(currentDate.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
              entryFee: 75,
              prizePool: 7500,
              maxParticipants: 32,
              currentParticipants: 32,
              createdBy: 'ArenaManager',
              status: 'completed',
              winner: 'DragonSlayer92',
              rules: 'Double elimination bracket. Best of 3 matches.',
              registeredTeams: [],
              teamRequired: true,
              rewards: [
                { position: '1st', reward: '3750 ₮' },
                { position: '2nd', reward: '2250 ₮' },
                { position: '3rd', reward: '1500 ₮' }
              ]
            }
          ];
          
          // Save to localStorage
          localStorage.setItem('tournaments', JSON.stringify(mockTournaments));
          setTournaments(mockTournaments);
        } else {
          setTournaments(storedTournaments);
        }
        
        // Get teams from localStorage - won't create mock teams if none exist
        const storedTeams = JSON.parse(localStorage.getItem('userTeams') || '[]');
        setTeams(storedTeams);
        
        // Simulate network delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setIsLoading(false);
      }
    };
    
    fetchTournaments();
  }, []);

  // Filter tournaments based on active filter
  const filteredTournaments = tournaments.filter(tournament => {
    const currentDate = new Date();
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    
    if (activeFilter === 'upcoming') {
      return startDate > currentDate;
    } else if (activeFilter === 'active') {
      return currentDate >= startDate && currentDate <= endDate;
    } else if (activeFilter === 'past') {
      return endDate < currentDate;
    } else if (activeFilter === 'my') {
      // In a real app, would filter by user's created/joined tournaments
      // For now, just filter by a mock creator ID
      return tournament.createdBy === 'CurrentPlayer';
    }
    
    return true; // 'all' filter
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Open team selection modal
  const openTeamSelectionModal = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setShowTeamModal(true);
  };

  // Close team selection modal
  const closeTeamSelectionModal = () => {
    setShowTeamModal(false);
    setSelectedTeam('');
    setSelectedTournamentId(null);
  };

  // Handle registration for a tournament with selected team
  const handleRegisterWithTeam = () => {
    if (!selectedTeam) {
      alert("Please select a team to continue registration.");
      return;
    }
    
    // Find selected team
    const team = teams.find(t => t.id === selectedTeam);
    if (!team) {
      alert("Selected team not found.");
      return;
    }
    
    // Update tournament with registered team
    const updatedTournaments = tournaments.map(tournament => {
      if (tournament.id === selectedTournamentId) {
        // Check if team is already registered for this tournament
        if (tournament.registeredTeams?.some(t => t.id === selectedTeam)) {
          alert(`Team "${team.name}" is already registered for this tournament.`);
          return tournament;
        }
        
        return {
          ...tournament,
          currentParticipants: tournament.currentParticipants + 1,
          registeredTeams: [...(tournament.registeredTeams || []), {
            id: team.id,
            name: team.name,
            registeredAt: new Date().toISOString(),
            playerId: 'CurrentPlayerId' // In a real app, this would be the logged-in user's ID
          }]
        };
      }
      return tournament;
    });
    
    setTournaments(updatedTournaments);
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
    
    // Close modal and reset selection
    closeTeamSelectionModal();
    
    alert(`Successfully registered team "${team.name}" for the tournament!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Tournaments</h1>
          <Link to="/player/tournament/create">
            <Button>
              <span className="flex items-center">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                Create Tournament
              </span>
            </Button>
          </Link>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex overflow-x-auto mb-6 bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-1">
          {["all", "upcoming", "active", "past", "my"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 whitespace-nowrap rounded-lg text-sm font-medium ${
                activeFilter === filter 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} Tournaments
            </button>
          ))}
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
            {/* Empty State */}
            {filteredTournaments.length === 0 ? (
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">No Tournaments Found</h3>
                <p className="text-gray-400 mb-6">
                  {activeFilter === 'my' 
                    ? "You haven't created or joined any tournaments yet." 
                    : `No ${activeFilter} tournaments are available right now.`
                  }
                </p>
                {activeFilter === 'my' && (
                  <Link to="/player/tournament/create">
                    <Button>
                      <span className="flex items-center">
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                          />
                        </svg>
                        Create Your First Tournament
                      </span>
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              /* Tournament List */
              <div className="space-y-6">
                {filteredTournaments.map(tournament => {
                  // Determine tournament status for UI
                  const currentDate = new Date();
                  const startDate = new Date(tournament.startDate);
                  const endDate = new Date(tournament.endDate);
                  
                  let statusColor = "bg-blue-600"; // Default - registration
                  let statusText = "Registration Open";
                  
                  if (tournament.status === 'in_progress' || (currentDate >= startDate && currentDate <= endDate)) {
                    statusColor = "bg-green-600";
                    statusText = "In Progress";
                  } else if (tournament.status === 'completed' || currentDate > endDate) {
                    statusColor = "bg-gray-600";
                    statusText = "Completed";
                  } else if (tournament.currentParticipants >= tournament.maxParticipants) {
                    statusColor = "bg-yellow-600";
                    statusText = "Full";
                  }
                  
                  // Check if the player has already registered for this tournament
                  const playerTeamRegistered = tournament.registeredTeams?.some(
                    team => team.playerId === 'CurrentPlayerId'
                  );
                  
                  return (
                    <motion.div
                      key={tournament.id}
                      className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-xl"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="">
                        {/* Tournament Details */}
                        <div className=" p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-2xl font-bold text-white mb-2">{tournament.name}</h2>
                              <p className="text-gray-400 text-sm mb-4">Organized by {tournament.createdBy}</p>
                            </div>
                            <div className={`${statusColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                              {statusText}
                            </div>
                          </div>
                          
                          <p className="text-gray-300 mb-4">
                            {tournament.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-gray-400 text-sm">Start Date</p>
                              <p className="text-white font-medium">{formatDate(tournament.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">End Date</p>
                              <p className="text-white font-medium">{formatDate(tournament.endDate)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Entry Fee</p>
                              <p className="text-white font-medium">{tournament.entryFee} ₮</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Prize Pool</p>
                              <p className="text-green-400 font-bold">{tournament.prizePool} ₮</p>
                            </div>
                          </div>
                          
                          {/* Team Participation Note */}
                          {tournament.teamRequired && (
                            <p className="text-yellow-400 text-sm mb-4">
                              <svg 
                                className="inline-block w-4 h-4 mr-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                              </svg>
                              Team participation is required for this tournament
                            </p>
                          )}
                          
                          {/* Registration Status */}
                          {playerTeamRegistered && (
                            <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-3 mb-4">
                              <p className="text-green-400 font-medium flex items-center">
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                  />
                                </svg>
                                You are already registered for this tournament
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-center items-center gap-2">
                            <Link to={`/player/tournament/${tournament.id}`}>
                              <Button>
                                View Details
                              </Button>
                            </Link>
                            
                            {/* Only show register button for tournaments in registration phase */}
                            {(statusText === "Registration Open" && !playerTeamRegistered) && (
                              <Button
                                onClick={() => openTeamSelectionModal(tournament.id)}
                              >
                                Register Now
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Tournament Stats & Progress */}
                        {/* <div className="md:w-1/3 bg-gray-800 p-6 flex flex-col justify-between"> */}
                          {/* <div>
                            <h3 className="text-white font-bold mb-2">Tournament Info</h3>
                            
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-300 mb-1">
                                <span>Participants</span>
                                <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-500 h-2.5 rounded-full" 
                                  style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {tournament.rewards && tournament.rewards.slice(0, 3).map((reward, index) => (
                                <div key={index} className="flex justify-between">
                                  <span className="text-gray-300">{reward.position}</span>
                                  <span className="text-green-400 font-medium">{reward.reward}</span>
                                </div>
                              ))}
                            </div>
                          </div> */}
                          
                          {/* Show winner for completed tournaments */}
                          {/* {tournament.winner && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                              <p className="text-gray-300 text-sm">Winner</p>
                              <p className="text-yellow-400 font-bold">{tournament.winner}</p>
                            </div>
                          )} */}
                        {/* </div> */}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </motion.div>
      
      {/* Team Selection Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-70" onClick={closeTeamSelectionModal}></div>
          <div className="bg-gray-900 rounded-xl shadow-2xl z-10 w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Select Team</h3>
              <p className="text-gray-300 mb-6">
                Please select the team you want to register with for this tournament.
              </p>
              
              {teams.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {teams.map(team => (
                    <div
                      key={team.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTeam === team.id
                          ? 'border-purple-500 bg-purple-900 bg-opacity-20'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedTeam(team.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-medium">{team.name}</h4>
                          <p className="text-sm text-gray-400">
                            {team.members ? `${team.members} members` : ''} 
                            {team.rank ? `${team.members ? ' • ' : ''}${team.rank} rank` : ''}
                          </p>
                        </div>
                        {selectedTeam === team.id && (
                          <svg 
                            className="w-6 h-6 text-purple-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">You don't have any teams in localStorage. Please create a team first.</p>
                  <Link to="/player/teams/create">
                    <Button>Create a Team First</Button>
                  </Link>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button 
                  className="flex-1 bg-gray-700 hover:bg-gray-600"
                  onClick={closeTeamSelectionModal}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleRegisterWithTeam}
                  disabled={!selectedTeam || teams.length === 0}
                >
                  Register Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;