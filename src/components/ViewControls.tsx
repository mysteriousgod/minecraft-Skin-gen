import React, { useRef, CSSProperties } from 'react';
import { Grid, Image, ZoomIn, ZoomOut } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

const panelStyle: CSSProperties = {
  backgroundColor: '#f8f8f8',
  padding: '16px',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#666',
  fontWeight: 600
};

const buttonStyle: CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  backgroundColor: '#fff'
};

const colorInputStyle: CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: '1px solid #ccc'
};

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
    <div style={panelStyle}>
      <div style={sectionStyle}>
        <h3 style={headerStyle}>
          <ZoomIn size={16} style={{ color: '#666' }} />
          View
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
            style={buttonStyle}
          >
            <span>Zoom In</span>
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
            style={buttonStyle}
          >
            <span>Zoom Out</span>
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => toggleGrid()}
            style={{
              ...buttonStyle,
              backgroundColor: showGrid ? '#e6e6e6' : '#fff'
            }}
          >
            <span>Show Grid</span>
            <Grid size={16} />
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={headerStyle}>
          <Image size={16} style={{ color: '#666' }} />
          Background
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={colorInputStyle}
            />
          </div>
          <button
            onClick={handleCustomImageClick}
            style={{ ...buttonStyle, flex: 1 }}
          >
            <span>Custom Image</span>
            <Image size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};
