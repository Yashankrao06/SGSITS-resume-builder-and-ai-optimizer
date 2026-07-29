export type UiThemeId = 'light' | 'dark' | 'navy' | 'emerald' | 'amber';

export interface UiTheme {
  id: UiThemeId;
  name: string;
  iconName: string;
  badgeBg: string;
  description: string;
  // Classes for main UI components
  appBgClass: string;
  headerBgClass: string;
  cardBgClass: string;
  cardHeaderBgClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  borderClass: string;
  inputBgClass: string;
  inputBorderClass: string;
  inputTextClass: string;
  previewBgClass: string;
  previewCanvasPattern: string;
  accentBadgeClass: string;
}

export const UI_THEMES: UiTheme[] = [
  {
    id: 'light',
    name: 'Classic Light',
    iconName: 'Sun',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Clean default light theme with crisp contrast',
    appBgClass: 'bg-slate-100 text-slate-900',
    headerBgClass: 'bg-white/95 text-slate-900 border-slate-200',
    cardBgClass: 'bg-white text-slate-900',
    cardHeaderBgClass: 'bg-slate-50 text-slate-900 border-slate-200',
    textPrimaryClass: 'text-slate-900',
    textSecondaryClass: 'text-slate-500',
    borderClass: 'border-slate-200',
    inputBgClass: 'bg-white',
    inputBorderClass: 'border-slate-300 focus:border-blue-500',
    inputTextClass: 'text-slate-900 placeholder:text-slate-400',
    previewBgClass: 'bg-slate-200/80',
    previewCanvasPattern: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
    accentBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'dark',
    name: 'Dark Midnight',
    iconName: 'Moon',
    badgeBg: 'bg-indigo-900/80 text-indigo-200 border-indigo-700',
    description: 'Eye-friendly deep midnight dark mode',
    appBgClass: 'bg-slate-950 text-slate-100 dark',
    headerBgClass: 'bg-slate-900/95 text-slate-100 border-slate-800',
    cardBgClass: 'bg-slate-900 text-slate-100',
    cardHeaderBgClass: 'bg-slate-800/80 text-slate-100 border-slate-700/80',
    textPrimaryClass: 'text-slate-100',
    textSecondaryClass: 'text-slate-400',
    borderClass: 'border-slate-800',
    inputBgClass: 'bg-slate-800/90',
    inputBorderClass: 'border-slate-700 focus:border-indigo-500',
    inputTextClass: 'text-slate-100 placeholder:text-slate-500',
    previewBgClass: 'bg-slate-900/90',
    previewCanvasPattern: 'radial-gradient(circle, #334155 1px, transparent 1px)',
    accentBadgeClass: 'bg-indigo-950 text-indigo-300 border-indigo-800',
  },
  {
    id: 'navy',
    name: 'Executive Navy',
    iconName: 'Shield',
    badgeBg: 'bg-blue-900 text-blue-200 border-blue-700',
    description: 'Professional deep blue executive environment',
    appBgClass: 'bg-slate-900 text-slate-100 dark',
    headerBgClass: 'bg-slate-900/95 text-slate-100 border-indigo-900/60',
    cardBgClass: 'bg-slate-800/95 text-slate-100',
    cardHeaderBgClass: 'bg-slate-900/80 text-slate-100 border-indigo-900/50',
    textPrimaryClass: 'text-slate-100',
    textSecondaryClass: 'text-indigo-200/70',
    borderClass: 'border-indigo-900/50',
    inputBgClass: 'bg-slate-900/80',
    inputBorderClass: 'border-indigo-800/60 focus:border-amber-400',
    inputTextClass: 'text-slate-100 placeholder:text-slate-400',
    previewBgClass: 'bg-slate-950/80',
    previewCanvasPattern: 'radial-gradient(circle, #1e293b 1px, transparent 1px)',
    accentBadgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'emerald',
    name: 'Forest Emerald',
    iconName: 'Trees',
    badgeBg: 'bg-emerald-900/80 text-emerald-200 border-emerald-700',
    description: 'Calm deep dark emerald workspace',
    appBgClass: 'bg-zinc-950 text-emerald-50 dark',
    headerBgClass: 'bg-emerald-950/90 text-emerald-50 border-emerald-900/70',
    cardBgClass: 'bg-zinc-900/95 text-emerald-50',
    cardHeaderBgClass: 'bg-emerald-950/70 text-emerald-50 border-emerald-900/60',
    textPrimaryClass: 'text-emerald-50',
    textSecondaryClass: 'text-emerald-300/70',
    borderClass: 'border-emerald-900/60',
    inputBgClass: 'bg-zinc-950/90',
    inputBorderClass: 'border-emerald-800/60 focus:border-emerald-400',
    inputTextClass: 'text-emerald-50 placeholder:text-emerald-600',
    previewBgClass: 'bg-zinc-950',
    previewCanvasPattern: 'radial-gradient(circle, #064e3b 1px, transparent 1px)',
    accentBadgeClass: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/60',
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    iconName: 'Flame',
    badgeBg: 'bg-amber-900/80 text-amber-200 border-amber-700',
    description: 'Warm, cozy dark editorial aesthetic',
    appBgClass: 'bg-stone-950 text-stone-100 dark',
    headerBgClass: 'bg-stone-900/95 text-stone-100 border-stone-800',
    cardBgClass: 'bg-stone-900/90 text-stone-100',
    cardHeaderBgClass: 'bg-stone-800/80 text-stone-100 border-stone-700',
    textPrimaryClass: 'text-stone-100',
    textSecondaryClass: 'text-stone-400',
    borderClass: 'border-stone-800',
    inputBgClass: 'bg-stone-950/80',
    inputBorderClass: 'border-amber-900/60 focus:border-amber-500',
    inputTextClass: 'text-stone-100 placeholder:text-stone-500',
    previewBgClass: 'bg-stone-950',
    previewCanvasPattern: 'radial-gradient(circle, #44403c 1px, transparent 1px)',
    accentBadgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
];

export interface AtsFont {
  id: string;
  name: string;
  category: 'Serif (Academic)' | 'LaTeX Standard' | 'Sans-Serif (Modern)';
  family: string;
  description: string;
  previewSample: string;
}

export const ATS_FONTS: AtsFont[] = [
  {
    id: 'georgia',
    name: 'Georgia',
    category: 'Serif (Academic)',
    family: "'Georgia', 'Times New Roman', 'CMU Serif', serif",
    description: 'Classic serif with exceptional legibility and traditional academic prestige.',
    previewSample: 'SGSITS Academic CV • Georgia Serif',
  },
  {
    id: 'latin-modern',
    name: 'Computer Modern (LaTeX)',
    category: 'LaTeX Standard',
    family: "'Latin Modern Roman', 'CMU Serif', 'Computer Modern', 'Times New Roman', serif",
    description: 'The golden standard LaTeX font for IEEE, ACM, and top research publications.',
    previewSample: 'SGSITS Academic CV • Computer Modern',
  },
  {
    id: 'times',
    name: 'Times New Roman',
    category: 'Serif (Academic)',
    family: "'Times New Roman', 'Times', 'Georgia', serif",
    description: 'Universal standard serif font required by traditional university formats.',
    previewSample: 'SGSITS Academic CV • Times New Roman',
  },
  {
    id: 'garamond',
    name: 'Garamond',
    category: 'Serif (Academic)',
    family: "'EB Garamond', 'Garamond', 'Baskerville', 'Times New Roman', serif",
    description: 'Refined, space-saving serif with elegant proportion and high print quality.',
    previewSample: 'SGSITS Academic CV • EB Garamond',
  },
  {
    id: 'cambria',
    name: 'Cambria',
    category: 'Serif (Academic)',
    family: "'Cambria', 'Georgia', 'Times New Roman', serif",
    description: 'Modern serif engineered for screen clarity and precise character spacing.',
    previewSample: 'SGSITS Academic CV • Cambria',
  },
  {
    id: 'arial',
    name: 'Arial',
    category: 'Sans-Serif (Modern)',
    family: "'Arial', 'Helvetica', sans-serif",
    description: 'Clean, highly readable universal sans-serif with 100% ATS parser compatibility.',
    previewSample: 'SGSITS Academic CV • Arial Sans',
  },
  {
    id: 'calibri',
    name: 'Calibri',
    category: 'Sans-Serif (Modern)',
    family: "'Calibri', 'Candara', 'Segoe UI', sans-serif",
    description: 'Modern corporate standard sans-serif font used by Microsoft Office.',
    previewSample: 'SGSITS Academic CV • Calibri',
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    category: 'Sans-Serif (Modern)',
    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    description: 'Crisp, timeless Swiss sans-serif with clean geometric letterforms.',
    previewSample: 'SGSITS Academic CV • Helvetica',
  },
  {
    id: 'trebuchet',
    name: 'Trebuchet MS',
    category: 'Sans-Serif (Modern)',
    family: "'Trebuchet MS', 'Lucida Sans', sans-serif",
    description: 'Open sans-serif font designed for distinct character readability.',
    previewSample: 'SGSITS Academic CV • Trebuchet MS',
  },
  {
    id: 'roboto',
    name: 'Roboto / Inter',
    category: 'Sans-Serif (Modern)',
    family: "'Roboto', 'Inter', 'Segoe UI', sans-serif",
    description: 'Tech-industry favorite modern sans-serif font for software engineers.',
    previewSample: 'SGSITS Academic CV • Roboto / Inter',
  },
];
