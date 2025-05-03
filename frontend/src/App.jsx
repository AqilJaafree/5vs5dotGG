import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Homepage from './pages/player/PlayerHome';
import PlayerNFT from './pages/player/players/PlayerNFT';

import PlayerTeams from './pages/player/teams/PlayerTeams';
import CreateTeam from './pages/player/teams/CreateTeam';
import { motion } from 'framer-motion';
import NavBar from './components/PlayerNavBar';

// Import or create these components
import RoleSelection from './pages/RoleSelection';
import CreatorHome from './pages/creator/CreatorHome';
import CreatorNavBar from './components/CreatorNavBar';
import NFTDetail from './pages/player/players/NFTDetail';
import TeamDetails from './pages/player/teams/TeamDetails';
import EditTeam from './pages/player/teams/EditTeam';
import NFTBuy from './pages/player/players/NFTBuy';
import CreateNFT from './pages/creator/createNFT/CreateNFT';
import Tournaments from './pages/player/tournaments/Tournaments';
import CreatorNFTs from './pages/creator/createNFT/CreatorNFT';
import CreatorNFT from './pages/creator/createNFT/CreatorNFT';
import CreateTournament from './pages/player/tournaments/CreateTournament';
import TournamentDetail from './pages/player/tournaments/TournamentDetail';
import AnimatedBackground from './AnimatedBackground';

function App() {
  const [userRole, setUserRole] = useState(() => {
    // Check if role is stored in localStorage
    return localStorage.getItem('userRole') || null;
  });

  // Save role to localStorage when it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    }
  }, [userRole]);

  // Handler for role selection
  const handleRoleSelect = (role) => {
    setUserRole(role);
  };

  // Reset role (for logout functionality)
  const resetRole = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      <section className="min-h-screen relative overflow-hidden">
        {/* Background Elements  */}
        <AnimatedBackground />
        <div>
          {/* Conditional NavBar based on userRole */}
          {userRole === 'player' && <NavBar onLogout={resetRole} />}
          {userRole === 'creator' && <CreatorNavBar onLogout={resetRole} />}
          
          <div className="pt-16"> 
            <Routes>
              {/* If no role is selected, show role selection page */}
              <Route 
                path="/" 
                element={
                  !userRole 
                    ? <RoleSelection onSelectRole={handleRoleSelect} /> 
                    : <Navigate to={`/${userRole}`} replace />
                } 
              />
              
              {/* Player routes */}
              <Route 
                path="/player" 
                element={
                  userRole === 'player' 
                    ? <Homepage /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/playernft" 
                element={
                  userRole === 'player' 
                    ? <PlayerNFT /> 
                    : <Navigate to="/" replace />
                } 
              />
                <Route 
                path="/player/playernft/buy" 
                element={
                  userRole === 'player' 
                    ? <NFTBuy/> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/nft/:id" 
                element={
                  userRole === 'player' 
                    ? <NFTDetail /> 
                    : <Navigate to="/" replace />
                } 
              />
              {/* Team management routes */}
              <Route 
                path="/player/teams" 
                element={
                  userRole === 'player' 
                    ? <PlayerTeams /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/teams/create" 
                element={
                  userRole === 'player' 
                    ? <CreateTeam /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/teams/:id" 
                element={
                  userRole === 'player' 
                    ? <TeamDetails /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/teams/:id/edit" 
                element={
                  userRole === 'player' 
                    ? <EditTeam /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/tournament" 
                element={
                  userRole === 'player' 
                    ? <Tournaments /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/tournament/create" 
                element={
                  userRole === 'player' 
                    ? <CreateTournament /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/tournament/:id" 
                element={
                  userRole === 'player' 
                    ? <TournamentDetail /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/player/*" 
                element={
                  userRole === 'player' 
                    ? <Homepage /> 
                    : <Navigate to="/" replace />
                } 
              />
              
              {/* Creator routes */}
              <Route 
                path="/creator" 
                element={
                  userRole === 'creator' 
                    ? <CreatorHome /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/creator/creatornft/create" 
                element={
                  userRole === 'creator' 
                    ? <CreateNFT /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/creator/creatornft" 
                element={
                  userRole === 'creator' 
                    ? <CreatorNFT /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/creator/*" 
                element={
                  userRole === 'creator' 
                    ? <CreatorHome /> 
                    : <Navigate to="/" replace />
                } 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </section>
    </BrowserRouter>
  );
}

export default App;