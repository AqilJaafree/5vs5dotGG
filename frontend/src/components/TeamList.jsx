import React, { useState, useEffect } from 'react'
import Button from './ui/Button'
import TeamBox from './TeamBox'

const TeamList = () => {
  // State to store user teams
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch teams (mock data for now)
  useEffect(() => {
    // Simulate API call to get user teams
    const fetchTeams = async () => {
      setLoading(true);
      
      // Example data - replace with actual API call
      // const response = await fetch('/api/teams');
      // const data = await response.json();
      
      // Mock data - empty array for new user, or sample teams for existing user
      // Uncomment to simulate existing user with teams
      const mockTeams = [
        { id: 1, name: 'Team Alpha', members: 5 },
        { id: 2, name: 'Team Beta', members: 3 },
        { id: 3, name: 'Team Gamma', members: 4 }
      ];
      
      // Comment out the line above and uncomment this for new user
      // const mockTeams = [];
      
      setTimeout(() => {
        setTeams(mockTeams);
        setLoading(false);
      }, 500);
    };
    
    fetchTeams();
  }, []);
  
  const handleCreateTeam = () => {
    // Handle team creation logic
    console.log('Creating new team...');
    // This would typically open a modal or redirect to team creation page
  };
  
  const handleTeamClick = (teamId) => {
    // Handle team selection/view logic
    console.log(`Selected team: ${teamId}`);
    // This would typically show team details or navigate to team page
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // No teams - show create team prompt
  if (teams.length === 0) {
    return (
      <div className="flex justify-center items-center pt-10">
        <div className="w-72 h-72 rounded-xl outline-2 outline-white p-4 flex flex-col justify-center items-center">
          <div className="text-center text-xl pb-6 w-full">
            <span className="block text-center">You don't have any team yet!</span>
          </div>
          <div className="flex justify-center items-center w-full">
            <Button 
              text="Create Team" 
              variant="primary" 
              size="large"
              onClick={handleCreateTeam}
            />
          </div>
        </div>
      </div>
    );
  }
  
  // User has teams - show team list with add team button in a 4-column grid
  return (
    <div className="w-full px-4">
      <h2 className="pt-10 text-2xl font-semibold mb-6 text-center">Your Teams</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 justify-items-center">
        {/* Map through and display user teams */}
        {teams.map(team => (
          <TeamBox 
            key={team.id}
            teamName={team.name}
            memberCount={team.members}
            onClick={() => handleTeamClick(team.id)}
          />
        ))}
        
        {/* Add team button */}
        <TeamBox 
          isAddButton={true}
          onClick={handleCreateTeam}
        />
      </div>
    </div>
  );
};

export default TeamList