import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

const NextMatch = () => {
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch registered tournaments
    const fetchRegisteredTournaments = () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch this data from an API
        // For this demo, we'll use localStorage
        
        // Get all tournaments from localStorage
        const allTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
        
        // For demo purposes, let's assume the player is registered for some tournaments
        // In a real app, you would store user registrations and filter based on that
        const playerRegisteredTournaments = allTournaments.filter(tournament => {
          // For demo, let's pretend the player is registered if the currentParticipants > 10
          return tournament.currentParticipants > 10 && 
                 new Date(tournament.startDate) > new Date(); // Only show upcoming tournaments
        });
        
        // Sort by start date (nearest first)
        const sortedTournaments = playerRegisteredTournaments.sort((a, b) => {
          return new Date(a.startDate) - new Date(b.startDate);
        });
        
        // Take the first 3 (or fewer if there aren't that many)
        const nearestTournaments = sortedTournaments.slice(0, 3);
        
        setUpcomingTournaments(nearestTournaments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setIsLoading(false);
      }
    };
    
    fetchRegisteredTournaments();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate time until tournament starts
  const getTimeUntil = (dateString) => {
    const tournamentDate = new Date(dateString);
    const now = new Date();
    const diffTime = tournamentDate - now;
    
    // If already started, return empty string
    if (diffTime <= 0) return '';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    } else {
      return `Starts in ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    }
  };

  // Generate placeholder team names based on tournament name
  const getTeamNames = (tournamentName) => {
    const words = tournamentName.split(' ');
    if (words.length >= 2) {
      return {
        teamA: `${words[0]} Legends`,
        teamB: `${words[1]} Guardians`
      };
    } else {
      return {
        teamA: `${tournamentName} Alpha`,
        teamB: `${tournamentName} Omega`
      };
    }
  };

  return (
    <section className="mt-6">
      <h2 className="text-3xl font-semibold mb-4 text-center">Your Upcoming Matches</h2>

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
      ) : upcomingTournaments.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-2xl text-center">
          <p className="text-xl text-gray-300 mb-4">You haven't registered for any upcoming tournaments yet.</p>
          <Link to="/player/tournaments">
            <Button>Find Tournaments</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingTournaments.map((tournament, index) => {
            const { teamA, teamB } = getTeamNames(tournament.name);
            return (
              <div key={tournament.id} className="bg-gray-800/50 rounded-xl p-6 shadow-2xl backdrop-blur-2xl border border-white/20">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-white">{tournament.name}</h3>
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {getTimeUntil(tournament.startDate)}
                    </span>
                  </div>
                  <p className="text-xl text-gray-400 text-center mb-6">Date: {formatDate(tournament.startDate)}</p>
                  
                  <div className="flex justify-between items-center p-2 mx-4 md:mx-14">
                    <div className="text-center">
                      <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-3">
                        <span className="text-2xl md:text-4xl font-bold text-white">{teamA.charAt(0)}</span>
                      </div>
                      <p className="text-xl md:text-2xl font-semibold">{teamA}</p>
                    </div>
                    <div>
                      <p className="text-3xl md:text-5xl font-bold text-white">VS</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-red-600 to-orange-600 rounded-full mx-auto flex items-center justify-center mb-3">
                        <span className="text-2xl md:text-4xl font-bold text-white">{teamB.charAt(0)}</span>
                      </div>
                      <p className="text-xl md:text-2xl font-semibold">{teamB}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center items-center gap-4">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 mb-2">Prize Pool</p>
                    <p className="text-xl text-green-400 font-bold">{tournament.prizePool} ₮</p>
                  </div>
                  <div className="border-r border-gray-600 h-12 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 mb-2">Participants</p>
                    <p className="text-xl text-white font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Link to={`/player/tournament/${tournament.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-center mt-4">
            <Link to="/player/tournament">
              <Button className="bg-gray-700 hover:bg-gray-600">
                View All Tournaments
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default NextMatch;