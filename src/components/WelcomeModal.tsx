import React from 'react';
import {
  FileUp,
  GraduationCap,
  Printer,
  Layers,
  X,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close welcome message"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center border border-white/30 shrink-0 overflow-hidden shadow-sm">
              <img
                src="https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png"
                alt="SGSITS Logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/sgsits_official_logo.png';
                }}
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-200 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                Official Format
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                SGSITS Academic CV Builder
              </h2>
            </div>
          </div>
          <p className="text-xs text-blue-100/90 leading-relaxed mt-1">
            Build, edit, and print your standardized academic resume effortlessly with automated PDF autofill.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-3.5">
            
            {/* Feature 1: PDF Resume Autofill */}
            <div className="flex gap-3.5 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100/80 hover:border-blue-200 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Smart Old CV PDF Autofill</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-md">New</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Upload your old PDF resume to instantly extract and autofill your details—contact info, education, work experience, projects, and skills—with 100% privacy and zero setup required!
                </p>
              </div>
            </div>

            {/* Feature 2: Strict Academic Format */}
            <div className="flex gap-3.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-slate-800 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Official Academic Format</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Pre-configured with official academic header, structured tables, course headings, and placement cell guidelines.
                </p>
              </div>
            </div>

            {/* Feature 3: 1-Page & 2-Page CV Toggle */}
            <div className="flex gap-3.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">1-Page & 2-Page Modes</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Switch instantly between compact 1-page summaries and comprehensive 2-page detailed academic CVs with independent auto-saving.
                </p>
              </div>
            </div>

            {/* Feature 4: One-Click PDF Export & Data Backup */}
            <div className="flex gap-3.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Instant Print & JSON Backup</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Generate print-ready A4 PDFs directly from your browser. Export and restore your data anytime using JSON backup files.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready to use</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all hover:shadow-md active:scale-98"
          >
            <span>Start Building Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
