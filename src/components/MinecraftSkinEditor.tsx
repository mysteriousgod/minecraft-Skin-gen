import React from 'react';
import ModelViewer from './ModelViewer';
import { TopControls } from './TopControls';
import { ViewControls } from './ViewControls';
import { ColorControls } from './ColorControls';

import { PaintingTools } from './PaintingTools';
import { ResetConfirmationModal } from './ResetConfirmationModal';

export const MinecraftSkinEditor: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <TopControls />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-auto lg:h-[calc(100vh-140px)] min-h-[auto] lg:min-h-[600px]">
          {/* Left Sidebar - Controls (View & Color) */}
          <div className="order-3 lg:order-1 lg:col-span-3 flex flex-col gap-4 lg:gap-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            <div className="glass-panel rounded-2xl p-4 lg:p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <ViewControls />
            </div>

            <div className="glass-panel rounded-2xl p-4 lg:p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ColorControls />
            </div>
          </div>

          {/* Main Content - Model Viewer */}
          <div className="order-1 lg:order-2 lg:col-span-7 relative h-[50vh] lg:h-full glass-panel rounded-2xl overflow-hidden animate-fade-in shadow-2xl border-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 to-slate-900/20 pointer-events-none z-10" />
            <ModelViewer />
          </div>

          {/* Right Sidebar - Tools */}
          <div className="order-2 lg:order-3 lg:col-span-2 flex flex-col gap-4 lg:gap-6">
            <div className="glass-panel rounded-2xl p-4 lg:p-6 h-full animate-fade-in flex flex-col" style={{ animationDelay: '0.3s' }}>
              <PaintingTools />
            </div>
          </div>
        </div>
      </div>
      <ResetConfirmationModal />
    </div>
  );
}
