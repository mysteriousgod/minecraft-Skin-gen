import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Upload, Box, User } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface TextureOption {
  id: string;
  label: string;
  value: string;
  baseModel?: 'steve' | 'alex';
}

const TextureSelectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedModel: 'steve' | 'alex', customName: string) => void;
}> = ({ isOpen, onClose, onSelect }) => {
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10 animate-fade-in border border-white/10 shadow-2xl bg-slate-900/90">
        <h2 className="text-2xl font-bold mb-6 text-emerald-400 font-display flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Import Skin Texture
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Skin Name</label>
            <input
              type="text"
              className="input-modern w-full"
              placeholder="e.g. My Cool Skin"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">Select Model Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`glass-button py-4 flex flex-col gap-2 items-center justify-center transition-all ${customName ? 'hover:bg-emerald-500/20 hover:border-emerald-500/50' : 'opacity-50 cursor-not-allowed'
                  }`}
                disabled={!customName}
                onClick={() => onSelect('steve', customName)}
              >
                <Box className="w-8 h-8 text-emerald-400" />
                <span className="font-semibold text-lg">Steve</span>
                <span className="text-xs text-slate-400 font-norma">Classic (4px arms)</span>
              </button>

              <button
                className={`glass-button py-4 flex flex-col gap-2 items-center justify-center transition-all ${customName ? 'hover:bg-emerald-500/20 hover:border-emerald-500/50' : 'opacity-50 cursor-not-allowed'
                  }`}
                disabled={!customName}
                onClick={() => onSelect('alex', customName)}
              >
                <User className="w-8 h-8 text-emerald-400" />
                <span className="font-semibold text-lg">Alex</span>
                <span className="text-xs text-slate-400 font-norma">Slim (3px arms)</span>
              </button>
            </div>
          </div>
        </div>

        <button
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const TopControls: React.FC = () => {
  const {
    setModel,
    setCustomTexture,
    selectedOptionId,
    setSelectedOptionId
  } = useEditorStore();

  const [options, setOptions] = useState<TextureOption[]>([
    { id: 'steve', label: 'Steve (Default)', value: 'steve' },
    { id: 'alex', label: 'Alex (Default)', value: 'alex' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState<string>('');

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedOptionId(selectedId);

    if (selectedId === 'steve' || selectedId === 'alex') {
      setModel(selectedId);
      setCustomTexture('');
      return;
    }

    const selectedOption = options.find((opt) => opt.id === selectedId);
    if (selectedOption && selectedOption.id.startsWith('custom-')) {
      setModel(selectedOption.baseModel!);
      setCustomTexture(selectedOption.value);
    }
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

  const handleDownload = () => {
    if (typeof (window as any).exportSkinTexture === 'function') {
      (window as any).exportSkinTexture();
    }
  };

  return (
    <>
      <nav className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 animate-fade-in border-b-2 border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  <Box className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-xl leading-none tracking-tight text-white mb-0.5">SkinCrafter</h1>
                  <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase">Professional Editor</p>
                </div>
              </Link>

              {/* Mobile-only menu toggle could go here if needed, but for now we just show everything */}
            </div>

            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative group w-full sm:w-auto">
                <select
                  value={selectedOptionId}
                  onChange={handleModelChange}
                  className="input-modern bg-slate-800 border-slate-700 w-full sm:min-w-[180px] pl-10 appearance-none cursor-pointer hover:border-emerald-500/50 transition-colors"
                >
                  {options.map((option) => (
                    <option key={option.id} value={option.id} className="bg-slate-800 text-white py-2">
                      {option.label}
                    </option>
                  ))}
                </select>
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="glass-button text-sm hover:text-emerald-300 flex-1 sm:flex-none"
            >
              <Upload size={18} />
              <span>Import</span>
            </button>

            <button
              onClick={handleDownload}
              className="glass-button bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] flex-1 sm:flex-none"
            >
              <Download size={18} />
              <span>Export Skin</span>
            </button>
          </div>
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
