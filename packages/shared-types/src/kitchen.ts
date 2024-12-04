// Enums
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type OnlineStatus = 'ONLINE' | 'AWAY' | 'OFFLINE';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type Category = {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: Category;
  subcategories?: Category[];
  createdAt: Date;
  updatedAt: Date;
};

export type FoodType = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CookProfile = {
  id: number;
  userId: number;
  businessName: string;
  description: string | null;
  cuisineTypes: any;
  verificationStatus: VerificationStatus;
  rating: number;
  location: any | null;
  totalEarnings: number;
  onlineStatus: OnlineStatus;
  createdAt: Date;
  updatedAt: Date;
  minOrderAmount?: number;
  maxOrdersPerSlot?: number;
  bankDetails?: any;
  operatingHours?: any;
};

export type ChefApplication = {
  id: number;
  userId: number;
  businessName: string;
  description: string;
  cuisineTypes: any;
  certificates: any | null;
  documents: any | null;
  status: ApplicationStatus;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  mainCategories: Category[];
  subCategories: Category[];
  certificateFiles?: any;
  documentFiles?: any;
};

export type Dish = {
  id: bigint;
  cookId: number;
  name: string;
  description: string | null;
  price: number;
  preparationTime: number;
  images: string[] | null;
  status: string;
  isAvailable: boolean;
  availableFrom: Date | null;
  availableUntil: Date | null;
  maxDailyQuantity: number | null;
  createdAt: Date;
  updatedAt: Date;
  categories: { categoryId: number; category: Category }[];
  foodTypes: { foodTypeId: number; foodType: FoodType }[];
};