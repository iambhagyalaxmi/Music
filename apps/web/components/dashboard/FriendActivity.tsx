"use client";

import React from 'react';
import { Music, Radio, Heart, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FriendActivityProps {
  friendsActivity: any[];
}

export function FriendActivity({ friendsActivity }: FriendActivityProps) {
  const router = useRouter();

  if (!friendsActivity || friendsActivity.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-sm text-center">
        <div className="text-[var(--color-text-muted)] text-sm">No friends online right now.</div>
        <button 
          onClick={() => router.push('/friends')}
          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors"
        >
          Find Friends
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[var(--color-surface)] rounded-xl border border-white/5 shadow-sm divide-y divide-white/5">
      {friendsActivity.slice(0, 5).map((friend, idx) => {
        // Determine action based on status (mocking behavior for visual variety)
        const isListeningSolo = friend.status === 'Listening solo';
        const isInRoom = friend.status === 'In a room';

        return (
          <div key={friend.id || idx} className="p-4 flex flex-col gap-3 group hover:bg-[var(--color-surface-2)] transition-colors first:rounded-t-xl last:rounded-b-xl">
            {/* Header: User & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full object-cover" />
                  {friend.listeningTo !== 'Offline' && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--color-surface)] group-hover:border-[var(--color-surface-2)] transition-colors"></div>
                  )}
                </div>
                <span className="font-bold text-sm">{friend.name}</span>
              </div>
              <span className="text-xs text-[var(--color-text-secondary)]">2 mins ago</span>
            </div>

            {/* Content: What they are listening to */}
            {friend.listeningTo !== 'Offline' && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-accent-pink)] font-medium">
                {isInRoom ? <Radio size={14} /> : <Music size={14} />}
                <span className="truncate">{friend.listeningTo}</span>
              </div>
            )}
            {friend.listeningTo === 'Offline' && (
              <div className="text-sm text-[var(--color-text-muted)] italic">
                Offline
              </div>
            )}

            {/* Actions */}
            {friend.listeningTo !== 'Offline' && (
              <div className="flex items-center gap-2 mt-1">
                {isInRoom ? (
                  <button className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1">
                    <Radio size={12} /> Join Room
                  </button>
                ) : (
                  <button className="flex-1 bg-[var(--color-accent-pink)]/20 hover:bg-[var(--color-accent-pink)]/30 text-[var(--color-accent-pink)] py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1">
                    <Music size={12} /> Listen Together
                  </button>
                )}
                
                {/* Secondary Action */}
                {isListeningSolo ? (
                  <button className="px-2 py-1.5 bg-white/5 hover:bg-white/10 rounded text-[var(--color-text-secondary)] hover:text-red-400 transition-colors" title="Send Reaction">
                    <Heart size={14} />
                  </button>
                ) : (
                  <button className="px-2 py-1.5 bg-white/5 hover:bg-white/10 rounded text-[var(--color-text-secondary)] hover:text-white transition-colors" title="View Profile">
                    <User size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
