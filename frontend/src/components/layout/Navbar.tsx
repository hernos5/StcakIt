import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, BellIcon, SunIcon, MoonIcon, MenuIcon, XIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { motion, AnimatePresence } from 'framer-motion';
interface NavbarProps {
  toggleSidebar: () => void;
}
export const Navbar = ({
  toggleSidebar
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const {
    user,
    logout,
    isAuthenticated
  } = useAuthStore();
  const {
    unreadCount,
    fetchNotifications
  } = useNotificationStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Polling for notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  return <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-md bg-background-dark bg-opacity-80 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side with menu toggle and logo */}
        <div className="flex items-center">
          <motion.button whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }} onClick={toggleSidebar} className="p-2 mr-2 rounded-full hover:bg-background-medium md:flex">
            <MenuIcon className="h-5 w-5" />
          </motion.button>
          <Link to="/" className="text-primary font-bold text-2xl mr-2 hover-glow cursor-pointer">
            <span className="text-white">Stack</span>
            <span className="text-primary">It</span>
          </Link>
        </div>
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <input type="text" placeholder="Search questions, tags, users..." className="w-full bg-background-medium bg-opacity-50 border border-white/10 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
          </div>
        </div>
        {/* Right Nav Items */}
        <div className="flex items-center space-x-3">
          <motion.button whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }} className="p-2 rounded-full hover:bg-background-medium relative" onClick={() => setShowNotifications(!showNotifications)}>
            <BellIcon className="h-5 w-5" />
            {unreadCount > 0 && <motion.span initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>}
          </motion.button>
          <AnimatePresence>
            {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
          </AnimatePresence>
          <motion.button whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }} className="p-2 rounded-full hover:bg-background-medium" onClick={toggleDarkMode}>
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </motion.button>
          {isAuthenticated && user ? <div className="relative group">
              <Link to={`/profile/${user.username}`}>
                <motion.div whileHover={{
              scale: 1.1
            }} className="h-8 w-8 rounded-full bg-primary cursor-pointer hover-glow overflow-hidden">
                  {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>}
                </motion.div>
              </Link>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-1 rounded-md backdrop-blur-sm bg-background-medium bg-opacity-90 border border-white/10">
                  <Link to={`/profile/${user.username}`} className="block px-4 py-2 text-sm hover:bg-background-dark">
                    Profile
                  </Link>
                  {user.role === 'admin' && <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-background-dark">
                      Admin Dashboard
                    </Link>}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-background-dark">
                    <div className="flex items-center">
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            </div> : <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>}
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-background-medium">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} transition={{
        duration: 0.2
      }} className="md:hidden absolute top-full left-0 right-0 bg-background-dark border-t border-white/10 py-4 px-4">
            <div className="flex mb-4">
              <div className="relative w-full">
                <input type="text" placeholder="Search..." className="w-full bg-background-medium bg-opacity-50 border border-white/10 rounded-full py-2 px-4 pl-10 text-sm" />
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Notifications</span>
              <div className="relative">
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>}
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Theme</span>
              <button onClick={toggleDarkMode}>
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>
            {isAuthenticated && user ? <>
                <Link to={`/profile/${user.username}`} className="flex justify-between items-center mb-2">
                  <span>Profile</span>
                  <div className="h-6 w-6 rounded-full bg-primary overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : <UserIcon className="h-4 w-4 text-white m-1" />}
                  </div>
                </Link>
                <button onClick={handleLogout} className="flex justify-between items-center w-full">
                  <span>Logout</span>
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </> : <Link to="/login" className="flex justify-between items-center">
                <span>Login</span>
                <UserIcon className="h-5 w-5" />
              </Link>}
          </motion.div>}
      </AnimatePresence>
    </nav>;
};