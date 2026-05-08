import { LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function PinGate({ children }) {
  const { settings } = useApp();
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthenticated(
      window.sessionStorage.getItem("al_admin_authenticated") === "true",
    );
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (pin === settings.adminPin) {
      window.sessionStorage.setItem("al_admin_authenticated", "true");
      setAuthenticated(true);
      setError("");
      return;
    }
    setError("Incorrect PIN. Please try again.");
  };

  if (authenticated) return children;

  return (
    <main className="safe-bottom mx-auto flex min-h-screen max-w-xl items-center px-4 py-8">
      <form onSubmit={submit} className="surface w-full p-6">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white">
          <LockKeyhole size={22} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-black text-slate-950">Admin PIN</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter the shop PIN to manage prices, glass rates, and settings.
        </p>
        <label className="mt-5 block">
          <span className="label">PIN</span>
          <input
            className="field text-center text-xl font-black tracking-[0.35em]"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            autoFocus
          />
        </label>
        {error ? <p className="mt-2 text-sm font-bold text-red-700">{error}</p> : null}
        <button type="submit" className="btn btn-primary mt-5 w-full">
          Unlock Admin
        </button>
      </form>
    </main>
  );
}

