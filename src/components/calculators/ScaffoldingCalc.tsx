import { useMemo, useState } from "react";
import { Save, Share2, Check, Box, Construction, Ruler } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ResultRow from "./ResultRow";
import { saveCalculation } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function ScaffoldingCalc() {
  const [length, setLength] = useState("10");
  const [height, setHeight] = useState("6");
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;

    // Standard H-Frame: 2m height, 1.25m width
    // Spacing: 1.5m
    const bays = Math.ceil(l / 1.5);
    const tiers = Math.ceil(h / 2.0);

    const frames = (bays + 1) * tiers;
    const braces = bays * tiers * 2;
    const pins = frames * 2;
    const basePlates = (bays + 1) * 2;

    return {
      area: (l * h).toFixed(2),
      frames,
      braces,
      pins,
      basePlates,
      invalid: l <= 0 || h <= 0
    };
  }, [length, height]);

  const handleShare = async () => {
    const text = `CivilMate — Scaffolding Estimate
Wall: ${length}m x ${height}m (${r.area} m²)
• H-Frames: ${r.frames} nos
• Cross Braces: ${r.braces} nos
• Connecting Pins: ${r.pins} nos
• Base Plates: ${r.basePlates} nos`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Scaffolding Estimate', text });
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
      type: "scaffolding",
      title: `Scaffolding - ${r.area} m²`,
      date: new Date().toISOString(),
      data: { r, length, height }
    });
    toast({ title: "Saved", description: "Calculation saved." });
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-500/10 rounded-[2rem] p-6 flex items-center justify-between border border-orange-500/20">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-orange-600">
            <Construction className="w-6 h-6" /> Scaffolding
          </h2>
          <p className="text-muted-foreground text-xs font-medium mt-1">H-Frame System Estimator</p>
        </div>
      </div>

      <Card className="p-6 space-y-6 border-0 shadow-sm rounded-[2rem] bg-white">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1 uppercase tracking-wider">Wall Length (m)</Label>
            <Input 
              type="number" 
              inputMode="decimal"
              value={length} 
              onChange={(e) => setLength(e.target.value)} 
              className="h-14 rounded-xl bg-muted/30 border-0 text-lg font-medium focus:ring-2 focus:ring-orange-500/20 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1 uppercase tracking-wider">Wall Height (m)</Label>
            <Input 
              type="number" 
              inputMode="decimal"
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              className="h-14 rounded-xl bg-muted/30 border-0 text-lg font-medium focus:ring-2 focus:ring-orange-500/20 transition-all" 
            />
          </div>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-6 px-1 flex justify-between">
            <span>Components Required</span>
            <span className="text-orange-600">{r.area} m² Area</span>
          </div>
          
          <div className="space-y-4">
            <ResultRow label="H-Frames (2m x 1.25m)" value={r.frames} unit="nos" />
            <ResultRow label="Cross Braces" value={r.braces} unit="nos" />
            <ResultRow label="Connecting Pins" value={r.pins} unit="nos" />
            <ResultRow label="Base Plates / Jacks" value={r.basePlates} unit="nos" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button onClick={handleSave} className="h-14 rounded-full bg-muted/50 text-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-all">
              <Save className="h-5 w-5" /> Save
            </button>
            <button onClick={handleShare} className="h-14 rounded-full bg-[#1C1C1E] text-orange-400 font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
              {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </Card>

      <div className="px-4 py-3 bg-muted/30 rounded-2xl border border-dashed border-muted">
        <p className="text-[10px] text-muted-foreground font-medium">
          Note: This estimate uses a standard 1.5m horizontal spacing for safety. Walking platforms (catwalks) and tie-backs should be added as per site safety requirements.
        </p>
      </div>
    </div>
  );
}
