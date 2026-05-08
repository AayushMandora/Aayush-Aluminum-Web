import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  Download,
  Edit3,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import PartRow from "../components/PartRow.jsx";
import PinGate from "../components/PinGate.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { createUuid, PART_UNITS } from "../utils/seedData.js";

const tabs = ["Window Types", "Parts & Prices", "Glass Rates", "Settings"];

export default function Admin() {
  return (
    <PinGate>
      <main className="safe-bottom mx-auto max-w-3xl px-4 py-5">
        <header>
          <p className="text-sm font-bold text-primary">Protected</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">Admin Panel</h1>
        </header>

        <TabGroup>
          <TabList className="no-print mt-5 flex gap-2 overflow-x-auto rounded-2xl bg-slate-200 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className="min-h-11 whitespace-nowrap rounded-xl px-3 text-sm font-extrabold text-slate-600 outline-none data-[selected]:bg-white data-[selected]:text-primary data-[selected]:shadow"
              >
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-5">
            <TabPanel>
              <WindowTypesTab />
            </TabPanel>
            <TabPanel>
              <PartsTab />
            </TabPanel>
            <TabPanel>
              <GlassRatesTab />
            </TabPanel>
            <TabPanel>
              <SettingsTab />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </main>
    </PinGate>
  );
}

function WindowTypesTab() {
  const { windowTypes, setWindowTypes, parts } = useApp();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");
  const isEditing = Boolean(editing?.id);

  const startAdd = () => {
    setError("");
    setEditing({
      name: "",
      description: "",
      parts: []
    });
  };

  const saveType = () => {
    if (!editing.name?.trim()) {
      setError("Window type name is required.");
      return;
    }
    const cleaned = {
      ...editing,
      id: editing.id || createUuid(),
      name: editing.name.trim(),
      description: editing.description?.trim() || "",
      parts: editing.parts
        .filter((row) => row.partId)
        .map((row) => ({
          partId: row.partId,
          formulaType: row.formulaType,
          label: row.label?.trim() || "",
          ...(row.formulaType === "fixed"
            ? { quantity: Number(row.quantity) || 0 }
            : { multiplier: Number(row.multiplier) || 0 })
        }))
    };

    setWindowTypes((items) =>
      isEditing
        ? items.map((item) => (item.id === cleaned.id ? cleaned : item))
        : [...items, cleaned],
    );
    setEditing(null);
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Window Types</h2>
          <p className="text-sm text-slate-500">Set formulas for each window style.</p>
        </div>
        <button type="button" className="btn btn-primary px-3" onClick={startAdd}>
          <Plus size={18} />
          Add
        </button>
      </div>

      {editing ? (
        <section className="surface space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="label">Name</span>
              <input
                className="field"
                value={editing.name}
                onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              />
            </label>
            <label>
              <span className="label">Description</span>
              <input
                className="field"
                value={editing.description}
                onChange={(event) =>
                  setEditing({ ...editing, description: event.target.value })
                }
              />
            </label>
          </div>
          {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-slate-950">Formula Parts</p>
              <button
                type="button"
                className="btn btn-soft px-3"
                onClick={() =>
                  setEditing({
                    ...editing,
                    parts: [
                      ...editing.parts,
                      {
                        partId: parts[0]?.id || "",
                        formulaType: "fixed",
                        quantity: 1,
                        label: ""
                      }
                    ]
                  })
                }
              >
                <Plus size={18} />
                Row
              </button>
            </div>
            {editing.parts.length ? (
              editing.parts.map((row, index) => (
                <PartRow
                  key={`${row.partId}-${index}`}
                  value={row}
                  parts={parts}
                  onChange={(next) =>
                    setEditing({
                      ...editing,
                      parts: editing.parts.map((item, itemIndex) =>
                        itemIndex === index ? next : item,
                      )
                    })
                  }
                  onRemove={() =>
                    setEditing({
                      ...editing,
                      parts: editing.parts.filter((_, itemIndex) => itemIndex !== index)
                    })
                  }
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                No formula rows yet. Add parts to calculate cost.
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={saveType}>
              <Save size={18} />
              Save
            </button>
          </div>
        </section>
      ) : null}

      {windowTypes.length ? (
        <div className="space-y-3">
          {windowTypes.map((type) => (
            <article key={type.id} className="subtle-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-slate-950">{type.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{type.description}</p>
                  <p className="mt-2 text-sm font-bold text-primary">
                    {type.parts?.length || 0} formula rows
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-soft h-11 w-11 p-0"
                    onClick={() => setEditing({ ...type, parts: type.parts || [] })}
                    aria-label="Edit window type"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger h-11 w-11 p-0"
                    onClick={() => setDeleteTarget(type)}
                    aria-label="Delete window type"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No window types added yet" body="Add a type before making estimates." />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete window type?"
        message="Existing estimates with this type may show it as unknown."
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          setWindowTypes((items) => items.filter((item) => item.id !== deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

function PartsTab() {
  const { parts, setParts, settings } = useApp();
  const [draft, setDraft] = useState({ name: "", unit: "piece", costPerUnit: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addPart = () => {
    if (!draft.name.trim()) return;
    setParts((items) => [
      ...items,
      {
        id: createUuid(),
        name: draft.name.trim(),
        unit: draft.unit,
        costPerUnit: Number(draft.costPerUnit) || 0
      }
    ]);
    setDraft({ name: "", unit: "piece", costPerUnit: "" });
  };

  return (
    <div className="space-y-4">
      <section className="surface space-y-3 p-4">
        <h2 className="text-lg font-black text-slate-950">Add Part</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_130px_140px]">
          <label>
            <span className="label">Name</span>
            <input
              className="field"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="Lock, rubber, frame"
            />
          </label>
          <label>
            <span className="label">Unit</span>
            <select
              className="field"
              value={draft.unit}
              onChange={(event) => setDraft({ ...draft, unit: event.target.value })}
            >
              {PART_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Rate</span>
            <input
              className="field"
              type="number"
              min="0"
              value={draft.costPerUnit}
              onChange={(event) =>
                setDraft({ ...draft, costPerUnit: event.target.value })
              }
            />
          </label>
        </div>
        <button type="button" className="btn btn-primary w-full" onClick={addPart}>
          <Plus size={18} />
          Add Part
        </button>
      </section>

      {parts.length ? (
        <div className="space-y-3">
          {parts.map((part) => (
            <article key={part.id} className="subtle-card grid gap-3 p-4 sm:grid-cols-[1fr_120px_140px_auto]">
              <label>
                <span className="label">Name</span>
                <input
                  className="field"
                  value={part.name}
                  onChange={(event) =>
                    setParts((items) =>
                      items.map((item) =>
                        item.id === part.id ? { ...item, name: event.target.value } : item,
                      ),
                    )
                  }
                />
              </label>
              <label>
                <span className="label">Unit</span>
                <select
                  className="field"
                  value={part.unit}
                  onChange={(event) =>
                    setParts((items) =>
                      items.map((item) =>
                        item.id === part.id ? { ...item, unit: event.target.value } : item,
                      ),
                    )
                  }
                >
                  {PART_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="label">Rate</span>
                <input
                  className="field"
                  type="number"
                  min="0"
                  value={part.costPerUnit}
                  onChange={(event) =>
                    setParts((items) =>
                      items.map((item) =>
                        item.id === part.id
                          ? { ...item, costPerUnit: Number(event.target.value) || 0 }
                          : item,
                      ),
                    )
                  }
                />
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {formatCurrency(part.costPerUnit, settings.currency)}/{part.unit}
                </p>
              </label>
              <button
                type="button"
                className="btn btn-danger mt-7 h-11 w-11 p-0"
                onClick={() => setDeleteTarget(part)}
                aria-label="Delete part"
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No parts added yet" body="Add material and fitting parts here." />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete part?"
        message="Window type formulas using this part will skip it."
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          setParts((items) => items.filter((item) => item.id !== deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

function GlassRatesTab() {
  const { glassRates, setGlassRates, settings } = useApp();
  const [draft, setDraft] = useState({ type: "", costPerSqFt: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addGlass = () => {
    if (!draft.type.trim()) return;
    setGlassRates((items) => [
      ...items,
      {
        id: createUuid(),
        type: draft.type.trim(),
        costPerSqFt: Number(draft.costPerSqFt) || 0
      }
    ]);
    setDraft({ type: "", costPerSqFt: "" });
  };

  return (
    <div className="space-y-4">
      <section className="surface space-y-3 p-4">
        <h2 className="text-lg font-black text-slate-950">Add Glass Rate</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
          <label>
            <span className="label">Glass type</span>
            <input
              className="field"
              value={draft.type}
              onChange={(event) => setDraft({ ...draft, type: event.target.value })}
              placeholder="Clear, Tinted"
            />
          </label>
          <label>
            <span className="label">Rate / sq ft</span>
            <input
              className="field"
              type="number"
              min="0"
              value={draft.costPerSqFt}
              onChange={(event) =>
                setDraft({ ...draft, costPerSqFt: event.target.value })
              }
            />
          </label>
        </div>
        <button type="button" className="btn btn-primary w-full" onClick={addGlass}>
          <Plus size={18} />
          Add Glass
        </button>
      </section>

      {glassRates.length ? (
        <div className="space-y-3">
          {glassRates.map((glass) => (
            <article key={glass.id} className="subtle-card grid gap-3 p-4 sm:grid-cols-[1fr_160px_auto]">
              <label>
                <span className="label">Type</span>
                <input
                  className="field"
                  value={glass.type}
                  onChange={(event) =>
                    setGlassRates((items) =>
                      items.map((item) =>
                        item.id === glass.id ? { ...item, type: event.target.value } : item,
                      ),
                    )
                  }
                />
              </label>
              <label>
                <span className="label">Rate / sq ft</span>
                <input
                  className="field"
                  type="number"
                  min="0"
                  value={glass.costPerSqFt}
                  onChange={(event) =>
                    setGlassRates((items) =>
                      items.map((item) =>
                        item.id === glass.id
                          ? { ...item, costPerSqFt: Number(event.target.value) || 0 }
                          : item,
                      ),
                    )
                  }
                />
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {formatCurrency(glass.costPerSqFt, settings.currency)}/sq ft
                </p>
              </label>
              <button
                type="button"
                className="btn btn-danger mt-7 h-11 w-11 p-0"
                onClick={() => setDeleteTarget(glass)}
                aria-label="Delete glass rate"
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No glass rates added yet" body="Add glass pricing before estimates." />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete glass rate?"
        message="Windows using this glass type will calculate glass as zero until updated."
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          setGlassRates((items) => items.filter((item) => item.id !== deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

function SettingsTab() {
  const { settings, setSettings, exportData, importData, resetData } = useApp();
  const [resetOpen, setResetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const patchSettings = (patch) => {
    setSettings((current) => ({
      ...current,
      ...patch,
      labourType: "perWindowFlat"
    }));
  };

  const downloadExport = () => {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `al-estimate-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setMessage("");
    try {
      const text = await file.text();
      importData(JSON.parse(text));
      setMessage("Data imported successfully.");
    } catch {
      setMessage("Import failed. Please choose a valid backup JSON file.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <section className="surface space-y-4 p-4">
        <h2 className="text-lg font-black text-slate-950">Shop Settings</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="label">Shop name</span>
            <input
              className="field"
              value={settings.shopName}
              onChange={(event) => patchSettings({ shopName: event.target.value })}
            />
          </label>
          <label>
            <span className="label">Phone</span>
            <input
              className="field"
              value={settings.phone}
              inputMode="tel"
              onChange={(event) => patchSettings({ phone: event.target.value })}
            />
          </label>
          <label>
            <span className="label">GST %</span>
            <input
              className="field"
              type="number"
              min="0"
              value={settings.gstPercent}
              onChange={(event) =>
                patchSettings({ gstPercent: Number(event.target.value) || 0 })
              }
            />
          </label>
          <label>
            <span className="label">Labour per window</span>
            <input
              className="field"
              type="number"
              min="0"
              value={settings.labourValue}
              onChange={(event) =>
                patchSettings({ labourValue: Number(event.target.value) || 0 })
              }
            />
          </label>
          <label>
            <span className="label">Admin PIN</span>
            <input
              className="field"
              value={settings.adminPin}
              onChange={(event) => patchSettings({ adminPin: event.target.value })}
            />
          </label>
          <label>
            <span className="label">Currency symbol</span>
            <input
              className="field"
              value={settings.currency}
              onChange={(event) => patchSettings({ currency: event.target.value || "₹" })}
            />
          </label>
        </div>
      </section>

      <section className="surface space-y-3 p-4">
        <h2 className="text-lg font-black text-slate-950">Data</h2>
        {message ? (
          <p className="rounded-xl bg-slate-100 p-3 text-sm font-bold text-slate-700">
            {message}
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          <button type="button" className="btn btn-outline" onClick={downloadExport}>
            <Download size={18} />
            Export Data
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
          >
            <Upload size={18} />
            {loading ? "Importing..." : "Import Data"}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => setResetOpen(true)}>
            <RotateCcw size={18} />
            Reset Defaults
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={importFile}
        />
      </section>

      <ConfirmDialog
        open={resetOpen}
        title="Reset all data?"
        message="This will restore default prices and remove saved projects on this device."
        confirmText="Reset"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetData();
          setResetOpen(false);
          setMessage("Default data restored.");
        }}
      />
    </div>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
      <p className="font-extrabold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

