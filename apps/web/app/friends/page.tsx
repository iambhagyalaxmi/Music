"use client";

import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SubscriptionGuard } from '../../lib/SubscriptionGuard';
import { FriendsHero } from '@/components/friends/FriendsHero';
import { FriendsStickyBar } from '@/components/friends/FriendsStickyBar';
import { FriendActivityFeed } from '@/components/friends/FriendActivityFeed';
import { FriendCard } from '@/components/friends/FriendCard';
import { FriendProfilePreview } from '@/components/friends/FriendProfilePreview';
import { ListenTogetherModal } from '@/components/friends/ListenTogetherModal';
import { NotificationsPanel } from '@/components/friends/NotificationsPanel';
import { FriendsEmptyState } from '@/components/friends/FriendsEmptyState';
import { useFriendsQueries, useFriendsSocket } from '@/components/friends/hooks';
import { Users, UserPlus, Headphones, Music, Check, X, ShieldAlert } from 'lucide-react';

export default function FriendsPage() {
  useFriendsSocket(); // Initialize real-time updates
  const { friends, onlineFriends, activity, suggestions, requestsIncoming, requestsOutgoing, listeningRooms, history } = useFriendsQueries();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [isListenModalOpen, setIsListenModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  
  const handleAddFriend = () => {
    // Focus search or open modal
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCreateRoom = () => {
    setIsListenModalOpen(true);
  };

  const handleInviteFriend = () => {
    // Copy invite link
    alert('Invite link copied to clipboard!');
  };

  const isLoading = friends.isLoading || activity.isLoading;
  const friendsList = friends.data || [];
  const onlineCount = onlineFriends.data?.length || 0;
  const requestsCount = (requestsIncoming.data?.length || 0) + (requestsOutgoing.data?.length || 0);

  // Filter friends based on search query
  const filteredFriends = friendsList.filter((f: any) => 
    f.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.profile?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SubscriptionGuard>
      <DashboardLayout>
        <div className="flex-1 flex flex-col pb-20 relative">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold sr-only">Friends Hub</h1>
            <div className="ml-auto flex items-center gap-4">
              <NotificationsPanel />
            </div>
          </div>

          <FriendsHero 
            stats={{ total: friendsList.length, online: onlineCount, requests: requestsIncoming.data?.length || 0 }}
            onAddFriend={handleAddFriend}
            onCreateRoom={handleCreateRoom}
            onInviteFriend={handleInviteFriend}
          />

          <FriendsStickyBar 
            onSearch={setSearchQuery} 
            onAddFriend={handleAddFriend} 
            pendingCount={requestsIncoming.data?.length || 0}
          />

          {isLoading ? (
            <div className="flex flex-col gap-6 mt-8">
              <div className="h-32 bg-white/5 rounded-xl animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse"></div>)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-12 mt-6">
              
              {/* Activity Feed */}
              {activity.data && activity.data.length > 0 && (
                <FriendActivityFeed activities={activity.data} />
              )}

              {/* Online Friends */}
              {onlineFriends.data && onlineFriends.data.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online Friends</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {friendsList.filter((f: any) => onlineFriends.data.includes(f.id)).map((friend: any) => (
                      <FriendCard 
                        key={friend.id} 
                        friend={{
                          id: friend.id,
                          username: friend.username,
                          displayName: friend.profile?.displayName,
                          avatarUrl: friend.profile?.avatarUrl,
                          status: 'online',
                          mutualFriends: Math.floor(Math.random() * 20),
                          currentSong: Math.random() > 0.5 ? 'Cruel Summer' : undefined
                        }}
                        onClick={() => setSelectedFriend(friend)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Listening Together Rooms */}
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Headphones className="text-purple-400" /> Active Listening Rooms</h2>
                {(!listeningRooms.data || listeningRooms.data.length === 0) ? (
                  <FriendsEmptyState type="no-rooms" onAction={handleCreateRoom} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Render rooms... normally mapped from data. Using a placeholder card here. */}
                    <div className="bg-[#111118] border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-all flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                          <Music className="text-purple-400" size={24} />
                        </div>
                        <div>
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1 inline-block animate-pulse">Live</span>
                          <h3 className="font-bold text-lg leading-tight">Rock Night</h3>
                          <p className="text-sm text-gray-400">4 Members</p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Now Playing</p>
                        <p className="font-bold text-sm truncate">Bohemian Rhapsody</p>
                        <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <button className="w-full py-2.5 bg-white/10 hover:bg-purple-500 hover:text-white rounded-xl text-sm font-bold transition-colors">
                        Join Room
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* Friend Requests */}
              <section>
                <div className="flex items-center gap-6 mb-4 border-b border-white/10 pb-2">
                  <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="text-pink-400" /> Requests</h2>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveTab('incoming')}
                      className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'incoming' ? 'text-white border-pink-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                    >
                      Incoming ({requestsIncoming.data?.length || 0})
                    </button>
                    <button 
                      onClick={() => setActiveTab('outgoing')}
                      className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'outgoing' ? 'text-white border-pink-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                    >
                      Outgoing ({requestsOutgoing.data?.length || 0})
                    </button>
                  </div>
                </div>

                {activeTab === 'incoming' && (
                  (!requestsIncoming.data || requestsIncoming.data.length === 0) ? (
                    <FriendsEmptyState type="no-requests" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {requestsIncoming.data.map((req: any) => (
                         <div key={req.id} className="bg-[#111118] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <img src={`https://i.pravatar.cc/150?u=${req.sender?.username}`} className="w-12 h-12 rounded-full object-cover" />
                              <div>
                                <p className="font-bold">{req.sender?.username}</p>
                                <p className="text-xs text-gray-400">4 Mutuals</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white transition-colors shadow-lg"><Check size={16} /></button>
                              <button className="w-8 h-8 rounded-full bg-transparent border border-white/10 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><X size={16} /></button>
                            </div>
                         </div>
                      ))}
                    </div>
                  )
                )}

                {activeTab === 'outgoing' && (
                  (!requestsOutgoing.data || requestsOutgoing.data.length === 0) ? (
                    <FriendsEmptyState type="no-requests" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                       {requestsOutgoing.data.map((req: any) => (
                         <div key={req.id} className="bg-[#111118] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 opacity-70">
                              <img src={`https://i.pravatar.cc/150?u=${req.receiver?.username}`} className="w-12 h-12 rounded-full object-cover grayscale" />
                              <div>
                                <p className="font-bold">{req.receiver?.username}</p>
                                <p className="text-xs text-yellow-500">Pending</p>
                              </div>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-xs font-bold text-gray-400 transition-colors">Cancel</button>
                         </div>
                      ))}
                    </div>
                  )
                )}
              </section>

              {/* All Friends List */}
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="text-blue-400" /> All Friends</h2>
                {friendsList.length === 0 ? (
                  <FriendsEmptyState type="no-friends" onAction={handleAddFriend} onSecondaryAction={handleInviteFriend} />
                ) : filteredFriends.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 bg-[#111118] rounded-2xl border border-white/5">
                    No friends match your search.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFriends.map((friend: any) => {
                      const isOnline = onlineFriends.data?.includes(friend.id);
                      return (
                        <FriendCard 
                          key={friend.id} 
                          friend={{
                            id: friend.id,
                            username: friend.username,
                            displayName: friend.profile?.displayName,
                            avatarUrl: friend.profile?.avatarUrl,
                            status: isOnline ? 'online' : 'offline',
                            lastActive: '2 hours ago'
                          }}
                          onClick={() => setSelectedFriend(friend)}
                        />
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Recently Played Together */}
              {history.data && history.data.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Music className="text-indigo-400" /> Recently Played Together</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.data.map((h: any) => (
                      <div key={h.id} className="bg-[#111118] p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-400"><Music size={20}/></div>
                           <div>
                             <p className="text-xs text-indigo-400 font-bold mb-0.5">{h.time}</p>
                             <p className="text-sm">You and <span className="font-bold">{h.users.filter((u:string) => u !== 'You').join(', ')}</span> played</p>
                             <p className="font-bold text-white">{h.target}</p>
                           </div>
                        </div>
                        <div className="text-xs text-gray-500 font-bold bg-white/5 px-2 py-1 rounded-md">{h.duration}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}

        </div>
      </DashboardLayout>

      {/* Drawers and Modals */}
      <FriendProfilePreview 
        isOpen={selectedFriend !== null} 
        onClose={() => setSelectedFriend(null)} 
        friend={selectedFriend ? {
          id: selectedFriend.id,
          username: selectedFriend.username,
          displayName: selectedFriend.profile?.displayName,
          avatarUrl: selectedFriend.profile?.avatarUrl,
          status: onlineFriends.data?.includes(selectedFriend.id) ? 'online' : 'offline',
          bio: 'Music is life. Always looking for new rock playlists.',
          mutualFriends: 12,
          favoriteGenres: ['Rock', 'Indie', 'Alternative'],
          recentlyPlayed: [
            { title: 'Blinding Lights', artist: 'The Weeknd' },
            { title: 'Stairway to Heaven', artist: 'Led Zeppelin' }
          ]
        } : null}
      />

      <ListenTogetherModal 
        isOpen={isListenModalOpen} 
        onClose={() => setIsListenModalOpen(false)} 
      />
    </SubscriptionGuard>
  );
}
