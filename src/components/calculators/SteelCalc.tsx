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
    <div className="space-y-4">
      <Card className="p-5 space-y-4">
        <div className="space-y-2">
          <Label>Bar diameter (mm)</Label>
          <Select value={dia} onValueChange={setDia}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DIAMETERS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} mm — {unitWeight(d)} kg/m
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Length per bar (m)</Label>
            <Input type="number" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} className="h-12" />
          </div>
          <div className="space-y-2">
            <Label>Quantity (nos)</Label>
            <Input type="number" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} className="h-12" />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Steel quantity</div>
        <ResultRow label="Unit weight" value={r.unitWeight} unit="kg/m" />
        <ResultRow label="Total length" value={r.totalLen} unit="m" />
        <ResultRow label="Total weight" value={r.totalKg} unit={`kg (${r.tonnes} t)`} />
        <Button onClick={copy} className="w-full mt-4 h-12 text-base">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy result"}
        </Button>
      </Card>

      <Card className="p-5 bg-accent/10 border-accent/30">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          Lap & Development length helper
        </div>
        <ResultRow label="Tension lap (50d)" value={r.lap} unit="mm" />
        <ResultRow label="Development length (47d)" value={r.dev} unit="mm" />
        <p className="text-xs text-muted-foreground mt-2">For Fe500 reinforcement with M20 concrete.</p>
      </Card>
    </div>
  );
}
