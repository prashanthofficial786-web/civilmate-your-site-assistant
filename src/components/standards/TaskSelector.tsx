import { useState } from "react";
import { cn } from "@/lib/utils";
import { Standard } from "@/data/standards";
import { Card } from "@/components/ui/card";
import { ChevronRight, Layers, Square, AlignVerticalSpaceAround } from "lucide-react";
import { Link } from "react-router-dom";

interface TaskSelectorProps {
  standards: Standard[];
}

type Task = "Slab" | "Beam" | "Column";

const tasks: { id: Task; label: string; icon: any }[] = [
  { id: "Slab", label: "Slab", icon: Layers },
  { id: "Beam", label: "Beam", icon: AlignVerticalSpaceAround },
  { id: "Column", label: "Column", icon: Square },
];

export default function TaskSelector({ standards }: TaskSelectorProps) {
  const [selectedTask, setSelectedTask] = useState<Task>("Slab");

  const filtered = standards.filter((s) => s.task === selectedTask);

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-xl p-2 flex gap-2">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isActive = selectedTask === task.id;
          return (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-semibold">{task.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
          {selectedTask} Critical Rules ({filtered.length})
        </h3>
        {filtered.map((s) => (
          <Link key={s.id} to={`/standards/${s.id}`}>
            <Card className="p-4 flex items-start gap-3 hover:shadow-[var(--shadow-elevated)] hover:border-primary/40 transition-all">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base leading-tight">{s.title}</h3>
                <p className="text-sm text-primary font-medium mt-1">{s.shortValue}</p>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{s.plain}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No standards found for this task.</p>
        )}
      </div>
    </div>
  );
}
