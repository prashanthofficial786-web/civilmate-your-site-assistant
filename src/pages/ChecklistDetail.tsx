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
    <div className="space-y-4">
      <Link to="/checklists" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All checklists
      </Link>

      <div>
        <h1 className="text-2xl font-bold leading-tight">{cl.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{cl.description}</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">
            {done.length} of {cl.items.length} complete
          </div>
          <button onClick={reset} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-success transition-all" style={{ width: `${pct}%` }} />
        </div>
      </Card>

      {allDone && (
        <Card className="p-4 bg-success/10 border-success/30 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-success" />
          <div className="text-sm font-semibold">All checks complete. Good to go!</div>
        </Card>
      )}

      <div className="space-y-2">
        {cl.items.map((item, i) => {
          const checked = done.includes(item.id);
          return (
            <Card
              key={item.id}
              onClick={() => toggle(item.id)}
              className={cn(
                "p-4 cursor-pointer transition-all flex items-start gap-3 select-none",
                checked && "bg-success/5 border-success/30",
              )}
            >
              <Checkbox checked={checked} className="mt-0.5 h-5 w-5" onCheckedChange={() => toggle(item.id)} />
              <div className="flex-1 min-w-0">
                <div className={cn("text-sm font-medium leading-snug", checked && "line-through text-muted-foreground")}>
                  <span className="text-muted-foreground mr-2 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  {item.text}
                </div>
                {item.hint && <div className="text-xs text-muted-foreground mt-1 ml-6">{item.hint}</div>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
