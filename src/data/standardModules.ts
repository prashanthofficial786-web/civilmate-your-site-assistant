import {
  Cuboid,
  Ruler,
  Layers,
  BrickWall,
  PaintBucket,
  Droplets,
  CloudRain,
  Microscope,
  Crosshair,
  ShieldAlert,
  KanbanSquare,
  Package,
} from "lucide-react";

export type StandardModuleId =
  | "concrete-advanced"
  | "reinforcement"
  | "structural-elements"
  | "masonry"
  | "finishing"
  | "waterproofing"
  | "weather"
  | "testing"
  | "tolerance"
  | "safety"
  | "formwork"
  | "storage";

export type StandardModule = {
  id: StandardModuleId;
  title: string;
  description: string;
  icon: any; // Lucide icon
  color: string;
};

export const standardModules: StandardModule[] = [
  {
    id: "structural-elements",
    title: "Structural Elements",
    description: "Task-based standards for Slab, Beam, and Column.",
    icon: Layers,
    color: "bg-blue-500",
  },
  {
    id: "concrete-advanced",
    title: "Concrete Advanced",
    description: "Water absorption, setting times, density, etc.",
    icon: Cuboid,
    color: "bg-stone-500",
  },
  {
    id: "reinforcement",
    title: "Reinforcement Rules",
    description: "Spacing, hook length, bending radius limits.",
    icon: Ruler,
    color: "bg-red-500",
  },
  {
    id: "masonry",
    title: "Masonry Standards",
    description: "Brick size, mortar ratio, tolerances.",
    icon: BrickWall,
    color: "bg-orange-600",
  },
  {
    id: "finishing",
    title: "Finishing Standards",
    description: "Plastering, flooring, tiling requirements.",
    icon: PaintBucket,
    color: "bg-teal-500",
  },
  {
    id: "waterproofing",
    title: "Waterproofing",
    description: "Slope, ponding duration, surface prep.",
    icon: Droplets,
    color: "bg-cyan-500",
  },
  {
    id: "weather",
    title: "Weather Guidance",
    description: "Hot, cold, and windy weather precautions.",
    icon: CloudRain,
    color: "bg-sky-500",
  },
  {
    id: "testing",
    title: "Testing & QA",
    description: "Cube testing, acceptance criteria.",
    icon: Microscope,
    color: "bg-indigo-500",
  },
  {
    id: "tolerance",
    title: "Tolerance Checker",
    description: "Acceptable deviations for alignment/level.",
    icon: Crosshair,
    color: "bg-rose-500",
  },
  {
    id: "safety",
    title: "Safety Standards",
    description: "PPE, scaffolding, height safety.",
    icon: ShieldAlert,
    color: "bg-yellow-500",
  },
  {
    id: "formwork",
    title: "Formwork Standards",
    description: "Deflection, oiling, leakage prevention.",
    icon: KanbanSquare,
    color: "bg-emerald-600",
  },
  {
    id: "storage",
    title: "Material Storage",
    description: "Cement stacking, sand/steel condition limits.",
    icon: Package,
    color: "bg-amber-600",
  },
];
