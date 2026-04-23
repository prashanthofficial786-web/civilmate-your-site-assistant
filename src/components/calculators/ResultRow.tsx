export default function ResultRow({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex items-baseline justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-bold text-lg">
        {value} <span className="text-xs font-medium text-muted-foreground ml-0.5">{unit}</span>
      </span>
    </div>
  );
}
