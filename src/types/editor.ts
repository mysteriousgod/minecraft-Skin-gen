export type SkinModel = 'steve' | 'alex';

export type Tool = 'none' | 'pencil' | 'colorPicker' | 'fill' | 'eraser';

export type Layer = 'outer' | 'inner' | 'both';

export interface EditorState {
  model: SkinModel;
  tool: Tool;
  layer: Layer;
  showGrid: boolean;
  color: string;
  alpha: number;
  history: string[];
  historyIndex: number;
  backgroundColor: string;
  zoom: number;
  reset: number;
  customTexture: string | null;
  paintData: string;
}

export interface EditorStore extends EditorState {
  setModel: (model: SkinModel) => void;
  setTool: (tool: Tool) => void;
  setLayer: (layer: Layer) => void;
  toggleGrid: () => void;
  setColor: (color: string) => void;
  setAlpha: (alpha: number) => void;
  undo: () => void;
  redo: () => void;
  setBackgroundColor: (color: string) => void;
  setZoom: (zoom: number) => void;
  triggerReset: () => void;
  setCustomTexture: (texture: string | null) => void;
  setPaintData: (data: string) => void;
  addHistory: (dataUrl: string) => void;
  clearHistory: () => void;
}
