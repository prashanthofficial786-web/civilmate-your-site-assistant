import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookMarked } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { standards } from "@/data/standards";
import { pushRecent } from "@/lib/storage";

export default function StandardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const std = standards.find((s) => s.id === id);

  useEffect(() => {
    if (std) pushRecent({ type: "standard", id: std.id, title: std.title });
  }, [std]);

  if (!std) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Standard not found.</p>
        <Button onClick={() => navigate("/standards")}>Back to Standards</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/standards" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> All standards
      </Link>

      <div className="px-1">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
          {std.category}
        </span>
        <h1 className="text-3xl font-black mt-3 leading-tight text-foreground tracking-tight">{std.title}</h1>
      </div>

      <Card className="p-8 bg-[#1C1C1E] text-white border-0 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="relative z-10">
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2 font-bold">Standard Value</div>
          <div className="text-3xl font-black text-primary drop-shadow-sm">{std.shortValue}</div>
        </div>
      </Card>

      <div className="grid gap-5">
        <Card className="p-6 border-0 shadow-sm rounded-[2rem] bg-white">
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-1">Overview</h2>
          <p className="text-base font-medium leading-relaxed text-foreground/90">{std.plain}</p>
        </Card>

        <Card className="p-6 border-0 shadow-sm rounded-[2rem] bg-white">
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-1">Technical Details</h2>
          <p className="text-base font-medium leading-relaxed whitespace-pre-line text-foreground/90">{std.detail}</p>
        </Card>

        <Card className="p-6 flex items-start gap-4 bg-[#1C1C1E] text-white border-0 rounded-[2rem] shadow-xl">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
             <BookMarked className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white/50 mb-1">IS Code Reference</div>
            <div className="text-base font-bold text-primary">{std.reference}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
