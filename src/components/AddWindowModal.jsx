import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Switch
} from "@headlessui/react";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import WindowCard from "./WindowCard.jsx";

const emptyForm = {
  windowTypeId: "",
  label: "",
  widthFt: "",
  heightFt: "",
  quantity: 1,
  includeGlass: true,
  glassType: "Clear"
};

export default function AddWindowModal({
  open,
  onClose,
  onSave,
  initialWindow,
  windowTypes,
  glassRates
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const editing = Boolean(initialWindow);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm({
      ...emptyForm,
      windowTypeId: initialWindow?.windowTypeId || windowTypes[0]?.id || "",
      label: initialWindow?.label || "",
      widthFt: initialWindow?.widthFt ?? "",
      heightFt: initialWindow?.heightFt ?? "",
      quantity: initialWindow?.quantity ?? 1,
      includeGlass: initialWindow?.includeGlass ?? true,
      glassType: initialWindow?.glassType || glassRates[0]?.type || "Clear"
    });
  }, [open, initialWindow, windowTypes, glassRates]);

  const selectedType = useMemo(
    () => windowTypes.find((type) => type.id === form.windowTypeId),
    [windowTypes, form.windowTypeId],
  );

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({
      ...form,
      widthFt: Number(form.widthFt),
      heightFt: Number(form.heightFt),
      quantity: Number(form.quantity)
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-40">
      <div className="fixed inset-0 bg-slate-950/45" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 top-8 flex items-end sm:items-center sm:justify-center sm:p-4">
        <DialogPanel className="max-h-full w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl">
          <form onSubmit={submit} className="flex max-h-[calc(100vh-2rem)] flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <DialogTitle className="text-xl font-black text-slate-950">
                  {editing ? "Edit Window" : "Add Window"}
                </DialogTitle>
                <p className="text-sm text-slate-500">
                  {selectedType?.name || "Choose a window type"}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-soft h-11 w-11 p-0"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-4">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-extrabold text-slate-950">Window Type</h2>
                  {errors.windowTypeId ? (
                    <span className="text-sm font-bold text-red-700">
                      {errors.windowTypeId}
                    </span>
                  ) : null}
                </div>
                {windowTypes.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {windowTypes.map((type) => (
                      <WindowCard
                        key={type.id}
                        windowType={type}
                        selected={form.windowTypeId === type.id}
                        onSelect={(windowTypeId) => setForm({ ...form, windowTypeId })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                    No window types added yet. Open Admin to create one.
                  </div>
                )}
              </section>

              <section className="grid grid-cols-2 gap-3">
                <label>
                  <span className="label">Width (ft)</span>
                  <input
                    className="field"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={form.widthFt}
                    onChange={(event) => setForm({ ...form, widthFt: event.target.value })}
                  />
                  {errors.widthFt ? (
                    <p className="mt-1 text-sm font-bold text-red-700">{errors.widthFt}</p>
                  ) : null}
                </label>
                <label>
                  <span className="label">Height (ft)</span>
                  <input
                    className="field"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={form.heightFt}
                    onChange={(event) => setForm({ ...form, heightFt: event.target.value })}
                  />
                  {errors.heightFt ? (
                    <p className="mt-1 text-sm font-bold text-red-700">{errors.heightFt}</p>
                  ) : null}
                </label>
              </section>

              <section className="grid grid-cols-2 gap-3">
                <label>
                  <span className="label">Quantity</span>
                  <input
                    className="field"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={form.quantity}
                    onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                  />
                  {errors.quantity ? (
                    <p className="mt-1 text-sm font-bold text-red-700">{errors.quantity}</p>
                  ) : null}
                </label>
                <label>
                  <span className="label">Label</span>
                  <input
                    className="field"
                    value={form.label}
                    onChange={(event) => setForm({ ...form, label: event.target.value })}
                    placeholder="Living Room"
                  />
                </label>
              </section>

              <section className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-slate-950">Include Glass</p>
                    <p className="text-sm text-slate-500">Glass is calculated by sq ft.</p>
                  </div>
                  <Switch
                    checked={form.includeGlass}
                    onChange={(includeGlass) => setForm({ ...form, includeGlass })}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                      form.includeGlass ? "bg-primary" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 rounded-full bg-white transition ${
                        form.includeGlass ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </Switch>
                </div>
                {form.includeGlass ? (
                  <label className="mt-3 block">
                    <span className="label">Glass Type</span>
                    <select
                      className="field"
                      value={form.glassType}
                      onChange={(event) => setForm({ ...form, glassType: event.target.value })}
                    >
                      {glassRates.map((rate) => (
                        <option key={rate.id} value={rate.type}>
                          {rate.type}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </section>
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!windowTypes.length}
              >
                {editing ? "Update Window" : "Add Window"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function validate(form) {
  const errors = {};
  if (!form.windowTypeId) errors.windowTypeId = "Required";
  if (!(Number(form.widthFt) > 0)) errors.widthFt = "Enter width";
  if (!(Number(form.heightFt) > 0)) errors.heightFt = "Enter height";
  if (!(Number(form.quantity) >= 1)) errors.quantity = "Min 1";
  return errors;
}

