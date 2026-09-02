import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { updateProfile, User } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { Camera, X, Loader2, Mail, Calendar, User as UserIcon, Check } from 'lucide-react';
import { auth } from '../lib/firebase';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
}

export default function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setPhotoURL(dataUrl);
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateProfile(user, {
        displayName: displayName.trim() || null,
        photoURL: photoURL || null
      });
      await auth.currentUser?.reload();
      toast.success('Profile updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 500);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md transition-all">
      <div className="bg-white dark:bg-[#0F172A] w-full sm:w-[480px] h-full sm:h-auto sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 ease-out border border-slate-200 dark:border-slate-800/60 relative overflow-hidden">
        
        {/* Header Background */}
        <div className="h-32 w-full bg-gradient-to-r from-blue-500/20 to-sky-500/20 dark:from-blue-500/10 dark:to-sky-500/10 absolute top-0 left-0" />
        
        {/* Header Actions */}
        <div className="flex justify-between items-center p-6 relative z-10">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">Profile Settings</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-8 pb-8 pt-2 flex-1 overflow-y-auto relative z-10 flex flex-col">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-[#0F172A] shadow-xl bg-slate-100 dark:bg-slate-800 transition-transform duration-300 group-hover:scale-[1.02]">
                {photoURL ? (
                  <img src={photoURL} alt={displayName || "User profile picture"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    <UserIcon className="w-12 h-12 opacity-50" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 hover:scale-110 transition-all border-2 border-white dark:border-[#0F172A]"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 font-medium tracking-wide uppercase">JPG, PNG under 2MB</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5 flex-1">
            <div className="space-y-1.5">
              <label htmlFor="displayName" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={user.email || ''}
                  disabled
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 font-medium opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2 ml-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>Joined TypeVelocity in {formattedDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-colors active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full sm:flex-1 px-6 py-3.5 sm:py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
