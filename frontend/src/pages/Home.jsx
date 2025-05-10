import React, { useState, useEffect } from 'react'
import InsertToken from '../components/InsertToken'
import TeamList from '../components/TeamList'
import LoadingSpinner from '../components/LoadingSpinner';
//import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const [loading, setLoading] = useState(true);
  //const [gameData, setGameData] = useState(null);
  
  // Simulate fetching game data
  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      // try {
        // Simulate API calls or data loading
        // Replace with actual API calls in your implementation
        //await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Mock data that would come from your backend
        // setGameData({
        //   username: 'Player123',
        //   tokens: 5,
          // other game data...
        //});

        setTimeout(() => {
          setLoading(false);
        }, 500);
        
        // Turn off loading state
      //   setLoading(false);
      // } catch (error) {
      //   console.error('Error loading game data:', error);
        // You could set an error state here
      //   setLoading(false);
      // }
    };
    
    fetchGameData();
  }, []);
  
  // Show loading spinner while data is being fetched
  if (loading) {
    return <LoadingSpinner />
  }
  
  return (
    <div className="min-h-screen">
      <InsertToken />
      
      <div className="flex justify-center items-center mt-8">
        <TeamList />
      </div>
    </div>
  )
}

export default Home