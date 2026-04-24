import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReinforcementValidator() {
  const [barDia, setBarDia] = useState<number>(16);
  const [maxAgg, setMaxAgg] = useState<number>(20);
  const [actualSpacing, setActualSpacing] = useState<number>(25);

  const reqSpacing = Math.max(barDia, maxAgg + 5);
  const isValid = actualSpacing >= reqSpacing;

  return (
    <Card className="p-4 bg-primary/5 border-primary/20 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-sm">Spacing Validator (IS 456)</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Bar Dia (mm)</label>
          <Input 
            type="number" 
            value={barDia || ""} 
            onChange={(e) => setBarDia(Number(e.target.value))}
            className="h-9"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Max Agg. (mm)</label>
          <Input 
            type="number" 
            value={maxAgg || ""} 
            onChange={(e) => setMaxAgg(Number(e.target.value))}
            className="h-9"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Actual Spacing</label>
          <Input 
            type="number" 
            value={actualSpacing || ""} 
            onChange={(e) => setActualSpacing(Number(e.target.value))}
            className="h-9"
          />
        </div>
      </div>

      <div className={cn(
        "p-3 rounded-lg flex items-start gap-3 border",
        isValid 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          : "bg-destructive/10 border-destructive/20 text-destructive"
      )}>
        {isValid ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
        <div className="text-sm">
          <p className="font-semibold">
            {isValid ? "Spacing is acceptable" : "Spacing is too small!"}
          </p>
          <p className="opacity-90 text-xs mt-0.5">
            Required minimum spacing is {reqSpacing}mm. {isValid ? "You are good to go." : "Concrete may not flow properly."}
          </p>
        </div>
      </div>
    </Card>
  );
}
