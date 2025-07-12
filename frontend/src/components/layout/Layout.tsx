import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    isAuthenticated
  } = useAuthStore();
  return <div className="min-h-screen bg-background-dark text-text-light">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <AnimatePresence>
          {isSidebarOpen && <motion.div initial={{
          x: -240
        }} animate={{
          x: 0
        }} exit={{
          x: -240
        }} transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }} className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)]">
              <Sidebar />
            </motion.div>}
        </AnimatePresence>
        <motion.main className={`pt-16 w-full transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`} initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.3
      }}>
          <div className="max-w-7xl mx-auto p-4">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>;
};