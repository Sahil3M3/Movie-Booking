import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutUser } from '../store/auth';

const Header = () => {
  const {user}=useSelector(state=>state.auth);
  const dispatch=useDispatch();

  return (
      <header className="sticky top-0 flex justify-between items-center bg-gray-900 text-white p-4 z-50 shadow-md">
      <h1 className="text-white text-xl font-bold">Admin Panel</h1>
      {user && <button className="bg-white text-blue-500 px-4 py-1 rounded hover:bg-gray-100 transition-all"
      onClick={()=>dispatch(logoutUser())}
      >
        Log out
      </button>}
    </header>
  );
};

export default Header;
