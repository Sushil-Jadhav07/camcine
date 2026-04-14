// Camcine - Type Definitions

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'viewer' | 'actor' | 'manager' | 'admin';
  subscription: SubscriptionType;
  subscriptionExpiry?: Date;
  createdAt: Date;
  preferences: UserPreferences;
}

export type SubscriptionType = 'free' | 'premium' | 'family';

export interface UserPreferences {
  languages: string[];
  genres: string[];
  regions: string[];
  autoplay: boolean;
  subtitles: boolean;
  quality: 'auto' | '720p' | '1080p' | '4K';
}

// Content Types
export type ContentType = 'movie' | 'series' | 'shortfilm' | 'song' | 'news';
export type ContentStatus = 'free' | 'premium' | 'rental' | 'purchase' | 'locked';

export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  status: ContentStatus;
  price?: number;
  rentalPrice?: number;
  purchasePrice?: number;
  poster: string;
  backdrop: string;
  trailer?: string;
  videoUrl?: string;
  duration?: number;
  releaseYear: number;
  rating: string;
  languages: string[];
  genres: string[];
  region: string;
  mood?: string[];
  cast: CastMember[];
  crew: CrewMember[];
  tags: string[];
  isTrending: boolean;
  isFeatured: boolean;
  viewCount: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Series extends Content {
  type: 'series';
  seasons: Season[];
  totalEpisodes: number;
}

export interface Season {
  id: string;
  number: number;
  title: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  status: ContentStatus;
  price?: number;
  airDate: Date;
}

export interface Movie extends Content {
  type: 'movie';
}

export interface ShortFilm extends Content {
  type: 'shortfilm';
}

export interface Song extends Content {
  type: 'song';
  album?: string;
  artist: string;
  lyrics?: string;
  audioUrl: string;
  isExplicit: boolean;
}

export interface News extends Content {
  type: 'news';
  isLive: boolean;
  channel: string;
  category: string;
}

export interface CastMember {
  id: string;
  name: string;
  character?: string;
  avatar?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
}

// Actor Portal Types
export interface ActorProfile {
  id: string;
  userId: string;
  stageName: string;
  realName: string;
  bio: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  languages: string[];
  skills: string[];
  experience: string;
  portfolio: PortfolioItem[];
  headshots: string[];
  contactEmail: string;
  contactPhone?: string;
  socialLinks: SocialLinks;
  status: 'pending' | 'approved' | 'rejected';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  description?: string;
  year?: number;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  website?: string;
}

export interface UpdateRequest {
  id: string;
  actorId: string;
  requestedBy: string;
  changes: Partial<ActorProfile>;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  managerComment?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

// Manager Types
export interface ManagerDashboard {
  pendingRequests: number;
  approvedToday: number;
  rejectedToday: number;
  totalActors: number;
}

// Admin Types
export interface AdminDashboard {
  totalUsers: number;
  totalContent: number;
  totalRevenue: number;
  monthlyRevenue: number;
  dailyActiveUsers: number;
  newSubscribers: number;
  churnRate: number;
}

export interface ContentUpload {
  id: string;
  title: string;
  type: ContentType;
  status: 'draft' | 'processing' | 'published' | 'rejected';
  uploadedBy: string;
  uploadedAt: Date;
  publishedAt?: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'update' | 'promotion';
  targetAudience: 'all' | 'free' | 'premium' | 'actors';
  sentAt?: Date;
  createdAt: Date;
}

// Player Types
export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  quality: string;
  playbackRate: number;
  isFullscreen: boolean;
  showControls: boolean;
  buffered: number;
}

export interface WatchHistory {
  contentId: string;
  episodeId?: string;
  progress: number;
  watchedAt: Date;
}

// Search Types
export interface SearchResult {
  content: Content[];
  actors: ActorProfile[];
  genres: string[];
  suggestions: string[];
}

// Payment Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  contentId: string;
  episodeId?: string;
  type: 'subscription' | 'rental' | 'purchase' | 'episode';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: Date;
  expiresAt?: Date;
}

// UI Types
export interface FilterState {
  languages: string[];
  genres: string[];
  regions: string[];
  moods: string[];
  types: ContentType[];
  status: ContentStatus[];
  yearRange: [number, number];
  sortBy: 'popular' | 'newest' | 'rating' | 'price';
}

export interface Theme {
  colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    accent: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
    };
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
}
