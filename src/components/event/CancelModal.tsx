export default function CancelModal({ open, onClose, onConfirm, title }) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 space-y-4 relative">
          <h2 className="text-lg font-semibold text-gray-800">
            确认要取消「{title}」的报名吗？
          </h2>
          <p className="text-sm text-gray-600">审核通过前可以取消。但请注意，累计取消超过 2 次将无法再加入活动。</p>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              先不取消
            </button>
            <button
              onClick={onConfirm}
              className="text-sm px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
            >
              确认取消
            </button>
          </div>
        </div>
      </div>
    );
  }
  