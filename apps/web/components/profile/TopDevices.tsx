import React from 'react';
import { Laptop, Smartphone, Globe, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

export function TopDevices() {
  const devices = [
    { name: 'Windows', icon: <Monitor size={16} />, percentage: 65, color: 'text-blue-500' },
    { name: 'Android', icon: <Smartphone size={16} />, percentage: 30, color: 'text-green-500' },
    { name: 'Web', icon: <Globe size={16} />, percentage: 5, color: 'text-purple-500' },
  ];

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Laptop className="text-gray-400" size={20} />
        <h3 className="font-bold text-lg text-white">Listening Devices</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {devices.map((device, i) => (
          <motion.div 
            key={device.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className={device.color}>{device.icon}</span>
                <span className="font-medium">{device.name}</span>
              </div>
              <span className="text-sm font-bold text-white">{device.percentage}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${device.percentage}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                className={`h-full ${device.color.replace('text-', 'bg-')}`}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
