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
    <div className="space-y-4">
      <Link to="/standards" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All standards
      </Link>

      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary">
          {std.category}
        </span>
        <h1 className="text-2xl font-bold mt-2 leading-tight">{std.title}</h1>
      </div>

      <Card className="p-5 bg-[image:var(--gradient-primary)] text-primary-foreground border-0 shadow-[var(--shadow-elevated)]">
        <div className="text-xs uppercase tracking-wider opacity-80 mb-1">Quick value</div>
        <div className="text-xl font-bold">{std.shortValue}</div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">In plain words</h2>
        <p className="text-base leading-relaxed">{std.plain}</p>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Details</h2>
        <p className="text-base leading-relaxed whitespace-pre-line">{std.detail}</p>
      </Card>

      <Card className="p-4 flex items-start gap-3 bg-accent/10 border-accent/30">
        <BookMarked className="h-5 w-5 text-accent-foreground mt-0.5 shrink-0" />
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">IS Reference</div>
          <div className="text-sm font-semibold">{std.reference}</div>
        </div>
      </Card>
    </div>
  );
}
