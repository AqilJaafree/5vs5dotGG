import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import TeamSlot from '../../../components/TeamSlot';
import NFTSelector from '../../../components/NFTSelector';
import Button from '../../../components/ui/Button';

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [selectedNFTs, setSelectedNFTs] = useState(Array(5).fill(null));
  const [isNFTSelectorOpen, setIsNFTSelectorOpen] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [originalTeam, setOriginalTeam] = useState(null);
  
  // Load team data and player's owned NFTs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get teams from localStorage
        const teams = JSON.parse(localStorage.getItem('playerTeams') || '[]');
        
        // Find the team with the matching ID
        const foundTeam = teams.find(t => t.id === id);
        
        if (foundTeam) {
          setOriginalTeam(foundTeam);
          setTeamName(foundTeam.name);
          setTeamDescription(foundTeam.description);
          setTeamLogo(foundTeam.logo || '');
          setSelectedNFTs(foundTeam.members);
        }
        
        // Mock data for owned NFTs
        const mockNFTs = [
          {
            id: '1',
            name: 'Cyber Samurai',
            image: 'https://via.placeholder.com/300x300?text=Cyber+Samurai',
            rarity: 'Epic',
            tokenId: '1337',
            collectionName: 'CryptoWarriors',
            attributes: [
              { trait_type: 'Strength', value: '90' },
              { trait_type: 'Speed', value: '75' },
              { trait_type: 'Magic', value: '80' },
              { trait_type: 'Durability', value: '95' }
            ],
            stats: {
              attack: 85,
              defense: 90,
              speed: 75,
              health: 800,
              mana: 650
            }
          },
          {
            id: '2',
            name: 'Mystic Dragon',
            image: 'https://via.placeholder.com/300x300?text=Mystic+Dragon',
            rarity: 'Legendary',
            tokenId: '420',
            collectionName: 'FantasyBeasts',
            attributes: [
              { trait_type: 'Fire', value: '100' },
              { trait_type: 'Flight', value: '85' },
              { trait_type: 'Wisdom', value: '90' }
            ],
            stats: {
              attack: 92,
              defense: 70,
              speed: 88,
              health: 750,
              mana: 900
            }
          },
          {
            id: '3',
            name: 'Space Pirate',
            image: 'https://via.placeholder.com/300x300?text=Space+Pirate',
            rarity: 'Rare',
            tokenId: '777',
            collectionName: 'GalacticOutlaws',
            attributes: [
              { trait_type: 'Charisma', value: '95' },
              { trait_type: 'Piloting', value: '85' },
              { trait_type: 'Combat', value: '75' }
            ],
            stats: {
              attack: 78,
              defense: 65,
              speed: 95,
              health: 600,
              mana: 550
            }
          },
          {
            id: '4',
            name: 'Quantum Knight',
            image: 'https://via.placeholder.com/300x300?text=Quantum+Knight',
            rarity: 'Epic',
            tokenId: '101',
            collectionName: 'FutureFighters',
            attributes: [
              { trait_type: 'Intelligence', value: '90' },
              { trait_type: 'Armor', value: '95' },
              { trait_type: 'Technology', value: '100' }
            ],
            stats: {
              attack: 75,
              defense: 95,
              speed: 60,
              health: 950,
              mana: 700
            }
          },
          {
            id: '5',
            name: 'Ancient Guardian',
            image: 'https://via.placeholder.com/300x300?text=Ancient+Guardian',
            rarity: 'Mythic',
            tokenId: '007',
            collectionName: 'TimelessProtectors',
            attributes: [
              { trait_type: 'Defense', value: '100' },
              { trait_type: 'Wisdom', value: '95' },
              { trait_type: 'Longevity', value: '100' }
            ],
            stats: {
              attack: 70,
              defense: 100,
              speed: 40,
              health: 1200,
              mana: 800
            }
          },
          {
            id: '6',
            name: 'Neon Assassin',
            image: 'https://via.placeholder.com/300x300?text=Neon+Assassin',
            rarity: 'Uncommon',
            tokenId: '256',
            collectionName: 'DigitalMercenaries',
            attributes: [
              { trait_type: 'Stealth', value: '95' },
              { trait_type: 'Agility', value: '90' },
              { trait_type: 'Hacking', value: '85' }
            ],
            stats: {
              attack: 82,
              defense: 45,
              speed: 98,
              health: 500,
              mana: 600
            }
          },
          {
            id: '7',
            name: 'Crystal Mage',
            image: 'https://via.placeholder.com/300x300?text=Crystal+Mage',
            rarity: 'Epic',
            tokenId: '888',
            collectionName: 'ElementalCasters',
            attributes: [
              { trait_type: 'Magic', value: '98' },
              { trait_type: 'Intelligence', value: '95' },
              { trait_type: 'Wisdom', value: '90' }
            ],
            stats: {
              attack: 92,
              defense: 50,
              speed: 65,
              health: 550,
              mana: 1100
            }
          }
        ];
        
        setOwnedNFTs(mockNFTs);
        
        // Simulate network delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Open NFT selector for a specific slot
  const handleOpenNFTSelector = (slotIndex) => {
    setCurrentSlotIndex(slotIndex);
    setIsNFTSelectorOpen(true);
  };
  
  // Handle NFT selection for a slot
  const handleNFTSelect = (nft) => {
    // Check if NFT is already selected in another slot
    const isAlreadySelected = selectedNFTs.some(
      (selectedNFT, index) => index !== currentSlotIndex && selectedNFT?.id === nft.id
    );
    
    if (isAlreadySelected) {
      alert("This NFT is already assigned to another slot in your team.");
      return;
    }
    
    const newSelectedNFTs = [...selectedNFTs];
    newSelectedNFTs[currentSlotIndex] = nft;
    setSelectedNFTs(newSelectedNFTs);
    setIsNFTSelectorOpen(false);
  };
  
  // Remove NFT from slot
  const handleRemoveNFT = (slotIndex) => {
    const newSelectedNFTs = [...selectedNFTs];
    newSelectedNFTs[slotIndex] = null;
    setSelectedNFTs(newSelectedNFTs);
  };
  
  // Calculate team stats based on selected NFTs
  const calculateTeamStats = () => {
    const baseStats = {
      attack: 0,
      defense: 0,
      speed: 0,
      health: 0,
      mana: 0
    };
    
    // Filter out empty slots and sum up stats
    const filledSlots = selectedNFTs.filter(nft => nft !== null);
    
    if (filledSlots.length === 0) return baseStats;
    
    const totalStats = filledSlots.reduce((accumulator, nft) => {
      Object.keys(nft.stats).forEach(stat => {
        accumulator[stat] += nft.stats[stat];
      });
      return accumulator;
    }, { ...baseStats });
    
    // Calculate averages
    Object.keys(totalStats).forEach(stat => {
      totalStats[stat] = Math.round(totalStats[stat] / filledSlots.length);
    });
    
    return totalStats;
  };
  
  // Validate form and save team
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    
    if (!teamName.trim()) {
      errors.teamName = "Team name is required";
    }
    
    if (!teamDescription.trim()) {
      errors.teamDescription = "Team description is required";
    }
    
    const filledSlots = selectedNFTs.filter(nft => nft !== null);
    if (filledSlots.length === 0) {
      errors.team = "You must assign at least one NFT to your team";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Save team
    setIsSaving(true);
    
    try {
      // Get existing teams from localStorage
      const teams = JSON.parse(localStorage.getItem('playerTeams') || '[]');
      
      // Find the index of the team to update
      const teamIndex = teams.findIndex(t => t.id === id);
      
      if (teamIndex !== -1) {
        // Update team data
        const updatedTeam = {
          ...originalTeam,
          name: teamName,
          description: teamDescription,
          logo: teamLogo || null,
          members: selectedNFTs,
          stats: calculateTeamStats(),
          // Preserve original createdAt date
          updatedAt: new Date().toISOString()
        };
        
        // Replace the team in the array
        teams[teamIndex] = updatedTeam;
        
        // Save back to localStorage
        localStorage.setItem('playerTeams', JSON.stringify(teams));
        
        // Simulate network delay
        setTimeout(() => {
          setIsSaving(false);
          
          // Redirect to team details page
          navigate(`/player/teams/${id}`);
        }, 1000);
      } else {
        throw new Error("Team not found");
      }
    } catch (error) {
      console.error("Error saving team:", error);
      setFormErrors({
        submit: "Failed to save team. Please try again."
      });
      setIsSaving(false);
    }
  };
  
  // Calculate team stats
  const teamStats = calculateTeamStats();
  
  // Handle cancel
  const handleCancel = () => {
    navigate(`/player/teams/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
      ) : !originalTeam ? (
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
            The team you're trying to edit doesn't exist or has been deleted.
          </p>
          <Link to="/player/teams">
            <Button>
              View All Teams
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Edit Team</h1>
            <Button 
              className="bg-gray-700 hover:bg-gray-600"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team Details */}
            <div className="lg:col-span-1">
              <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Team Details</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2" htmlFor="teamName">
                      Team Name
                    </label>
                    <input
                      type="text"
                      id="teamName"
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                    />
                    {formErrors.teamName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.teamName}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2" htmlFor="teamDescription">
                      Description
                    </label>
                    <textarea
                      id="teamDescription"
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="Enter team description"
                      rows={4}
                    />
                    {formErrors.teamDescription && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.teamDescription}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2" htmlFor="teamLogo">
                      Team Logo URL (Optional)
                    </label>
                    <input
                      type="text"
                      id="teamLogo"
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={teamLogo}
                      onChange={(e) => setTeamLogo(e.target.value)}
                      placeholder="Enter logo URL"
                    />
                  </div>
                  
                  {/* Team Stats */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Team Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Attack</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(teamStats.attack / 100) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{teamStats.attack}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Defense</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(teamStats.defense / 100) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{teamStats.defense}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Speed</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(teamStats.speed / 100) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{teamStats.speed}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Health</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(teamStats.health / 1200) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{teamStats.health}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-3 col-span-2">
                        <p className="text-gray-400 text-xs">Mana</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                            <div
                              className="bg-cyan-500 h-2 rounded-full"
                              style={{ width: `${(teamStats.mana / 1000) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{teamStats.mana}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {formErrors.team && (
                    <p className="text-red-500 text-sm mt-4">{formErrors.team}</p>
                  )}
                  
                  {formErrors.submit && (
                    <p className="text-red-500 text-sm mt-4">{formErrors.submit}</p>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center">
                        <svg 
                          className="animate-spin h-5 w-5 mr-2" 
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
                        Saving Changes...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Team Slots */}
            <div className="lg:col-span-2">
              <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Team Members</h2>
                <p className="text-gray-300 mb-6">
                  Modify your team by assigning or removing NFT players from slots.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TeamSlot
                      key={index}
                      slotIndex={index}
                      nft={selectedNFTs[index]}
                      onAssign={() => handleOpenNFTSelector(index)}
                      onRemove={() => handleRemoveNFT(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* NFT Selector Modal */}
      {isNFTSelectorOpen && (
        <NFTSelector
          nfts={ownedNFTs}
          onSelect={handleNFTSelect}
          onClose={() => setIsNFTSelectorOpen(false)}
          selectedNFTs={selectedNFTs.filter(nft => nft !== null)}
        />
      )}
    </div>
  );
};

export default EditTeam;