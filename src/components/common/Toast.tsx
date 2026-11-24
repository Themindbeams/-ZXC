import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md">
      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
      <span className="flex-1 font-normal text-slate-100">{message}</span>
      <button 
        onClick={onClose}
        className="text-slate-400 hover:text-white text-xs ml-2 uppercase font-medium tracking-wider"
      >
        Dismiss
      </button>
    </div>
  );
};
