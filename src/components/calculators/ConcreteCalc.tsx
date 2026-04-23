import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import ResultRow from "./ResultRow";

// Volumetric proportions (sum) for nominal mixes
const mixes: Record<string, { ratio: string; sum: number; cementPart: number; sandPart: number; aggPart: number; water: number }> = {
  M15: { ratio: "1:2:4", sum: 7, cementPart: 1, sandPart: 2, aggPart: 4, water: 0.55 },
  M20: { ratio: "1:1.5:3", sum: 5.5, cementPart: 1, sandPart: 1.5, aggPart: 3, water: 0.5 },
  M25: { ratio: "1:1:2", sum: 4, cementPart: 1, sandPart: 1, aggPart: 2, water: 0.45 },
  M30: { ratio: "Design mix*", sum: 3.6, cementPart: 1, sandPart: 1, aggPart: 1.6, water: 0.42 },
};

const DRY_FACTOR = 1.54; // wet → dry volume
const CEMENT_DENSITY = 1440; // kg/m³
const BAG = 50; // kg per bag

export default function ConcreteCalc() {
  const [vol, setVol] = useState("1");
  const [grade, setGrade] = useState("M20");
  const [waste, setWaste] = useState("5");
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const v = parseFloat(vol) || 0;
    const w = (parseFloat(waste) || 0) / 100;
    const m = mixes[grade];
    const dry = v * DRY_FACTOR * (1 + w);
    const cementVol = (dry * m.cementPart) / m.sum;
    const sandVol = (dry * m.sandPart) / m.sum;
    const aggVol = (dry * m.aggPart) / m.sum;
    const cementKg = cementVol * CEMENT_DENSITY;
    const bags = cementKg / BAG;
    const waterL = cementKg * m.water;
    return {
      bags: bags.toFixed(2),
      cementKg: cementKg.toFixed(0),
      sand: sandVol.toFixed(3),
      agg: aggVol.toFixed(3),
      water: waterL.toFixed(0),
      ratio: m.ratio,
    };
  }, [vol, grade, waste]);

  const copy = async () => {
    const text = `CivilMate — Concrete estimate
Volume: ${vol} m³ · Grade: ${grade} (${r.ratio}) · Wastage: ${waste}%
• Cement: ${r.bags} bags (${r.cementKg} kg)
• Sand: ${r.sand} m³
• Aggregate: ${r.agg} m³
• Water: ~${r.water} L`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied", description: "Result ready to share on WhatsApp." });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <Card className="p-5 space-y-4">
        <div className="space-y-2">
          <Label>Wet volume (m³)</Label>
          <Input
            type="number"
            inputMode="decimal"
            value={vol}
            onChange={(e) => setVol(e.target.value)}
            className="h-12 text-base"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Grade</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(mixes).map((g) => (
                  <SelectItem key={g} value={g}>
                    {g} ({mixes[g].ratio})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Wastage (%)</Label>
            <Input type="number" inputMode="decimal" value={waste} onChange={(e) => setWaste(e.target.value)} className="h-12" />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          Materials required
        </div>
        <ResultRow label="Cement" value={r.bags} unit={`bags (${r.cementKg} kg)`} />
        <ResultRow label="Sand" value={r.sand} unit="m³" />
        <ResultRow label="Aggregate (20mm)" value={r.agg} unit="m³" />
        <ResultRow label="Water (approx)" value={r.water} unit="litres" />

        <Button onClick={copy} className="w-full mt-4 h-12 text-base" variant="default">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy result"}
        </Button>
        {grade === "M30" && (
          <p className="text-xs text-muted-foreground mt-3">
            * M30 and above should use design mix as per IS 10262. Values shown are indicative only.
          </p>
        )}
      </Card>
    </div>
  );
}
