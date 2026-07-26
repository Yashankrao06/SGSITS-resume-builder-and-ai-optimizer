import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CvData, CvMode } from './types';
import {
  onePageSampleData,
  twoPageSampleData,
  getOnePageSampleData,
  getTwoPageSampleData,
  ensureCvDataDefaults,
} from './data/sampleData';
import { FormEditor } from './components/FormEditor';
import { ResumePreview } from './components/ResumePreview';
import { WelcomeModal } from './components/WelcomeModal';
import {
  FileText,
  Files,
  Printer,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  FileCheck,
  ZoomIn,
  ZoomOut,
  Maximize2,
  GraduationCap,
  Linkedin,
  ExternalLink,
  Loader2,
  FileUp,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEYS: Record<CvMode, string> = {
  '1page': 'cv_one_page_data_v3',
  '2page': 'cv_two_page_data_v3',
};

function loadStoredData(mode: CvMode, fallback: CvData): CvData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[mode]);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.header) {
        return ensureCvDataDefaults(parsed);
      }
    }
  } catch (e) {
    console.error('Error reading localStorage for mode:', mode, e);
  }
  return ensureCvDataDefaults(fallback);
}

export default function App() {
  const [cvMode, setCvMode] = useState<CvMode>('1page');
  const [zoomLevel, setZoomLevel] = useState<number>(0.9);

  // Initialize state with fresh default sample data on every reload
  const [onePageData, setOnePageData] = useState<CvData>(() =>
    getOnePageSampleData()
  );
  const [twoPageData, setTwoPageData] = useState<CvData>(() =>
    getTwoPageSampleData()
  );

  const [isSaved, setIsSaved] = useState(true);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [parseMessage, setParseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const printRef = useRef<HTMLDivElement>(null);

  // Active CV Data & Updater based on selected tab
  const activeData = cvMode === '1page' ? onePageData : twoPageData;
  const setActiveData = (updated: CvData) => {
    if (cvMode === '1page') {
      setOnePageData(updated);
    } else {
      setTwoPageData(updated);
    }
  };

  // Auto-Save Effect
  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS['1page'], JSON.stringify(onePageData));
        localStorage.setItem(STORAGE_KEYS['2page'], JSON.stringify(twoPageData));
        setIsSaved(true);
      } catch (e) {
        console.error('Failed to auto-save to localStorage', e);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [onePageData, twoPageData]);

  // Handle PDF Print Generation
  const handleDownloadPdf = useCallback(() => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
      alert('Please allow popups to enable PDF printing.');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${cvMode === '1page' ? 'One Page' : 'Two Page'} CV - ${activeData.header.name}</title>
  <base href="${window.location.origin}">
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: white; width: 210mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; }
    .cv-page { height: 297mm; min-height: unset !important; overflow: hidden; }
    .cv-page-break { page-break-after: always; break-after: page; }
    .cv-pages-wrapper { gap: 0 !important; }
  </style>
</head>
<body>${printContent}
<script>
  window.addEventListener('load', function() {
    window.focus();
    window.print();
  });
  window.addEventListener('afterprint', function() {
    window.close();
  });
<\/script>
</body>
</html>`);

    printWindow.document.close();
  }, [cvMode, activeData]);

  // Clear current CV data back to default template
  const handleClear = () => {
    if (
      window.confirm(
        `Reset all data back to the default sample template? Any unsaved edits will be cleared.`
      )
    ) {
      setOnePageData(getOnePageSampleData());
      setTwoPageData(getTwoPageSampleData());
      try {
        localStorage.removeItem(STORAGE_KEYS['1page']);
        localStorage.removeItem(STORAGE_KEYS['2page']);
      } catch (e) {
        console.error('Failed to clear localStorage', e);
      }
      setParseMessage({ type: 'success', text: 'Reset to default template values!' });
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(activeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${activeData.header.name.replace(/\s+/g, '_')}_${cvMode}_CV.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.header) {
            setActiveData(ensureCvDataDefaults(parsed));
            setParseMessage({ type: 'success', text: 'CV JSON loaded successfully!' });
          } else {
            alert('Invalid CV JSON format.');
          }
        } catch (err) {
          alert('Could not parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle PDF Resume Upload & Parsing
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF resume file.');
      return;
    }

    setIsParsingPdf(true);
    setParseMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = event.target?.result as string;
        const response = await fetch('/api/ai/parse-pdf-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Pdf: base64Data }),
        });

        const result = await response.json();
        if (result.success && result.data && result.data.header) {
          setActiveData(ensureCvDataDefaults(result.data));
          setParseMessage({
            type: 'success',
            text: 'Resume details extracted and autofilled from PDF!',
          });
        } else {
          setParseMessage({
            type: 'error',
            text: result.error || 'Unable to extract information from the uploaded PDF.',
          });
        }
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        setParseMessage({
          type: 'error',
          text: 'An error occurred while uploading and analyzing your PDF.',
        });
      } finally {
        setIsParsingPdf(false);
        // Clear input value so the same file can be re-uploaded if desired
        e.target.value = '';
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* APP TOP HEADER & TOOLBAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-[1536px] w-full mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs font-bold">
              <GraduationCap className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight text-slate-900">
                  Academic Resume Builder
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80 rounded-full">
                  Official Format
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Live A4 Academic CV Canvas with PDF Resume Autofill & Live Preview
              </p>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: '1page', label: '1-Page CV', icon: FileText },
              { id: '2page', label: '2-Page CV', icon: Files },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = cvMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCvMode(tab.id as CvMode)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-save status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 mr-1">
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved to device</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Saving...</span>
                </>
              )}
            </div>

            {/* Upload PDF Resume Button */}
            <label
              className={`px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isParsingPdf ? 'opacity-80 pointer-events-none' : ''
              }`}
              title="Upload your existing resume PDF to auto-extract details"
            >
              {isParsingPdf ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <FileUp className="w-3.5 h-3.5 text-blue-200" />
              )}
              <span>{isParsingPdf ? 'Parsing PDF CV...' : 'Upload PDF Resume'}</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfUpload}
                disabled={isParsingPdf}
                className="hidden"
              />
            </label>

            {/* Features & Guide Info Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowWelcomeModal(true)}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border border-amber-200/80 shadow-2xs"
              title="View Features & Quick Start Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Features</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJson}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-300 shadow-2xs"
              title="Export resume as JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Export JSON</span>
            </button>

            {/* Import JSON */}
            <label className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-300 shadow-2xs cursor-pointer" title="Import resume JSON file">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            {/* Reset Defaults button */}
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-300 hover:border-rose-300 shadow-2xs"
              title="Reset all fields back to default sample template"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            {/* Download PDF button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 border border-slate-800"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.5] text-amber-400" />
              <span>Download A4 PDF</span>
            </button>
          </div>

        </div>
      </header>

      {/* PARSE NOTIFICATION BANNER */}
      {parseMessage && (
        <div
          className={`w-full py-2 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 border-b transition-all ${
            parseMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {parseMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{parseMessage.text}</span>
          <button
            type="button"
            onClick={() => setParseMessage(null)}
            className="ml-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* MAIN WORKSPACE GRID */}
      <main className="max-w-[1536px] w-full mx-auto px-4 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT COLUMN: FORM EDITOR (5 Columns on Large) */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-200" />
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  CV Content Editor
                </span>
              </div>
              <span className="text-[11px] text-slate-700 font-semibold bg-slate-200/80 px-2.5 py-0.5 rounded-full border border-slate-300/60">
                {cvMode === '1page' ? '1-Page Layout' : '2-Page Layout'}
              </span>
            </div>

            <div className="h-[calc(100vh-130px)] overflow-y-auto p-4 custom-scrollbar bg-slate-50/50">
              <FormEditor
                data={activeData}
                onChange={setActiveData}
                type={cvMode}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE CANVAS PREVIEW (7 Columns on Large) */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  A4 Live Printable Canvas
                </span>
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs text-slate-700 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.05))}
                    className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-600 hover:text-slate-900"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px] font-semibold text-slate-800">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.05))}
                    className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-600 hover:text-slate-900"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(0.9)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-600 hover:text-slate-900 border-l border-slate-200 ml-0.5 pl-1.5"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
                  Click headings to edit
                </span>
              </div>
            </div>

            {/* CANVAS CONTAINER */}
            <div className="h-[calc(100vh-130px)] overflow-y-auto p-6 bg-slate-200/70 flex justify-center custom-scrollbar">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="mb-12 shadow-xl rounded-sm"
              >
                <ResumePreview
                  data={activeData}
                  type={cvMode}
                  printRef={printRef}
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 py-3 px-4 text-center text-xs text-slate-600 flex items-center justify-center gap-2 flex-wrap z-20">
        <span>Made by <strong className="text-slate-900 font-semibold">Yashank Rao</strong></span>
        <span className="text-slate-300">•</span>
        <a
          href="https://www.linkedin.com/in/yashank-rao-ben-61761533b/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-medium transition-colors hover:underline"
        >
          <Linkedin className="w-3.5 h-3.5 text-blue-600 fill-blue-600/10" />
          <span>LinkedIn</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </footer>

      {/* WELCOME FEATURES POPUP MODAL */}
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}

    </div>
  );
}


