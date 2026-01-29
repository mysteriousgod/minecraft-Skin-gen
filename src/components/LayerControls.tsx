import React, { CSSProperties } from 'react';
import { Layers } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import type { Layer } from '../types/editor';

const panelStyle: CSSProperties = {
  backgroundColor: '#f8f8f8',
  padding: '16px',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const labelStyle: CSSProperties = {
  fontWeight: 600,
  color: '#666'
};

const buttonStyle: CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const activeButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#666',
  color: 'white',
  borderColor: '#666'
};

export const LayerControls: React.FC = () => {
  // const { layer, setLayer } = useEditorStore();

  // const layers: { id: Layer; label: string }[] = [
  //   { id: 'outer', label: 'Outer Layer' },
  //   { id: 'inner', label: 'Inner Layer' },
  //   { id: 'both', label: 'Both Layers' }, // Add "Both" option
  // ];

  return (
    <div style={panelStyle}>
      {/* <div style={headerStyle}>
        <Layers size={20} style={{ color: '#666' }} />
        <h3 style={labelStyle}>Layers</h3>
      </div> */}
{/*       
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {layers.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setLayer(id)}
            style={layer === id ? activeButtonStyle : buttonStyle}
          >
            {label}
          </button>
        ))}
      </div> */}
    </div>
  );
};
