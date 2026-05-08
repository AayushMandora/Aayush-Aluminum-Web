import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) {
  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/45" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
              <AlertTriangle size={20} aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-lg font-extrabold text-slate-950">
                {title}
              </DialogTitle>
              <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              {cancelText}
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

