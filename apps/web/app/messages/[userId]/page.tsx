'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useSocket } from '@/hooks/useSocket';

interface Message {
  id: string;
  senderId: string;
  sender: string;
  text: string;
  timestamp: number;
  edited: boolean;
  isRead: boolean;
}

export default function DirectMessagePage() {
  const { userId } = useParams() as { userId: string };
  const { user } = useAuth();
  const router = useRouter();
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [targetIsTyping, setTargetIsTyping] = useState(false);
  const [targetIsOnline, setTargetIsOnline] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        
        // Fetch history
        const res = await fetch(`${apiUrl}/api/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setTargetUser(data.targetUser);
        }

        // Mark as read
        fetch(`${apiUrl}/api/messages/${userId}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchHistory();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (data: any) => {
      // Only process if the message is from this conversation
      if (data.otherUser.id === userId || data.message.senderId === user.id) {
        setMessages(prev => [...prev, data.message]);
        
        // Mark as read if we received a message from the other user
        if (data.message.senderId === userId) {
          const token = localStorage.getItem('token');
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
          fetch(`${apiUrl}/api/messages/${userId}/read`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
    };

    const handleReadReceipt = (data: any) => {
      if (data.readBy === userId) {
        setMessages(prev => prev.map(m => 
          data.messageIds.includes(m.id) ? { ...m, isRead: true } : m
        ));
      }
    };

    const handleTyping = (data: any) => {
      if (data.userId === userId) {
        setTargetIsTyping(data.isTyping);
      }
    };

    const handleOnline = (data: any) => {
      if (data.userId === userId) setTargetIsOnline(true);
    };

    const handleOffline = (data: any) => {
      if (data.userId === userId) setTargetIsOnline(false);
    };

    socket.on('dm:new', handleNewMessage);
    socket.on('dm:read', handleReadReceipt);
    socket.on('dm:typing', handleTyping);
    socket.on('dm:online', handleOnline);
    socket.on('dm:offline', handleOffline);

    return () => {
      socket.off('dm:new', handleNewMessage);
      socket.off('dm:read', handleReadReceipt);
      socket.off('dm:typing', handleTyping);
      socket.off('dm:online', handleOnline);
      socket.off('dm:offline', handleOffline);
    };
  }, [socket, userId, user]);

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('dm:typing', { targetUserId: userId, isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('dm:typing', { targetUserId: userId, isTyping: false });
    }, 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const token = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    const msgText = newMessage.trim();
    setNewMessage('');
    setIsTyping(false);
    socket?.emit('dm:typing', { targetUserId: userId, isTyping: false });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      await fetch(`${apiUrl}/api/messages/${userId}/send`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ text: msgText })
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!targetUser) {
    return <div className="h-full flex items-center justify-center text-white/50 animate-pulse">Loading conversation...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-background)]">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-[var(--color-surface)]/50 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <img 
          src={targetUser.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${targetUser.username}&background=random`} 
          alt={targetUser.username} 
          className="w-10 h-10 rounded-full border-2 border-white/10"
        />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {targetUser.username}
            {targetIsOnline && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>}
          </h2>
          <p className="text-xs text-white/50">
            {targetIsOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user?.id;
          const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {showAvatar && (
                  <img 
                    src={targetUser.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${targetUser.username}&background=random`}
                    alt={msg.sender}
                    className="w-6 h-6 rounded-full shrink-0"
                  />
                )}
                {!showAvatar && !isMe && <div className="w-6 shrink-0" />}

                <div className={`
                  px-4 py-2.5 rounded-2xl relative group
                  ${isMe 
                    ? 'bg-gradient-to-br from-[var(--color-accent-pink)] to-[var(--color-accent-purple)] text-white rounded-br-sm shadow-md' 
                    : 'bg-white/10 text-white rounded-bl-sm border border-white/5'}
                `}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1 px-8 text-[10px] text-white/40">
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMe && (
                  <span>{msg.isRead ? '· Read' : '· Sent'}</span>
                )}
              </div>
            </div>
          );
        })}
        {targetIsTyping && (
          <div className="flex items-center gap-2 text-white/50 px-8 py-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs">{targetUser.username} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[var(--color-surface)]/50 backdrop-blur-md border-t border-white/5">
        <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleTypingChange}
            placeholder={`Message ${targetUser.username}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 bg-gradient-to-r from-[var(--color-accent-pink)] to-[var(--color-accent-purple)] rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Send size={18} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}
