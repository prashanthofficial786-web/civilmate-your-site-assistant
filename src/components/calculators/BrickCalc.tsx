import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import ResultRow from "./ResultRow";

// Standard modular brick incl. mortar joint = 200 x 100 x 100 mm
const BRICKS_PER_M3 = 500;
const MORTAR_RATIOS: Record<string, { sum: number; c: number; s: number }> = {
  "1:4": { sum: 5, c: 1, s: 4 },
  "1:5": { sum: 6, c: 1, s: 5 },
  "1:6": { sum: 7, c: 1, s: 6 },
};
const DRY = 1.33;
const CEMENT_DENSITY = 1440;
const BAG = 50;

export default function BrickCalc() {
  const [length, setLength] = useState("3");
  const [height, setHeight] = useState("3");
  const [thickness, setThickness] = useState("0.23"); // m
  const [mortarPct, setMortarPct] = useState("25");
  const [ratio, setRatio] = useState("1:6");
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const L = parseFloat(length) || 0;
    const H = parseFloat(height) || 0;
    const T = parseFloat(thickness) || 0;
    const wallVol = L * H * T;
    const mortarFraction = (parseFloat(mortarPct) || 0) / 100;
    const mortarWet = wallVol * mortarFraction;
    const brickVol = wallVol - mortarWet;
    const bricks = Math.ceil(brickVol * BRICKS_PER_M3);
    const mortarDry = mortarWet * DRY;
    const m = MORTAR_RATIOS[ratio];
    const cementVol = (mortarDry * m.c) / m.sum;
    const sandVol = (mortarDry * m.s) / m.sum;
    const cementKg = cementVol * CEMENT_DENSITY;
    const bags = cementKg / BAG;
    return {
      area: (L * H).toFixed(2),
      bricks,
      mortarWet: mortarWet.toFixed(3),
      bags: bags.toFixed(2),
      cementKg: cementKg.toFixed(0),
      sand: sandVol.toFixed(3),
    };
  }, [length, height, thickness, mortarPct, ratio]);

  const copy = async () => {
    const text = `CivilMate — Brickwork estimate
Wall: ${length} × ${height} m, ${thickness} m thick (${r.area} m²)
Mortar: ${ratio}
• Bricks: ${r.bricks} nos
• Cement: ${r.bags} bags (${r.cementKg} kg)
• Sand: ${r.sand} m³`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied", description: "Result ready to share." });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <Card className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Length (m)</Label>
            <Input type="number" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} className="h-12" />
          </div>
          <div className="space-y-2">
            <Label>Height (m)</Label>
            <Input type="number" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} className="h-12" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Thickness (m)</Label>
            <Select value={thickness} onValueChange={setThickness}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0.115">115 mm (half brick)</SelectItem>
                <SelectItem value="0.23">230 mm (full brick)</SelectItem>
                <SelectItem value="0.345">345 mm (1.5 brick)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Mortar ratio</Label>
            <Select value={ratio} onValueChange={setRatio}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(MORTAR_RATIOS).map((m) => (
                  <SelectItem key={m} value={m}>{m} (cement:sand)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Mortar fraction (%)</Label>
          <Input type="number" inputMode="decimal" value={mortarPct} onChange={(e) => setMortarPct(e.target.value)} className="h-12" />
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Materials required</div>
        <ResultRow label="Wall area" value={r.area} unit="m²" />
        <ResultRow label="Bricks" value={r.bricks} unit="nos" />
        <ResultRow label="Cement" value={r.bags} unit={`bags (${r.cementKg} kg)`} />
        <ResultRow label="Sand" value={r.sand} unit="m³" />
        <Button onClick={copy} className="w-full mt-4 h-12 text-base">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy result"}
        </Button>
      </Card>
    </div>
  );
}
