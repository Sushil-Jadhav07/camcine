// Camcine - UI Store (Zustand)
import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  sidebarOpen: false,
  activeModal: null,
  modalData: null,
  searchQuery: '',
  searchOpen: false,
  filterOpen: false,
  toasts: [],
  theme: 'dark',

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openModal: (modal, data) => 
    set({ activeModal: modal, modalData: data || null }),

  closeModal: () => set({ activeModal: null, modalData: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleSearch: () => set(state => ({ searchOpen: !state.searchOpen })),
  setSearchOpen: (open) => set({ searchOpen: open }),

  toggleFilter: () => set(state => ({ filterOpen: !state.filterOpen })),
  setFilterOpen: (open) => set({ filterOpen: open }),

  addToast: (message, type, duration = 3000) => {
    const id = `toast-${Date.now()}`;
    set(state => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },

  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),
}));
