import { Check } from "lucide-react";

export default function WindowCard({ windowType, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(windowType.id)}
      className={`min-h-[86px] rounded-xl border p-3 text-left transition ${
        selected
          ? "border-primary bg-[#1E3A5F]/8 ring-2 ring-primary/20"
          : "border-slate-200 bg-white hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-extrabold text-slate-900">{windowType.name}</p>
          <p className="mt-1 text-sm text-slate-500">{windowType.description}</p>
        </div>
        {selected ? (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-white">
            <Check size={16} aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </button>
  );
}

