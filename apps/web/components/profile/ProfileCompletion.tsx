import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileCompletion() {
  const percentage = 80;
  
  const completedTasks = [
    'Avatar uploaded',
    'Username set',
    'Bio added',
    'Favorite Genres selected'
  ];
  
  const missingTasks = [
    'Social Links',
    'Favorite Artists'
  ];

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-green-500/20 transition-colors"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-bold text-lg text-white">Profile Completion</h3>
        <span className="text-green-400 font-black text-xl">{percentage}%</span>
      </div>
      
      <div className="w-full bg-white/5 rounded-full h-2.5 mb-6 overflow-hidden relative z-10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="bg-green-500 h-2.5 rounded-full"
        ></motion.div>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 relative z-10">
        <div className="flex flex-col gap-2">
          {completedTasks.map(task => (
            <div key={task} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              <span>{task}</span>
            </div>
          ))}
        </div>
        
        {missingTasks.length > 0 && (
          <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Missing</p>
            {missingTasks.map(task => (
              <div key={task} className="flex items-center gap-2 text-sm text-gray-500">
                <Circle size={16} className="shrink-0" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
