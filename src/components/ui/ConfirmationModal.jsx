import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-300 relative overflow-hidden">
        {/* Banner accent */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${variant === 'danger' ? 'bg-red-500' : 'bg-indigo-500'}`} />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-4 ${variant === 'danger' ? 'bg-red-100' : 'bg-indigo-100'}`}>
          <AlertTriangle className={`h-6 w-6 ${variant === 'danger' ? 'text-red-600' : 'text-indigo-600'}`} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{message}</p>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50" 
            onClick={onClose} 
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            className={`flex-1 rounded-xl text-white shadow-md transition-all active:scale-95 ${
              variant === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`} 
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
