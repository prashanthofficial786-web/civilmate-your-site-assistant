import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { standards } from "@/data/standards";
import { standardModules } from "@/data/standardModules";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Concrete",
  "RCC",
  "Curing",
  "Testing",
  "Formwork",
  "Masonry",
  "Finishing",
  "Waterproofing",
  "Weather",
  "Tolerance",
  "Safety",
  "Storage",
  "Reinforcement",
  "Concrete Advanced",
  "Structural Elements"
] as const;

export default function Standards() {
  const [viewMode, setViewMode] = useState<"modules" | "all">("modules");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return standards.filter((s) => {
      const matchCat = cat === "All" || s.category === cat;
      const matchQ =
        !term || (s.title + s.plain + s.shortValue + s.reference).toLowerCase().includes(term);
      return matchCat && matchQ;
    });
  }, [q, cat]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-2xl font-bold text-foreground">Standards</h1>
        <div className="flex bg-muted/50 p-1.5 rounded-[1.25rem] border border-border/50">
          <button
            onClick={() => setViewMode("modules")}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-[1rem] transition-all flex items-center gap-2",
              viewMode === "modules" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Modules
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-[1rem] transition-all flex items-center gap-2",
              viewMode === "all" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" />
            All
          </button>
        </div>
      </div>

      {viewMode === "modules" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {standardModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.id} to={`/standards/module/${mod.id}`}>
                <Card className="h-full p-5 flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all group border-0 rounded-[2rem] bg-white">
                  <div className={cn("p-4 rounded-[1.5rem]", mod.color, "bg-opacity-10 text-current transition-transform group-hover:scale-110")}>
                    <Icon className={cn("w-6 h-6", mod.color.replace("bg-", "text-"))} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight mb-2 text-foreground">{mod.title}</h3>
                    <p className="text-[11px] text-muted-foreground font-medium line-clamp-2 leading-relaxed">{mod.description}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search standards…"
              className="pl-12 h-14 rounded-[1.5rem] bg-white border-0 shadow-sm text-base"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-0",
                  cat === c
                    ? "bg-[#1C1C1E] text-primary shadow-lg"
                    : "bg-white text-muted-foreground hover:bg-muted/50",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((s) => (
              <Link key={s.id} to={`/standards/${s.id}`}>
                <Card className="p-5 flex items-start gap-4 hover:shadow-xl transition-all border-0 rounded-[1.75rem] bg-white group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        {s.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-primary font-bold mt-2">{s.shortValue}</p>
                    <p className="text-[13px] text-muted-foreground font-medium mt-2 line-clamp-2 leading-relaxed">{s.plain}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center shrink-0 mt-1 group-hover:bg-primary group-hover:text-[#1C1C1E] transition-all">
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#1C1C1E]" strokeWidth={2.5} />
                  </div>
                </Card>
              </Link>
            ))}
            {filtered.length === 0 && (
              <Card className="p-12 text-center text-sm font-medium text-muted-foreground bg-white border-0 rounded-[2rem]">
                No standards match your search.
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
