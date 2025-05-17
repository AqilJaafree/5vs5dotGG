import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
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
import { BoltProvider } from './context/BoltContext';
// Safe localStorage access
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage.getItem:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error accessing localStorage.setItem:', error);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error accessing localStorage.removeItem:', error);
    }
  }
};

// A component to handle wallet connection state within the router context
const WalletStateHandler = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Update localStorage based on wallet connection
    if (connected) {
      safeLocalStorage.setItem('walletConnected', 'true');
      
      // If on wallet connect page and connected, redirect to home
      if (location.pathname === '/connect-wallet') {
        navigate('/', { replace: true });
      }
    } else {
      // If wallet disconnected, update localStorage
      const currentValue = safeLocalStorage.getItem('walletConnected');
      if (currentValue === 'true') {
        console.log("Wallet disconnected, updating localStorage");
        safeLocalStorage.removeItem('walletConnected');
        
        // If not already on wallet connect page, redirect there
        if (location.pathname !== '/connect-wallet') {
          navigate('/connect-wallet', { replace: true });
        }
      }
    }
  }, [connected, location.pathname, navigate]);
  
  return null;
};

function AppContent() {
  const [initialized, setInitialized] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const { connected } = useWallet();

  // Check if wallet is connected on app startup
  useEffect(() => {
    // Check for existing wallet connection in localStorage
    const checkWalletConnection = () => {
      try {
        const walletConnected = safeLocalStorage.getItem('walletConnected') === 'true';
        console.log("Initial wallet connection check:", walletConnected);
        setIsWalletConnected(walletConnected);
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setIsWalletConnected(false);
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };
    
    // Simulate app initialization with a slight delay
    const initTimer = setTimeout(() => {
      checkWalletConnection();
    }, 1000);
    
    return () => clearTimeout(initTimer);
  }, []);
  
  // Keep isWalletConnected in sync with actual wallet connection
  useEffect(() => {
    setIsWalletConnected(connected);
  }, [connected]);

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
      console.log("Protected route: not connected, redirecting to wallet connect");
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
    <section className="fixed inset-0 z-0">
      {/* Track wallet state across the app */}
      <WalletStateHandler />
      
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
                <Route path="/connect-wallet" element={<WalletConnectPage />} />

                {/* Default route - redirect based on wallet connection */}
                <Route 
                  path="/" 
                  element={
                    isWalletConnected ? (
                      <Home />
                    ) : (
                      <Navigate to="/connect-wallet" replace />
                    )
                  } 
                />

                {/* Protected routes */}
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
            {/* Navigation Bar - only show when wallet is connected */}
            {isWalletConnected && <NavBar />}
          </div>
        </div>
      </div>
    </section>
  );
}

// Main App component with providers
function App() {
  return (
    <WalletContextProvider>
      <BoltProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </BoltProvider>
    </WalletContextProvider>
  );
}

export default App;