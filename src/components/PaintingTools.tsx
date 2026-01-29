import React, { useState } from 'react';
import { Pencil, Eraser, Square, RotateCcw, Undo, Redo, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import type { Tool } from '../types/editor';

export const PaintingTools: React.FC = () => {
  const { tool, setTool, selectedOptionId } = useEditorStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'pencil', icon: <Pencil size={24} />, label: 'Pencil' },
    { id: 'fill', icon: <Square size={24} />, label: 'Fill Bucket' },
    { id: 'eraser', icon: <Eraser size={24} />, label: 'Eraser' },
  ];

  const handleUndo = () => {
    if (typeof (window as any).undoTexture === 'function') {
      (window as any).undoTexture();
    }
  };

  const handleRedo = () => {
    if (typeof (window as any).redoTexture === 'function') {
      (window as any).redoTexture();
    }
  };

  const handleReset = () => {
    if (typeof (window as any).resetTexture === 'function') {
      (window as any).resetTexture(selectedOptionId);
    }
  };

  const confirmFullReset = () => {
    if (typeof (window as any).fullResetTexture === 'function') {
      (window as any).fullResetTexture(selectedOptionId);
    }
    setShowConfirmModal(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="panel-title mb-0">Tools</h3>
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
          <button
            onClick={handleUndo}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={handleRedo}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {tools.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() =>
              id === 'pencil' && tool === 'pencil'
                ? setTool('none')
                : setTool(id)
            }
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 group ${tool === id
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/10 hover:text-slate-200'
              }`}
            title={label}
          >
            <div className={`mb-2 transform transition-transform group-hover:scale-110 ${tool === id ? 'text-emerald-400' : ''}`}>
              {icon}
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="pt-4 mt-2 border-t border-white/5">
        <button
          onClick={handleReset}
          className="w-full glass-button justify-between py-3 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 text-red-300 border-transparent"
        >
          <span className="flex items-center gap-2">
            <Trash2 size={16} />
            Reset Current Skin
          </span>
          <RotateCcw size={14} className="opacity-50" />
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
          <div className="glass-panel w-full max-w-sm p-6 rounded-2xl relative z-10 animate-fade-in bg-slate-900 border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Confirm Reset</h2>
            <p className="text-slate-400 mb-6">
              This action will clear the entire paint job and cannot be undone. Are you sure?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="glass-button text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmFullReset}
                className="glass-button bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
