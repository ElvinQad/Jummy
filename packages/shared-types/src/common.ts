export type Timestamp = {
  createdAt: Date;
  updatedAt: Date;
};

export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type TimeSlot = {
  start: string; // HH:mm format
  end: string;   // HH:mm format
};

export type WeeklySchedule = {
  [key in 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN']: TimeSlot[];
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type SearchParams = {
  query?: string;
  filters?: Record<string, any>;
} & PaginationParams;
