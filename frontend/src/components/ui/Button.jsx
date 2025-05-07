import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  text,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  style = {},
  children,
}) => {
  // Base styles
  const baseStyles = 'rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-white outline-2 outline-black shadow-md  duration-300 text-black',
    secondary: 'rounded-lg bg-white shadow-2xl text-black',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400',
    info: 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400',
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700',
    outline: 'bg-transparent outline-2 outline-white hover:bg-opacity-10 focus:outline-white',
    link: 'bg-transparent text-blue-600 hover:underline focus:ring-blue-500 p-0',
  };
  
  // Size styles
  const sizeStyles = {
    small: 'text-xs py-1 px-2',
    medium: 'text-sm py-2 px-4',
    large: 'text-base py-3 px-6',
    xlarge: 'text-lg py-4 px-8',
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all styles
  const buttonStyles = `
    ${baseStyles} 
    ${variantStyles[variant] || variantStyles.primary} 
    ${sizeStyles[size] || sizeStyles.medium} 
    ${widthStyles} 
    ${disabledStyles} 
    ${className}
  `;
  
  // Render icon based on position
  const renderContent = () => {
    if (!icon) return children || text;
    
    return (
      <span className="flex items-center justify-center">
        {iconPosition === 'left' && icon}
        <span>{children || text}</span>
        {iconPosition === 'right' && icon}
      </span>
    );
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
      style={style}
    >
      {renderContent()}
    </button>
  );
};

// PropTypes for type checking and documentation
Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 
    'warning', 'info', 'light', 'dark', 'outline', 'link'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Button;