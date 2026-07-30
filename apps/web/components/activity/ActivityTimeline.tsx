import React from 'react';
import { Music, Heart, Plus, Radio, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'play' | 'like' | 'add' | 'room' | 'comment';
  target: string;
  time: string;
  dateGroup: string;
}

interface ActivityTimelineProps {
  items?: ActivityItem[];
}

export function ActivityTimeline({ items = [] }: ActivityTimelineProps) {
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[#111118] border border-white/5 rounded-2xl">
        <Music size={48} className="text-gray-600 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2">No Recent Activity</h3>
        <p className="text-gray-400 text-sm max-w-sm">Your listening history, liked songs, and interactions will appear here.</p>
      </div>
    );
  }

  // Group by dateGroup (e.g. "Today", "Yesterday")
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.dateGroup]) acc[item.dateGroup] = [];
    acc[item.dateGroup].push(item);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  const getIcon = (type: string) => {
    switch(type) {
      case 'play': return <Music size={14} className="text-pink-500" />;
      case 'like': return <Heart size={14} className="text-red-500 fill-red-500" />;
      case 'add': return <Plus size={14} className="text-green-500" />;
      case 'room': return <Radio size={14} className="text-purple-500" />;
      case 'comment': return <MessageSquare size={14} className="text-blue-500" />;
      default: return <Music size={14} className="text-gray-400" />;
    }
  };

  const getActionText = (type: string) => {
    switch(type) {
      case 'play': return 'Played';
      case 'like': return 'Liked';
      case 'add': return 'Added';
      case 'room': return 'Joined';
      case 'comment': return 'Commented';
      default: return 'Did something with';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(grouped).map(([date, activities]) => (
        <div key={date} className="relative">
          <h3 className="text-lg font-bold text-white mb-6 sticky top-[80px] bg-[var(--color-background)] py-2 z-10 border-b border-white/5">
            {date}
          </h3>
          
          <div className="flex flex-col relative pl-6 before:absolute before:top-2 before:bottom-0 before:left-[11px] before:w-px before:bg-white/10 gap-6">
            {activities.map((activity, i) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-[#181824] border-2 border-[#111118] flex items-center justify-center z-10 group-hover:scale-125 group-hover:border-white/20 transition-all">
                  {getIcon(activity.type)}
                </div>
                
                {/* Content Card */}
                <div className="bg-[#111118] border border-white/5 rounded-xl p-4 hover:bg-[#1A1A24] transition-colors hover:border-white/10 group-hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        {getActionText(activity.type)} 
                        <span className="text-gray-300 font-medium">{activity.target}</span>
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap font-medium">{activity.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
