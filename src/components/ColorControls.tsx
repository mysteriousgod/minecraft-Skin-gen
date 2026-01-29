import React, { CSSProperties } from 'react';
import { useEditorStore } from '../store/editorStore';

const panelStyle: CSSProperties = {
  backgroundColor: '#f8f8f8',
  padding: '16px',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle: CSSProperties = {
  fontWeight: 600,
  color: '#666'
};

const colorInputStyle: CSSProperties = {
  width: '100%',
  height: '48px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: '1px solid #ccc'
};

const rangeInputStyle: CSSProperties = {
  width: '100%',
  accentColor: '#666'
};

const rgbInputStyle: CSSProperties = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

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

  const updateChannel = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [channel]: value };
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div style={panelStyle}>
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Color</h3>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={colorInputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={labelStyle}>Alpha</h3>
          <span style={{ color: '#666' }}>{alpha.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
          style={rangeInputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <h3 style={labelStyle}>RGB</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {['r', 'g', 'b'].map((channel) => (
            <div key={channel} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ ...labelStyle, fontSize: '0.875rem' }}>{channel.toUpperCase()}</label>
              <input
                type="number"
                min="0"
                max="255"
                value={channel === 'r' ? rgb.r : channel === 'g' ? rgb.g : rgb.b}
                onChange={(e) =>
                  updateChannel(channel as 'r' | 'g' | 'b', Number(e.target.value))
                }
                style={rgbInputStyle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
