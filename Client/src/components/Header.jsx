import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-2 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold"><Link to="/">🎬 MovieX</Link></h1>
      <nav>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;