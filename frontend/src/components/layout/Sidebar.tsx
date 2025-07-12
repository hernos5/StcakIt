import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, MessageSquarePlusIcon, TagIcon, UserIcon, ShieldIcon, TrendingUpIcon, HelpCircleIcon, StarIcon } from 'lucide-react';
import { useTagStore } from '../../store/tagStore';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
export const Sidebar = () => {
  const location = useLocation();
  const {
    popularTags,
    fetchPopularTags
  } = useTagStore();
  const {
    user
  } = useAuthStore();
  useEffect(() => {
    fetchPopularTags();
  }, [fetchPopularTags]);
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <aside className="glass-card w-64 h-full overflow-y-auto">
      <div className="p-4 h-full flex flex-col">
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className={`flex items-center p-2 rounded-lg group transition-all duration-200 ${isActive('/') ? 'bg-primary/20 text-primary' : 'hover:bg-background-dark'}`}>
                <HomeIcon className={`h-5 w-5 mr-3 ${isActive('/') ? 'text-primary' : 'text-text-muted'}`} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/ask" className={`flex items-center p-2 rounded-lg group transition-all duration-200 ${isActive('/ask') ? 'bg-primary/20 text-primary' : 'hover:bg-background-dark'}`}>
                <MessageSquarePlusIcon className={`h-5 w-5 mr-3 ${isActive('/ask') ? 'text-primary' : 'text-text-muted'}`} />
                <span>Ask Question</span>
              </Link>
            </li>
            <li>
              <Link to="/tags" className={`flex items-center p-2 rounded-lg group transition-all duration-200 ${isActive('/tags') ? 'bg-primary/20 text-primary' : 'hover:bg-background-dark'}`}>
                <TagIcon className={`h-5 w-5 mr-3 ${isActive('/tags') ? 'text-primary' : 'text-text-muted'}`} />
                <span>Tags</span>
              </Link>
            </li>
            <li>
              <Link to={user ? `/profile/${user.username}` : '/login'} className={`flex items-center p-2 rounded-lg group transition-all duration-200 ${location.pathname.startsWith('/profile') ? 'bg-primary/20 text-primary' : 'hover:bg-background-dark'}`}>
                <UserIcon className={`h-5 w-5 mr-3 ${location.pathname.startsWith('/profile') ? 'text-primary' : 'text-text-muted'}`} />
                <span>Profile</span>
              </Link>
            </li>
            {user?.role === 'admin' && <li>
                <Link to="/admin" className={`flex items-center p-2 rounded-lg group transition-all duration-200 ${isActive('/admin') ? 'bg-primary/20 text-primary' : 'hover:bg-background-dark'}`}>
                  <ShieldIcon className={`h-5 w-5 mr-3 ${isActive('/admin') ? 'text-primary' : 'text-text-muted'}`} />
                  <span>Admin</span>
                </Link>
              </li>}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Discover</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/?sort=trending" className="flex items-center p-2 rounded-lg hover:bg-background-dark group">
                <TrendingUpIcon className="h-5 w-5 mr-3 text-text-muted group-hover:text-primary" />
                <span>Trending</span>
              </Link>
            </li>
            <li>
              <Link to="/?filter=unanswered" className="flex items-center p-2 rounded-lg hover:bg-background-dark group">
                <HelpCircleIcon className="h-5 w-5 mr-3 text-text-muted group-hover:text-primary" />
                <span>Unanswered</span>
              </Link>
            </li>
            <li>
              <Link to="/?sort=top" className="flex items-center p-2 rounded-lg hover:bg-background-dark group">
                <StarIcon className="h-5 w-5 mr-3 text-text-muted group-hover:text-primary" />
                <span>Top Questions</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-4 mb-3">
          <h3 className="font-semibold mb-3">Popular Tags</h3>
          <div className="space-y-2">
            {popularTags.map(tag => <motion.div key={tag.name} whileHover={{
            x: 5
          }} className="flex items-center justify-between p-2 rounded-lg hover:bg-background-dark cursor-pointer group">
                <div className="flex items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary bg-opacity-20 text-primary">
                    {tag.name}
                  </span>
                </div>
                <span className="text-xs text-text-muted">{tag.count}</span>
              </motion.div>)}
          </div>
        </div>
        <div className="mt-auto">
          <div className="p-3 rounded-lg bg-background-dark bg-opacity-50 border border-white/5">
            <h4 className="text-sm font-medium mb-2">AI Suggestions</h4>
            <p className="text-xs text-text-muted">
              Based on your activity, you might be interested in DevOps and
              Cloud topics.
            </p>
          </div>
        </div>
      </div>
    </aside>;
};