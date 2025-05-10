import React, { useState, useEffect } from 'react';
import Button from './ui/Button';

// MOBA roles and lanes constants
const ROLES = {
  TOP: 'Top Lane',
  MID: 'Mid Lane',
  BOT: 'Bot Lane',
  JUNGLER: 'Jungler',
  SUPPORT: 'Support'
};

const ROLE_DESCRIPTIONS = {
  TOP: 'Tanky and durable heroes that can fight alone',
  MID: 'Ability-based heroes with high damage and utility',
  BOT: 'Physical damage dealers with high sustained damage',
  JUNGLER: 'Versatile heroes who gather resources from neutral camps',
  SUPPORT: 'Heroes who protect and empower teammates'
};

const CreateTeamModal = ({ isOpen, onClose, onTeamCreated }) => {
  // Form state
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const [roleAssignments, setRoleAssignments] = useState({
    TOP: null,
    MID: null,
    BOT: null,
    JUNGLER: null,
    SUPPORT: null
  });
  
  // UI state
  const [availableNFTs, setAvailableNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Info, 2: Select NFTs, 3: Assign Roles
  const [draggedNFT, setDraggedNFT] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);
  
  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      // Reset all form data
      setTeamName('');
      setTeamDescription('');
      setSelectedNFTs([]);
      setRoleAssignments({
        TOP: null,
        MID: null,
        BOT: null,
        JUNGLER: null,
        SUPPORT: null
      });
      
      // Reset UI states
      setError(null);
      setStep(1);
      setSubmitting(false);
      setDraggedNFT(null);
      setHoveredRole(null);
      
      // Fetch NFTs
      fetchNFTs();
    }
  }, [isOpen]);
  
  // Fetch available NFTs owned by player
  const fetchNFTs = async () => {
    try {
      setLoading(true);
      
      // Mock NFT data
      const mockNFTs = Array(6).fill().map((_, index) => ({
        id: index + 1,
        name: `Hero #${index + 1}`,
        image: `https://via.placeholder.com/100?text=Hero${index + 1}`,
        rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 5)],
        stats: {
          power: Math.floor(Math.random() * 100),
          defense: Math.floor(Math.random() * 100),
          speed: Math.floor(Math.random() * 100)
        },
        class: ['Tank', 'Assassin', 'Mage', 'Marksman', 'Support'][Math.floor(Math.random() * 5)]
      }));
      
      // Simulate API delay
      setTimeout(() => {
        setAvailableNFTs(mockNFTs);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to load your heroes. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle NFT selection/deselection
  const toggleNFTSelection = (nft) => {
    if (selectedNFTs.some(selected => selected.id === nft.id)) {
      // Remove NFT if already selected
      setSelectedNFTs(selectedNFTs.filter(selected => selected.id !== nft.id));
      
      // Also remove from any role assignments
      const newRoleAssignments = { ...roleAssignments };
      Object.keys(newRoleAssignments).forEach(role => {
        if (newRoleAssignments[role]?.id === nft.id) {
          newRoleAssignments[role] = null;
        }
      });
      setRoleAssignments(newRoleAssignments);
    } else if (selectedNFTs.length < 5) {
      // Add NFT if under limit
      setSelectedNFTs([...selectedNFTs, nft]);
    }
  };
  
  // Assign NFT to role
  const assignRole = (nftId, role) => {
    const nft = selectedNFTs.find(n => n.id === nftId);
    if (!nft) return;
    
    // Check if this NFT is already assigned to another role
    const currentRole = Object.keys(roleAssignments).find(
      r => roleAssignments[r]?.id === nftId
    );
    
    // Create new assignments
    const newRoleAssignments = { ...roleAssignments };
    
    // If there's already an NFT in this role, swap them
    if (newRoleAssignments[role] && currentRole) {
      newRoleAssignments[currentRole] = newRoleAssignments[role];
    } else if (currentRole) {
      // If the NFT is already in a role but the new role is empty
      newRoleAssignments[currentRole] = null;
    }
    
    // Assign the NFT to the new role
    newRoleAssignments[role] = nft;
    setRoleAssignments(newRoleAssignments);
  };
  
  // Handle drag and drop
  const handleDragStart = (nft) => {
    setDraggedNFT(nft);
  };
  
  const handleDragOver = (e, role) => {
    e.preventDefault();
    setHoveredRole(role);
  };
  
  const handleDrop = (e, role) => {
    e.preventDefault();
    if (draggedNFT) {
      assignRole(draggedNFT.id, role);
      setDraggedNFT(null);
      setHoveredRole(null);
    }
  };
  
  const handleDragEnd = () => {
    setDraggedNFT(null);
    setHoveredRole(null);
  };
  
  // Remove NFT from role
  const removeFromRole = (role) => {
    const newRoleAssignments = { ...roleAssignments };
    newRoleAssignments[role] = null;
    setRoleAssignments(newRoleAssignments);
  };
  
  // Form validation
  // Validate step 1 - Team info
  const validateTeamInfo = () => {
    // Clear previous errors
    setError(null);
    
    if (!teamName.trim()) {
      setError('Team name is required');
      return false;
    }
    
    if (teamName.trim().length < 3) {
      setError('Team name must be at least 3 characters');
      return false;
    }
    
    return true;
  };
  
  // Validate step 2 - Hero selection
  const validateHeroSelection = () => {
    // Clear previous errors
    setError(null);
    
    if (selectedNFTs.length === 0) {
      setError('Please select at least one hero for your team');
      return false;
    }
    
    return true;
  };
  
  // Validate step 3 - Role assignment
  const validateRoleAssignment = () => {
    // Clear previous errors
    setError(null);
    
    // For step 3, check if at least one role is assigned
    const assignedRoles = Object.values(roleAssignments).filter(Boolean);
    if (assignedRoles.length === 0) {
      setError('Please assign at least one hero to a role');
      return false;
    }
    
    return true;
  };
  
  // Handle next step
  const handleNextStep = () => {
    let isValid = false;
    
    // Validate current step
    if (step === 1) {
      isValid = validateTeamInfo();
    } else if (step === 2) {
      isValid = validateHeroSelection();
    }
    
    // Proceed to next step if valid
    if (isValid) {
      setStep(step + 1);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRoleAssignment()) return;
    
    try {
      setSubmitting(true);
      
      // Create team data object
      const teamData = {
        name: teamName,
        description: teamDescription,
        heroes: selectedNFTs.map(nft => ({
          id: nft.id,
          role: Object.keys(roleAssignments).find(role => 
            roleAssignments[role]?.id === nft.id
          ) || null
        }))
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Team created:', teamData);
      
      // Call success callback
      if (onTeamCreated) {
        onTeamCreated({
          id: new Date().getTime(), // Mock ID
          ...teamData,
          memberCount: selectedNFTs.length // Add member count for TeamBox display
        });
      }
      
      // Reset form state to prevent issues with subsequent team creation
      setSubmitting(false);
      
      // Close modal
      onClose();
      
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Failed to create team. Please try again.');
      setSubmitting(false);
    }
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  // Render modal content based on current step
  const renderStepContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }
    
    switch (step) {
      case 1:
        return (
          // Step 1: Team Information
          <div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Team Name *</label>
              <input 
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                placeholder="Enter team name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Team Description</label>
              <textarea
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white h-32"
                placeholder="Enter team description (optional)"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          // Step 2: NFT Selection
          <div>
            <p className="text-gray-300 mb-4">
              Select up to 5 heroes for your team. You have selected {selectedNFTs.length}/5 heroes.
            </p>
            
            {/* Selected NFTs */}
            {selectedNFTs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Selected Heroes:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNFTs.map(nft => (
                    <div 
                      key={`selected-${nft.id}`} 
                      className="bg-purple-900 rounded-lg p-2 flex items-center"
                    >
                      <img 
                        src={nft.image} 
                        alt={nft.name} 
                        className="w-8 h-8 mr-2 rounded"
                      />
                      <span className="text-white">{nft.name}</span>
                      <button 
                        onClick={() => toggleNFTSelection(nft)}
                        className="ml-2 text-gray-300 hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available NFTs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableNFTs.map(nft => {
                const isSelected = selectedNFTs.some(selected => selected.id === nft.id);
                const isDisabled = !isSelected && selectedNFTs.length >= 5;
                
                return (
                  <div 
                    key={nft.id}
                    onClick={() => !isDisabled && toggleNFTSelection(nft)}
                    className={`
                      border rounded-lg p-2 cursor-pointer transition-all
                      ${isSelected ? 'border-purple-500 bg-purple-900 bg-opacity-50' : 'border-gray-700'}
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-500'}
                    `}
                  >
                    <div className="aspect-square mb-2 overflow-hidden rounded">
                      <img 
                        src={nft.image} 
                        alt={nft.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-white text-sm font-medium">{nft.name}</div>
                    <div className="text-xs text-gray-400">{nft.class}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 3:
        return (
          // Step 3: Role Assignment
          <div>
            <p className="text-gray-300 text-xs">
              Drag and drop heroes to assign roles. Not all roles need to be filled.
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              {/* Left side: MOBA lane map and role slots */}
              <div className="bg-gray-900 rounded-lg px-4 relative">
                <div className="text-center text-white font-bold">
                  Lane Assignments
                </div>
                
                {/* MOBA map representation */}
                <div className="relative h-40 mb-4 bg-gray-800 rounded border border-gray-700">
                  {/* Top lane */}
                  <div
                    className="absolute top-0 left-0 w-1/2 h-1/3 flex justify-center items-center border-r border-b border-gray-700"
                    onDragOver={(e) => handleDragOver(e, 'TOP')}
                    onDrop={(e) => handleDrop(e, 'TOP')}
                    onClick={() => hoveredRole === 'TOP' && draggedNFT && assignRole(draggedNFT.id, 'TOP')}
                  >
                    <div className={`w-full h-full flex justify-center items-center ${hoveredRole === 'TOP' ? 'bg-purple-900 bg-opacity-30' : ''}`}>
                      {roleAssignments.TOP ? (
                        <div className="relative">
                          <img 
                            src={roleAssignments.TOP.image} 
                            alt={roleAssignments.TOP.name}
                            className="w-16 h-16 rounded-full border-2 border-purple-500"
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromRole('TOP'); }}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Top Lane</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Mid lane */}
                  <div
                    className="absolute top-1/3 left-1/4 w-1/2 h-1/3 flex justify-center items-center border border-gray-700"
                    onDragOver={(e) => handleDragOver(e, 'MID')}
                    onDrop={(e) => handleDrop(e, 'MID')}
                    onClick={() => hoveredRole === 'MID' && draggedNFT && assignRole(draggedNFT.id, 'MID')}
                  >
                    <div className={`w-full h-full flex justify-center items-center ${hoveredRole === 'MID' ? 'bg-purple-900 bg-opacity-30' : ''}`}>
                      {roleAssignments.MID ? (
                        <div className="relative">
                          <img 
                            src={roleAssignments.MID.image} 
                            alt={roleAssignments.MID.name}
                            className="w-16 h-16 rounded-full border-2 border-purple-500"
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromRole('MID'); }}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Mid Lane</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bot lane */}
                  <div
                    className="absolute bottom-0 right-0 w-1/2 h-1/3 flex justify-center items-center border-l border-t border-gray-700"
                    onDragOver={(e) => handleDragOver(e, 'BOT')}
                    onDrop={(e) => handleDrop(e, 'BOT')}
                    onClick={() => hoveredRole === 'BOT' && draggedNFT && assignRole(draggedNFT.id, 'BOT')}
                  >
                    <div className={`w-full h-full flex justify-center items-center ${hoveredRole === 'BOT' ? 'bg-purple-900 bg-opacity-30' : ''}`}>
                      {roleAssignments.BOT ? (
                        <div className="relative">
                          <img 
                            src={roleAssignments.BOT.image} 
                            alt={roleAssignments.BOT.name}
                            className="w-16 h-16 rounded-full border-2 border-purple-500"
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromRole('BOT'); }}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Bot Lane</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Jungler */}
                  <div
                    className="absolute top-1/4 right-3/4 w-1/4 h-1/4 flex justify-center items-center"
                    onDragOver={(e) => handleDragOver(e, 'JUNGLER')}
                    onDrop={(e) => handleDrop(e, 'JUNGLER')}
                    onClick={() => hoveredRole === 'JUNGLER' && draggedNFT && assignRole(draggedNFT.id, 'JUNGLER')}
                  >
                    <div className={`w-full h-full flex justify-center items-center rounded-full border border-gray-700 ${hoveredRole === 'JUNGLER' ? 'bg-purple-900 bg-opacity-30' : ''}`}>
                      {roleAssignments.JUNGLER ? (
                        <div className="relative">
                          <img 
                            src={roleAssignments.JUNGLER.image} 
                            alt={roleAssignments.JUNGLER.name}
                            className="w-14 h-14 rounded-full border-2 border-purple-500"
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromRole('JUNGLER'); }}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs">Jungler</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Support */}
                  <div
                    className="absolute bottom-1/4 left-3/4 w-1/4 h-1/4 flex justify-center items-center"
                    onDragOver={(e) => handleDragOver(e, 'SUPPORT')}
                    onDrop={(e) => handleDrop(e, 'SUPPORT')}
                    onClick={() => hoveredRole === 'SUPPORT' && draggedNFT && assignRole(draggedNFT.id, 'SUPPORT')}
                  >
                    <div className={`w-full h-full flex justify-center items-center rounded-full border border-gray-700 ${hoveredRole === 'SUPPORT' ? 'bg-purple-900 bg-opacity-30' : ''}`}>
                      {roleAssignments.SUPPORT ? (
                        <div className="relative">
                          <img 
                            src={roleAssignments.SUPPORT.image} 
                            alt={roleAssignments.SUPPORT.name}
                            className="w-14 h-14 rounded-full border-2 border-purple-500"
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromRole('SUPPORT'); }}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs">Support</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Role description */}
                {/* <div className="text-sm text-gray-400 mt-2">
                  {hoveredRole ? ROLE_DESCRIPTIONS[hoveredRole] : 'Hover over a role to see description'}
                </div> */}
              </div>
              
              {/* Selected heroes */}
              <div>
                <div className="text-white font-bold mb-2">Selected Heroes</div>
                {selectedNFTs.length === 0 ? (
                  <div className="text-gray-500 text-center p-4 border border-gray-700 rounded-lg">
                    No heroes selected yet
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-3">
                    {selectedNFTs.map(nft => {
                      const assignedRole = Object.keys(roleAssignments).find(
                        role => roleAssignments[role]?.id === nft.id
                      );
                      
                      return (
                        <div 
                          key={nft.id}
                          draggable="true"
                          onDragStart={() => handleDragStart(nft)}
                          onDragEnd={handleDragEnd}
                          className={`
                            bg-gray-700 p-2 rounded-lg items-center cursor-move
                            ${assignedRole ? 'border-2 border-purple-500' : 'border border-gray-600'}
                          `}
                        >
                          <img 
                            src={nft.image} 
                            alt={nft.name}
                            className="w-10 h-10 rounded-lg mr-3"
                          />
                          <div>
                            {/* <div className="text-white font-medium">{nft.name}</div> */}
                            <div className="text-center text-xs text-gray-400">{nft.class}</div>
                            {assignedRole && (
                              <div className="text-xs text-purple-400 mt-1">
                                {ROLES[assignedRole]}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
{/*                 
                <div className="mt-4 text-gray-300 text-sm">
                  <p>Drag heroes to the map to assign roles. Click a role to remove a hero.</p>
                </div> */}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Modal footer buttons
  const renderFooterButtons = () => {
    // Back button or Cancel button
    const leftButton = step === 1 ? (
      <Button 
        text="Cancel"
        variant="outline"
        onClick={onClose}
      />
    ) : (
      <Button 
        text="Back"
        variant="outline"
        onClick={() => setStep(step - 1)}
      />
    );
    
    // Next button or Create Team button
    const rightButton = step === 3 ? (
      <Button 
        text={submitting ? "Creating Team..." : "Create Team"}
        variant="primary"
        onClick={handleSubmit}
        disabled={submitting}
      />
    ) : (
      <Button 
        text="Next"
        variant="primary"
        onClick={handleNextStep}
      />
    );
    
    return (
      <>
        {leftButton}
        {rightButton}
      </>
    );
  };
  
  return (
    // Modal overlay
    <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50">
      {/* Modal container with fixed height and scrollable content */}
      <div className="bg-gray-800 rounded-xl w-85 mx-4 flex flex-col h-[calc(100svh-12rem)]">
        {/* Fixed header */}
        <div className="border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {step === 1 ? 'Create New Team' : 
             step === 2 ? 'Select Team Heroes' : 
             'Assign Hero Roles'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        
        {/* Fixed progress indicator */}
        <div className="bg-gray-900 px-6 py-3 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 1 ? 'bg-purple-600' : 'bg-gray-700'
              }`}>
                1
              </div>
              <div className={`h-1 w-12 ${
                step > 1 ? 'bg-purple-600' : 'bg-gray-700'
              }`}></div>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 2 ? 'bg-purple-600' : 'bg-gray-700'
              }`}>
                2
              </div>
              <div className={`h-1 w-12 ${
                step > 2 ? 'bg-purple-600' : 'bg-gray-700'
              }`}></div>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 3 ? 'bg-purple-600' : 'bg-gray-700'
              }`}>
                3
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Step {step} of 3
            </div>
          </div>
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto py-2 px-6 scrollbar-hide">
          {/* Error message */}
          {error && (
            <div className="bg-red-900 text-white p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {/* Dynamic content based on current step */}
          {renderStepContent()}
        </div>
        
        {/* Fixed footer */}
        <div className="border-t border-gray-700 p-4 flex justify-between bg-gray-800 rounded-b-xl">
          {renderFooterButtons()}
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;