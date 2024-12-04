import { api } from '../axios';
import useAuthStore from '../stores/authStore';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: number;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  receiver: {
    id: number;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export interface Conversation {
  conversationId: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

export interface MessageResponse {
  conversations: Conversation[];
  total: number;
  unreadCount: number;
}

export interface UserStatus {
  notificationsCount: number;
  messagesCount: number;
  ordersCount: number;
  lastNotificationAt: string | null;
  lastMessageAt: string | null;
  lastOrderUpdateAt: string | null;
}

export const NotificationService = {
  async getNotifications(skip = 0, take = 10): Promise<NotificationResponse> {
    const userId = useAuthStore.getState().user?.id;
    
    if (!userId) {
      return { notifications: [], total: 0, unreadCount: 0 };
    }

    try {
      const { data } = await api.get<NotificationResponse>(`/users/${userId}/notifications`, {
        params: { skip, take }
      });
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async getMessages(skip = 0, take = 10): Promise<MessageResponse> {
    const userId = useAuthStore.getState().user?.id;
    
    if (!userId) {
      return { conversations: [], total: 0, unreadCount: 0 };
    }

    try {
      const { data } = await api.get<MessageResponse>(`/users/${userId}/messages`, {
        params: { skip, take }
      });
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async markNotificationAsRead(notificationId: number) {
    const { data } = await api.patch(`/notifications/${notificationId}/read`);
    return data;
  },

  async markMessageAsRead(messageId: string) {  // Change from number to string
    const { data } = await api.patch(`/messages/${messageId}/read`);
    return data;
  },

  async markAllNotificationsAsRead() {
    const userId = localStorage.getItem('userId');
    const { data } = await api.patch(`/users/${userId}/notifications/read-all`);
    return data;
  },

  async markAllMessagesAsRead() {
    const userId = localStorage.getItem('userId');
    const { data } = await api.patch(`/users/${userId}/messages/read-all`);
    return data;
  },

  async getUserStatus(): Promise<UserStatus> {
    const userId = useAuthStore.getState().user?.id;
    
    if (!userId) {
      return {
        notificationsCount: 0,
        messagesCount: 0,
        ordersCount: 0,
        lastNotificationAt: null,
        lastMessageAt: null,
        lastOrderUpdateAt: null
      };
    }

    try {
      const { data } = await api.get<UserStatus>(`/users/${userId}/status`);
      return data;
    } catch (error) {
      console.error('Error fetching user status:', error);
      throw error;
    }
  }
};
