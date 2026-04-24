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
    <div className="space-y-6">
      <Card className="p-6 space-y-6 border-0 shadow-sm rounded-[2rem] bg-white">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Wall Dimensions</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1">Length (m)</Label>
            <Input 
              type="number" 
              inputMode="decimal" 
              value={length} 
              onChange={(e) => setLength(e.target.value)} 
              className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-lg font-medium transition-all focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div className="space-y-2.5">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1">Height (m)</Label>
            <Input 
              type="number" 
              inputMode="decimal" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-lg font-medium transition-all focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1">Thickness</Label>
            <Select value={thickness} onValueChange={setThickness}>
              <SelectTrigger className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] border-0 shadow-2xl">
                <SelectItem value="0.115">115 mm (Half)</SelectItem>
                <SelectItem value="0.23">230 mm (Full)</SelectItem>
                <SelectItem value="0.345">345 mm (1.5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1">Mortar Ratio</Label>
            <Select value={ratio} onValueChange={setRatio}>
              <SelectTrigger className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] border-0 shadow-2xl">
                {Object.keys(MORTAR_RATIOS).map((m) => (
                  <SelectItem key={m} value={m}>{m} ratio</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2.5">
          <Label className="text-[11px] font-bold text-foreground/70 ml-1">Mortar fraction (%)</Label>
          <Input 
            type="number" 
            inputMode="decimal" 
            value={mortarPct} 
            onChange={(e) => setMortarPct(e.target.value)} 
            className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-lg font-medium transition-all focus:ring-2 focus:ring-primary/20" 
          />
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-6 px-1">Estimate Results</div>
          <div className="space-y-4">
            <ResultRow label="Wall area" value={r.area} unit="m²" />
            <ResultRow label="Total Bricks" value={r.bricks} unit="nos" />
            <ResultRow label="Cement Bags" value={r.bags} unit={`bags (${r.cementKg} kg)`} />
            <ResultRow label="Sand Vol." value={r.sand} unit="m³" />
          </div>
          
          <button 
            onClick={copy} 
            className="w-full mt-8 h-14 rounded-full bg-[#1C1C1E] text-primary font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="h-5 w-5" strokeWidth={3} /> : <Copy className="h-5 w-5" strokeWidth={3} />}
            {copied ? "Copied" : "Copy Estimate"}
          </button>
        </div>
      </Card>
    </div>
  );
}
