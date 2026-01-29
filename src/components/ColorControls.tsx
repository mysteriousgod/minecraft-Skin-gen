import React, { useState } from 'react';
import { Palette, Droplet } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (cleanHex.length !== 6) return null;
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const ColorControls: React.FC = () => {
  const { color, alpha, setColor, setAlpha } = useEditorStore();
  const rgb = hexToRgb(color) || { r: 0, g: 0, b: 0 };
  const [activeTab, setActiveTab] = useState<'picker' | 'rgb'>('picker');

  const updateChannel = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [channel]: value };
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="panel-title mb-0">Color Palette</h3>
        <div className="flex bg-slate-800 rounded-lg p-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('picker')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'picker' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Picker
          </button>
          <button
            onClick={() => setActiveTab('rgb')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'rgb' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            RGB
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Main Color Preview & Input */}
        <div className="flex gap-4">
          <div
            className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/20 relative group overflow-hidden cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => document.getElementById('color-picker-input')?.click()}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <Palette className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">#</span>
              <input
                type="text"
                value={color.replace('#', '').toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setColor(`#${val}`);
                  }
                }}
                className="input-modern w-full pl-7 font-mono text-sm uppercase"
              />
              <input
                id="color-picker-input"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Droplet size={14} className="text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="flex-1 accent-emerald-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400 w-8 text-right">{(alpha * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {activeTab === 'rgb' && (
          <div className="grid grid-cols-3 gap-2 animate-fade-in">
            {['r', 'g', 'b'].map((channel) => (
              <div key={channel} className="space-y-1">
                <label className="text-xs uppercase font-bold text-slate-500">{channel}</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={channel === 'r' ? rgb.r : channel === 'g' ? rgb.g : rgb.b}
                  onChange={(e) => updateChannel(channel as 'r' | 'g' | 'b', Number(e.target.value))}
                  className="input-modern w-full p-1 text-center font-mono text-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
