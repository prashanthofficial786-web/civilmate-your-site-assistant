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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {showHeader && (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md">
          <div className="mx-auto w-full max-w-2xl px-5 py-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white text-foreground grid place-items-center shadow-sm border border-border">
              <HardHat className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{titleMap[pathname]}</h1>
              <p className="text-xs text-muted-foreground font-medium">
                {pathname === "/" ? "Good Morning!" : "Site Reference"}
              </p>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 pt-2 pb-32">
        <Outlet />
      </main>

      <nav className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4">
        <div className="bg-[#1C1C1E] rounded-[2rem] p-2 flex items-center justify-between w-full max-w-sm shadow-2xl">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-primary text-[#1C1C1E]" 
                    : "text-white/60 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <t.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                  {isActive && <span>{t.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
