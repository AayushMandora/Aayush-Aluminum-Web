import { Switch } from "@headlessui/react";
import { CheckCircle2, Printer, Save, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useApp } from "../context/AppContext.jsx";
import { useEstimate } from "../hooks/useEstimate.js";
import { calculateEstimate } from "../utils/calculate.js";
import {
  formatCurrency,
  formatDate,
  formatQuantity
} from "../utils/formatCurrency.js";
import { createUuid } from "../utils/seedData.js";
import { buildShareText } from "../utils/shareText.js";

export default function Summary({ mode }) {
  const app = useApp();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const current = useEstimate();
  const [saved, setSaved] = useState(false);
  const readOnly = mode === "project";
  const project = readOnly
    ? app.projects.find((item) => item.id === projectId)
    : current.estimate;

  const totals = useMemo(
    () =>
      project
        ? calculateEstimate(project, {
            parts: app.parts,
            windowTypes: app.windowTypes,
            glassRates: app.glassRates,
            settings: app.settings
          })
        : null,
    [project, app.parts, app.windowTypes, app.glassRates, app.settings],
  );

  if (!project || !totals) {
    return (
      <main className="safe-bottom mx-auto max-w-xl px-4 py-8">
        <div className="surface p-5 text-center">
          <p className="font-extrabold text-slate-950">Estimate not found</p>
          <Link to="/" className="btn btn-primary mt-4">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const saveProject = () => {
    const savedProject = {
      ...project,
      id: createUuid(),
      date: new Date().toISOString(),
      totalAmount: totals.grandTotal
    };
    app.setProjects((items) => [savedProject, ...items]);
    current.setEstimate({
      ...current.estimate,
      totalAmount: totals.grandTotal
    });
    setSaved(true);
    setTimeout(() => navigate(`/history/${savedProject.id}`), 450);
  };

  const share = () => {
    const text = buildShareText(project, totals, app.settings);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <main className="safe-bottom mx-auto max-w-3xl px-4 py-5">
      <div className="print-container surface p-4 sm:p-6">
        <header className="border-b border-slate-200 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-primary">{app.settings.shopName}</p>
              <h1 className="mt-1 text-3xl font-black text-slate-950">
                Estimate Summary
              </h1>
              {app.settings.phone ? (
                <p className="mt-1 text-sm text-slate-500">{app.settings.phone}</p>
              ) : null}
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>{formatDate(project.date)}</p>
              <p>{readOnly ? "Saved project" : "Draft estimate"}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-3">
            <p className="font-extrabold text-slate-950">
              {project.clientName || "Walk-in customer"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {project.clientPhone || "No phone added"}
            </p>
          </div>
        </header>

        <section className="mt-5 space-y-4">
          {totals.windowBreakdowns.map((item, index) => (
            <article key={item.window.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-slate-950">
                    {index + 1}. {item.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.typeName} · {item.widthFt}ft × {item.heightFt}ft ×{" "}
                    {item.quantity}
                  </p>
                </div>
                <p className="font-black text-primary">
                  {formatCurrency(item.total, app.settings.currency)}
                </p>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2 font-extrabold">Part</th>
                      <th className="py-2 font-extrabold">Qty</th>
                      <th className="py-2 font-extrabold">Unit</th>
                      <th className="py-2 font-extrabold">Rate</th>
                      <th className="py-2 text-right font-extrabold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.partRows.map((part) => (
                      <tr key={part.id} className="border-b border-slate-100">
                        <td className="py-2">{part.label}</td>
                        <td className="py-2">{formatQuantity(part.quantity)}</td>
                        <td className="py-2">{part.unit}</td>
                        <td className="py-2">
                          {formatCurrency(part.rate, app.settings.currency)}
                        </td>
                        <td className="py-2 text-right font-bold">
                          {formatCurrency(part.amount, app.settings.currency)}
                        </td>
                      </tr>
                    ))}
                    {item.glassCost ? (
                      <tr className="border-b border-slate-100">
                        <td className="py-2">{item.glassType} glass</td>
                        <td className="py-2">
                          {formatQuantity(item.areaSqFt * item.quantity)}
                        </td>
                        <td className="py-2">sq ft</td>
                        <td className="py-2">
                          {formatCurrency(item.glassRate, app.settings.currency)}
                        </td>
                        <td className="py-2 text-right font-bold">
                          {formatCurrency(item.glassCost, app.settings.currency)}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </section>

        {project.notes ? (
          <section className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="font-extrabold text-slate-950">Notes</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{project.notes}</p>
          </section>
        ) : null}

        <section className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
          <Line label="Materials subtotal" value={totals.materialsSubtotal} settings={app.settings} />
          <Line label="Glass subtotal" value={totals.glassSubtotal} settings={app.settings} />
          <ToggleLine
            label={`Labour (${formatCurrency(app.settings.labourValue, app.settings.currency)}/window)`}
            value={totals.labour}
            checked={project.includeLabour}
            disabled={readOnly}
            onChange={(checked) => current.updateField("includeLabour", checked)}
            settings={app.settings}
          />
          <ToggleLine
            label={`GST (${Number(app.settings.gstPercent) || 0}%)`}
            value={totals.gst}
            checked={project.includeGst}
            disabled={readOnly}
            onChange={(checked) => current.updateField("includeGst", checked)}
            settings={app.settings}
          />
          <div className="mt-4 flex items-end justify-between border-t border-white/20 pt-4">
            <span className="text-lg font-black">Grand Total</span>
            <strong className="text-3xl font-black text-accent">
              {formatCurrency(totals.grandTotal, app.settings.currency)}
            </strong>
          </div>
        </section>
      </div>

      <section className="no-print mt-4 grid gap-3 sm:grid-cols-3">
        {!readOnly ? (
          <button type="button" className="btn btn-primary" onClick={saveProject}>
            {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
            {saved ? "Saved" : "Save Project"}
          </button>
        ) : null}
        <button type="button" className="btn btn-accent" onClick={share}>
          <Send size={20} />
          Share on WhatsApp
        </button>
        <button type="button" className="btn btn-outline" onClick={() => window.print()}>
          <Printer size={20} />
          Print
        </button>
      </section>
    </main>
  );
}

function Line({ label, value, settings }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-white/70">{label}</span>
      <strong>{formatCurrency(value, settings.currency)}</strong>
    </div>
  );
}

function ToggleLine({ label, value, checked, disabled, onChange, settings }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <Switch
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className={`no-print relative inline-flex h-7 w-12 items-center rounded-full transition ${
            checked ? "bg-accent" : "bg-white/20"
          } ${disabled ? "opacity-40" : ""}`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white transition ${
              checked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </Switch>
        <span className="text-white/70">{label}</span>
      </div>
      <strong>{formatCurrency(value, settings.currency)}</strong>
    </div>
  );
}

