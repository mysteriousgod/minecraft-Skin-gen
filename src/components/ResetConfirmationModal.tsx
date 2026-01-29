import React from 'react';
import { useEditorStore } from '../store/editorStore';

export const ResetConfirmationModal: React.FC = () => {
    const { isResetModalOpen, setResetModalOpen } = useEditorStore();

    const confirmFullReset = () => {
        if (typeof (window as any).resetTexture === 'function') {
            (window as any).resetTexture();
        }
        setResetModalOpen(false);
    };

    if (!isResetModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setResetModalOpen(false)}
            />
            <div className="glass-panel w-full max-w-sm p-6 rounded-2xl relative z-10 animate-fade-in bg-slate-900 border border-white/10 shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-white">Confirm Reset</h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                    This action will clear the entire paint job on all parts of the skin and cannot be undone. Are you sure you want to proceed?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setResetModalOpen(false)}
                        className="glass-button text-sm hover:bg-slate-800 text-slate-300 border-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmFullReset}
                        className="glass-button bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 text-sm font-semibold shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                    >
                        Yes, Reset Skin
                    </button>
                </div>
            </div>
        </div>
    );
};
