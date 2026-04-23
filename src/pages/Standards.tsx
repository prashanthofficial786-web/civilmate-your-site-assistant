import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { standards } from "@/data/standards";
import { cn } from "@/lib/utils";

const categories = ["All", "Concrete", "RCC", "Curing", "Testing", "Formwork"] as const;

export default function Standards() {
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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search standards…"
          className="pl-11 h-11 rounded-xl bg-card"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
              cat === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/50",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map((s) => (
          <Link key={s.id} to={`/standards/${s.id}`}>
            <Card className="p-4 flex items-start gap-3 hover:shadow-[var(--shadow-elevated)] hover:border-primary/40 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {s.category}
                  </span>
                </div>
                <h3 className="font-semibold text-base leading-tight">{s.title}</h3>
                <p className="text-sm text-primary font-medium mt-1">{s.shortValue}</p>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{s.plain}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">No standards match your search.</Card>
        )}
      </div>
    </div>
  );
}
