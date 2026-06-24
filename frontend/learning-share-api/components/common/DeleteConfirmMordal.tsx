type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-bold">学習ログを削除しますか？</h2>

        <p className="mt-3 text-gray-600">この操作は元に戻せません。</p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border px-4 py-2 transition-colors duration-200 hover:bg-gray-100"
          >
            キャンセル
          </button>

          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-rose-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-rose-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
