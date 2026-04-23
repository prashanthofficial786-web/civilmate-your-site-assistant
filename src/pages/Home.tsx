import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { BookOpen, ListChecks, Calculator, Search, ArrowRight, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { standards } from "@/data/standards";
import { checklists } from "@/data/checklists";
import { getRecent } from "@/lib/storage";

const tiles = [
  {
    to: "/standards",
    title: "Standards",
    desc: "IS code values, plain English",
    icon: BookOpen,
    bg: "bg-primary text-primary-foreground",
  },
  {
    to: "/checklists",
    title: "Checklists",
    desc: "Step-by-step on-site",
    icon: ListChecks,
    bg: "bg-accent text-accent-foreground",
  },
  {
    to: "/calculators",
    title: "Calculators",
    desc: "Concrete · Brick · Steel",
    icon: Calculator,
    bg: "bg-success text-success-foreground",
  },
];

const todays = [
  { type: "checklist", id: "slab-concreting", title: "Slab concreting checks" },
  { type: "standard", id: "slump-limits", title: "What slump should I expect?" },
  { type: "calculator", id: "concrete", title: "Estimate concrete for today's pour" },
];

export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const recent = useMemo(() => getRecent(), []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    const std = standards
      .filter((s) => (s.title + s.plain + s.shortValue).toLowerCase().includes(term))
      .slice(0, 4)
      .map((s) => ({ type: "standard" as const, id: s.id, title: s.title, sub: s.shortValue }));
    const cl = checklists
      .filter((c) => (c.title + c.description).toLowerCase().includes(term))
      .slice(0, 4)
      .map((c) => ({ type: "checklist" as const, id: c.id, title: c.title, sub: c.description }));
    return [...std, ...cl].slice(0, 6);
  }, [q]);

  const open = (item: { type: string; id: string }) => {
    if (item.type === "standard") navigate(`/standards/${item.id}`);
    else if (item.type === "checklist") navigate(`/checklists/${item.id}`);
    else navigate("/calculators");
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search standards, checklists…"
          className="pl-11 h-12 rounded-xl text-base shadow-[var(--shadow-card)] bg-card"
        />
        {results.length > 0 && (
          <Card className="absolute z-30 inset-x-0 top-14 p-1 shadow-[var(--shadow-elevated)]">
            {results.map((r) => (
              <button
                key={r.type + r.id}
                onClick={() => open(r)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{r.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.sub}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground shrink-0">{r.type}</span>
              </button>
            ))}
          </Card>
        )}
      </div>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Modules</h2>
        <div className="grid grid-cols-1 gap-3">
          {tiles.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group relative overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all flex items-center gap-4 bg-card border border-border"
            >
              <div className={`h-14 w-14 rounded-xl grid place-items-center ${t.bg}`}>
                <t.icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.desc}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today on site</h2>
        <Card className="divide-y divide-border overflow-hidden">
          {todays.map((item) => (
            <button
              key={item.type + item.id}
              onClick={() => open(item)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-xs font-bold uppercase">
                {item.type[0]}
              </div>
              <span className="flex-1 text-sm font-medium">{item.title}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </Card>
      </section>

      {recent.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Recently viewed
          </h2>
          <div className="flex gap-2 flex-wrap">
            {recent.map((r) => (
              <button
                key={r.type + r.id}
                onClick={() => open(r)}
                className="px-3 py-2 rounded-full bg-card border border-border text-xs font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {r.title}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
