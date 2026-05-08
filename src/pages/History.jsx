import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatCurrency, formatDate } from "../utils/formatCurrency.js";

export default function History() {
  const { projects, setProjects, settings } = useApp();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredProjects = useMemo(
    () =>
      [...projects]
        .filter((project) =>
          String(project.clientName || "Walk-in customer")
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [projects, search],
  );

  return (
    <main className="safe-bottom mx-auto max-w-xl px-4 py-5">
      <header>
        <p className="text-sm font-bold text-primary">Saved Work</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Project History</h1>
      </header>

      <label className="relative mt-5 block">
        <Search
          className="pointer-events-none absolute left-3 top-[39px] text-slate-400"
          size={18}
        />
        <span className="label">Search by client</span>
        <input
          className="field pl-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Client name"
        />
      </label>

      <section className="mt-5 space-y-3">
        {filteredProjects.length ? (
          filteredProjects.map((project) => (
            <article key={project.id} className="subtle-card p-4">
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <Link to={`/history/${project.id}`} className="min-w-0">
                  <p className="truncate font-extrabold text-slate-950">
                    {project.clientName || "Walk-in customer"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(project.date)} · {project.windows?.length || 0} windows
                  </p>
                  <p className="mt-2 text-xl font-black text-primary">
                    {formatCurrency(project.totalAmount, settings.currency)}
                  </p>
                </Link>
                <button
                  type="button"
                  className="btn btn-danger h-11 w-11 p-0"
                  onClick={() => setDeleteTarget(project)}
                  aria-label="Delete project"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
            <p className="font-extrabold text-slate-900">
              {projects.length ? "No matching projects" : "No saved projects yet"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Saved estimates will appear here with client, date, and amount.
            </p>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete project?"
        message="This saved estimate will be permanently removed from this device."
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          setProjects((items) => items.filter((item) => item.id !== deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </main>
  );
}

