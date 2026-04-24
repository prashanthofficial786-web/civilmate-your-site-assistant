const PREFIX = "civilmate:";

export function getChecked(checklistId: string): string[] {
  try {
    const raw = localStorage.getItem(PREFIX + "cl:" + checklistId);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setChecked(checklistId: string, ids: string[]) {
  try {
    localStorage.setItem(PREFIX + "cl:" + checklistId, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function pushRecent(item: { type: "standard" | "checklist" | "calculator"; id: string; title: string }) {
  try {
    const raw = localStorage.getItem(PREFIX + "recent");
    const list = raw ? (JSON.parse(raw) as typeof item[]) : [];
    const next = [item, ...list.filter((i) => !(i.type === item.type && i.id === item.id))].slice(0, 6);
    localStorage.setItem(PREFIX + "recent", JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getRecent(): { type: "standard" | "checklist" | "calculator"; id: string; title: string }[] {
  try {
    const raw = localStorage.getItem(PREFIX + "recent");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

import type { Checklist } from "@/data/checklists";

export function getCustomChecklists(): Checklist[] {
  try {
    const raw = localStorage.getItem(PREFIX + "custom_checklists");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomChecklist(checklist: Checklist) {
  try {
    const existing = getCustomChecklists();
    const existingIndex = existing.findIndex((c) => c.id === checklist.id);
    if (existingIndex >= 0) {
      existing[existingIndex] = checklist;
    } else {
      existing.push(checklist);
    }
    localStorage.setItem(PREFIX + "custom_checklists", JSON.stringify(existing));
  } catch {
    /* ignore */
  }
}

export type SavedCalculation = {
  id: string;
  type: string;
  title: string;
  date: string;
  data: any;
};

export function getSavedCalculations(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(PREFIX + "saved_calculations");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCalculation(calc: SavedCalculation) {
  try {
    const existing = getSavedCalculations();
    existing.unshift(calc);
    localStorage.setItem(PREFIX + "saved_calculations", JSON.stringify(existing));
  } catch {
    /* ignore */
  }
}
