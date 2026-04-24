import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { standardModules } from "@/data/standardModules";
import { standards } from "@/data/standards";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import TaskSelector from "@/components/standards/TaskSelector";
import ReinforcementValidator from "@/components/standards/ReinforcementValidator";

export default function StandardModule() {
  const { id } = useParams();
  const moduleInfo = standardModules.find((m) => m.id === id);
  
  if (!moduleInfo) {
    return <div className="p-8 text-center text-muted-foreground">Module not found</div>;
  }

  const moduleStandards = standards.filter((s) => s.moduleId === id);
  const Icon = moduleInfo.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/standards"
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className={cn("p-2 rounded-xl text-white", moduleInfo.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">{moduleInfo.title}</h1>
          <p className="text-sm text-muted-foreground">{moduleInfo.description}</p>
        </div>
      </div>

      <div className="pt-2">
        {id === "structural-elements" ? (
          <TaskSelector standards={moduleStandards} />
        ) : (
          <div className="space-y-3">
            {id === "reinforcement" && <ReinforcementValidator />}
            
            {moduleStandards.map((s) => (
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
            {moduleStandards.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No standards found for this module.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
