import { useMemo, useState } from "react";
import { Copy, Check, Save, Share2, Calculator, Settings2, HardHat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import ResultRow from "./ResultRow";
import { saveCalculation } from "@/lib/storage";
import { cn } from "@/lib/utils";

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
  const [inputMode, setInputMode] = useState<"volume" | "dimensions">("volume");
  const [unit, setUnit] = useState<"m" | "ft">("m");
  const [vol, setVol] = useState("1");
  const [dim, setDim] = useState({ l: "", w: "", d: "" });
  const [grade, setGrade] = useState("M20");
  const [waste, setWaste] = useState("5");
  const [siteMode, setSiteMode] = useState(false);
  
  const [prices, setPrices] = useState({ cement: "", sand: "", agg: "" });
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    let v = 0;
    const l = parseFloat(dim.l);
    const w = parseFloat(dim.w);
    const d = parseFloat(dim.d);

    if (inputMode === "volume") {
      v = parseFloat(vol) || 0;
      if (unit === "ft") {
        v = v / 35.3147; // convert ft³ to m³
      }
    } else {
      const vl = l || 0;
      const vw = w || 0;
      const vd = d || 0;
      if (unit === "ft") {
        v = (vl * 0.3048) * (vw * 0.3048) * (vd * 0.3048);
      } else {
        v = vl * vw * vd;
      }
    }

    const isNegative = v < 0 || l < 0 || w < 0 || d < 0;
    const isMissingDims = inputMode === "dimensions" && (isNaN(l) || isNaN(w) || isNaN(d));

    const w_factor = (parseFloat(waste) || 0) / 100;
    const m = mixes[grade];
    
    const dry = v * DRY_FACTOR * (1 + w_factor);
    const cementVol = (dry * m.cementPart) / m.sum;
    const sandVol = (dry * m.sandPart) / m.sum;
    const aggVol = (dry * m.aggPart) / m.sum;
    
    const cementKg = cementVol * CEMENT_DENSITY;
    const bags = cementKg / BAG;
    const waterL = cementKg * m.water;
    
    const sandCft = sandVol * 35.3147;
    const aggCft = aggVol * 35.3147;

    const pCement = parseFloat(prices.cement) || 0;
    const pSand = parseFloat(prices.sand) || 0;
    const pAgg = parseFloat(prices.agg) || 0;

    const costCement = bags * pCement;
    const costSand = unit === "ft" ? sandCft * pSand : sandVol * pSand;
    const costAgg = unit === "ft" ? aggCft * pAgg : aggVol * pAgg;
    const totalCost = costCement + costSand + costAgg;

    return {
      invalid: isNegative || isMissingDims,
      v: v.toFixed(3),
      vFt: (v * 35.3147).toFixed(2),
      bags: bags.toFixed(2),
      cementKg: cementKg.toFixed(0),
      sand: sandVol.toFixed(3),
      sandCft: sandCft.toFixed(2),
      agg: aggVol.toFixed(3),
      aggCft: aggCft.toFixed(2),
      water: waterL.toFixed(0),
      ratio: m.ratio,
      costCement,
      costSand,
      costAgg,
      totalCost
    };
  }, [inputMode, unit, vol, dim, grade, waste, prices]);

  const handleShare = async () => {
    if (r.invalid) {
      toast({ title: "Error", description: "Invalid calculation inputs.", variant: "destructive" });
      return;
    }
    const text = `CivilMate — Concrete Estimate
${inputMode === "volume" ? `Volume: ${vol} ${unit === 'm' ? 'm³' : 'ft³'}` : `Dimensions: ${dim.l}x${dim.w}x${dim.d} ${unit}`}
Grade: ${grade} (${r.ratio}) · Wastage: ${waste}%

Materials:
• Cement: ${r.bags} bags (${r.cementKg} kg)
• Sand: ${unit === 'm' ? r.sand + ' m³' : r.sandCft + ' cft'}
• Aggregate: ${unit === 'm' ? r.agg + ' m³' : r.aggCft + ' cft'}
• Water: ~${r.water} L
${r.totalCost > 0 ? `\nEst. Cost: ₹${r.totalCost.toFixed(2)}` : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Concrete Estimate', text });
        return;
      } catch (e) {
        // user cancelled or share failed, fallback
      }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied", description: "Result ready to share." });
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    if (r.invalid) {
      toast({ title: "Error", description: "Cannot save invalid inputs.", variant: "destructive" });
      return;
    }
    saveCalculation({
      id: Date.now().toString(),
      type: "concrete",
      title: `Concrete ${grade} - ${r.v} m³`,
      date: new Date().toISOString(),
      data: { r, vol, dim, unit, inputMode }
    });
    toast({ title: "Saved", description: "Calculation saved for future reference." });
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="bg-[#1C1C1E] rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" strokeWidth={2.5} /> Concrete
          </h2>
          <p className="text-white/60 text-xs font-medium mt-1">Estimator & Site Mode</p>
        </div>
        <div className="relative z-10 flex flex-col items-end gap-2">
           <div className="flex items-center gap-3">
             <Label htmlFor="site-mode" className="text-[11px] font-bold uppercase tracking-wider text-white/70 cursor-pointer flex items-center gap-1.5">
               <HardHat className="w-4 h-4 text-primary" />
               Site Mode
             </Label>
             <Switch id="site-mode" checked={siteMode} onCheckedChange={setSiteMode} className="data-[state=checked]:bg-primary" />
           </div>
        </div>
      </div>

      <div className="space-y-5">
        <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as any)} className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-14 p-1.5 bg-muted/50 rounded-[1.5rem] border border-border/50">
            <TabsTrigger value="volume" className="rounded-[1.1rem] text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">Total Volume</TabsTrigger>
            <TabsTrigger value="dimensions" className="rounded-[1.1rem] text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">Dimensions</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="p-6 space-y-6 border-0 shadow-sm rounded-[2rem] bg-white">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.1em]">Unit System</Label>
            <div className="flex bg-muted/50 rounded-[1rem] p-1 border border-border/30">
              <button
                onClick={() => setUnit("m")}
                className={`px-4 py-2 text-[10px] font-bold rounded-[0.8rem] transition-all ${unit === "m" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                METRIC (m)
              </button>
              <button
                onClick={() => setUnit("ft")}
                className={`px-4 py-2 text-[10px] font-bold rounded-[0.8rem] transition-all ${unit === "ft" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                IMPERIAL (ft)
              </button>
            </div>
          </div>

          {inputMode === "volume" ? (
            <div className="space-y-3">
              <Label className="text-xs font-bold text-foreground/70 ml-1">Wet volume ({unit === "m" ? "m³" : "ft³"})</Label>
              <Input 
                type="number" 
                inputMode="decimal" 
                value={vol} 
                onChange={(e) => setVol(e.target.value)} 
                className={cn(
                  "rounded-[1.25rem] bg-muted/30 border-0 text-foreground transition-all focus:ring-2 focus:ring-primary/20",
                  siteMode ? 'h-16 text-2xl font-bold' : 'h-14 text-lg font-medium'
                )} 
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'L', key: 'l' },
                { label: 'W', key: 'w' },
                { label: 'D', key: 'd' }
              ].map((f) => (
                <div key={f.key} className="space-y-3">
                  <Label className="text-[11px] font-bold text-foreground/70 ml-1">{f.label} ({unit})</Label>
                  <Input 
                    type="number" 
                    inputMode="decimal" 
                    value={(dim as any)[f.key]} 
                    onChange={(e) => setDim({ ...dim, [f.key]: e.target.value })} 
                    className={cn(
                      "rounded-[1.25rem] bg-muted/30 border-0 text-foreground transition-all focus:ring-2 focus:ring-primary/20",
                      siteMode ? 'h-16 text-2xl font-bold' : 'h-14 text-lg font-medium'
                    )} 
                  />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-foreground/70 ml-1">Grade</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className={cn(
                  "rounded-[1.25rem] bg-muted/30 border-0 text-foreground transition-all focus:ring-2 focus:ring-primary/20",
                  siteMode ? 'h-16 text-lg font-bold' : 'h-14 text-sm font-medium'
                )}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-[1.5rem] border-0 shadow-2xl">
                  {Object.keys(mixes).map((g) => (
                    <SelectItem key={g} value={g} className="rounded-xl my-1">{g} ({mixes[g].ratio})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold text-foreground/70 ml-1">Wastage (%)</Label>
              <Input 
                type="number" 
                inputMode="decimal" 
                value={waste} 
                onChange={(e) => setWaste(e.target.value)} 
                className={cn(
                  "rounded-[1.25rem] bg-muted/30 border-0 text-foreground transition-all focus:ring-2 focus:ring-primary/20",
                  siteMode ? 'h-16 text-lg font-bold' : 'h-14 text-sm font-medium'
                )} 
              />
            </div>
          </div>
        </Card>

        {!siteMode && (
          <Card className="p-6 space-y-5 border-2 border-dashed border-muted bg-transparent rounded-[2rem]">
            <div className="flex items-center gap-2 px-1">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Cost Estimation</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Cement (₹/bag)', key: 'cement', p: 'e.g. 400' },
                { label: `Sand (₹/${unit === 'm' ? 'm³' : 'cft'})`, key: 'sand', p: 'e.g. 1500' },
                { label: `Agg (₹/${unit === 'm' ? 'm³' : 'cft'})`, key: 'agg', p: 'e.g. 1200' }
              ].map((f) => (
                <div key={f.key} className="space-y-2.5">
                  <Label className="text-[10px] font-bold text-muted-foreground ml-1">{f.label}</Label>
                  <Input 
                    type="number" 
                    inputMode="decimal" 
                    value={(prices as any)[f.key]} 
                    onChange={(e) => setPrices({ ...prices, [f.key]: e.target.value })} 
                    className="h-12 rounded-[1rem] bg-white border-border shadow-sm text-sm font-semibold" 
                    placeholder={f.p} 
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className={cn(
          "p-8 border-0 shadow-xl rounded-[2.5rem] transition-all bg-white relative overflow-hidden",
          r.invalid && 'opacity-60 grayscale-[0.5]'
        )}>
          {/* Subtle glow for results card */}
          {!r.invalid && <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />}
          
          <div className="relative z-10">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-6 flex justify-between items-center px-1">
              <span>Materials Required</span>
              {inputMode === "dimensions" && !r.invalid && (
                <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-full">
                  {unit === "m" ? `${r.v} m³` : `${r.vFt} ft³`}
                </span>
              )}
            </div>
            
            {r.invalid ? (
              <div className="py-12 text-center text-muted-foreground">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold text-lg">Waiting for inputs...</p>
                <p className="text-sm font-medium opacity-70">Enter valid dimensions to see estimate.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <ResultRow label="Cement" value={r.bags} unit={`bags (${r.cementKg} kg)`} />
                  <ResultRow label="Sand" value={unit === 'm' ? r.sand : r.sandCft} unit={unit === 'm' ? 'm³' : 'cft'} />
                  <ResultRow label="Aggregate" value={unit === 'm' ? r.agg : r.aggCft} unit={unit === 'm' ? 'm³' : 'cft'} />
                  {!siteMode && <ResultRow label="Water (approx)" value={r.water} unit="litres" />}
                </div>
                
                {!siteMode && r.totalCost > 0 && (
                  <div className="pt-6 mt-6 border-t border-muted">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Cost</span>
                      <span className="font-black text-3xl text-primary drop-shadow-sm">₹ {r.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={handleSave} 
                className="h-14 rounded-full bg-muted/50 text-foreground font-bold text-sm shadow-sm hover:bg-muted transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={r.invalid}
              >
                <Save className="h-5 w-5" /> Save
              </button>
              <button 
                onClick={handleShare} 
                className="h-14 rounded-full bg-[#1C1C1E] text-primary font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={r.invalid}
              >
                {copied ? <Check className="h-5 w-5" strokeWidth={3} /> : <Share2 className="h-5 w-5" strokeWidth={3} />}
                {copied ? "Copied" : "Share"}
              </button>
            </div>
            
            {grade === "M30" && !siteMode && (
              <p className="text-[10px] text-muted-foreground mt-6 text-center font-medium opacity-60">
                * M30 and above should use design mix as per IS 10262. Values shown are indicative only.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
