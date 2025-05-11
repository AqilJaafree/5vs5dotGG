import React, { useState, useEffect } from 'react';
import Button from './ui/Button';

const CreateMatchModal = ({ isOpen, onClose, onMatchCreated }) => {
  // Form state
  const [matchName, setMatchName] = useState('');
  const [teamQuota, setTeamQuota] = useState(2);
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [matchPassword, setMatchPassword] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Set default date/time to tomorrow at noon
  useEffect(() => {
    if (isOpen) {
      // Reset form
      setMatchName('');
      setTeamQuota(2);
      setIsPrivate(false);
      setMatchPassword('');
      setError(null);
      setSubmitting(false);
      
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Format date as YYYY-MM-DD for input element
      const formattedDate = tomorrow.toISOString().split('T')[0];
      setMatchDate(formattedDate);
      
      // Set default time to noon
      setMatchTime('12:00');
    }
  }, [isOpen]);
  
  // Form validation
  const validateForm = () => {
    if (!matchName.trim()) {
      setError('Match name is required');
      return false;
    }
    
    if (matchName.trim().length < 3) {
      setError('Match name must be at least 3 characters');
      return false;
    }
    
    if (!matchDate) {
      setError('Match date is required');
      return false;
    }
    
    if (!matchTime) {
      setError('Match time is required');
      return false;
    }
    
    // Check if date and time are in the future
    const matchDateTime = new Date(`${matchDate}T${matchTime}`);
    const now = new Date();
    
    if (matchDateTime <= now) {
      setError('Match date and time must be in the future');
      return false;
    }
    
    // Check if private match has a password
    if (isPrivate && !matchPassword.trim()) {
      setError('Private matches require a password');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // Combine date and time into a single datetime
      const matchDateTime = new Date(`${matchDate}T${matchTime}`);
      
      // Create match data object
      const matchData = {
        name: matchName,
        teamQuota: teamQuota,
        matchDateTime: matchDateTime.toISOString(),
        isPrivate: isPrivate,
        password: isPrivate ? matchPassword : null
      };
      
      // Replace with your actual API call to create match
      // const response = await fetch('/api/matches', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(matchData)
      // });
      // const data = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Match created:', matchData);
      
      // Call success callback
      if (onMatchCreated) {
        onMatchCreated({
          id: new Date().getTime(), // Mock ID
          ...matchData,
          teamsJoined: 0 // Initialize with 0 teams joined
        });
      }
      
      // Reset form state and close modal
      setSubmitting(false);
      onClose();
      
    } catch (err) {
      console.error('Error creating match:', err);
      setError('Failed to create match. Please try again.');
      setSubmitting(false);
    }
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    // Modal overlay
    <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50">
      {/* Modal container with fixed height and scrollable content */}
      <div className="bg-[#191825] outline-2 outline-[#FFA3FD] rounded-xl w-85 mx-4 flex flex-col h-[calc(100svh-12rem)]">
        {/* Fixed header */}
        <div className="border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create New Match</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {/* Error message */}
          {error && (
            <div className="bg-red-900 text-white p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {/* Match details form */}
          <form onSubmit={handleSubmit}>
            {/* Match Name */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">
                Match Name *
              </label>
              <input 
                type="text"
                value={matchName}
                onChange={(e) => setMatchName(e.target.value)}
                className="w-full bg-white border border-white rounded-lg p-3 text-black"
                placeholder="Enter match name"
              />
            </div>
            
            {/* Team Quota */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">
                Team Quota *
              </label>
              <div className="flex items-center">
                <button 
                  type="button"
                  onClick={() => setTeamQuota(Math.max(2, teamQuota - 1))}
                  className="bg-white hover:bg-gray-300 text-black p-2 rounded-l-lg border border-gray-300"
                >
                  -
                </button>
                <div className="px-4 py-2 bg-white border-t border-b border-white text-black">
                  {teamQuota} teams
                </div>
                <button 
                  type="button"
                  onClick={() => setTeamQuota(Math.min(10, teamQuota + 1))}
                  className="bg-white hover:bg-gray-300 text-black p-2 rounded-r-lg border border-gray-300"
                >
                  +
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Minimum: 2 teams, Maximum: 10 teams
              </p>
            </div>
            
            {/* Match Date and Time */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Match Date *
                </label>
                <input 
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full bg-white border border-white rounded-lg p-3 text-black"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Match Time *
                </label>
                <input 
                  type="time"
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                  className="w-full bg-white border border-white rounded-lg p-3 text-black"
                />
              </div>
            </div>
            
            {/* Private Match Option */}
            <div className="mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4 mr-2 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor="isPrivate" className="text-gray-300">
                  Private Match
                </label>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Private matches require a password to join
              </p>
            </div>
            
            {/* Match Password (if private) */}
            {isPrivate && (
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Match Password *
                </label>
                <input 
                  type="text"
                  value={matchPassword}
                  onChange={(e) => setMatchPassword(e.target.value)}
                  className="w-full bg-white border border-white rounded-lg p-3 text-black"
                  placeholder="Enter password for private match"
                />
              </div>
            )}
          </form>
        </div>
        
        {/* Fixed footer */}
        <div className="border-t border-gray-700 p-4 flex justify-between bg-gray-800 rounded-b-xl">
          <Button 
            text="Cancel"
            variant="outline"
            onClick={onClose}
          />
          <Button 
            text={submitting ? "Creating Match..." : "Create Match"}
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMatchModal;