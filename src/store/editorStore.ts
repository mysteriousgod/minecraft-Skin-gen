import create from "zustand";
import { useEffect } from "react";

// Listen to dark mode changes
const setupDarkModeListener = (setBackgroundColor: (color: string) => void) => {
  // Initial setup
  const isDark = document.documentElement.classList.contains("dark");
  setBackgroundColor(isDark ? "#0F172A" : "#FFFFFF");

  // Create observer for dark mode changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const isDark = document.documentElement.classList.contains("dark");
        setBackgroundColor(isDark ? "#0F172A" : "#FFFFFF");
      }
    });
  });

  // Start observing
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return observer;
};

export interface EditorState {
  model: "steve" | "alex";
  customTexture: string;
  selectedOptionId: string;
  tool: string;
  layer: string;
  showGrid: boolean;
  color: string;
  alpha: number;
  // Instead of a single history array, use a map keyed by option id
  history: { [optionId: string]: string[] };
  historyIndex: { [optionId: string]: number };
  backgroundColor: string;
  zoom: number;
  reset: number;
  paintData: string;
  paintedData: { [optionId: string]: string };

  setModel: (model: "steve" | "alex") => void;
  setCustomTexture: (texture: string) => void;
  setSelectedOptionId: (id: string) => void;
  setTool: (tool: string) => void;
  setLayer: (layer: string) => void;
  toggleGrid: () => void;
  setColor: (color: string) => void;
  setAlpha: (alpha: number) => void;
  undo: () => void;
  redo: () => void;
  setBackgroundColor: (backgroundColor: string) => void;
  setZoom: (zoom: number) => void;
  triggerReset: () => void;
  setPaintData: (data: string) => void;
  setPaintedData: (data: { optionId: string; paintedData: string }) => void;
  addHistory: (optionId: string, dataUrl: string) => void;
  clearHistory: (optionId: string) => void;
  isResetModalOpen: boolean;
  setResetModalOpen: (isOpen: boolean) => void;
}

export const useEditorStore = create<EditorState>((set, get) => {
  // Setup dark mode listener when store is created
  if (typeof window !== "undefined") {
    setupDarkModeListener((backgroundColor) => set({ backgroundColor }));
  }

  return {
    model: "steve",
    customTexture: "",
    selectedOptionId: "steve", // default value
    tool: "pencil",
    layer: "outer",
    showGrid: false,
    color: "#000000",
    alpha: 1,
    // Initialize with empty history for each option if needed
    history: {},
    historyIndex: {},
    backgroundColor:
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "#0F172A"
        : "#FFFFFF",
    zoom: 1,
    reset: 0,
    paintData: "",
    paintedData: {},
    isResetModalOpen: false,
    setModel: (model) => set({ model }),
    setCustomTexture: (texture) => set({ customTexture: texture }),
    setSelectedOptionId: (id) => set({ selectedOptionId: id }),
    setTool: (tool) => set({ tool }),
    setLayer: (layer) => set({ layer }),
    toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
    setColor: (color) => set({ color }),
    setAlpha: (alpha) => set({ alpha }),
    setResetModalOpen: (isOpen) => set({ isResetModalOpen: isOpen }),
    undo: () => {
      const { selectedOptionId, history, historyIndex } = get();
      const currentHistory = history[selectedOptionId] || [];
      
      // If there's no history for this option, do nothing
      if (currentHistory.length === 0) return;
      
      // Get current index with proper initialization
      const currentIdx = typeof historyIndex[selectedOptionId] === 'number' 
        ? historyIndex[selectedOptionId] 
        : currentHistory.length - 1;
        
      // Validate current index
      if (currentIdx < 0 || currentIdx >= currentHistory.length) return;
      
      // If we're at the beginning of history, don't do anything
      if (currentIdx === 0) return;
      
      // Calculate new index
      const newIndex = currentIdx - 1;
      const previousState = currentHistory[newIndex];
      const currentState = currentHistory[currentIdx];
      
      // Only update if we have a different state to go back to
      if (previousState !== currentState) {
        set((state) => ({
          historyIndex: {
            ...state.historyIndex,
            [selectedOptionId]: newIndex,
          },
          paintData: previousState,
        }));
      }
    },

    redo: () => {
      const { selectedOptionId, history, historyIndex } = get();
      const currentHistory = history[selectedOptionId] || [];
      
      // If there's no history for this option, do nothing
      if (currentHistory.length === 0) return;
      
      // Get current index with proper initialization
      const currentIdx = typeof historyIndex[selectedOptionId] === 'number'
        ? historyIndex[selectedOptionId]
        : -1;
        
      // Validate current index
      if (currentIdx < -1 || currentIdx >= currentHistory.length - 1) return;
      
      // If we're at the end of history, don't do anything
      if (currentIdx === currentHistory.length - 1) return;
      
      // Calculate new index
      const newIndex = currentIdx + 1;
      const nextState = currentHistory[newIndex];
      const currentState = currentIdx >= 0 ? currentHistory[currentIdx] : null;
      
      // Only update if we have a different state to go to
      if (nextState !== currentState) {
        set((state) => ({
          historyIndex: {
            ...state.historyIndex,
            [selectedOptionId]: newIndex,
          },
          paintData: nextState,
        }));
      }
    },
    setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
    setZoom: (zoom) => set({ zoom }),
    triggerReset: () => set((state) => ({ reset: state.reset + 1 })),
    setPaintData: (data) => set({ paintData: data }),
    setPaintedData: ({ optionId, paintedData }) => set((state) => ({
        paintedData: {
            ...state.paintedData,
            [optionId]: paintedData
        }
    })),
    addHistory: (optionId, dataUrl) =>
      set((state) => {
        // Ensure we have valid inputs
        if (!optionId || !dataUrl) return state;

        const currentHistory = state.history[optionId] || [];
        const currentIdx = typeof state.historyIndex[optionId] === 'number'
          ? state.historyIndex[optionId] 
          : currentHistory.length - 1;

        // Validate current index
        if (currentIdx < -1) return state;

        // If we're at the initial state
        if (currentHistory.length === 0) {
          return {
            history: {
              ...state.history,
              [optionId]: [dataUrl]
            },
            historyIndex: {
              ...state.historyIndex,
              [optionId]: 0
            }
          };
        }

        // Don't add if it's the same as the current state
        const currentState = currentIdx >= 0 ? currentHistory[currentIdx] : null;
        if (currentState === dataUrl) {
          return state;
        }

        // Remove any future states after current index and add new state
        const historySlice = currentHistory.slice(0, currentIdx + 1);
        const newHistory = [...historySlice, dataUrl];
        
        // Enforce a maximum history size to prevent memory issues
        const maxHistorySize = 100;
        if (newHistory.length > maxHistorySize) {
          newHistory.splice(0, newHistory.length - maxHistorySize);
        }

        return {
          history: {
            ...state.history,
            [optionId]: newHistory,
          },
          historyIndex: {
            ...state.historyIndex,
            [optionId]: newHistory.length - 1,
          },
        };
      }),
    clearHistory: (optionId) =>
      set((state) => ({
        history: { ...state.history, [optionId]: [] },
        historyIndex: { ...state.historyIndex, [optionId]: -1 },
      })),
  };
});
