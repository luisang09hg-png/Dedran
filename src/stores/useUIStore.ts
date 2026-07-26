"use client";

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface UIState {
  // Toast notifications
  toasts: Toast[];
  // Modal states
  modals: {
    profileEdit: boolean;
    applicationForm: boolean;
    confirmation: boolean;
  };
  // Loading states
  loading: Partial<Record<string, boolean>>;
  // Sidebar/mini-sidebar
  sidebarOpen: boolean;
  // Error boundaries
  error: Error | null;
  // Theme preferences
  theme: 'light' | 'dark' | 'system';
}

const initialState: UIState = {
  toasts: [],
  modals: {
    profileEdit: false,
    applicationForm: false,
    confirmation: false,
  },
  loading: {},
  sidebarOpen: false,
  error: null,
  theme: 'system',
};

export const useUIStore = create<UIState & {
  // Toast methods
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal methods
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  isModalOpen: (modal: keyof UIState['modals']) => boolean;

  // Loading methods
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;

  // Error handling
  setError: (error: Error | null) => void;
  clearError: () => void;

// Theme
  setTheme: (theme: UIState['theme']) => void;
  toggleTheme: () => void;
}>(devtools((set, get) => ({
  ...initialState,

  // Toast methods
  addToast: (toastData) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toastData, id };
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));

    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, toastData.duration || 5000);

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Modal methods
  openModal: (modal) => {
    set((state) => ({
      modals: { ...state.modals, [modal]: true }
    }));
  },

  closeModal: (modal) => {
    set((state) => ({
      modals: { ...state.modals, [modal]: false }
    }));
  },

isModalOpen: (modal) => {
    return !!get().modals[modal];
  },

  // Loading methods
  setLoading: (key, loading) => {
    set((state) => ({
      loading: { ...state.loading, [key]: loading }
    }));
  },

  isLoading: (key) => {
    return !!state.loading[key];
  },

  // Error handling
  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // Theme
  setTheme: (theme) => {
    set({ theme });
    // Persist to localStorage if needed
    localStorage.setItem('theme', theme);
  },

  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : state.theme === 'dark' ? 'system' : 'light'
    }));
  },
})));