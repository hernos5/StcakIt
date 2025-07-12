import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/notificationStore';
import { BellIcon, CheckIcon, MessageSquareIcon, ArrowUpIcon, CheckCircleIcon, AtSignIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface NotificationDropdownProps {
  onClose: () => void;
}
export const NotificationDropdown = ({
  onClose
}: NotificationDropdownProps) => {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchNotifications();
    // Click outside to close
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-dropdown')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fetchNotifications, onClose]);
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    // Navigate based on notification type
    if (notification.sourceType === 'question' && notification.sourceId) {
      navigate(`/question/${notification.sourceId}`);
    } else if (notification.sourceType === 'answer' && notification.sourceId) {
      navigate(`/question/1#answer-${notification.sourceId}`);
    }
    onClose();
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <MessageSquareIcon className="h-4 w-4 text-primary" />;
      case 'upvote':
        return <ArrowUpIcon className="h-4 w-4 text-primary" />;
      case 'accept':
        return <CheckCircleIcon className="h-4 w-4 text-secondary" />;
      case 'mention':
        return <AtSignIcon className="h-4 w-4 text-primary" />;
      default:
        return <BellIcon className="h-4 w-4 text-primary" />;
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 10
  }} transition={{
    duration: 0.2
  }} className="notification-dropdown absolute right-0 mt-2 w-80 bg-background-medium border border-white/10 rounded-xl shadow-lg z-50 backdrop-blur-sm">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-medium">Notifications</h3>
        <button onClick={() => markAllAsRead()} className="text-xs text-primary hover:text-primary/80 flex items-center">
          <CheckIcon className="h-3 w-3 mr-1" />
          Mark all as read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? <div className="p-4 text-center text-text-muted">
            <BellIcon className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div> : notifications.map(notification => <motion.div key={notification.id} whileHover={{
        backgroundColor: 'rgba(168, 85, 247, 0.05)'
      }} onClick={() => handleNotificationClick(notification)} className={`p-3 border-b border-white/5 hover:bg-background-dark cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}>
              <div className="flex items-start">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${!notification.read ? 'bg-primary/10' : 'bg-background-dark'} mr-3`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(notification.createdAt).toLocaleDateString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })}
                  </p>
                </div>
                {!notification.read && <div className="h-2 w-2 rounded-full bg-primary ml-auto mt-2"></div>}
              </div>
            </motion.div>)}
      </div>
      <div className="p-2 border-t border-white/10">
        <button onClick={() => navigate('/notifications')} className="text-xs text-center w-full py-1 text-primary hover:text-primary/80">
          View all notifications
        </button>
      </div>
    </motion.div>;
};