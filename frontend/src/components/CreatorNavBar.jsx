import React from 'react'
import ConnectButton from './ui/ConnectButton'
import Logo from '../assets/5vs5dotgg_logo.png'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CreatorNavBar = ({ onLogout }) => {
  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-2xl shadow-md">
    <div> 
        <Link to="/creator">      
            <img src={Logo} alt="Logo" className="w-24 h-5" />
        </Link>
    </div>
    <div className="flex gap-10">
      <div className="flex gap-10 mt-2 text-xl">
        <Link to="/creator/creatornft" className="hover:text-indigo-300">
        NFT Collections
        </Link>
      </div>
      <ConnectButton className="font-medium">Connect Wallet</ConnectButton>
      <motion.button
        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
      >
        Switch Role
      </motion.button>
    </div>
  </motion.nav>
  )
}

export default CreatorNavBar