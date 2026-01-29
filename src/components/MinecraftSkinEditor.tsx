import React from 'react';
import ModelViewer from './ModelViewer';
import { TopControls } from './TopControls';
import { ViewControls } from './ViewControls';
import { ColorControls } from './ColorControls';

import { PaintingTools } from './PaintingTools';

export const MinecraftSkinEditor: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <TopControls />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="glass-panel rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <ViewControls />
            </div>

            <div className="glass-panel rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ColorControls />
            </div>
          </div>

          {/* Main Content - Model Viewer */}
          <div className="lg:col-span-7 relative h-full glass-panel rounded-2xl overflow-hidden animate-fade-in shadow-2xl border-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 to-slate-900/20 pointer-events-none z-10" />
            <ModelViewer />
          </div>

          {/* Right Sidebar - Tools */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 h-full animate-fade-in flex flex-col" style={{ animationDelay: '0.3s' }}>
              <PaintingTools />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
