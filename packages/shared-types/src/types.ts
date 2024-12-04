import type { CookProfile, ChefApplication, Dish, OnlineStatus } from './kitchen';

// Core types
export type Address = {
  id: bigint;
  title: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  profileId: bigint;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  avatar: string | null;
  addresses: Address[];
};

export type User = {
  id: number;
  email: string;
  phone: string | null;
  password: string | null;
  googleId: string | null;
  isChef: boolean;
  isAdmin: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profile?: UserProfile | null;
  onlineStatus: OnlineStatus;
  lastSeen?: LastSeen;
  favorites?: UserFavorite[];
  cookProfile?: CookProfile | null;
  chefApplication?: ChefApplication | null;
  notifications?: Notification[];
  subscriptions?: Subscription[];
  conversations?: Conversation[];
  sentMessages?: Message[];
  receivedMessages?: Message[];
};

export type LastSeen = {
  id: bigint;
  userId: number;
  timestamp: Date;
  platform?: string;
  deviceId?: string;
  ip?: string;
};

export type UserFavorite = {
  id: bigint;
  userId: number;
  dishId: bigint;
  dish: Dish;
  createdAt: Date;
};

// Communication types
export type NotificationType = 'ORDER_STATUS' | 'NEW_MESSAGE' | 'SUBSCRIPTION' | 'SYSTEM' | 'REVIEW';

export type Notification = {
  id: bigint;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Subscription = {
  id: bigint;
  userId: number;
  cookId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Conversation = {
  id: bigint;
  users: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export type Message = {
  id: bigint;
  conversationId: bigint;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Orders and Payments
export type Cart = {
  id: bigint;
  userId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: bigint;
  cartId: bigint;
  dishId: bigint;
  dish: Dish;
  quantity: number;
  scheduledFor: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'ON_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type Order = {
  id: bigint;
  customerId: number;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryDetails: any | null;
  scheduledFor: Date;
  createdAt: Date;
  updatedAt: Date;
  statusHistory?: OrderStatusHistory[];
  review?: Review;
  payment?: Payment;
};

export type OrderItem = {
  id: bigint;
  orderId: bigint;
  dishId: bigint;
  dish: Dish;
  cookId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: any | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderStatusHistory = {
  id: bigint;
  orderId: bigint;
  status: OrderStatus;
  comment?: string;
  createdAt: Date;
};

export type Review = {
  id: bigint;
  orderId: bigint;
  customerId: number;
  cookId: number;
  rating: number;
  comment?: string;
  metrics?: any;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type PaymentProvider = 'STRIPE' | 'PAYPAL';

export type Payment = {
  id: bigint;
  orderId: bigint;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  provider: PaymentProvider;
  providerResponse?: any;
  createdAt: Date;
  updatedAt: Date;
};
