import React, { useState } from 'react';
import { Sparkles, Check, Loader2, Bot, Target } from 'lucide-react';
import { CvData } from '../types';

interface AiEnhancerModalProps {
  initialBullet?: string;
  resumeData: CvData;
  onApplyBullet?: (bullet: string) => void;
  onClose: () => void;
}

export const AiEnhancerModal: React.FC<AiEnhancerModalProps> = ({
  initialBullet = '',
  resumeData,
  onApplyBullet,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'bullet' | 'tailor'>('bullet');
  const [bulletText, setBulletText] = useState(initialBullet);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [tailorResult, setTailorResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhance Bullet Handler
  const handleEnhanceBullet = async () => {
    if (!bulletText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText,
          sectionType: 'Technical Projects & Achievements',
          context: resumeData.header.department,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate bullet enhancements.');
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message || 'Error communicating with Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  // Tailor Resume Handler
  const handleTailorResume = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeSummary: {
            name: resumeData.header.name,
            department: resumeData.header.department,
            college: resumeData.header.college,
            skills: resumeData.skills,
            projects: resumeData.projects.map((p) => ({ title: p.title, stack: p.techStack })),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze job description.');
      setTailorResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Error generating tailoring advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-xs flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Gemini AI Resume Assistant</h3>
              <p className="text-[11px] text-slate-300">Action-oriented bullet rewriting & job matching</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-base px-2">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('bullet')}
            className={`pb-2.5 px-3 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'bullet'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Bullet Enhancer
          </button>
          <button
            onClick={() => setActiveTab('tailor')}
            className={`pb-2.5 px-3 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'tailor'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Job Description Tailor
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* TAB 1: Bullet Enhancer */}
          {activeTab === 'bullet' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Original Bullet Point / Text</label>
                <textarea
                  value={bulletText}
                  onChange={(e) => setBulletText(e.target.value)}
                  rows={3}
                  placeholder="Paste or type the bullet point you want to improve..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={handleEnhanceBullet}
                disabled={loading || !bulletText.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                Generate 3 Action-Oriented Variations
              </button>

              {suggestions.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] text-purple-700">AI Suggested Variations</h4>
                  {suggestions.map((sug, i) => (
                    <div key={i} className="p-3 bg-purple-50/50 border border-purple-200 rounded-lg flex items-start justify-between gap-3 group">
                      <p className="text-slate-800 leading-relaxed text-xs">{sug}</p>
                      {onApplyBullet && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyBullet(sug);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold shrink-0 text-[11px] flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3 h-3" /> Apply
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Job Description Tailor */}
          {activeTab === 'tailor' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Job Description / Industry Posting</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  placeholder="Paste the target job requirements or internship description here..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={handleTailorResume}
                disabled={loading || !jobDescription.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4 text-amber-300" />}
                Analyze Resume Match & Keywords
              </button>

              {tailorResult && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-900">Estimated Match Score</span>
                    <span className="text-lg font-black text-emerald-700">{tailorResult.matchScore || 85}%</span>
                  </div>

                  {tailorResult.missingKeywords && (
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Recommended Missing Keywords:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {tailorResult.missingKeywords.map((kw: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-medium text-[11px]">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {tailorResult.recommendedActionItems && (
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Action Items:</span>
                      <ul className="list-disc ml-4 space-y-1 text-slate-700">
                        {tailorResult.recommendedActionItems.map((act: string, i: number) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
