import React from 'react';
import { Users, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface TogetherSession {
  id: string;
  users: string[];
  target: string;
  duration: string;
  time: string;
}

interface RecentlyPlayedTogetherProps {
  sessions?: TogetherSession[];
}

export function RecentlyPlayedTogether({ sessions = [] }: RecentlyPlayedTogetherProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Users className="text-purple-500" size={20} />
        <h3 className="font-bold text-lg text-white">Recently Played Together</h3>
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
        {sessions.map((session, i) => (
          <motion.div 
            key={session.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white flex items-center gap-2">
                {session.users.join(' + ')}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{session.time}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Listened to <span className="font-bold text-white">{session.target}</span></p>
                <p className="text-xs text-gray-500 mt-0.5">{session.duration}</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <Play size={14} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
