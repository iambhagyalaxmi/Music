import React, { useState } from 'react';
import { Bell, Check, Users, Music, Mic2, Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'request', title: 'New Friend Request', text: 'Alex wants to be friends', time: '5m ago', read: false },
    { id: 2, type: 'room', title: 'Room Invite', text: 'Priya invited you to Rock Night', time: '1h ago', read: false },
    { id: 3, type: 'playlist', title: 'Playlist Shared', text: 'Rahul shared "Weekend Vibes" with you', time: '2h ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'request': return <Users size={16} className="text-pink-500" />;
      case 'room': return <Mic2 size={16} className="text-green-500" />;
      case 'playlist': return <Music size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#09090B]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[#181824] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[400px]"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#111118]">
                <h3 className="font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-pink-500 hover:text-pink-400 font-medium flex items-center gap-1">
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative group ${!notif.read ? 'bg-pink-500/5' : ''}`}
                      >
                        <button 
                          onClick={(e) => removeNotification(notif.id, e)}
                          className="absolute right-2 top-2 p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/10"
                        >
                          <X size={14} />
                        </button>
                        <div className="flex gap-3">
                          <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notif.read ? 'bg-white/10' : 'bg-white/5'}`}>
                            {getIcon(notif.type)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5 pr-4">{notif.title}</p>
                            <p className="text-xs text-gray-400 mb-1">{notif.text}</p>
                            <p className="text-[10px] text-gray-500">{notif.time}</p>
                          </div>
                        </div>
                        {!notif.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-pink-500 rounded-r-full"></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
