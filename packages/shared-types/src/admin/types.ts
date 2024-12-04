import type { User, OrderStatus,  NotificationType, Message } from '../types';

// Dashboard types
export interface AdminDashboardStats {
  totalUsers: number;
  totalChefs: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
}

export type DashboardFilters = {
  searchTerm: string;
  status: string;
  dateRange?: [Date | null, Date | null];
};

// Status types
export type Status = 'pending' | 'completed' | 'cancelled' | 'approved' | 'rejected';
export type ChefStatus = Extract<Status, 'pending' | 'approved' | 'rejected'>;

export const CHEF_STATUSES: ChefStatus[] = ['pending', 'approved', 'rejected'];

// API related types
export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pageCount: number;
    total: number;
    page: number;
    limit?: number;
  };
}

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChefVerification {
  id: string;
  name: string;
  appliedDate: string;
  status: ChefStatus;
  experience: string;
  specialties: string[];
}

interface DetailedUser extends User {
  orders: {
    id: bigint;  // changed from string to bigint
    status: OrderStatus;  // changed from string to OrderStatus
    totalAmount: number;
    deliveryDetails: {
      notes: string;
      phone: string;
      address: string;
    };
    scheduledFor: Date;  // changed from string to Date
    createdAt: Date;    // changed from string to Date
  }[];
  notifications: {
    id: bigint;         // changed from string to bigint
    userId: number;     // added missing property
    type: NotificationType;  // changed from string to NotificationType
    title: string;
    message: string;
    data: any;
    isRead: boolean;
    createdAt: Date;    // changed from string to Date
    updatedAt: Date;    // added missing property
  }[];
  conversations: {
    id: bigint;         // changed from string to bigint
    users: User[];
    messages: Message[];
    createdAt: Date;    // changed from string to Date
    updatedAt: Date;    // added missing property
  }[];
  sentMessages: Message[]; // Changed type to Message[]
  receivedMessages: Message[];  // changed from any[] to Message[]
}

// Export what's needed
export type { DetailedUser };


