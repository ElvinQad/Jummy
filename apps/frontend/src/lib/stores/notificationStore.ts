import { create } from 'zustand';
import { NotificationService, type Notification, type Conversation, type UserStatus } from '../services/NotificationService';

interface NotificationStore {
  notifications: Notification[];
  conversations: Conversation[];
  unreadCount: number;
  unreadMessagesCount: number;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number;
  pollingInterval: NodeJS.Timeout | null;
  onNewNotification: ((notification: Notification) => void) | null;
  setNotificationCallback: (callback: (notification: Notification) => void) => void;
  fetchAll: () => Promise<void>;
  markAsRead: (type: 'notification' | 'message', id: number | string) => Promise<void>;
  markAllAsRead: (type: 'notification' | 'message') => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  userStatus: UserStatus | null;
  fetchUserStatus: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  conversations: [],
  unreadCount: 0,
  unreadMessagesCount: 0,
  isLoading: false,
  error: null,
  lastFetchedAt: 0,
  pollingInterval: null,
  onNewNotification: null,
  userStatus: null,

  setNotificationCallback: (callback) => {
    set({ onNewNotification: callback });
  },

  fetchUserStatus: async () => {
    const currentTime = Date.now();
    const timeSinceLastFetch = currentTime - get().lastFetchedAt;
    
    if (timeSinceLastFetch < 10000) return;

    try {
      const status = await NotificationService.getUserStatus();
      set({ 
        userStatus: status,
        unreadCount: status.notificationsCount,
        unreadMessagesCount: status.messagesCount,
        lastFetchedAt: currentTime
      });
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  },

  fetchAll: async () => {
    const currentTime = Date.now();
    const timeSinceLastFetch = currentTime - get().lastFetchedAt;
    
    // Reduce throttle time to 2 seconds for manual fetches
    if (timeSinceLastFetch < 2000) return;

    set({ isLoading: true, error: null, lastFetchedAt: currentTime });
    try {
      
      const [notifData, messageData] = await Promise.all([
        NotificationService.getNotifications(),
        NotificationService.getMessages()
      ]);
      
      const previousNotifications = get().notifications;
      const { onNewNotification } = get();
      
      // Handle new notifications using callback
      notifData.notifications.forEach(notification => {
        const isNew = !previousNotifications.find(n => n.id === notification.id);
        if (isNew && !notification.isRead && onNewNotification) {
          onNewNotification(notification);
        }
      });

      set({
        notifications: notifData.notifications,
        conversations: messageData.conversations,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch notifications and messages',
        isLoading: false
      });
      console.error('Error fetching notifications:', error);
    }
  },

  markAsRead: async (type, id) => {
    try {
      if (type === 'notification') {
        await NotificationService.markNotificationAsRead(id as number);
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: state.unreadCount - 1
        }));
      } else {
        await NotificationService.markMessageAsRead(id as string);
        set(state => ({
          conversations: state.conversations.map(m => 
            m.id === id ? { ...m, isRead: true } : m
          ),
          unreadMessagesCount: state.unreadMessagesCount - 1
        }));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  },

  markAllAsRead: async (type) => {
    try {
      if (type === 'notification') {
        await NotificationService.markAllNotificationsAsRead();
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0
        }));
      } else {
        await NotificationService.markAllMessagesAsRead();
        set(state => ({
          conversations: state.conversations.map(m => ({ ...m, isRead: true })),
          unreadMessagesCount: 0
        }));
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  },

  startPolling: () => {
    if (get().pollingInterval) return;
    
    // Initial fetch
    get().fetchUserStatus();
    
    const interval = setInterval(() => {
      get().fetchUserStatus();  // Poll status more frequently
      // get().fetchAll();        // Full data fetch less frequently
    }, 30000);

    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  }
}));
