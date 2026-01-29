import React, { useState, CSSProperties } from 'react';
import { Pencil, Eraser, Square, RotateCcw, Undo, Redo, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import type { Tool } from '../types/editor';

const panelStyle: CSSProperties = {
  backgroundColor: '#f8f8f8',
  padding: '16px',
  borderRadius: '4px'
};

const toolGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px'
};

const baseToolButtonStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  cursor: 'pointer',
  backgroundColor: '#fff',
  transition: 'all 0.2s ease'
};

const activeToolButtonStyle: CSSProperties = {
  ...baseToolButtonStyle,
  backgroundColor: '#666',
  color: 'white',
  borderColor: '#666',
  transform: 'scale(1.02)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const actionButtonStyle: CSSProperties = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  cursor: 'pointer',
  backgroundColor: '#fff',
  flex: 1
};

const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 50
};

const modalContentStyle: CSSProperties = {
  backgroundColor: '#fff',
  padding: '16px',
  borderRadius: '8px',
  maxWidth: '400px',
  width: '100%'
};

export const PaintingTools: React.FC = () => {
  const { tool, setTool, selectedOptionId } = useEditorStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'pencil', icon: <Pencil size={20} />, label: 'Pencil' },
    { id: 'fill', icon: <Square size={20} />, label: 'Fill' },
    { id: 'eraser', icon: <Eraser size={20} />, label: 'Eraser' },
  ];

    // Modify the handleUndo and handleRedo functions
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

  const cancelFullReset = () => {
    setShowConfirmModal(false);
  };

  return (
    <div style={panelStyle}>
      <div style={toolGridStyle}>
        {tools.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() =>
              id === 'pencil' && tool === 'pencil'
                ? setTool('none')
                : setTool(id)
            }
            style={tool === id ? activeToolButtonStyle : baseToolButtonStyle}
            title={label}
          >
            <div style={{ color: tool === id ? '#fff' : '#666' }}>
              {icon}
            </div>
            <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>{label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button
          onClick={handleUndo}
          style={actionButtonStyle}
          title="Undo"
        >
          <Undo size={16} style={{ margin: '0 auto' }} />
        </button>
        <button
          onClick={handleRedo}
          style={actionButtonStyle}
          title="Redo"
        >
          <Redo size={16} style={{ margin: '0 auto' }} />
        </button>
        <button
          onClick={handleReset}
          style={actionButtonStyle}
          title="Reset Skin"
        >
          <RotateCcw size={16} style={{ margin: '0 auto' }} />
        </button>
      </div>


      {showConfirmModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>
              Confirm Full Reset
            </h2>
            <p style={{ marginBottom: '16px' }}>
              This action will clear the entire paint job and cannot be undone. Are you sure you want to continue?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                onClick={cancelFullReset}
                style={{
                  ...actionButtonStyle,
                  padding: '8px 16px'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmFullReset}
                style={{
                  ...actionButtonStyle,
                  padding: '8px 16px',
                  backgroundColor: '#666',
                  color: '#fff',
                  borderColor: '#666'
                }}
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
