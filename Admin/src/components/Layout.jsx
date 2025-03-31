import React from 'react'
import Header from './Header'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
    <Header/>
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-4">
        <Outlet /> {/* This renders the respective admin pages */}
      </div>
    </div>
    </>
  )
}

export default Layout
