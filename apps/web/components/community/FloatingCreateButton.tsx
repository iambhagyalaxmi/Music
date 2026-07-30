import React, { useState } from 'react';
import { Plus, Edit3, ListMusic, BarChart2, MessageSquare, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingCreateButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-[calc(100%+16px)] right-0 flex flex-col gap-3"
          >
            {[
              { icon: <Calendar size={18} />, label: 'Event', color: 'bg-orange-500' },
              { icon: <MessageSquare size={18} />, label: 'Discussion', color: 'bg-blue-500' },
              { icon: <BarChart2 size={18} />, label: 'Poll', color: 'bg-green-500' },
              { icon: <ListMusic size={18} />, label: 'Playlist', color: 'bg-[#9D4EDD]' },
              { icon: <Edit3 size={18} />, label: 'Post', color: 'bg-pink-500' },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: (4 - i) * 0.05 }}
                className="flex items-center gap-3 justify-end group"
              >
                <span className="bg-[#181824] text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
                <div className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110`}>
                  {item.icon}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,77,141,0.4)] transition-transform hover:scale-110 z-10 relative"
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={24} />
        </motion.div>
      </button>
    </div>
  );
}
