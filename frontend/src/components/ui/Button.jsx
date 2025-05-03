import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false 
}) => {
  // Base classes for the button
  const baseClasses = "bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium";
  
  // Combine base classes with any additional classes
  const buttonClasses = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;