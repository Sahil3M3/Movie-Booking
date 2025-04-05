import React from 'react'
import Header from './Header'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};


export default Layout
