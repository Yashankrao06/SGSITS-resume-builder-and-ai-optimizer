import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CvData, CvMode } from './types';
import {
  onePageSampleData,
  twoPageSampleData,
  getOnePageSampleData,
  getTwoPageSampleData,
  ensureCvDataDefaults,
} from './data/sampleData';
import { UI_THEMES, ATS_FONTS, UiThemeId } from './data/themesAndFonts';
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
  RotateCcw,
  Palette,
  Type,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Shield,
  Trees,
  Flame,
} from 'lucide-react';

const STORAGE_KEYS: Record<CvMode, string> = {
  '1page': 'cv_one_page_data_v3',
  '2page': 'cv_two_page_data_v3',
};

const THEME_ICONS: Record<string, React.ElementType> = {
  Sun,
  Moon,
  Shield,
  Trees,
  Flame,
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

  // Interface Theme & ATS Resume Font State
  const [uiThemeId, setUiThemeId] = useState<UiThemeId>(() => {
    try {
      return (localStorage.getItem('cv_ui_theme_v1') as UiThemeId) || 'light';
    } catch {
      return 'light';
    }
  });

  const [selectedFontId, setSelectedFontId] = useState<string>(() => {
    try {
      return localStorage.getItem('cv_ats_font_v1') || 'georgia';
    } catch {
      return 'georgia';
    }
  });

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);

  // Get active Theme & Font objects
  const currentTheme = UI_THEMES.find((t) => t.id === uiThemeId) || UI_THEMES[0];
  const currentFont = ATS_FONTS.find((f) => f.id === selectedFontId) || ATS_FONTS[0];

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

  // Persist Theme & apply HTML dark class
  useEffect(() => {
    try {
      localStorage.setItem('cv_ui_theme_v1', uiThemeId);
    } catch (e) {
      console.error('Failed saving theme', e);
    }
    if (uiThemeId !== 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [uiThemeId]);

  // Persist Font choice
  useEffect(() => {
    try {
      localStorage.setItem('cv_ats_font_v1', selectedFontId);
    } catch (e) {
      console.error('Failed saving font choice', e);
    }
  }, [selectedFontId]);

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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=Inter:wght@400;500;600;700&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/latin-modern-web@1.0.0/style.css">
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: white; width: 210mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; }
    .cv-page { height: 297mm; min-height: unset !important; overflow: hidden; font-family: ${currentFont.family} !important; }
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
  }, [cvMode, activeData, currentFont]);

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
        e.target.value = '';
      }
    };

    reader.readAsDataURL(file);
  };

  const CurrentThemeIcon = THEME_ICONS[currentTheme.iconName] || Sun;

  return (
    <div className={`min-h-screen ${currentTheme.appBgClass} flex flex-col font-sans transition-colors duration-200 selection:bg-amber-200 selection:text-amber-950`}>
      
      {/* APP TOP HEADER & TOOLBAR */}
      <header className={`sticky top-0 z-30 ${currentTheme.headerBgClass} backdrop-blur-md border-b shadow-xs transition-colors duration-200`}>
        <div className="max-w-[1536px] w-full mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Branding with College Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden">
              <img
                src="https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png"
                alt="SGSITS College Logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/sgsits_official_logo.png';
                }}
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight">
                  SGSITS Academic Resume Builder
                </h1>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${currentTheme.accentBadgeClass}`}>
                  Official Format
                </span>
              </div>
              <p className={`text-[11px] ${currentTheme.textSecondaryClass} font-medium`}>
                SGSITS Indore • Live A4 Academic CV Canvas & PDF Resume Autofill
              </p>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
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
                      ? 'bg-blue-600 text-white shadow-xs'
                      : `${currentTheme.textSecondaryClass} hover:text-blue-500 hover:bg-black/5 dark:hover:bg-white/10`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* THEME & FONT SELECTORS + ACTION BUTTONS */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* 1. UI THEME SWITCHER DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowThemeMenu(!showThemeMenu);
                  setShowFontMenu(false);
                }}
                className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-black/10 dark:border-white/10 transition-all shadow-2xs"
                title="Change UI Theme (Light, Dark Midnight, Executive Navy, Emerald, Amber)"
              >
                <CurrentThemeIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{currentTheme.name}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>Select Interface Theme</span>
                  </div>

                  <div className="space-y-1">
                    {UI_THEMES.map((theme) => {
                      const ThemeIcon = THEME_ICONS[theme.iconName] || Sun;
                      const isSelected = theme.id === uiThemeId;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => {
                            setUiThemeId(theme.id);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ThemeIcon className="w-4 h-4 text-amber-500 shrink-0" />
                            <div className="text-left">
                              <div className="font-semibold">{theme.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal leading-tight">
                                {theme.description}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. ATS RESUME FONT SELECTOR DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowFontMenu(!showFontMenu);
                  setShowThemeMenu(false);
                }}
                className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-black/10 dark:border-white/10 transition-all shadow-2xs"
                title="Change Resume Font (All Standard ATS-Friendly Fonts)"
              >
                <Type className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-medium max-w-[100px] truncate">{currentFont.name}</span>
                <span className="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 py-0.2 rounded font-mono font-bold">
                  ATS
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showFontMenu && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 custom-scrollbar">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-blue-500" />
                      <span>ATS Resume Fonts</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      100% Parseable
                    </span>
                  </div>

                  <div className="space-y-1">
                    {ATS_FONTS.map((font) => {
                      const isSelected = font.id === selectedFontId;
                      return (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => {
                            setSelectedFontId(font.id);
                            setShowFontMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{font.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                • {font.category}
                              </span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                          </div>
                          
                          {/* Live Font Sample Preview */}
                          <div
                            style={{ fontFamily: font.family }}
                            className="text-[12px] font-medium text-slate-800 dark:text-slate-200 mt-1 pl-1 border-l-2 border-slate-300 dark:border-slate-700 py-0.5"
                          >
                            {font.previewSample}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {font.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Auto-save status indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-[11px] font-medium mr-1">
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Saving...</span>
                </>
              )}
            </div>

            {/* Upload PDF Resume Button */}
            <label
              className={`px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isParsingPdf ? 'opacity-80 pointer-events-none' : ''
              }`}
              title="Upload your existing resume PDF to auto-extract details"
            >
              {isParsingPdf ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <FileUp className="w-3.5 h-3.5 text-blue-200" />
              )}
              <span>{isParsingPdf ? 'Parsing...' : 'Upload PDF'}</span>
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
              className="px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border border-amber-300/80 dark:border-amber-800 shadow-2xs"
              title="View Features & Quick Start Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden lg:inline">Guide</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJson}
              className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-black/10 dark:border-white/10 shadow-2xs"
              title="Export resume as JSON backup"
            >
              <Download className="w-3.5 h-3.5 opacity-70" />
              <span className="hidden md:inline">Export</span>
            </button>

            {/* Import JSON */}
            <label className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-black/10 dark:border-white/10 shadow-2xs cursor-pointer" title="Import resume JSON file">
              <Upload className="w-3.5 h-3.5 opacity-70" />
              <span className="hidden md:inline">Import</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            {/* Reset Defaults button */}
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-rose-50 text-slate-700 dark:text-slate-200 hover:text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-black/10 dark:border-white/10 hover:border-rose-300 shadow-2xs"
              title="Reset all fields back to default sample template"
            >
              <RotateCcw className="w-3.5 h-3.5 opacity-70 hover:text-rose-600" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Download PDF button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 border border-blue-500"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.5] text-amber-300" />
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
              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
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
          <div className={`lg:col-span-5 rounded-2xl border ${currentTheme.borderClass} ${currentTheme.cardBgClass} overflow-hidden shadow-sm flex flex-col transition-colors duration-200`}>
            <div className={`px-4 py-3 ${currentTheme.cardHeaderBgClass} border-b ${currentTheme.borderClass} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  CV Content Editor
                </span>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentTheme.accentBadgeClass}`}>
                {cvMode === '1page' ? '1-Page Layout' : '2-Page Layout'}
              </span>
            </div>

            <div className="h-[calc(100vh-130px)] overflow-y-auto p-4 custom-scrollbar">
              <FormEditor
                data={activeData}
                onChange={setActiveData}
                type={cvMode}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE CANVAS PREVIEW (7 Columns on Large) */}
          <div className={`lg:col-span-7 rounded-2xl border ${currentTheme.borderClass} ${currentTheme.cardBgClass} overflow-hidden shadow-sm flex flex-col transition-colors duration-200`}>
            <div className={`px-4 py-2.5 ${currentTheme.cardHeaderBgClass} border-b ${currentTheme.borderClass} flex items-center justify-between flex-wrap gap-2`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  <span className="text-xs font-bold tracking-wide uppercase">
                    A4 Live Printable Canvas
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Font: {currentFont.name}
                </span>
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-lg p-0.5 text-xs shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.05))}
                    className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px] font-semibold">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.05))}
                    className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(0.9)}
                    className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors border-l border-black/10 dark:border-white/10 ml-0.5 pl-1.5"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                <span className={`text-[11px] ${currentTheme.textSecondaryClass} hidden sm:inline font-medium`}>
                  Click headings to edit
                </span>
              </div>
            </div>

            {/* CANVAS CONTAINER */}
            <div className={`h-[calc(100vh-130px)] overflow-y-auto p-6 ${currentTheme.previewBgClass} flex justify-center custom-scrollbar`}>
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="mb-12 shadow-2xl rounded-sm"
              >
                <ResumePreview
                  data={activeData}
                  type={cvMode}
                  printRef={printRef}
                  fontFamily={currentFont.family}
                  previewBgClass={currentTheme.previewBgClass}
                  previewCanvasPattern={currentTheme.previewCanvasPattern}
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className={`w-full ${currentTheme.cardBgClass} border-t ${currentTheme.borderClass} py-3 px-4 text-center text-xs flex items-center justify-center gap-2 flex-wrap z-20`}>
        <span>Made by <strong className="font-semibold">Yashank Rao</strong></span>
        <span className="opacity-40">•</span>
        <a
          href="https://www.linkedin.com/in/yashank-rao-ben-61761533b/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium hover:text-blue-500 transition-colors hover:underline"
        >
          <Linkedin className="w-3.5 h-3.5 text-blue-600 fill-blue-600/10" />
          <span>LinkedIn</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </footer>

      {/* WELCOME FEATURES POPUP MODAL */}
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}

    </div>
  );
}


