import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { checklists } from "@/data/checklists";
import { getChecked } from "@/lib/storage";

export default function Checklists() {
  const progress = useMemo(() => {
    return Object.fromEntries(checklists.map((c) => [c.id, getChecked(c.id).length]));
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Tap any checklist to start. Your progress is saved on this device.
      </p>
      {checklists.map((c) => {
        const done = progress[c.id] ?? 0;
        const pct = Math.round((done / c.items.length) * 100);
        return (
          <Link key={c.id} to={`/checklists/${c.id}`}>
            <Card className="p-4 hover:shadow-[var(--shadow-elevated)] hover:border-primary/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base leading-tight">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {c.duration}
                    </span>
                    <span>
                      {done}/{c.items.length} done
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
