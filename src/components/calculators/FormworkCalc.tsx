import { useMemo, useState } from "react";
import { Calculator, Save, Share2, Check, Box, ChevronUp, Grid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ResultRow from "./ResultRow";
import { saveCalculation } from "@/lib/storage";
import { cn } from "@/lib/utils";

const PLATE_AREA = 0.54; // 900mm x 600mm
const PROP_SPACING = 0.9; // sqm per prop (approx)

export default function FormworkCalc() {
  const [area, setArea] = useState("100");
  const [height, setHeight] = useState("3");
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const a = parseFloat(area) || 0;
    const h = parseFloat(height) || 0;

    const props = Math.ceil(a / PROP_SPACING);
    const plates = Math.ceil(a / PLATE_AREA);
    const runners = a * 1.5; // running meters

    return {
      area: a.toFixed(2),
      props,
      plates,
      runners: runners.toFixed(1),
      invalid: a <= 0
    };
  }, [area, height]);

  const handleShare = async () => {
    const text = `CivilMate — Formwork (Slab) Estimate
Slab Area: ${r.area} m²
Height: ${height} m
• MS Props: ${r.props} nos
• Centering Plates: ${r.plates} nos
• Runners/Joists: ${r.runners} m`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Formwork Estimate', text });
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
      type: "formwork",
      title: `Formwork - ${r.area} m²`,
      date: new Date().toISOString(),
      data: { r, area, height }
    });
    toast({ title: "Saved", description: "Calculation saved." });
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-500/10 rounded-[2rem] p-6 flex items-center justify-between border border-emerald-500/20">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-600">
            <Grid className="w-6 h-6" /> Formwork
          </h2>
          <p className="text-muted-foreground text-xs font-medium mt-1">Slab Centering & Decking</p>
        </div>
      </div>

      <Card className="p-6 space-y-6 border-0 shadow-sm rounded-[2rem] bg-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1 uppercase tracking-wider">Total Slab Area (m²)</Label>
            <Input 
              type="number" 
              inputMode="decimal"
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              className="h-16 rounded-2xl bg-muted/30 border-0 text-2xl font-bold text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-foreground/70 ml-1 uppercase tracking-wider">Floor Height (m)</Label>
            <Input 
              type="number" 
              inputMode="decimal"
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              className="h-14 rounded-xl bg-muted/30 border-0 text-lg font-medium" 
            />
          </div>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-6 px-1">Inventory Required</div>
          
          <div className="space-y-4">
            <ResultRow label="Adjustable MS Props" value={r.props} unit="nos" />
            <ResultRow label="Centering Plates" value={r.plates} unit="nos (900x600)" />
            <ResultRow label="Runners / Joists" value={r.runners} unit="running meters" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button onClick={handleSave} className="h-14 rounded-full bg-muted/50 text-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-all">
              <Save className="h-5 w-5" /> Save
            </button>
            <button onClick={handleShare} className="h-14 rounded-full bg-[#1C1C1E] text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
              {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </Card>

      <div className="px-4 py-3 bg-muted/30 rounded-2xl">
        <p className="text-[10px] text-muted-foreground font-medium italic">
          * Prop estimation assumes a standard spacing of 900mm center-to-center. Actual site conditions may vary based on slab thickness and load.
        </p>
      </div>
    </div>
  );
}
