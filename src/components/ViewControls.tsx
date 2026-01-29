import React, { useRef } from 'react';
import { Grid, Image, ZoomIn, ZoomOut, Eye } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const ViewControls: React.FC = () => {
  const { showGrid, toggleGrid, zoom, setZoom, backgroundColor, setBackgroundColor } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && typeof (window as any).applyCustomBackground === 'function') {
      (window as any).applyCustomBackground(file);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="panel-title">
          <Eye size={16} className="text-emerald-500" />
          Camera & View
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
            className="glass-button justify-between bg-slate-800 text-sm hover:text-emerald-300"
          >
            <span>Zoom In</span>
            <ZoomIn size={14} />
          </button>

          <button
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
            className="glass-button justify-between bg-slate-800 text-sm hover:text-emerald-300"
          >
            <span>Zoom Out</span>
            <ZoomOut size={14} />
          </button>
        </div>

        <button
          onClick={() => toggleGrid()}
          className={`glass-button w-full justify-between transition-all ${showGrid ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
        >
          <span className="flex items-center gap-2">
            <Grid size={16} />
            Show Pixel Grid
          </span>
          <div className={`w-3 h-3 rounded-full ${showGrid ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
        </button>
      </div>

      <div>
        <h3 className="panel-title">
          <Image size={16} className="text-emerald-500" />
          Environment
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-white/5">
            <div className="relative">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden"
              />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-400 uppercase block mb-0.5">Background Color</span>
              <span className="text-sm font-mono text-white">{backgroundColor.toUpperCase()}</span>
            </div>
          </div>

          <button
            onClick={handleCustomImageClick}
            className="glass-button w-full justify-center gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300"
          >
            <Image size={16} />
            Upload Environment
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};
