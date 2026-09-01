import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <TopHeader />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
