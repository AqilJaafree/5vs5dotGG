import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const CreateTournament = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    entryFee: 0,
    prizePool: 0,
    maxParticipants: 16,
    rules: '',
    teamRequired: true
  });
  
  // Rewards state - can add multiple reward tiers
  const [rewards, setRewards] = useState([
    { position: '1st', reward: '' },
    { position: '2nd', reward: '' },
    { position: '3rd', reward: '' }
  ]);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate minimum date for datepicker (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox fields
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked
      }));
      return;
    }
    
    // Handle number fields
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
      return;
    }
    
    // Handle regular fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle reward field changes
  const handleRewardChange = (index, field, value) => {
    const updatedRewards = [...rewards];
    updatedRewards[index] = {
      ...updatedRewards[index],
      [field]: value
    };
    setRewards(updatedRewards);
  };
  
  // Add a new reward tier
  const addReward = () => {
    setRewards(prev => [...prev, { position: '', reward: '' }]);
  };
  
  // Remove a reward tier
  const removeReward = (index) => {
    if (rewards.length <= 1) return;
    setRewards(rewards.filter((_, i) => i !== index));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Tournament name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    // Check if entry fee is valid
    if (formData.entryFee < 0) newErrors.entryFee = 'Entry fee cannot be negative';
    
    // Check if prize pool is valid
    if (formData.prizePool <= 0) newErrors.prizePool = 'Prize pool must be greater than zero';
    
    // Check if max participants is valid
    if (formData.maxParticipants < 2) {
      newErrors.maxParticipants = 'Tournament must allow at least 2 participants';
    }
    
    // Check if rules are provided
    if (!formData.rules) newErrors.rules = 'Tournament rules are required';
    
    // Validate rewards
    let rewardErrors = false;
    rewards.forEach((reward, index) => {
      if (!reward.position || !reward.reward) {
        rewardErrors = true;
      }
    });
    
    if (rewardErrors) {
      newErrors.rewards = 'All reward positions and amounts must be filled';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the tournament
      const tournamentId = 't' + Date.now().toString();
      
      // Get existing tournaments from localStorage
      const existingTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
      
      // Create new tournament object
      const newTournament = {
        id: tournamentId,
        ...formData,
        createdBy: 'CurrentPlayer', // In a real app, would be the current user's ID or username
        createdAt: new Date().toISOString(),
        currentParticipants: 0,
        status: 'registration',
        registeredTeams: [],
        rewards: rewards.map(reward => ({
          position: reward.position,
          reward: `${reward.reward} ₮`
        }))
      };
      
      // Add new tournament to the array
      const updatedTournaments = [...existingTournaments, newTournament];
      
      // Save to localStorage
      localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
      
      // Redirect to tournaments list with success message
      alert('Tournament created successfully!');
      navigate('/player/tournaments');
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Error creating tournament. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Create Tournament</h1>
          <p className="text-gray-400 mt-2">
            Set up a new tournament for players to join. Fill in the details below.
          </p>
        </div>
        
        <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tournament Name */}
                <div className="col-span-2">
                  <label className="block text-gray-300 mb-2" htmlFor="name">
                    Tournament Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-gray-900 border ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500`}
                    placeholder="Enter tournament name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.name}</p>
                  )}
                </div>
                
                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-gray-300 mb-2" htmlFor="description">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full bg-gray-900 border ${
                      errors.description ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 h-24`}
                    placeholder="Describe your tournament"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.description}</p>
                  )}
                </div>
                
                {/* Start Date */}
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="startDate">
                    Start Date & Time *
                  </label>
                  <input
                    id="startDate"
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={today}
                    className={`w-full bg-gray-900 border ${
                      errors.startDate ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.startDate}</p>
                  )}
                </div>
                
                {/* End Date */}
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="endDate">
                    End Date & Time *
                  </label>
                  <input
                    id="endDate"
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || today}
                    className={`w-full bg-gray-900 border ${
                      errors.endDate ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Registration Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Registration Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Entry Fee */}
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="entryFee">
                    Entry Fee (₮)
                  </label>
                  <input
                    id="entryFee"
                    type="number"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleChange}
                    min="0"
                    className={`w-full bg-gray-900 border ${
                      errors.entryFee ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500`}
                  />
                  {errors.entryFee && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.entryFee}</p>
                  )}
                </div>
                
                {/* Prize Pool */}
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="prizePool">
                    Prize Pool (₮) *
                  </label>
                  <input
                    id="prizePool"
                    type="number"
                    name="prizePool"
                    value={formData.prizePool}
                    onChange={handleChange}
                    min="1"
                    className={`w-full bg-gray-900 border ${
                      errors.prizePool ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500`}
                  />
                  {errors.prizePool && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.prizePool}</p>
                  )}
                </div>
                
                {/* Max Participants */}
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="maxParticipants">
                    Max Participants *
                  </label>
                  <input
                    id="maxParticipants"
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="2"
                    max="128"
                    className={`w-full bg-gray-900 border ${
                      errors.maxParticipants ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500`}
                  />
                  {errors.maxParticipants && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.maxParticipants}</p>
                  )}
                </div>
                
                {/* Team Required */}
                <div className="md:col-span-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="teamRequired"
                      checked={formData.teamRequired}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-700 bg-gray-900 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-gray-300">Require team registration (players must register with a team)</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Tournament Rules */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Tournament Rules</h2>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="rules">
                  Rules & Format *
                </label>
                <textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  className={`w-full bg-gray-900 border ${
                    errors.rules ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 h-32`}
                  placeholder="Describe the tournament format, rules, and requirements (e.g., 'Single elimination bracket. Best of 3 matches.')"
                ></textarea>
                {errors.rules && (
                  <p className="text-red-500 text-sm mt-1 error-message">{errors.rules}</p>
                )}
              </div>
            </div>
            
            {/* Reward Distribution */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Reward Distribution</h2>
                <Button
                  type="button"
                  onClick={addReward}
                  className="bg-gray-700 hover:bg-gray-600 text-sm py-1"
                >
                  Add Tier
                </Button>
              </div>
              
              {errors.rewards && (
                <p className="text-red-500 text-sm mb-4 error-message">{errors.rewards}</p>
              )}
              
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-1/3">
                      <input
                        type="text"
                        value={reward.position}
                        onChange={(e) => handleRewardChange(index, 'position', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="Position (e.g., 1st, 2nd, 3rd-4th)"
                      />
                    </div>
                    <div className="w-1/3">
                      <div className="relative">
                        <input
                          type="number"
                          value={reward.reward}
                          onChange={(e) => handleRewardChange(index, 'reward', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 pr-8"
                          placeholder="Reward amount"
                          min="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">₮</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeReward(index)}
                      className="bg-red-900 hover:bg-red-800 text-sm py-1"
                      disabled={rewards.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => navigate('/player/tournament')}
                className="bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={isSubmitting ? 'bg-purple-800 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
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
                    Creating...
                  </span>
                ) : 'Create Tournament'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateTournament;