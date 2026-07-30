import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

export interface DMConversation {
  id: string;
  name: string;
  otherUser: {
    id: string;
    username: string;
    profile: {
      avatarUrl: string | null;
    } | null;
  };
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
  } | null;
  unreadCount: number;
}

export const useDirectMessages = () => {
  const socket = useSocket();
  const [conversations, setConversations] = useState<DMConversation[]>([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        setTotalUnreadCount(data.totalUnreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch DM conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/messages/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setConversations(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
        setTotalUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      const { conversationId, message, otherUser } = data;
      
      setConversations(prev => {
        const index = prev.findIndex(c => c.id === conversationId);
        const newConvos = [...prev];
        
        if (index >= 0) {
          const conv = { ...newConvos[index] };
          conv.lastMessage = message;
          if (!message.isRead) {
            conv.unreadCount += 1;
            setTotalUnreadCount(count => count + 1);
          }
          newConvos.splice(index, 1);
          newConvos.unshift(conv); // Move to top
        } else {
          // New conversation
          const newConv: DMConversation = {
            id: conversationId,
            name: `dm-${otherUser.id}`,
            otherUser: otherUser,
            lastMessage: message,
            unreadCount: message.isRead ? 0 : 1
          };
          if (!message.isRead) setTotalUnreadCount(count => count + 1);
          newConvos.unshift(newConv);
        }
        return newConvos;
      });
    };

    const handleReadReceipt = (data: any) => {
      const { conversationId } = data;
      setConversations(prev => {
        return prev.map(c => {
          if (c.id === conversationId) {
            setTotalUnreadCount(count => Math.max(0, count - c.unreadCount));
            return { ...c, unreadCount: 0 };
          }
          return c;
        });
      });
    };

    socket.on('dm:new', handleNewMessage);
    socket.on('dm:read', handleReadReceipt);

    return () => {
      socket.off('dm:new', handleNewMessage);
      socket.off('dm:read', handleReadReceipt);
    };
  }, [socket]);

  return {
    conversations,
    totalUnreadCount,
    loading,
    markAllAsRead,
    refresh: fetchConversations
  };
};
