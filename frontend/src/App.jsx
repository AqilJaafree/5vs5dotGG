import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Match from './pages/Match';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Logo from '../src/assets/img/5vs5dotgg_logo.png'


function App() {
  return (
    <BrowserRouter>
      <section className="fixed inset-0 z-0">
        {/* Background Elements  */}
        <AnimatedBackground />

        <div className="">
          <div className="relative z-10 h-[100dvh]"> 
            <div className="relative h-[100svh] text-white pt-10 pb-2 max-w-sm mx-auto flex flex-col gap-2.5 px-2 xs:px-0">
              <div className="h-[calc(100svh-8rem)] flex-1 mx-auto w-full bg-black rounded-xl shadow-xl">
                <div className="flex justify-center items-center pt-4">
                  <img src={Logo} alt="logo" className="w-20" />
                </div>
                <Routes>
                    <Route 
                      path="/" 
                      element={
                        <Home /> 
                      } 
                      />
                    <Route 
                      path="/match" 
                      element={
                        <Match /> 
                      } 
                      />
                    <Route 
                      path="/marketplace" 
                      element={
                        <Marketplace /> 
                      } 
                      />
                    <Route 
                      path="/profile" 
                      element={
                        <Profile /> 
                      } 
                      />
                    <Route 
                      path="/player/*" 
                      element={
                        <Home /> 
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
  );
}

export default App;