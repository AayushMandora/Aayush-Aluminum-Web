import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import AddWindowModal from "../components/AddWindowModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useEstimate } from "../hooks/useEstimate.js";
import { APP_KEYS } from "../utils/seedData.js";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function NewEstimate() {
  const app = useApp();
  const navigate = useNavigate();
  const {
    estimate,
    setEstimate,
    totals,
    updateField,
    addWindow,
    updateWindow,
    deleteWindow
  } = useEstimate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWindow, setEditingWindow] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState("");

  const openNewWindow = () => {
    setEditingWindow(null);
    setModalOpen(true);
  };

  const viewSummary = () => {
    if (!estimate.windows.length) {
      setFormError("Add at least one window before viewing summary.");
      return;
    }
    const ready = {
      ...estimate,
      date: estimate.date || new Date().toISOString(),
      totalAmount: totals.grandTotal
    };
    setEstimate(ready);
    window.localStorage.setItem(APP_KEYS.currentEstimate, JSON.stringify(ready));
    navigate("/estimate/summary");
  };

  return (
    <main className="safe-bottom mx-auto max-w-xl px-4 py-5">
      <header>
        <p className="text-sm font-bold text-primary">New Estimate</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Client Details</h1>
      </header>

      <section className="surface mt-5 space-y-4 p-4">
        <label>
          <span className="label">Client name</span>
          <input
            className="field"
            value={estimate.clientName}
            onChange={(event) => updateField("clientName", event.target.value)}
            placeholder="Ramesh Shah"
          />
        </label>
        <label>
          <span className="label">Client phone</span>
          <input
            className="field"
            value={estimate.clientPhone}
            onChange={(event) => updateField("clientPhone", event.target.value)}
            placeholder="Optional"
            inputMode="tel"
          />
        </label>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">Windows</h2>
            <p className="text-sm text-slate-500">
              {estimate.windows.length} added
            </p>
          </div>
          <button type="button" className="btn btn-primary px-3" onClick={openNewWindow}>
            <Plus size={18} />
            Add Window
          </button>
        </div>

        {formError ? (
          <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {formError}
          </p>
        ) : null}

        {estimate.windows.length ? (
          <div className="space-y-3">
            {totals.windowBreakdowns.map((item) => (
              <article key={item.window.id} className="subtle-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-slate-950">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.typeName} · {item.widthFt}ft × {item.heightFt}ft ×{" "}
                      {item.quantity}
                    </p>
                    <p className="mt-2 text-lg font-black text-primary">
                      {formatCurrency(item.total, app.settings.currency)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-soft h-11 w-11 p-0"
                      onClick={() => {
                        setEditingWindow(item.window);
                        setModalOpen(true);
                      }}
                      aria-label="Edit window"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger h-11 w-11 p-0"
                      onClick={() => setDeleteTarget(item.window)}
                      aria-label="Delete window"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
            <p className="font-extrabold text-slate-900">No windows added</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Tap Add Window to enter size, type, quantity, and glass.
            </p>
          </div>
        )}
      </section>

      <section className="no-print fixed inset-x-0 bottom-[76px] z-20 mx-auto max-w-xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-bold text-slate-500">Running Total</span>
            <strong className="text-2xl font-black text-primary">
              {formatCurrency(totals.grandTotal, app.settings.currency)}
            </strong>
          </div>
          <button type="button" className="btn btn-accent w-full" onClick={viewSummary}>
            View Summary
          </button>
        </div>
      </section>

      <AddWindowModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialWindow={editingWindow}
        windowTypes={app.windowTypes}
        glassRates={app.glassRates}
        onSave={(windowData) => {
          setFormError("");
          if (editingWindow) {
            updateWindow(editingWindow.id, windowData);
          } else {
            addWindow(windowData);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete window?"
        message="This window will be removed from the estimate."
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteWindow(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </main>
  );
}

