import React from 'react';
import { Pencil, Eraser, Square, RotateCcw, Undo, Redo, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import type { Tool } from '../types/editor';

export const PaintingTools: React.FC = () => {
  const { tool, setTool, setResetModalOpen } = useEditorStore();

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
    setResetModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="panel-title mb-0">Tools</h3>
          <div className="flex gap-1 bg-slate-800/80 p-1 rounded-lg border border-white/5">
            <button
              onClick={handleUndo}
              className="p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-50"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} />
            </button>
            <div className="w-px bg-white/10 my-1" />
            <button
              onClick={handleRedo}
              className="p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-50"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={18} />
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
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group overflow-hidden ${tool === id
                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800/60 hover:border-white/10 hover:text-slate-200'
                }`}
              title={label}
            >
              <div className={`mb-2 transform transition-transform duration-300 group-hover:scale-110 ${tool === id ? 'text-emerald-400 scale-110' : 'text-slate-400'}`}>
                {icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${tool === id ? 'text-emerald-400' : 'text-slate-500'}`}>
                {label}
              </span>
              {tool === id && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500 shadow-[0_-2px_8px_rgba(16,185,129,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        <h3 className="panel-title text-xs mb-3 text-slate-500">Actions</h3>
        <button
          onClick={handleReset}
          className="w-full group relative flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border-0 hover:bg-red-500/10 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 border border-transparent group-hover:border-red-500/20 rounded-xl transition-colors pointer-events-none" />
          <div className="flex items-center gap-3 z-10">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
              <Trash2 size={18} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-300 group-hover:text-red-200 transition-colors">Reset Skin</span>
              <span className="text-[10px] text-slate-500 group-hover:text-red-400/70">Clear all changes</span>
            </div>
          </div>
          <RotateCcw size={16} className="text-slate-600 group-hover:text-red-400 group-hover:rotate-180 transition-all duration-500" />
        </button>
      </div>
    </div>
  );
};
