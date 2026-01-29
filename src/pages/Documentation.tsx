import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, MousePointer, Layers, PenTool } from 'lucide-react';

export const Documentation: React.FC = () => {
    return (
        <div className="min-h-screen font-sans bg-slate-900">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                    <span className="text-xl font-bold font-display text-slate-200">
                        Documentation
                    </span>
                    <div className="w-24"></div> {/* Spacer for centering */}
                </div>
            </nav>

            <div className="pt-24 pb-20 container mx-auto px-6 max-w-4xl">
                <div className="glass-panel p-8 md:p-12 rounded-2xl">
                    <div className="prose prose-invert max-w-none">
                        <h1 className="text-4xl font-bold font-display mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            User Guide
                        </h1>

                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Book className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100 m-0">Getting Started</h2>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed mb-4">
                                Welcome to SkinCraft Pro. This tool allows you to create custom Minecraft skins directly in your browser.
                                You can start from scratch (Steve or Alex model) or upload an existing skin to edit.
                            </p>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-500 mt-1">1</span>
                                    <span><strong>Choose Model:</strong> Select between Classic (Steve) or Slim (Alex) models from the top bar.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-500 mt-1">2</span>
                                    <span><strong>Paint:</strong> Use the brush tool to paint directly on the 3D model.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-500 mt-1">3</span>
                                    <span><strong>Export:</strong> Click the "Download Skin" button to save your creation as a PNG file ready for Minecraft.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                    <PenTool className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100 m-0">Tools & Painting</h2>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed mb-6">
                                The toolbar on the right provides various tools to help you craft the perfect skin.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <h3 className="font-bold text-slate-200 mb-2">Brush Tool</h3>
                                    <p className="text-sm text-slate-400">Standard painting tool. Click and drag on the model to paint.</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <h3 className="font-bold text-slate-200 mb-2">Eraser</h3>
                                    <p className="text-sm text-slate-400">Removes pixels, making them transparent (useful for the outer layer).</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <h3 className="font-bold text-slate-200 mb-2">Color Picker</h3>
                                    <p className="text-sm text-slate-400">Click on any part of the model to select that color.</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <h3 className="font-bold text-slate-200 mb-2">Bucket Fill</h3>
                                    <p className="text-sm text-slate-400">Fill an entire face or body part with a single color.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-violet-500/10 text-violet-400">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100 m-0">Layers & Visibility</h2>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Minecraft skins have two layers: the Base Layer (Body) and the Outer Layer (Hat/Jacket).
                                Use the visibility controls in the left sidebar to toggle specific body parts or the entire outer layer on/off.
                                This helps when painting areas that are hidden by other parts.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400">
                                    <MousePointer className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100 m-0">Navigation Controls</h2>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-white/10">
                                <table className="w-full text-left bg-slate-800/30">
                                    <thead className="bg-slate-800/80 text-custom-white">
                                        <tr>
                                            <th className="p-4 font-semibold text-slate-300">Action</th>
                                            <th className="p-4 font-semibold text-slate-300">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-400">
                                        <tr>
                                            <td className="p-4">Rotate Model</td>
                                            <td className="p-4 flex items-center gap-2"><span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono text-white">Left Click</span> + Drag</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4">Pan Model</td>
                                            <td className="p-4 flex items-center gap-2"><span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono text-white">Right Click</span> + Drag</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4">Zoom</td>
                                            <td className="p-4 flex items-center gap-2"><span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono text-white">Scroll Wheel</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};
