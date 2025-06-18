export interface User {
  _id: string;
  ime: string;
  prezime: string;
  email: string;
  datumRodjenja: Date;
  spol: 'muški' | 'ženski' | 'ostalo';
  tip: 'admin' | 'user';
  slika?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  _id: string;
  naslov: string;
  tekst: string;
  autor: User;
  tip: 'campaign' | 'adventure' | 'tavern-tale' | 'quest';
  kategorije: string[];
  tagovi: string[];
  level: {
    min: number;
    max: number;
  };
  igraci: {
    min: number;
    max: number;
  };
  lokacija: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  javno: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  ime: string;
  prezime: string;
  email: string;
  password: string;
  confirmPassword: string;
  datumRodjenja: Date;
  spol: 'muški' | 'ženski' | 'ostalo';
}

export interface UpdateUserData {
  ime?: string;
  prezime?: string;
  email?: string;
  datumRodjenja?: Date;
  spol?: 'muški' | 'ženski' | 'ostalo';
  tip?: 'admin' | 'user';
}

export interface CreateUserData extends RegisterData {
  tip: 'admin' | 'user';
}

export interface CreatePostData {
  naslov: string;
  tekst: string;
  tip: 'campaign' | 'adventure' | 'tavern-tale' | 'quest';
  kategorije: string[];
  tagovi: string[];
  level: {
    min: number;
    max: number;
  };
  igraci: {
    min: number;
    max: number;
  };
  lokacija: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  javno: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 