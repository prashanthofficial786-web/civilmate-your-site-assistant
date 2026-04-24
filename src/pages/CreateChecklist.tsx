import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checklist, ChecklistItem } from "@/data/checklists";
import { saveCustomChecklist } from "@/lib/storage";

export default function CreateChecklist() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("Custom");
  const [items, setItems] = useState<ChecklistItem[]>([{ id: crypto.randomUUID(), text: "", hint: "" }]);

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), text: "", hint: "" }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: "text" | "hint", value: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    if (!title.trim() || items.some((item) => !item.text.trim())) {
      alert("Please fill in the title and all item texts.");
      return;
    }

    const newChecklist: Checklist = {
      id: "custom-" + crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      duration: duration.trim() || "Ongoing",
      category: category.trim() || "Custom",
      items: items.map((item) => ({ ...item, text: item.text.trim(), hint: item.hint.trim() || undefined })),
    };

    saveCustomChecklist(newChecklist);
    navigate("/checklists");
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4 px-1">
        <button 
          onClick={() => navigate("/checklists")} 
          className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">New Checklist</h1>
          <p className="text-sm text-muted-foreground font-medium">Build your custom site inspection module.</p>
        </div>
      </div>

      <Card className="p-8 space-y-6 border-0 shadow-sm rounded-[2.5rem] bg-white">
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-foreground/70 ml-1 uppercase tracking-wider">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-lg font-medium transition-all focus:ring-2 focus:ring-primary/20"
            placeholder="e.g., Pre-Delivery Inspection"
            required
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-foreground/70 ml-1 uppercase tracking-wider">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-[1.25rem] bg-muted/30 border-0 px-5 py-4 text-sm font-medium transition-all focus:ring-2 focus:ring-primary/20 min-h-[100px] text-foreground"
            placeholder="What is this checklist for?"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-foreground/70 ml-1 uppercase tracking-wider">Duration</label>
            <Input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-sm font-medium transition-all focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., 2 Hours"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-foreground/70 ml-1 uppercase tracking-wider">Category</label>
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-14 rounded-[1.25rem] bg-muted/30 border-0 text-sm font-medium transition-all focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., Quality Control"
            />
          </div>
        </div>
      </Card>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Checklist Items</h2>
          <button 
            type="button" 
            onClick={addItem}
            className="h-10 px-5 rounded-full bg-muted/50 text-foreground font-bold text-xs flex items-center gap-2 hover:bg-muted transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id} className="p-6 flex gap-4 items-start border-0 shadow-sm rounded-[2rem] bg-white group relative">
              <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0 font-bold text-xs text-muted-foreground group-hover:bg-primary group-hover:text-[#1C1C1E] transition-colors mt-1">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 space-y-4">
                <Input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(item.id, "text", e.target.value)}
                  className="h-12 rounded-[1rem] bg-muted/30 border-0 text-base font-bold transition-all focus:ring-2 focus:ring-primary/20"
                  placeholder="The inspection point..."
                  required
                />
                <Input
                  type="text"
                  value={item.hint}
                  onChange={(e) => updateItem(item.id, "hint", e.target.value)}
                  className="h-10 rounded-[0.75rem] bg-transparent border-dashed border-border text-xs font-medium placeholder:text-muted-foreground/50 transition-all focus:ring-2 focus:ring-primary/20"
                  placeholder="Add a helpful hint or IS reference..."
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  className="h-10 w-10 rounded-full bg-destructive/5 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all mt-1 shadow-sm"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button 
          onClick={() => navigate("/checklists")} 
          className="flex-1 h-14 rounded-full bg-white text-muted-foreground font-bold text-sm shadow-sm hover:bg-muted/50 transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          className="flex-[2] h-14 rounded-full bg-[#1C1C1E] text-primary font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Save Checklist
        </button>
      </div>
    </div>
  );
}
