import React from 'react';
import ModelViewer from './ModelViewer';
import { TopControls } from './TopControls';
import { ViewControls } from './ViewControls';
import { ColorControls } from './ColorControls';
import { LayerControls } from './LayerControls';
import { PaintingTools } from './PaintingTools';

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '24px'
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr 1fr',
  gap: '16px',
  marginTop: '16px'
};

const sidebarStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

export const MinecraftSkinEditor: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <div style={containerStyle}>
        <TopControls />
        
        <div style={gridStyle}>
          {/* Left Sidebar */}
          <div style={sidebarStyle}>
            <ViewControls />
            <ColorControls />
          </div>

          {/* Main Content */}
          <div>
            <ModelViewer />
          </div>

          {/* Right Sidebar */}
          <div style={sidebarStyle}>
            <PaintingTools />
            <LayerControls />
          </div>
        </div>
      </div>
    </div>
  );
}
