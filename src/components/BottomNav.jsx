import { Calculator, History, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router";

const navItems = [
  { to: "/", label: "Estimator", icon: Calculator },
  { to: "/history", label: "History", icon: History },
  { to: "/admin", label: "Admin", icon: ShieldCheck }
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-xl grid-cols-3 px-3 pt-2">
        {navItems.map((item) => {
          const active = isActivePath(location.pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold ${
                active
                  ? "bg-primary text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-primary"
              }`}
            >
              <item.icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function isActivePath(pathname, target) {
  if (target === "/") return pathname === "/" || pathname.startsWith("/estimate");
  return pathname === target || pathname.startsWith(`${target}/`);
}
