// Camcine - UI Store (Zustand)
import { create } from 'zustand';

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  
  // Modal states
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  
  // Search state
  searchQuery: string;
  searchOpen: boolean;
  
  // Filter state
  filterOpen: boolean;
  
  // Toast notifications
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>;
  
  // Theme
  theme: 'dark' | 'light';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modal: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleFilter: () => void;
  setFilterOpen: (open: boolean) => void;
  addToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  removeToast: (id: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  sidebarOpen: false,
  activeModal: null,
  modalData: null,
  searchQuery: '',
  searchOpen: false,
  filterOpen: false,
  toasts: [],
  theme: 'dark',

  // Actions
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  openModal: (modal: string, data?: Record<string, unknown>) => 
    set({ activeModal: modal, modalData: data || null }),

  closeModal: () => set({ activeModal: null, modalData: null }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  toggleSearch: () => set(state => ({ searchOpen: !state.searchOpen })),
  setSearchOpen: (open: boolean) => set({ searchOpen: open }),

  toggleFilter: () => set(state => ({ filterOpen: !state.filterOpen })),
  setFilterOpen: (open: boolean) => set({ filterOpen: open }),

  addToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration = 3000) => {
    const id = `toast-${Date.now()}`;
    set(state => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    // Auto-remove toast
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },

  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme: 'dark' | 'light') => set({ theme }),
}));
