import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [error, setError] = useState(null);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Load tournament and user teams from localStorage
  useEffect(() => {
    const fetchTournamentData = async () => {
      setIsLoading(true);
      try {
        // Get tournaments from localStorage
        const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
        
        // Find the specific tournament by ID
        const foundTournament = storedTournaments.find(t => t.id === id);
        
        if (!foundTournament) {
          setError('Tournament not found');
          setIsLoading(false);
          return;
        }
        
        // Get user teams from localStorage
        const storedTeams = JSON.parse(localStorage.getItem('userTeams') || '[]');
        
        setTournament(foundTournament);
        setUserTeams(storedTeams);
        
        // Simulate network delay for loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching tournament data:', error);
        setError('An error occurred while loading the tournament details');
        setIsLoading(false);
      }
    };
    
    fetchTournamentData();
  }, [id]);
  
  // Determine tournament status based on dates and status field
  const getTournamentStatus = () => {
    if (!tournament) return { text: 'Unknown', color: 'bg-gray-600' };
    
    const currentDate = new Date();
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    
    if (tournament.status === 'completed' || currentDate > endDate) {
      return { text: 'Completed', color: 'bg-gray-600' };
    } else if (tournament.status === 'in_progress' || (currentDate >= startDate && currentDate <= endDate)) {
      return { text: 'In Progress', color: 'bg-green-600' };
    } else if (tournament.currentParticipants >= tournament.maxParticipants) {
      return { text: 'Registration Full', color: 'bg-yellow-600' };
    } else {
      return { text: 'Registration Open', color: 'bg-blue-600' };
    }
  };
  
  // Check if player is already registered
  const isPlayerRegistered = () => {
    if (!tournament || !tournament.registeredTeams) return false;
    return tournament.registeredTeams.some(team => team.playerId === 'CurrentPlayerId');
  };
  
  // Open team selection modal
  const openTeamSelectionModal = () => {
    setShowTeamModal(true);
  };
  
  // Close team selection modal
  const closeTeamSelectionModal = () => {
    setShowTeamModal(false);
    setSelectedTeam('');
  };
  
  // Handle registration for tournament with selected team
  const handleRegisterWithTeam = () => {
    if (!selectedTeam) {
      alert("Please select a team to continue registration.");
      return;
    }
    
    // Find selected team
    const team = userTeams.find(t => t.id === selectedTeam);
    if (!team) {
      alert("Selected team not found.");
      return;
    }
    
    // Update tournament with registered team
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    
    const updatedTournaments = storedTournaments.map(t => {
      if (t.id === tournament.id) {
        // Check if team is already registered for this tournament
        if (t.registeredTeams?.some(rt => rt.id === selectedTeam)) {
          alert(`Team "${team.name}" is already registered for this tournament.`);
          return t;
        }
        
        return {
          ...t,
          currentParticipants: t.currentParticipants + 1,
          registeredTeams: [...(t.registeredTeams || []), {
            id: team.id,
            name: team.name,
            registeredAt: new Date().toISOString(),
            playerId: 'CurrentPlayerId' // In a real app, this would be the logged-in user's ID
          }]
        };
      }
      return t;
    });
    
    // Save updated tournaments to localStorage
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
    
    // Update tournament state
    const updatedTournament = updatedTournaments.find(t => t.id === tournament.id);
    setTournament(updatedTournament);
    
    // Close modal and reset selection
    closeTeamSelectionModal();
    
    alert(`Successfully registered team "${team.name}" for the tournament!`);
  };
  
  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      </div>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 text-center">
          <svg 
            className="h-16 w-16 text-red-500 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">Error</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={() => navigate('/player/tournaments')}>
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }
  
  // If tournament not found, show error
  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 text-center">
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
          <h3 className="text-xl font-bold text-white mb-2">Tournament Not Found</h3>
          <p className="text-gray-400 mb-6">The tournament you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/player/tournaments')}>
            Browse Tournaments
          </Button>
        </div>
      </div>
    );
  }
  
  // Get tournament status
  const status = getTournamentStatus();
  
  // Check registration status
  const playerRegistered = isPlayerRegistered();
  const registrationClosed = status.text !== 'Registration Open';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back button and status */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/player/tournaments')}
            className="flex items-center text-gray-400 hover:text-white transition"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Tournaments
          </button>
          
          <div className={`${status.color} text-white text-sm font-bold px-4 py-1 rounded-full`}>
            {status.text}
          </div>
        </div>
        
        {/* Tournament Header */}
        <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden mb-6">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{tournament.name}</h1>
            <p className="text-gray-400 mb-4">Organized by {tournament.createdBy}</p>
            
            <p className="text-gray-300 mb-6">
              {tournament.description}
            </p>
            
            {/* Registration Status */}
            {playerRegistered && (
              <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-4 mb-6">
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
                  You are registered for this tournament
                </p>
                
                {/* If tournament is in the future, show your registered team */}
                {tournament.registeredTeams && tournament.registeredTeams.find(team => team.playerId === 'CurrentPlayerId') && (
                  <p className="text-gray-300 mt-2 pl-7">
                    Registered Team: <span className="text-white font-medium">
                      {tournament.registeredTeams.find(team => team.playerId === 'CurrentPlayerId').name}
                    </span>
                  </p>
                )}
              </div>
            )}
            
            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Start Date</p>
                <p className="text-white font-medium">{formatDate(tournament.startDate)}</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">End Date</p>
                <p className="text-white font-medium">{formatDate(tournament.endDate)}</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Entry Fee</p>
                <p className="text-white font-medium">{tournament.entryFee} ₮</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Prize Pool</p>
                <p className="text-green-400 font-bold">{tournament.prizePool} ₮</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rules Section */}
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Tournament Rules</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line">{tournament.rules}</p>
              </div>
            </div>
            
            {/* Registered Teams Section */}
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Registered Teams</h2>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Participation</span>
                  <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Team List */}
              {tournament.registeredTeams && tournament.registeredTeams.length > 0 ? (
                <div className="space-y-3">
                  {tournament.registeredTeams.map((team, index) => (
                    <div key={index} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">{team.name}</h3>
                        <p className="text-gray-400 text-sm">
                          Registered on {formatDate(team.registeredAt)}
                        </p>
                      </div>
                      
                      {/* Highlight if this is the player's team */}
                      {team.playerId === 'CurrentPlayerId' && (
                        <span className="text-xs text-green-400 font-bold bg-green-900 bg-opacity-30 px-3 py-1 rounded-full">
                          Your Team
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-gray-400">No teams have registered yet</p>
                </div>
              )}
              
              {/* Register Button - only show if registration is open and player not registered */}
              {!playerRegistered && !registrationClosed && (
                <div className="mt-6">
                  <Button 
                    onClick={openTeamSelectionModal}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Register for Tournament
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Prize Distribution */}
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Prize Distribution</h2>
              
              {tournament.rewards && tournament.rewards.length > 0 ? (
                <div className="space-y-4">
                  {tournament.rewards.map((reward, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        {index === 0 && (
                          <svg 
                            className="w-6 h-6 text-yellow-400 mr-2" 
                            fill="currentColor" 
                            viewBox="0 0 20 20" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-white font-medium">{reward.position}</span>
                      </div>
                      <span className="text-green-400 font-bold">{reward.reward}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No rewards specified</p>
              )}
            </div>
            
            {/* Tournament Information */}
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
              
              <div className="space-y-3">
                {tournament.teamRequired && (
                  <div className="flex items-start">
                    <svg 
                      className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" 
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
                    <p className="text-gray-300">
                      Team registration is required for this tournament
                    </p>
                  </div>
                )}
                
                {tournament.winner && (
                  <div className="flex items-start">
                    <svg 
                      className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" 
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
                    <div>
                      <p className="text-gray-300">
                        Winner: <span className="text-yellow-400 font-bold">{tournament.winner}</span>
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-gray-400 mr-2 mt-0.5" 
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
                  <div>
                    <p className="text-gray-300">
                      Duration: {Math.ceil((new Date(tournament.endDate) - new Date(tournament.startDate)) / (1000 * 60 * 60))} hours
                    </p>
                  </div>
                </div>
                
                {tournament.createdAt && (
                  <div className="flex items-start">
                    <svg 
                      className="w-5 h-5 text-gray-400 mr-2 mt-0.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <div>
                      <p className="text-gray-300">
                        Created: {formatDate(tournament.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
              
              {userTeams.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {userTeams.map(team => (
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
                  disabled={!selectedTeam || userTeams.length === 0}
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

export default TournamentDetail;