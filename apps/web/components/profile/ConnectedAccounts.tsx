import React from 'react';
import { Link2, MessageCircle, PlaySquare, Check } from 'lucide-react';

export function ConnectedAccounts() {
  const accounts = [
    { name: 'Spotify', icon: <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><div className="w-2.5 h-0.5 bg-black rounded-full mb-0.5"></div></div>, connected: true },
    { name: 'YouTube Music', icon: <PlaySquare size={20} className="text-red-500" />, connected: true },
    { name: 'Discord', icon: <MessageCircle size={20} className="text-indigo-500" />, connected: false },
    { name: 'Google', icon: <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">G</div>, connected: true },
  ];

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link2 className="text-gray-400" size={20} />
        <h3 className="font-bold text-lg text-white">Connected Accounts</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {accounts.map((acc, i) => (
          <div key={acc.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              {acc.icon}
              <span className="text-sm font-bold text-white">{acc.name}</span>
            </div>
            
            {acc.connected ? (
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                <Check size={12} /> Connected
              </span>
            ) : (
              <button className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
