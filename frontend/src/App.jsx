import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Match from './pages/Match';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Logo from '../src/assets/img/5vs5dotgg_logo.png'
import TeamDetailsPage from './pages/TeamDetails';
import CreateMatchModal from './components/CreateMatchModal';
import Loading from './components/Loading';
import SplashScreen from './pages/SplashScreen';
import WalletConnectPage from './pages/WalletConnect';
import WalletContextProvider from './context/WalletContextProvider';

function App() {
  const [initialized, setInitialized] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

   // Check if wallet is connected on app startup
  useEffect(() => {
    // Check for existing wallet connection in localStorage
    const checkWalletConnection = () => {
      const walletConnected = localStorage.getItem('walletConnected') === 'true';
      setIsWalletConnected(walletConnected);
      setInitialized(true);
      setLoading(false);
    };
    
    // Simulate app initialization
    const initTimer = setTimeout(() => {
      checkWalletConnection();
    }, 1000);
    
    return () => clearTimeout(initTimer);
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  // Auth check wrapper for protected routes
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <Loading />;
    }
    
    if (!isWalletConnected) {
      return <Navigate to="/connect-wallet" replace />;
    }
    
    return children;
  };
  
  // If app is still initializing, show loading
  if (!initialized) {
    return <Loading />;
  }
  
  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <WalletContextProvider>
      <BrowserRouter>
        <section className="fixed inset-0 z-0">
          {/* Background Elements  */}
          <AnimatedBackground />

          <div className="">
            <div className="relative z-10 h-[100dvh]"> 
              <div className="relative h-[100svh] text-white pt-4 pb-2 max-w-sm mx-auto flex flex-col gap-2.5 px-2 ">
                <div className="h-[calc(100svh-8rem)] flex-1 mx-auto w-full bg-[#191825] rounded-xl">
                  <div className="flex justify-center items-center pt-4">
                    <img src={Logo} alt="logo" className="w-20" />
                  </div>
                  <Routes>
                      {/* Public routes */}
                      <Route path="/connect-wallet" element={
                         <WalletConnectPage />
                      } />

                      {/* Protected routes */}
                      <Route 
                        path="/" 
                        element={
                          <ProtectedRoute>
                            <Home /> 
                          </ProtectedRoute>
                        } 
                        />
                      <Route 
                        path="/home" 
                        element={
                          <ProtectedRoute>
                            <Home /> 
                          </ProtectedRoute>
                        } 
                        />
                      <Route 
                        path="/home/:teamId" 
                        element={
                          <ProtectedRoute>
                            <TeamDetailsPage /> 
                          </ProtectedRoute>
                        } 
                        />
                      <Route 
                        path="/match" 
                        element={
                          <ProtectedRoute> 
                            <Match /> 
                          </ProtectedRoute>
                        } 
                        />
                      <Route 
                        path="/match/create" 
                        element={
                          <ProtectedRoute> 
                            <CreateMatchModal /> 
                          </ProtectedRoute>
                        } 
                        />
                      <Route 
                        path="/marketplace" 
                        element={
                          <ProtectedRoute> 
                            <Marketplace /> 
                          </ProtectedRoute>
                        } 
                        />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile /> 
                          </ProtectedRoute>
                        } 
                        />
                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                {/* Navigation Bar */}
                <NavBar />
              </div>
            </div>
          </div>
        </section>
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;