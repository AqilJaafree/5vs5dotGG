// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  return (
    <nav className="backdrop-blur-md bg-gray-900/70 p-4 fixed w-full top-0 z-50 border-b border-gray-800/50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-white text-xl font-bold">
          ESFL
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/checkin" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200">
            Check In
          </Link>
          <Link to="/marketplace" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200">
            Marketplace
          </Link>
          <Link to="/battle" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200">
            Battle
          </Link>
          <Link to="/manager" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200">
            Manager
          </Link>
          <Link to="/mint" className="text-indigo-300 hover:text-white hover:bg-indigo-800/50 px-3 py-2 rounded-lg transition-all duration-200">
            Mint NFT
          </Link>
        </div>

        {/* Wallet Button */}
        <div className="flex items-center wallet-button-container">
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;