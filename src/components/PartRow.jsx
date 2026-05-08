import { Trash2 } from "lucide-react";
import { FORMULA_TYPES } from "../utils/seedData.js";

export default function PartRow({ value, parts, onChange, onRemove }) {
  const isFixed = value.formulaType === "fixed";

  return (
    <div className="subtle-card space-y-3 p-3">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <label>
          <span className="label">Part</span>
          <select
            className="field"
            value={value.partId}
            onChange={(event) => onChange({ ...value, partId: event.target.value })}
          >
            <option value="">Select part</option>
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn btn-danger mt-7 h-11 w-11 p-0"
          onClick={onRemove}
          aria-label="Remove part row"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className="label">Formula</span>
          <select
            className="field"
            value={value.formulaType}
            onChange={(event) =>
              onChange({
                ...value,
                formulaType: event.target.value,
                multiplier: event.target.value === "fixed" ? undefined : value.multiplier ?? 1,
                quantity: event.target.value === "fixed" ? value.quantity ?? 1 : undefined
              })
            }
          >
            {FORMULA_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">{isFixed ? "Fixed qty" : "Multiplier"}</span>
          <input
            className="field"
            type="number"
            step="0.0001"
            min="0"
            value={isFixed ? value.quantity ?? "" : value.multiplier ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                [isFixed ? "quantity" : "multiplier"]: event.target.value
              })
            }
          />
        </label>
      </div>
      <label>
        <span className="label">Bill label</span>
        <input
          className="field"
          value={value.label || ""}
          onChange={(event) => onChange({ ...value, label: event.target.value })}
          placeholder="e.g. Side frame"
        />
      </label>
    </div>
  );
}

