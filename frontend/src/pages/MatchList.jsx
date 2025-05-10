import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import MatchCard from '../components/MatchCard';
import CreateMatchModal from '../components/CreateMatchModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const MatchesList = () => {
  // State
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    showAll: true,
    showPublic: false,
    showPrivate: false,
    showAvailable: false,
  });
  
  // Fetch matches data
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual API call
        // const response = await fetch('/api/matches');
        // const data = await response.json();
        
        // Mock data for demonstration - creating more matches to show scrolling
        const mockMatches = Array(3).fill().map((_, index) => ({
          id: index + 1,
          name: `Match #${index + 1} ${['Tournament', 'Friendly', 'Championship', 'Practice', 'Ranked'][index % 5]}`,
          teamQuota: 2 + (index % 9), // Between 2 and 10 teams
          teamsJoined: index % 3, // Some have teams joined
          matchDateTime: new Date(Date.now() + 86400000 * (index % 7) + 3600000 * (index % 24)).toISOString(), // Various times
          isPrivate: index % 3 === 0 // Some are private
        }));
        
        // Simulate API delay
        setTimeout(() => {
          setMatches(mockMatches);
          setFilteredMatches(mockMatches);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches. Please try again.');
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...matches];
    
    // Apply filters
    if (!filterOptions.showAll) {
      if (filterOptions.showPublic) {
        result = result.filter(match => !match.isPrivate);
      }
      
      if (filterOptions.showPrivate) {
        result = result.filter(match => match.isPrivate);
      }
      
      if (filterOptions.showAvailable) {
        result = result.filter(match => match.teamsJoined < match.teamQuota);
      }
    }
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(match => 
        match.name.toLowerCase().includes(term)
      );
    }
    
    setFilteredMatches(result);
  }, [matches, filterOptions, searchTerm]);
  
  // Handle filter clicks
//   const handleFilterChange = (filter) => {
//     if (filter === 'showAll') {
//       setFilterOptions({
//         showAll: true,
//         showPublic: false,
//         showPrivate: false,
//         showAvailable: false
//       });
//     } else {
//       setFilterOptions({
//         ...filterOptions,
//         showAll: false,
//         [filter]: !filterOptions[filter]
//       });
//     }
//   };
  
  // Handle creating a new match
  const handleCreateMatch = (newMatch) => {
    setMatches([newMatch, ...matches]);
  };
  
  // Handle search input
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };
  
  return (
    <div className="h-[calc(100svh-14rem)] bg-gray-900 rounded-xl text-white flex flex-col overflow-hidden">
      {/* Fixed header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Available Matches</h1>
            <Button 
              text="Create Match" 
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />}
            />
          </div>
          
          {/* Search bar */}
          {/* <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 w-full text-white focus:border-purple-500 focus:outline-none"
            />
          </div> */}
          
          {/* Filter tabs */}
          {/* <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('showAll')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterOptions.showAll 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => handleFilterChange('showPublic')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterOptions.showPublic && !filterOptions.showAll
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Public Only
            </button>
            <button
              onClick={() => handleFilterChange('showPrivate')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterOptions.showPrivate && !filterOptions.showAll
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Private Only
            </button>
            <button
              onClick={() => handleFilterChange('showAvailable')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterOptions.showAvailable && !filterOptions.showAll
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Available Slots
            </button>
          </div> */}
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="max-w-4xl mx-auto">
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-85">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 text-white p-4 rounded-lg">
              <p>{error}</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400 mb-4">No matches found</p>
              <Button 
                text="Create a New Match" 
                variant="primary"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          ) : (
            // Vertical list of match cards
            <div className="space-y-4">
              {filteredMatches.map(match => (
                <MatchCard 
                  key={match.id}
                  match={match}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Create Match Modal */}
      <CreateMatchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMatchCreated={handleCreateMatch}
      />
    </div>
  );
};

export default MatchesList;