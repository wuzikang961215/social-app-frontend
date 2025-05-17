import React from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg p-4 relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
