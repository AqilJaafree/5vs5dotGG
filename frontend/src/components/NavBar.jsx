import React from 'react'
import Logo from '../assets/5vs5dotgg_logo.png'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavBar = ({ onLogout }) => {
  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-7 bg-black/50 backdrop-blur-2xl shadow-md">
    <div> 
        <Link to="/">      
            <img src={Logo} alt="Logo" className="w-24 h-5" />
        </Link>
    </div>
  </motion.nav>
  )
}

export default NavBar