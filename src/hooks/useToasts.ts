"use client";

import { useCallback } from 'react';
import { useUIStore } from '../stores/useUIStore';

export function useToasts() {
  const { 
    toasts, 
    addToast, 
    removeToast, 
    clearToasts,
    setError
  } = useUIStore();

  // Success toast helper
  const success = (message: string, title?: string, duration?: number) => {
    return addToast({
      type: 'success',
      title,
      message,
      duration,
    });
  };

  // Error toast helper
  const error = (message: string, title?: string, duration?: number) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration,
    });
  };

  // Warning toast helper
  const warning = (message: string, title?: string, duration?: number) => {
    return addToast({
      type: 'warning',
      title,
      message,
      duration,
    });\n  };

  // Info toast helper
  const info = (message: string, title?: string, duration?: number) => {
    return addToast({
      type: 'info',
      title,
      message,
      duration,
    });
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };
}