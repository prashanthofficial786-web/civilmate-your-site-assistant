import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checklists as defaultChecklists, Checklist } from "@/data/checklists";
import { getChecked, getCustomChecklists } from "@/lib/storage";

export default function Checklists() {
  const navigate = useNavigate();
  const [customChecklists, setCustomChecklists] = useState<Checklist[]>([]);

  useEffect(() => {
    setCustomChecklists(getCustomChecklists());
  }, []);

  const allChecklists = useMemo(() => {
    return [...defaultChecklists, ...customChecklists];
  }, [customChecklists]);

  const progress = useMemo(() => {
    return Object.fromEntries(allChecklists.map((c) => [c.id, getChecked(c.id).length]));
  }, [allChecklists]);

  // Group checklists by category
  const groupedChecklists = useMemo(() => {
    const groups: Record<string, Checklist[]> = {};
    allChecklists.forEach((c) => {
      const cat = c.category || "Other";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(c);
    });
    return groups;
  }, [allChecklists]);

  // Ordered categories based on our standard modules, custom/other goes last
  const categoryOrder = [
    "Pre-Construction Setup",
    "Reinforcement Work",
    "Formwork Erection",
    "Concreting Work",
    "Masonry",
    "Finishing Work",
    "Waterproofing",
    "Quality Control",
    "Safety",
    "Daily Site Routine",
    "Custom",
    "Other",
  ];

  const sortedCategories = Object.keys(groupedChecklists).sort((a, b) => {
    let indexA = categoryOrder.indexOf(a);
    let indexB = categoryOrder.indexOf(b);
    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;
    return indexA - indexB;
  });

  return (
    <div className="space-y-8 pb-8">
      <div className="bg-[#1C1C1E] rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-1">Your Checklists</h2>
          <p className="text-white/60 text-xs font-medium max-w-xs">
            Tap any checklist to start. Your progress is saved locally on this device.
          </p>
        </div>
        <button 
          onClick={() => navigate("/checklists/create")} 
          className="relative z-10 bg-primary text-[#1C1C1E] h-12 px-6 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" strokeWidth={3} />
          New Checklist
        </button>
      </div>

      {sortedCategories.map((category) => (
        <div key={category} className="space-y-5">
          <div className="flex items-center gap-3 px-1">
             <div className="h-2 w-2 rounded-full bg-primary" />
             <h2 className="text-lg font-bold tracking-tight text-foreground">
               {category}
             </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {groupedChecklists[category].map((c) => {
              const done = progress[c.id] ?? 0;
              const pct = Math.round((done / c.items.length) * 100);
              return (
                <Link key={c.id} to={`/checklists/${c.id}`} className="block group">
                  <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-all border-0 rounded-[2rem] bg-white">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mt-2 font-medium line-clamp-2 leading-relaxed">{c.description}</p>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-[#1C1C1E] transition-all">
                         <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#1C1C1E]" strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {c.duration}
                        </span>
                        <span>
                          {done}/{c.items.length} completed
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
