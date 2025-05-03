import React from 'react';
import { motion } from 'framer-motion';
import { div } from 'motion/react-client';
import NavBar from '../components/NavBar';
import Button from '../components/ui/Button';

const RoleSelection = ({ onSelectRole }) => {
  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center h-screen">
        <motion.div 
          className="bg-gray/50 bg-opacity-10 backdrop-filter p-8 rounded-2xl shadow-2xl ring-gray-600 backdrop-blur-2xl w-full max-w-md outline-1 outline-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Choose Your Role</h1>
          
          <div className="grid grid-cols-2 gap-6">
            <Button  onClick={() => onSelectRole('player')}>
              {/* <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg> */}
              Player
            </Button>
            
            <Button onClick={() => onSelectRole('creator')}>
              {/* <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg> */}
              Creator
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;