import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import ResultRow from "./ResultRow";

const DIAMETERS = [6, 8, 10, 12, 16, 20, 25, 32];

// Unit weight = d²/162.2 kg/m
const unitWeight = (d: number) => +(d * d / 162.2).toFixed(3);

export default function SteelCalc() {
  const [dia, setDia] = useState("12");
  const [length, setLength] = useState("12");
  const [qty, setQty] = useState("10");
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const d = parseFloat(dia) || 0;
    const L = parseFloat(length) || 0;
    const Q = parseFloat(qty) || 0;
    const w = unitWeight(d);
    const totalLen = L * Q;
    const totalKg = w * totalLen;
    const lap = 50 * d; // tension lap mm
    const dev = 47 * d; // dev length mm (Fe500 + M20)
    return {
      unitWeight: w.toFixed(3),
      totalLen: totalLen.toFixed(2),
      totalKg: totalKg.toFixed(2),
      tonnes: (totalKg / 1000).toFixed(3),
      lap: lap.toFixed(0),
      dev: dev.toFixed(0),
    };
  }, [dia, length, qty]);

  const copy = async () => {
    const text = `CivilMate — Steel estimate
Bar: ${dia} mm · Length: ${length} m × Qty: ${qty}
• Unit weight: ${r.unitWeight} kg/m
• Total length: ${r.totalLen} m
• Total weight: ${r.totalKg} kg (${r.tonnes} t)
• Lap (tension): ${r.lap} mm · Dev. length: ${r.dev} mm`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied", description: "Result ready to share." });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-6 border-0 shadow-sm rounded-[2rem] bg-white">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Rebar Details</h3>
        </div>
        <div className="space-y-3">
          <Label className="text-[11px] font-bold text-foreground/70 ml-1">Bar diameter (mm)</Label>
          <Select value={dia} onValueChange={setDia}>
            <SelectTrigger className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-sm font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-[1.5rem] border-0 shadow-2xl">
              {DIAMETERS.map((d) => (
                <SelectItem key={d} value={String(d)} className="rounded-xl my-1 font-medium">
                  {d} mm — {unitWeight(d)} kg/m
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1">Length per bar (m)</Label>
            <Input 
              type="number" 
              inputMode="decimal" 
              value={length} 
              onChange={(e) => setLength(e.target.value)} 
              className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-lg font-bold transition-all focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1">Quantity (nos)</Label>
            <Input 
              type="number" 
              inputMode="numeric" 
              value={qty} 
              onChange={(e) => setQty(e.target.value)} 
              className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-lg font-bold transition-all focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-6 px-1">Weight Analysis</div>
          <div className="space-y-4">
            <ResultRow label="Unit Weight" value={r.unitWeight} unit="kg/m" />
            <ResultRow label="Total length" value={r.totalLen} unit="m" />
            <ResultRow label="Total Weight" value={r.totalKg} unit={`kg (${r.tonnes} t)`} />
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

      <Card className="p-7 bg-[#1C1C1E] text-white border-0 rounded-[2rem] shadow-xl">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black mb-5">
          Lap & Development Length
        </div>
        <div className="space-y-4">
          <ResultRow label="Tension lap (50d)" value={r.lap} unit="mm" />
          <ResultRow label="Development length (47d)" value={r.dev} unit="mm" />
        </div>
        <p className="text-[10px] text-white/30 mt-5 font-medium leading-relaxed">
          Based on IS 456 for Fe500 reinforcement bars with M20 grade concrete.
        </p>
      </Card>
    </div>
  );
}
