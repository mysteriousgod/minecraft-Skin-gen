import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import type { Layer } from '../types/editor';

export const LayerControls: React.FC = () => {
  const { layer, setLayer } = useEditorStore();

  const layers: { id: Layer; label: string; description: string }[] = [
    { id: 'outer', label: 'Outer Layer', description: 'Hat, Jacket, Sleeves (Overlay)' },
    { id: 'inner', label: 'Inner Layer', description: 'Body, Arms, Legs (Base)' },
    { id: 'both', label: 'Both Layers', description: 'Edit all layers simultaneously' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="panel-title">
        <Layers size={16} className="text-emerald-500" />
        Active Layer
      </h3>

      <div className="flex flex-col gap-2">
        {layers.map(({ id, label, description }) => (
          <button
            key={id}
            onClick={() => setLayer(id)}
            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${layer === id
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
              }`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${layer === id ? 'bg-emerald-500' : 'bg-transparent'}`} />

            <div className="flex items-center justify-between pl-2">
              <div>
                <span className={`block text-sm font-semibold transition-colors ${layer === id ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {label}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">{description}</span>
              </div>

              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${layer === id ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'
                }`}>
                {layer === id ? <Eye size={16} /> : <EyeOff size={16} />}
              </div>
            </div>

            {layer === id && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
