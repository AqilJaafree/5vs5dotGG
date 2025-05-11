import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBasketShopping, faGamepad, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
        <div className="flex justify-center items-center gap-4">
            <Link to="/">
              <div className="h-12 w-14 bg-white hover:bg-[#865DFF] shadow-md hover:shadow-[#865DFF] duration-500 rounded-xl outline-4 outline-[#191825] flex items-center justify-center">
                <FontAwesomeIcon icon={faHouse} style={{color: "#191825",}} />
              </div>
            </Link>
            <Link to="/match">
              <div className="h-12 w-14 bg-white hover:bg-[#865DFF] shadow-md hover:shadow-[#865DFF] duration-500 rounded-xl outline-4 outline-[#191825] flex items-center justify-center">
                <FontAwesomeIcon icon={faGamepad} style={{color: "#191825",}} />
              </div>
            </Link>
            <Link to="/marketplace">
              <div className="h-12 w-14 bg-white hover:bg-[#865DFF] shadow-md hover:shadow-[#865DFF] duration-500 rounded-xl outline-4 outline-[#191825] flex items-center justify-center">
                <FontAwesomeIcon icon={faBasketShopping} style={{color: "#191825",}} />
              </div>
            </Link>
            <Link to="/profile">
              <div className="h-12 w-14 bg-white hover:bg-[#865DFF] shadow-md hover:shadow-[#865DFF] duration-500 rounded-xl outline-4 outline-[#191825] flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} style={{color: "#191825",}} />
              </div>
            </Link>
        </div>
    </div>
  );
};

export default NavBar;