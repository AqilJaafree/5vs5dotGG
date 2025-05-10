import React, { useState, useEffect } from 'react'
import Button from './ui/Button'
import TeamBox from './TeamBox'
import CreateTeamModal from './CreateTeamModal'

const TeamList = () => {
  // State to store user teams
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch teams (mock data for now)
  useEffect(() => {
    // Simulate API call to get user teams
    const fetchTeams = async () => {
      
      // Example data - replace with actual API call
      // const response = await fetch('/api/teams');
      // const data = await response.json();
      
      // Mock data - empty array for new user, or sample teams for existing user
      // Uncomment to simulate existing user with teams
      const mockTeams = [
        // { id: 1, name: 'Team Alpha', members: 5 },
        // { id: 2, name: 'Team Beta', members: 3 },
        // { id: 3, name: 'Team Gamma', members: 4 }
      ];
      
      // Comment out the line above and uncomment this for new user
      // const mockTeams = [];
      
      setTimeout(() => {
        setTeams(mockTeams);
      }, 500);
    };
    
    fetchTeams();
  }, []);
  
  // Open create team modal
  const handleCreateTeamClick = () => {
    setIsModalOpen(true);
  };
  
  // Close create team modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Handle team creation success
  const handleTeamCreated = (newTeam) => {
    // Add new team to the list
    setTeams([...teams, newTeam]);
  };
  
  // Handle team selection
  const handleTeamClick = (teamId) => {
    console.log(`Selected team: ${teamId}`);
    // Handle team selection logic here
  };
  
  // No teams - show create team prompt
  if (teams.length === 0) {
    return (
      <>
      <div>
          <h2 className="text-2xl font-semibold text-center">Your Teams</h2>
          <div className="flex justify-center items-center">
            <div className="w-72 h-72 rounded-xl outline-2 outline-white p-4 flex flex-col justify-center items-center">
              <div className="text-center text-xl pb-6 w-full">
                <span className="block text-center">You don't have any team yet!</span>
              </div>
              <div className="flex justify-center items-center w-full">
                <Button 
                  text="Create Team" 
                  variant="primary" 
                  size="large"
                  onClick={handleCreateTeamClick}
                />
              </div>
            </div>
          </div>
      </div>
        
        {/* Create Team Modal */}
        <CreateTeamModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTeamCreated={handleTeamCreated}
        />
      </>
    );
  }
  
  // User has teams - show team list with add team button in a 4-column grid
  return (
    <>
      <div className="w-full px-4">
        <h2 className="pt-10 text-2xl font-semibold mb-6 text-center">Your Teams</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
          {/* Map through and display user teams */}
          {teams.map(team => (
            <TeamBox 
              key={team.id}
              teamName={team.name}
              memberCount={team.nfts?.length || 0}
              onClick={() => handleTeamClick(team.id)}
            />
          ))}
          
          {/* Add team button */}
          <TeamBox 
            isAddButton={true}
            onClick={handleCreateTeamClick}
          />
        </div>
      </div>
      
      {/* Create Team Modal */}
      <CreateTeamModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTeamCreated={handleTeamCreated}
      />
    </>
  );
};

export default TeamList;