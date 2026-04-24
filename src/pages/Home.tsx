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
      {/* Dashboard Card */}
      <div className="bg-[#1C1C1E] rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
        
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-6">CivilMate Assistant</h2>

          <div className="flex justify-between items-center px-2">
            {[
              { icon: BookOpen, label: "Standards", action: () => navigate('/standards') },
              { icon: ListChecks, label: "Checklists", action: () => navigate('/checklists') },
              { icon: Calculator, label: "Calculate", action: () => navigate('/calculators') },
            ].map((btn, i) => (
              <button 
                key={i} 
                onClick={btn.action}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="h-12 w-12 rounded-full bg-[#2C2C2E] flex items-center justify-center transition-colors group-hover:bg-[#3C3C3E]">
                  <btn.icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <span className="text-xs text-white/70 font-medium">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search standards, checklists…"
          className="pl-12 h-14 rounded-2xl text-base shadow-sm border-0 bg-white"
        />
        {results.length > 0 && (
          <Card className="absolute z-30 inset-x-0 top-16 p-2 shadow-2xl border-0 rounded-2xl">
            {results.map((r) => (
              <button
                key={r.type + r.id}
                onClick={() => open(r)}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate text-foreground">{r.title}</div>
                  <div className="text-xs text-muted-foreground truncate font-medium">{r.sub}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary/80 shrink-0 bg-primary/10 px-2 py-1 rounded-md">{r.type}</span>
              </button>
            ))}
          </Card>
        )}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-foreground">Modules</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {tiles.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group relative overflow-hidden rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4 bg-white border-0"
            >
              <div className="h-14 w-14 rounded-[1.25rem] grid place-items-center bg-muted/50 group-hover:bg-primary/10 transition-colors">
                <t.icon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-base text-foreground mb-0.5">{t.title}</div>
                <div className="text-sm text-muted-foreground font-medium">{t.desc}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-[#1C1C1E] transition-all">
                 <ArrowRight className="h-4 w-4 text-foreground/50 group-hover:text-[#1C1C1E]" strokeWidth={2.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-4 px-1">Today on site</h2>
        <Card className="divide-y divide-border/50 overflow-hidden rounded-[1.5rem] border-0 shadow-sm">
          {todays.map((item) => (
            <button
              key={item.type + item.id}
              onClick={() => open(item)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors group"
            >
              <div className="h-10 w-10 rounded-[1rem] bg-muted/50 text-foreground grid place-items-center text-sm font-bold uppercase group-hover:bg-primary group-hover:text-[#1C1C1E] transition-colors">
                {item.type[0]}
              </div>
              <span className="flex-1 text-sm font-semibold text-foreground">{item.title}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </Card>
      </section>

      {recent.length > 0 && (
        <section className="px-1">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Recently viewed
          </h2>
          <div className="flex gap-2 flex-wrap">
            {recent.map((r) => (
              <button
                key={r.type + r.id}
                onClick={() => open(r)}
                className="px-4 py-2 rounded-xl bg-white shadow-sm border-0 text-xs font-semibold text-foreground hover:bg-primary hover:text-[#1C1C1E] transition-all"
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
