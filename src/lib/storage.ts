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
