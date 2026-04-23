import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, BookOpen, ListChecks, Calculator, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/standards", label: "Standards", icon: BookOpen },
  { to: "/checklists", label: "Checklists", icon: ListChecks },
  { to: "/calculators", label: "Calculators", icon: Calculator },
];

export default function AppLayout() {
  const { pathname } = useLocation();
  const titleMap: Record<string, string> = {
    "/": "CivilMate",
    "/standards": "Standards",
    "/checklists": "Checklists",
    "/calculators": "Calculators",
  };
  const showHeader = pathname in titleMap;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && (
        <header className="sticky top-0 z-40 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-card)]">
          <div className="mx-auto w-full max-w-2xl px-5 py-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground grid place-items-center shadow-[var(--shadow-card)]">
              <HardHat className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-bold tracking-tight">{titleMap[pathname]}</h1>
              <p className="text-xs text-primary-foreground/80">
                {pathname === "/" ? "Site assistant for civil engineers" : "Concrete & RCC reference"}
              </p>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 pt-4 pb-28">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur border-t border-border">
        <div className="mx-auto max-w-2xl grid grid-cols-4">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors min-h-[60px]",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "h-9 w-12 grid place-items-center rounded-full transition-colors",
                      isActive && "bg-primary/10",
                    )}
                  >
                    <t.icon className="h-5 w-5" />
                  </span>
                  {t.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
