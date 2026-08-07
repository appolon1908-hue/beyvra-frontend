import { ChartInterval } from "../chartTypes";
import { ChartDrawing, DEFAULT_DRAWING_STYLE, DrawingPoint, DrawingState, PersistedDrawingType, validateDrawing } from "./types";

type DrawingStorage = Pick<Storage, "getItem" | "setItem">;
const clone = (drawings: readonly ChartDrawing[]) => drawings.map((drawing) => ({ ...drawing, style: { ...drawing.style }, points: drawing.points.map((point) => ({ ...point })) }));
const initialState = (): DrawingState => ({ drawings: [], visible: true, canUndo: false, canRedo: false });

export class DrawingStore {
  private state = initialState();
  private listeners = new Set<() => void>();
  private undoStack: ChartDrawing[][] = [];
  private redoStack: ChartDrawing[][] = [];
  private accountScope = "anonymous";
  private instrumentId = "";
  private interval: ChartInterval = "1m";
  constructor(private readonly storage: DrawingStorage | undefined = typeof localStorage === "undefined" ? undefined : localStorage) {}

  readonly subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  readonly getSnapshot = () => this.state;

  setScope(accountScope: string, instrumentId: string, interval: ChartInterval) {
    if (this.accountScope === accountScope && this.instrumentId === instrumentId && this.interval === interval) return;
    this.accountScope = accountScope || "anonymous"; this.instrumentId = instrumentId; this.interval = interval;
    this.undoStack = []; this.redoStack = [];
    let drawings: ChartDrawing[] = [];
    try {
      const parsed = JSON.parse(this.storage?.getItem(this.key()) || "[]");
      if (Array.isArray(parsed)) drawings = parsed.filter((item) => validateDrawing(item, instrumentId, interval)).map((item: ChartDrawing) => ({ ...item, style: { ...item.style }, points: item.points.map((point: DrawingPoint) => ({ ...point })) }));
    } catch { drawings = []; }
    this.state = { drawings, visible: true, canUndo: false, canRedo: false }; this.emit();
  }

  create(type: PersistedDrawingType, points: DrawingPoint[], text?: string): ChartDrawing {
    const now = new Date().toISOString();
    const drawing: ChartDrawing = { id: `drawing_${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`}`, type, instrumentId: this.instrumentId, interval: this.interval, points: points.map((point) => ({ ...point })), style: { ...DEFAULT_DRAWING_STYLE }, text: type === "text" ? (text || "Note").slice(0, 500) : undefined, locked: false, visible: true, createdAt: now, updatedAt: now };
    if (!validateDrawing(drawing, this.instrumentId, this.interval)) throw new Error("INVALID_DRAWING_CONFIG");
    this.commit([...this.state.drawings, drawing], drawing.id); return drawing;
  }

  select(id?: string) { this.state = { ...this.state, selectedId: this.state.drawings.some((item) => item.id === id) ? id : undefined }; this.emit(); }
  move(id: string, points: DrawingPoint[]): boolean {
    const current = this.state.drawings.find((item) => item.id === id); if (!current || current.locked) return false;
    const candidate = { ...current, points: points.map((point) => ({ ...point })), updatedAt: new Date().toISOString() };
    if (!validateDrawing(candidate, this.instrumentId, this.interval)) return false;
    this.commit(this.state.drawings.map((item) => item.id === id ? candidate : item), id); return true;
  }
  remove(id = this.state.selectedId) { if (!id || !this.state.drawings.some((item) => item.id === id)) return; this.commit(this.state.drawings.filter((item) => item.id !== id)); }
  clear() { if (this.state.drawings.length) this.commit([]); }
  toggleLock(id = this.state.selectedId) { this.patch(id, (item) => ({ ...item, locked: !item.locked })); }
  toggleDrawingVisibility(id = this.state.selectedId) { this.patch(id, (item) => ({ ...item, visible: !item.visible })); }
  toggleAllVisibility() { this.state = { ...this.state, visible: !this.state.visible }; this.emit(); }
  updateText(id: string, text: string) { this.patch(id, (item) => item.type === "text" ? { ...item, text: text.slice(0, 500) } : item); }
  undo() { const previous = this.undoStack.pop(); if (!previous) return; this.redoStack.push(clone(this.state.drawings)); this.replace(previous); }
  redo() { const next = this.redoStack.pop(); if (!next) return; this.undoStack.push(clone(this.state.drawings)); this.replace(next); }

  private patch(id: string | undefined, transform: (drawing: ChartDrawing) => ChartDrawing) { if (!id) return; const next = this.state.drawings.map((item) => item.id === id ? { ...transform(item), updatedAt: new Date().toISOString() } : item); this.commit(next, id); }
  private commit(drawings: ChartDrawing[], selectedId?: string) { this.undoStack.push(clone(this.state.drawings)); this.redoStack = []; this.replace(drawings, selectedId); }
  private replace(drawings: ChartDrawing[], selectedId?: string) {
    const safeSelected = drawings.some((item) => item.id === (selectedId ?? this.state.selectedId)) ? (selectedId ?? this.state.selectedId) : undefined;
    this.state = { ...this.state, drawings: clone(drawings), selectedId: safeSelected, canUndo: this.undoStack.length > 0, canRedo: this.redoStack.length > 0 };
    try { this.storage?.setItem(this.key(), JSON.stringify(this.state.drawings)); } catch { /* persistence failure must not break chart state */ }
    this.emit();
  }
  private key() { return `codestra.chart.drawings.v1:${encodeURIComponent(this.accountScope)}:${encodeURIComponent(this.instrumentId)}:${this.interval}`; }
  private emit() { this.listeners.forEach((listener) => listener()); }
}
