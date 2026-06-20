'use client';

import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

export default function Modal({ open, onClose, title, children, footer, maxWidth = 520 }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-[90%] max-h-[85vh] overflow-y-auto rounded-[14px] border bg-white p-7 shadow-2xl"
        style={{ borderColor: 'var(--border)', maxWidth }}
      >
        <div className="font-display mb-5 text-xl font-semibold">{title}</div>
        {children}
        {footer && <div className="mt-5 flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}
