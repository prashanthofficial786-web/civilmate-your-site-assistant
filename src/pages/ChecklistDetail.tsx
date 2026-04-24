import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { checklists } from "@/data/checklists";
import { getChecked, setChecked, pushRecent } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function ChecklistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cl = checklists.find((c) => c.id === id);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    if (cl) {
      setDone(getChecked(cl.id));
      pushRecent({ type: "checklist", id: cl.id, title: cl.title });
    }
  }, [cl]);

  if (!cl) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Checklist not found.</p>
        <Button onClick={() => navigate("/checklists")}>Back</Button>
      </div>
    );
  }

  const toggle = (itemId: string) => {
    const next = done.includes(itemId) ? done.filter((x) => x !== itemId) : [...done, itemId];
    setDone(next);
    setChecked(cl.id, next);
  };

  const reset = () => {
    setDone([]);
    setChecked(cl.id, []);
  };

  const pct = Math.round((done.length / cl.items.length) * 100);
  const allDone = done.length === cl.items.length;

  return (
    <div className="space-y-6 pb-12">
      <Link to="/checklists" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> All checklists
      </Link>

      <div className="px-1">
        <h1 className="text-3xl font-black leading-tight text-foreground tracking-tight">{cl.title}</h1>
        <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed">{cl.description}</p>
      </div>

      <Card className="p-6 border-0 shadow-sm rounded-[2rem] bg-white">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {done.length} of {cl.items.length} completed
          </div>
          <button 
            onClick={reset} 
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_12px_rgba(184,255,92,0.5)]" style={{ width: `${pct}%` }} />
        </div>
      </Card>

      {allDone && (
        <Card className="p-6 bg-[#1C1C1E] border-0 shadow-2xl rounded-[2rem] flex items-center gap-4 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8" />
           <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
             <CheckCircle2 className="h-7 w-7 text-primary" strokeWidth={3} />
           </div>
           <div className="text-white relative z-10">
              <div className="text-sm font-black">All Checks Complete</div>
              <div className="text-xs font-medium text-white/50">Good to go! You've verified everything.</div>
           </div>
        </Card>
      )}

      <div className="space-y-3">
        {cl.items.map((item, i) => {
          const checked = done.includes(item.id);
          return (
            <Card
              key={item.id}
              onClick={() => toggle(item.id)}
              className={cn(
                "p-5 cursor-pointer border-0 shadow-sm rounded-[1.75rem] transition-all flex items-start gap-4 select-none group bg-white",
                checked ? "bg-muted/30" : "hover:shadow-md hover:translate-x-1"
              )}
            >
              <div className={cn(
                "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all mt-1",
                checked ? "bg-primary border-primary" : "border-muted group-hover:border-primary/50"
              )}>
                {checked && <CheckCircle2 className="h-4 w-4 text-[#1C1C1E]" strokeWidth={4} />}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className={cn(
                  "text-base font-bold leading-tight transition-all", 
                  checked ? "line-through text-muted-foreground/60" : "text-foreground"
                )}>
                  {item.text}
                </div>
                {item.hint && (
                  <div className={cn(
                    "text-xs mt-2 font-medium leading-relaxed transition-all",
                    checked ? "opacity-40" : "text-muted-foreground"
                  )}>
                    {item.hint}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
