import { ArrowRight, Calculator, Clock3, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext.jsx";
import { APP_KEYS, createEmptyEstimate } from "../utils/seedData.js";
import { formatCurrency, formatDate } from "../utils/formatCurrency.js";

export default function Home() {
  const { projects, settings } = useApp();
  const navigate = useNavigate();
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const startEstimate = () => {
    window.localStorage.setItem(APP_KEYS.currentEstimate, JSON.stringify(createEmptyEstimate()));
    navigate("/estimate/new");
  };

  return (
    <main className="safe-bottom mx-auto max-w-xl px-4 py-5">
      <section className="rounded-3xl bg-primary p-5 text-white shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white/70">Aluminium Shop Estimator</p>
            <h1 className="mt-1 text-3xl font-black">{settings.shopName}</h1>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/12">
            <Calculator size={24} />
          </span>
        </div>
        <button type="button" className="btn btn-accent mt-6 w-full" onClick={startEstimate}>
          <Plus size={20} />
          Start New Estimate
        </button>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">Recent Projects</h2>
            <p className="text-sm text-slate-500">Last 3 saved estimates</p>
          </div>
          <Link to="/history" className="btn btn-soft px-3 text-sm">
            View All
          </Link>
        </div>

        {recentProjects.length ? (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/history/${project.id}`}
                className="subtle-card flex items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-slate-950">
                    {project.clientName || "Walk-in customer"}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <Clock3 size={15} /> {formatDate(project.date)} ·{" "}
                    {project.windows?.length || 0} windows
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary">
                    {formatCurrency(project.totalAmount, settings.currency)}
                  </p>
                  <ArrowRight className="ml-auto mt-1 text-slate-400" size={18} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
            <p className="font-extrabold text-slate-900">No projects saved yet</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create an estimate and save it to see recent work here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

