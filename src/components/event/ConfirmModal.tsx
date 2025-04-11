import React from "react";

export default function ConfirmModal({ open, onClose, onConfirm, title }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 space-y-4 relative">
        <h2 className="text-lg font-semibold text-gray-800">
          确认要报名「{title}」吗？
        </h2>
        <p className="text-sm text-gray-600">
          报名即表示你会参加。被主办人确认后，原则上无法取消，感谢理解！
        </p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="text-sm px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            确认报名
          </button>
        </div>
      </div>
    </div>
  );
}
