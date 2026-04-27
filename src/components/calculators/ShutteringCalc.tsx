import { useMemo, useState } from "react";
import { Calculator, Save, Share2, Check, Layout, Square, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import ResultRow from "./ResultRow";
import { saveCalculation } from "@/lib/storage";
import { cn } from "@/lib/utils";

const PLYWOOD_AREA = 2.97; // 1.22m x 2.44m
const SHUTTERING_OIL_RATE = 0.15; // L per sqm

export default function ShutteringCalc() {
  const [type, setType] = useState<"column" | "beam" | "wall">("column");
  const [dim, setDim] = useState({ l: "3", w: "0.3", h: "0.3", n: "1" });
  const [waste, setWaste] = useState("10");
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const l = parseFloat(dim.l) || 0;
    const w = parseFloat(dim.w) || 0;
    const h = parseFloat(dim.h) || 0;
    const n = parseFloat(dim.n) || 0;
    const wasteFactor = 1 + (parseFloat(waste) || 0) / 100;

    let area = 0;
    if (type === "column") {
      // Perimeter * Height * Number
      area = 2 * (l + w) * h * n;
    } else if (type === "beam") {
      // (Bottom + 2 * Sides) * Length * Number
      // dim.w is breadth, dim.h is depth, dim.l is length
      area = (w + 2 * h) * l * n;
    } else if (type === "wall") {
      // 2 * Length * Height * Number
      area = 2 * l * h * n;
    }

    const plywood = (area * wasteFactor) / PLYWOOD_AREA;
    const oil = area * SHUTTERING_OIL_RATE;

    return {
      area: area.toFixed(2),
      plywood: Math.ceil(plywood),
      oil: oil.toFixed(2),
      invalid: area <= 0
    };
  }, [type, dim, waste]);

  const handleShare = async () => {
    const text = `CivilMate — Shuttering Estimate
Type: ${type.toUpperCase()}
Total Area: ${r.area} m²
• Plywood (8'x4'): ${r.plywood} sheets
• Shuttering Oil: ${r.oil} L`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Shuttering Estimate', text });
        return;
      } catch (e) {}
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied", description: "Result ready to share." });
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    saveCalculation({
      id: Date.now().toString(),
      type: "shuttering",
      title: `Shuttering ${type} - ${r.area} m²`,
      date: new Date().toISOString(),
      data: { r, type, dim, waste }
    });
    toast({ title: "Saved", description: "Calculation saved." });
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 rounded-[2rem] p-6 flex items-center justify-between border border-primary/20">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
            <Layers className="w-6 h-6" /> Shuttering
          </h2>
          <p className="text-muted-foreground text-xs font-medium mt-1">Column, Beam & Wall Estimates</p>
        </div>
      </div>

      <Card className="p-6 space-y-6 border-0 shadow-sm rounded-[2rem] bg-white">
        <div className="space-y-3">
          <Label className="text-xs font-bold text-foreground/70 ml-1">Structure Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'column', icon: Layout, label: 'Column' },
              { id: 'beam', icon: Square, label: 'Beam' },
              { id: 'wall', icon: Layers, label: 'Wall' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id as any)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                  type === t.id ? "bg-primary/10 border-primary text-primary" : "bg-muted/30 border-transparent text-muted-foreground"
                )}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {type === "column" && (
            <>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold ml-1">Side A (m)</Label>
                <Input type="number" value={dim.l} onChange={(e) => setDim({ ...dim, l: e.target.value })} className="h-12 rounded-xl bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold ml-1">Side B (m)</Label>
                <Input type="number" value={dim.w} onChange={(e) => setDim({ ...dim, w: e.target.value })} className="h-12 rounded-xl bg-muted/30 border-0" />
              </div>
            </>
          )}
          {type === "beam" && (
            <>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold ml-1">Breadth (m)</Label>
                <Input type="number" value={dim.w} onChange={(e) => setDim({ ...dim, w: e.target.value })} className="h-12 rounded-xl bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold ml-1">Depth (m)</Label>
                <Input type="number" value={dim.h} onChange={(e) => setDim({ ...dim, h: e.target.value })} className="h-12 rounded-xl bg-muted/30 border-0" />
              </div>
            </>
          )}
          {type === "wall" && (
            <>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold ml-1">Length (m)</Label>
                <Input type="number" value={dim.l} onChange={(e) => setDim({ ...dim, l: e.target.value })} className="h-12 rounded-xl bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold ml-1">Height (m)</Label>
                <Input type="number" value={dim.h} onChange={(e) => setDim({ ...dim, h: e.target.value })} className="h-12 rounded-xl bg-muted/30 border-0" />
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold ml-1">{type === 'beam' ? 'Length (m)' : type === 'column' ? 'Height (m)' : 'Wall Count'}</Label>
            <Input 
              type="number" 
              value={type === 'beam' ? dim.l : type === 'column' ? dim.h : dim.n} 
              onChange={(e) => setDim({ ...dim, [type === 'beam' ? 'l' : type === 'column' ? 'h' : 'n']: e.target.value })} 
              className="h-12 rounded-xl bg-muted/30 border-0" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold ml-1">Wastage (%)</Label>
            <Input type="number" value={waste} onChange={(e) => setWaste(e.target.value)} className="h-12 rounded-xl bg-muted/30 border-0" />
          </div>
        </div>

        {type !== 'wall' && (
          <div className="space-y-2">
            <Label className="text-[11px] font-bold ml-1">Number of {type}s</Label>
            <Input type="number" value={dim.n} onChange={(e) => setDim({ ...dim, n: e.target.value })} className="h-12 rounded-xl bg-muted/30 border-0" />
          </div>
        )}
      </Card>

      <Card className="p-8 border-0 shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-6 px-1 flex justify-between">
            <span>Results</span>
            <span className="text-primary">{r.area} m²</span>
          </div>
          
          <div className="space-y-4">
            <ResultRow label="Total Contact Area" value={r.area} unit="m²" />
            <ResultRow label="Plywood Sheets" value={r.plywood} unit="nos (8'x4')" />
            <ResultRow label="Shuttering Oil" value={r.oil} unit="Litres" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button onClick={handleSave} className="h-14 rounded-full bg-muted/50 text-foreground font-bold text-sm flex items-center justify-center gap-2">
              <Save className="h-5 w-5" /> Save
            </button>
            <button onClick={handleShare} className="h-14 rounded-full bg-[#1C1C1E] text-primary font-bold text-sm flex items-center justify-center gap-2">
              {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
