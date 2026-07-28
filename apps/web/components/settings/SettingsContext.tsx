"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Dialog } from '../ui/Dialog';
import { useRouter } from 'next/navigation';

interface SettingsContextType {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  requestNavigation: (path: string) => void;
  saveFnRef: React.MutableRefObject<(() => Promise<void>) | null>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveFnRef = useRef<(() => Promise<void>) | null>(null);
  const router = useRouter();

  const requestNavigation = useCallback((path: string) => {
    if (isDirty) {
      setPendingPath(path);
      setIsDialogOpen(true);
    } else {
      router.replace(path);
    }
  }, [isDirty, router]);

  const handleSave = async () => {
    if (saveFnRef.current) {
      setIsSaving(true);
      try {
        await saveFnRef.current();
        setIsDirty(false);
        setIsDialogOpen(false);
        if (pendingPath) {
          router.replace(pendingPath);
        }
      } catch (error) {
        console.error('Failed to save settings:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDiscard = () => {
    setIsDirty(false);
    setIsDialogOpen(false);
    if (pendingPath) {
      router.replace(pendingPath);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setPendingPath(null);
  };

  return (
    <SettingsContext.Provider value={{ isDirty, setIsDirty, requestNavigation, saveFnRef }}>
      {children}
      
      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCancel}
        title="Unsaved Changes"
        description="You have unsaved changes. Would you like to save them before leaving?"
        footer={
          <>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-lg bg-transparent px-4 py-2 font-semibold text-white transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleDiscard}
              disabled={isSaving}
              className="rounded-lg bg-white/5 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-[#1DB954] px-4 py-2 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
      </Dialog>
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
