import React, { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import type { SkinModel } from '../types/editor';

interface TextureOption {
  id: string;
  label: string;
  value: string;
  baseModel?: 'steve' | 'alex';
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 50
};

const modalContentStyle: React.CSSProperties = {
  background: '#ffffff',
  padding: '24px',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f0f0f0',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px'
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '100%',
  marginBottom: '16px'
};

// Inline modal component
const TextureSelectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedModel: 'steve' | 'alex', customName: string) => void;
}> = ({ isOpen, onClose, onSelect }) => {
  const [customName, setCustomName] = useState('');
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Apply Uploaded Texture
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Enter a name for your custom texture:
        </p>
        <input
          type="text"
          style={inputStyle}
          placeholder="Custom texture name"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
        />
        <p style={{ marginBottom: '16px' }}>
          Select which model to apply your uploaded texture:
        </p>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <button
            style={{ ...buttonStyle, opacity: customName ? 1 : 0.5 }}
            disabled={!customName}
            onClick={() => onSelect('steve', customName)}
          >
            Steve
          </button>
          <button
            style={{ ...buttonStyle, opacity: customName ? 1 : 0.5 }}
            disabled={!customName}
            onClick={() => onSelect('alex', customName)}
          >
            Alex
          </button>
        </div>
        <button
          style={{ color: '#666', fontSize: '0.875rem' }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const TopControls: React.FC = () => {
  const {
    model,
    setModel,
    setCustomTexture,
    customTexture,
    selectedOptionId,
    setSelectedOptionId
  } = useEditorStore();

  const [options, setOptions] = useState<TextureOption[]>([
    { id: 'steve', label: 'Steve', value: 'steve' },
    { id: 'alex', label: 'Alex', value: 'alex' },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState<string>('');

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedOptionId(selectedId);

    // For default models, update model and clear any custom texture.
    if (selectedId === 'steve' || selectedId === 'alex') {
      setModel(selectedId);
      setCustomTexture('');
      return;
    }

    // For custom textures, update model and custom texture accordingly.
    const selectedOption = options.find((opt) => opt.id === selectedId);
    if (selectedOption && selectedOption.id.startsWith('custom-')) {
      setModel(selectedOption.baseModel!);
      setCustomTexture(selectedOption.value);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setUploadedData(dataUrl);
        // Open modal to let the user choose which model to apply the texture.
        setIsModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleModalSelect = (selectedModel: 'steve' | 'alex', customName: string) => {
    const timestamp = Date.now();
    const newOption: TextureOption = {
      id: `custom-${timestamp}`,
      label: customName,
      value: uploadedData,
      baseModel: selectedModel,
    };

    setOptions((prevOptions) => [...prevOptions, newOption]);
    setSelectedOptionId(newOption.id);
    setModel(selectedModel);
    setCustomTexture(newOption.value);
    setIsModalOpen(false);
  };

  const handleUpload = () => {
    handleUploadClick();
  };

  const handleDownload = () => {
    if (typeof (window as any).exportSkinTexture === 'function') {
      (window as any).exportSkinTexture();
    }
  };

  return (
    <>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#f8f8f8',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <select
            value={selectedOptionId}
            onChange={handleModelChange}
            style={{ ...buttonStyle, minWidth: '120px' }}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleUpload}
            style={buttonStyle}
          >
            <Upload size={16} />
            Upload
          </button>

          <button
            onClick={handleDownload}
            style={buttonStyle}
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </nav>
      <TextureSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleModalSelect}
      />
    </>
  );
};
