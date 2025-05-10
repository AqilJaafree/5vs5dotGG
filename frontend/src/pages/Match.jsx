import React, { useEffect, useState } from 'react'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import MatchList from '../pages/MatchList'
import CreateMatchModal from '../components/CreateMatchModal'

const Match = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle creating a new match
  const handleCreateMatch = (newMatch) => {
    setMatches([newMatch, ...matches]);
  };
  

  // useEffect(() => {
  //   const fetchMatchData = async () => {
  //     setLoading(true);
  
  //     setTimeout(() => {
  //       setLoading(false);
  //     },);
      
  //   };
  //   fetchMatchData(); 
  // }, []);

  // if (loading) {
  //   return <LoadingSpinner />
  // }

  return (
    <div className="">
      <div className="flex justify-center items-center pt-4">
        <div className="w-80 h-125  rounded-xl">
          <MatchList />
        </div>
      </div>

      {/* Join, Create and Find Match Button */}
      <div className="flex justify-center items-center">
        <div className="absolute bottom-18">
          <div className="grid grid-cols-2 gap-6 pb-2">    
            <Button text="Create Match" variant="primary"  
             onClick={() => setIsModalOpen(true)}
            />   
            <Button text="Find Match" variant="primary"/>        
          </div>
        </div>
      </div>
      {/* Create Match Modal */}
      <CreateMatchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMatchCreated={handleCreateMatch}
      />
    </div>
  )
}

export default Match