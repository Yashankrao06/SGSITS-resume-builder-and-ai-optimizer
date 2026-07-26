import React, { useState } from 'react';
import { CvData, CvMode } from '../types';
import {
  User,
  GraduationCap,
  Award,
  Briefcase,
  FolderOpen,
  Wrench,
  BookOpen,
  Heart,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  Link,
  Edit3,
} from 'lucide-react';

interface FormEditorProps {
  data: CvData;
  onChange: (updated: CvData) => void;
  type: CvMode;
  onEnhanceBullet?: (text: string, callback: (enhanced: string) => void) => void;
}

const SectionHeader: React.FC<{
  icon: React.ElementType;
  title: string;
  onClear?: () => void;
}> = ({ icon: Icon, title, onClear }) => (
  <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
    </div>
    {onClear && (
      <button
        type="button"
        className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors px-2 py-1 rounded hover:bg-destructive/10"
        onClick={() => {
          if (window.confirm(`Are you sure you want to clear the ${title} section?`)) {
            onClear();
          }
        }}
      >
        <Trash2 className="w-3.5 h-3.5" /> Clear
      </button>
    )}
  </div>
);

export const FormEditor: React.FC<FormEditorProps> = ({
  data,
  onChange,
  type,
  onEnhanceBullet,
}) => {
  const [showSectionTitlesEditor, setShowSectionTitlesEditor] = useState(false);

  const updateHeader = (field: keyof CvData['header'], value: any) => {
    onChange({
      ...data,
      header: { ...data.header, [field]: value },
    });
  };

  const updateSectionTitle = (key: keyof CvData['sectionTitles'], value: string) => {
    onChange({
      ...data,
      sectionTitles: { ...data.sectionTitles, [key]: value },
    });
  };

  const updateEducationHeader = (key: keyof CvData['educationHeaders'], value: string) => {
    onChange({
      ...data,
      educationHeaders: { ...data.educationHeaders, [key]: value },
    });
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 pb-24 bg-muted/30">
      
      {/* SECTION TITLES & COLUMN HEADERS CUSTOMIZER TOGGLE */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <button
          type="button"
          onClick={() => setShowSectionTitlesEditor(!showSectionTitlesEditor)}
          className="w-full flex items-center justify-between font-semibold text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Customize Section Titles & Table Column Headers
          </span>
          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded font-mono">
            {showSectionTitlesEditor ? 'Close ▲' : 'Edit Headings ▼'}
          </span>
        </button>

        {showSectionTitlesEditor && (
          <div className="mt-4 pt-4 border-t border-border space-y-4 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-primary" /> Section Headings Customization
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1">Education Title</label>
                  <input
                    type="text"
                    value={data.sectionTitles.education}
                    onChange={(e) => updateSectionTitle('education', e.target.value)}
                    className="w-full p-2 border border-input rounded bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Achievements Title</label>
                  <input
                    type="text"
                    value={data.sectionTitles.achievements}
                    onChange={(e) => updateSectionTitle('achievements', e.target.value)}
                    className="w-full p-2 border border-input rounded bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Work Experience Title</label>
                  <input
                    type="text"
                    value={data.sectionTitles.experience}
                    onChange={(e) => updateSectionTitle('experience', e.target.value)}
                    className="w-full p-2 border border-input rounded bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Projects Title</label>
                  <input
                    type="text"
                    value={data.sectionTitles.projects}
                    onChange={(e) => updateSectionTitle('projects', e.target.value)}
                    className="w-full p-2 border border-input rounded bg-background text-foreground"
                  />
                </div>
                {type === '2page' && (
                  <>
                    <div>
                      <label className="block text-muted-foreground mb-1">Academic Projects Heading</label>
                      <input
                        type="text"
                        value={data.sectionTitles.academicProjects}
                        onChange={(e) => updateSectionTitle('academicProjects', e.target.value)}
                        className="w-full p-2 border border-input rounded bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground mb-1">Technical Projects Heading</label>
                      <input
                        type="text"
                        value={data.sectionTitles.technicalProjects}
                        onChange={(e) => updateSectionTitle('technicalProjects', e.target.value)}
                        className="w-full p-2 border border-input rounded bg-background text-foreground"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-muted-foreground mb-1">Skills Title</label>
                  <input
                    type="text"
                    value={data.sectionTitles.skills}
                    onChange={(e) => updateSectionTitle('skills', e.target.value)}
                    className="w-full p-2 border border-input rounded bg-background text-foreground"
                  />
                </div>
                {type === '2page' && (
                  <div>
                    <label className="block text-muted-foreground mb-1">Courses Title</label>
                    <input
                      type="text"
                      value={data.sectionTitles.courses}
                      onChange={(e) => updateSectionTitle('courses', e.target.value)}
                      className="w-full p-2 border border-input rounded bg-background text-foreground"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-muted-foreground mb-1">Positions Title</label>
                  <input
                    type="text"
                    value={data.sectionTitles.positions}
                    onChange={(e) => updateSectionTitle('positions', e.target.value)}
                    className="w-full p-2 border border-input rounded bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Extracurricular Title</label>
                  <input
                    type="text"
                    value={data.sectionTitles.extracurricular}
                    onChange={(e) => updateSectionTitle('extracurricular', e.target.value)}
                    className="w-full p-2 border border-input rounded bg-background text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-border">
              <h4 className="font-bold text-foreground">Education Table Column Headers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-muted-foreground">Col 1 Header</label>
                  <input
                    type="text"
                    value={data.educationHeaders.degree}
                    onChange={(e) => updateEducationHeader('degree', e.target.value)}
                    className="w-full p-1.5 border border-input rounded bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground">Col 2 Header</label>
                  <input
                    type="text"
                    value={data.educationHeaders.university}
                    onChange={(e) => updateEducationHeader('university', e.target.value)}
                    className="w-full p-1.5 border border-input rounded bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground">Col 3 Header</label>
                  <input
                    type="text"
                    value={data.educationHeaders.institute}
                    onChange={(e) => updateEducationHeader('institute', e.target.value)}
                    className="w-full p-1.5 border border-input rounded bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground">Col 4 Header</label>
                  <input
                    type="text"
                    value={data.educationHeaders.year}
                    onChange={(e) => updateEducationHeader('year', e.target.value)}
                    className="w-full p-1.5 border border-input rounded bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground">Col 5 Header</label>
                  <input
                    type="text"
                    value={data.educationHeaders.score}
                    onChange={(e) => updateEducationHeader('score', e.target.value)}
                    className="w-full p-1.5 border border-input rounded bg-background text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HEADER & PERSONAL INFORMATION */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={User} title="Header Information" />
        <div className="mb-4 p-2.5 bg-muted/60 border border-border rounded-lg text-xs flex items-center justify-between">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> Permanent College Logo:
          </span>
          <span className="text-muted-foreground font-medium">SGSITS Official Seal (Fixed)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Full Name</label>
            <input
              type="text"
              value={data.header.name}
              onChange={(e) => updateHeader('name', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">UG Year / Status</label>
            <input
              type="text"
              value={data.header.ugYear}
              onChange={(e) => updateHeader('ugYear', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">College / University</label>
            <input
              type="text"
              value={data.header.college}
              onChange={(e) => updateHeader('college', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Date of Birth</label>
            <input
              type="text"
              value={data.header.dob}
              onChange={(e) => updateHeader('dob', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Email Address</label>
            <input
              type="text"
              value={data.header.email}
              onChange={(e) => updateHeader('email', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Enrollment / Roll No.</label>
            <input
              type="text"
              value={data.header.enrollmentNo}
              onChange={(e) => updateHeader('enrollmentNo', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Department</label>
            <input
              type="text"
              value={data.header.department}
              onChange={(e) => updateHeader('department', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Gender</label>
            <input
              type="text"
              value={data.header.gender}
              onChange={(e) => updateHeader('gender', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Specialization</label>
            <input
              type="text"
              value={data.header.specialization}
              onChange={(e) => updateHeader('specialization', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Mobile Number</label>
            <input
              type="text"
              value={data.header.mobile}
              onChange={(e) => updateHeader('mobile', e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
            />
          </div>
        </div>
      </section>

      {/* EDUCATION / ACADEMIC DETAILS */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SectionHeader
          icon={GraduationCap}
          title={data.sectionTitles.education || 'Academic Details'}
          onClear={() => onChange({ ...data, education: [] })}
        />
        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={edu.id} className="p-4 rounded-xl bg-background border border-border/60 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end text-xs">
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                    {data.educationHeaders.degree}
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...data.education];
                      updated[idx] = { ...edu, degree: e.target.value };
                      onChange({ ...data, education: updated });
                    }}
                    className="w-full p-2 border border-input rounded bg-background"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                    {data.educationHeaders.university}
                  </label>
                  <input
                    type="text"
                    value={edu.university}
                    onChange={(e) => {
                      const updated = [...data.education];
                      updated[idx] = { ...edu, university: e.target.value };
                      onChange({ ...data, education: updated });
                    }}
                    className="w-full p-2 border border-input rounded bg-background"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                    {data.educationHeaders.institute}
                  </label>
                  <input
                    type="text"
                    value={edu.institute}
                    onChange={(e) => {
                      const updated = [...data.education];
                      updated[idx] = { ...edu, institute: e.target.value };
                      onChange({ ...data, education: updated });
                    }}
                    className="w-full p-2 border border-input rounded bg-background"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                    {data.educationHeaders.year}
                  </label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => {
                      const updated = [...data.education];
                      updated[idx] = { ...edu, year: e.target.value };
                      onChange({ ...data, education: updated });
                    }}
                    className="w-full p-2 border border-input rounded bg-background"
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                      {data.educationHeaders.score}
                    </label>
                    <input
                      type="text"
                      value={edu.score}
                      onChange={(e) => {
                        const updated = [...data.education];
                        updated[idx] = { ...edu, score: e.target.value };
                        onChange({ ...data, education: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background font-bold"
                    />
                  </div>
                  {data.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...data,
                          education: data.education.filter((_, i) => i !== idx),
                        })
                      }
                      className="p-2 text-muted-foreground hover:text-destructive rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                education: [
                  ...data.education,
                  {
                    id: `edu_${Date.now()}`,
                    degree: 'New Certificate',
                    university: 'Board / University',
                    institute: 'Institute Name',
                    year: '2026',
                    score: '8.5',
                  },
                ],
              })
            }
            className="w-full py-2 border border-dashed border-border hover:border-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Education Row
          </button>
        </div>
      </section>

      {/* SCHOLASTIC ACHIEVEMENTS */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SectionHeader
          icon={Award}
          title={data.sectionTitles.achievements || 'Scholastic Achievements'}
          onClear={() => onChange({ ...data, achievements: [] })}
        />
        <div className="space-y-3">
          {data.achievements.map((ach, idx) => (
            <div key={idx} className="flex gap-2 items-start text-xs">
              <input
                type="text"
                value={ach}
                onChange={(e) => {
                  const updated = [...data.achievements];
                  updated[idx] = e.target.value;
                  onChange({ ...data, achievements: updated });
                }}
                className="flex-1 p-2 border border-input rounded bg-background"
              />
              {onEnhanceBullet && (
                <button
                  type="button"
                  onClick={() =>
                    onEnhanceBullet(ach, (enhanced) => {
                      const updated = [...data.achievements];
                      updated[idx] = enhanced;
                      onChange({ ...data, achievements: updated });
                    })
                  }
                  className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded shrink-0"
                  title="AI Polish"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
              {data.achievements.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      achievements: data.achievements.filter((_, i) => i !== idx),
                    })
                  }
                  className="p-2 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => onChange({ ...data, achievements: [...data.achievements, ''] })}
            className="w-full py-2 border border-dashed border-border hover:border-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Achievement Bullet
          </button>
        </div>
      </section>

      {/* WORK EXPERIENCE */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SectionHeader
          icon={Briefcase}
          title={data.sectionTitles.experience || 'Work Experience'}
          onClear={() => onChange({ ...data, experience: [] })}
        />
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={exp.id} className="p-4 rounded-xl bg-background border border-border/60 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Company Name</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx] = { ...exp, company: e.target.value };
                        onChange({ ...data, experience: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Role / Designation</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx] = { ...exp, role: e.target.value };
                        onChange({ ...data, experience: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx] = { ...exp, duration: e.target.value };
                        onChange({ ...data, experience: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background"
                    />
                  </div>
                </div>
                {data.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...data,
                        experience: data.experience.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                  Bullet Points (One per line)
                </label>
                <textarea
                  value={exp.points.join('\n')}
                  rows={3}
                  onChange={(e) => {
                    const updated = [...data.experience];
                    updated[idx] = { ...exp, points: e.target.value.split('\n') };
                    onChange({ ...data, experience: updated });
                  }}
                  className="w-full p-2 border border-input rounded bg-background text-xs"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                experience: [
                  ...data.experience,
                  {
                    id: `exp_${Date.now()}`,
                    company: '',
                    role: '',
                    duration: '',
                    points: [''],
                  },
                ],
              })
            }
            className="w-full py-2 border border-dashed border-border hover:border-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Experience Entry
          </button>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SectionHeader
          icon={FolderOpen}
          title={data.sectionTitles.projects || 'Projects'}
          onClear={() => onChange({ ...data, projects: [] })}
        />
        <div className="space-y-5">
          {data.projects.map((proj, idx) => (
            <div key={proj.id} className="p-4 rounded-xl bg-background border border-border/60 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx] = { ...proj, title: e.target.value };
                        onChange({ ...data, projects: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Date / Duration</label>
                    <input
                      type="text"
                      value={proj.date}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx] = { ...proj, date: e.target.value };
                        onChange({ ...data, projects: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background"
                    />
                  </div>
                </div>
                {data.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...data,
                        projects: data.projects.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {type === '2page' && (
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block">Project Classification</label>
                  <select
                    value={proj.type}
                    onChange={(e) => {
                      const updated = [...data.projects];
                      updated[idx] = { ...proj, type: e.target.value as any };
                      onChange({ ...data, projects: updated });
                    }}
                    className="w-full p-2 border border-input rounded bg-background text-foreground"
                  >
                    <option value="academic">Academic Project</option>
                    <option value="technical">Technical Project</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block">Tech Stack (Optional)</label>
                <input
                  type="text"
                  value={proj.techStack || ''}
                  placeholder="e.g. React, Node.js, Python, PostgreSQL"
                  onChange={(e) => {
                    const updated = [...data.projects];
                    updated[idx] = { ...proj, techStack: e.target.value };
                    onChange({ ...data, projects: updated });
                  }}
                  className="w-full p-2 border border-input rounded bg-background"
                />
              </div>

              {/* GitHub Repo Links */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Link className="w-3 h-3 text-primary" /> Repository / URL Links
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...data.projects];
                      const links = updated[idx].githubLinks || [];
                      updated[idx] = {
                        ...proj,
                        githubLinks: [...links, { label: 'GitHub', url: '' }],
                      };
                      onChange({ ...data, projects: updated });
                    }}
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    + Add Link
                  </button>
                </div>

                {proj.githubLinks?.map((link, lIdx) => (
                  <div key={lIdx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Label (e.g. Frontend / Backend)"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        const links = [...(updated[idx].githubLinks || [])];
                        links[lIdx] = { ...links[lIdx], label: e.target.value };
                        updated[idx] = { ...proj, githubLinks: links };
                        onChange({ ...data, projects: updated });
                      }}
                      className="w-1/3 p-1.5 border border-input rounded bg-background"
                    />
                    <input
                      type="text"
                      placeholder="URL (https://github.com/...)"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        const links = [...(updated[idx].githubLinks || [])];
                        links[lIdx] = { ...links[lIdx], url: e.target.value };
                        updated[idx] = { ...proj, githubLinks: links };
                        onChange({ ...data, projects: updated });
                      }}
                      className="flex-1 p-1.5 border border-input rounded bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.projects];
                        const links = (updated[idx].githubLinks || []).filter((_, i) => i !== lIdx);
                        updated[idx] = { ...proj, githubLinks: links };
                        onChange({ ...data, projects: updated });
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                  Bullet Points (One per line)
                </label>
                <textarea
                  value={proj.points.join('\n')}
                  rows={3}
                  onChange={(e) => {
                    const updated = [...data.projects];
                    updated[idx] = { ...proj, points: e.target.value.split('\n') };
                    onChange({ ...data, projects: updated });
                  }}
                  className="w-full p-2 border border-input rounded bg-background text-xs"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                projects: [
                  ...data.projects,
                  {
                    id: `proj_${Date.now()}`,
                    title: '',
                    date: '',
                    points: [''],
                    type: 'technical',
                    techStack: '',
                    githubLinks: [{ label: '', url: '' }],
                  },
                ],
              })
            }
            className="w-full py-2 border border-dashed border-border hover:border-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>
      </section>

      {/* SKILLS & PLATFORMS */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SectionHeader
          icon={Wrench}
          title={data.sectionTitles.skills || 'Skills & Platforms'}
          onClear={() =>
            onChange({
              ...data,
              skills: { os: '', programming: '', web: '', software: '' },
            })
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-muted-foreground font-medium">Category 1 Label</label>
              <input
                type="text"
                value={data.skills.osLabel || 'Operating Systems'}
                onChange={(e) =>
                  onChange({
                    ...data,
                    skills: { ...data.skills, osLabel: e.target.value },
                  })
                }
                className="text-right text-[11px] font-bold text-primary bg-transparent focus:underline border-none"
              />
            </div>
            <input
              type="text"
              value={data.skills.os}
              onChange={(e) =>
                onChange({
                  ...data,
                  skills: { ...data.skills, os: e.target.value },
                })
              }
              className="w-full p-2 border border-input rounded bg-background"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-muted-foreground font-medium">Category 2 Label</label>
              <input
                type="text"
                value={data.skills.programmingLabel || 'Programming Skills'}
                onChange={(e) =>
                  onChange({
                    ...data,
                    skills: { ...data.skills, programmingLabel: e.target.value },
                  })
                }
                className="text-right text-[11px] font-bold text-primary bg-transparent focus:underline border-none"
              />
            </div>
            <input
              type="text"
              value={data.skills.programming}
              onChange={(e) =>
                onChange({
                  ...data,
                  skills: { ...data.skills, programming: e.target.value },
                })
              }
              className="w-full p-2 border border-input rounded bg-background"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-muted-foreground font-medium">Category 3 Label</label>
              <input
                type="text"
                value={data.skills.webLabel || (type === '2page' ? 'Web Technologies' : 'Web Designing')}
                onChange={(e) =>
                  onChange({
                    ...data,
                    skills: { ...data.skills, webLabel: e.target.value },
                  })
                }
                className="text-right text-[11px] font-bold text-primary bg-transparent focus:underline border-none"
              />
            </div>
            <input
              type="text"
              value={data.skills.web}
              onChange={(e) =>
                onChange({
                  ...data,
                  skills: { ...data.skills, web: e.target.value },
                })
              }
              className="w-full p-2 border border-input rounded bg-background"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-muted-foreground font-medium">Category 4 Label</label>
              <input
                type="text"
                value={data.skills.softwareLabel || (type === '2page' ? 'Tools' : 'Software Skills')}
                onChange={(e) =>
                  onChange({
                    ...data,
                    skills: { ...data.skills, softwareLabel: e.target.value },
                  })
                }
                className="text-right text-[11px] font-bold text-primary bg-transparent focus:underline border-none"
              />
            </div>
            <input
              type="text"
              value={data.skills.software}
              onChange={(e) =>
                onChange({
                  ...data,
                  skills: { ...data.skills, software: e.target.value },
                })
              }
              className="w-full p-2 border border-input rounded bg-background"
            />
          </div>
        </div>
      </section>

      {/* COURSES UNDERTACEN (2-PAGE MODE) */}
      {type === '2page' && (
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <SectionHeader
            icon={BookOpen}
            title={data.sectionTitles.courses || 'Courses Undertaken'}
            onClear={() => onChange({ ...data, coreCourses: [], breadthCourses: [] })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                Core Courses (One per line)
              </label>
              <textarea
                value={data.coreCourses.join('\n')}
                rows={5}
                onChange={(e) =>
                  onChange({
                    ...data,
                    coreCourses: e.target.value.split('\n'),
                  })
                }
                className="w-full p-2.5 border border-input rounded bg-background"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                Breadth / Elective Courses (One per line)
              </label>
              <textarea
                value={data.breadthCourses.join('\n')}
                rows={5}
                onChange={(e) =>
                  onChange({
                    ...data,
                    breadthCourses: e.target.value.split('\n'),
                  })
                }
                className="w-full p-2.5 border border-input rounded bg-background"
              />
            </div>
          </div>
        </section>
      )}

      {/* POSITIONS OF RESPONSIBILITY */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SectionHeader
          icon={Award}
          title={data.sectionTitles.positions || 'Positions of Responsibility'}
          onClear={() => onChange({ ...data, positions: [] })}
        />
        <div className="space-y-4">
          {data.positions.map((pos, idx) => (
            <div key={pos.id} className="p-4 rounded-xl bg-background border border-border/60 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Title / Position</label>
                    <input
                      type="text"
                      value={pos.title}
                      onChange={(e) => {
                        const updated = [...data.positions];
                        updated[idx] = { ...pos, title: e.target.value };
                        onChange({ ...data, positions: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Duration</label>
                    <input
                      type="text"
                      value={pos.duration}
                      onChange={(e) => {
                        const updated = [...data.positions];
                        updated[idx] = { ...pos, duration: e.target.value };
                        onChange({ ...data, positions: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background"
                    />
                  </div>
                </div>
                {data.positions.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...data,
                        positions: data.positions.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                  Bullet Points (One per line)
                </label>
                <textarea
                  value={pos.points.join('\n')}
                  rows={2}
                  onChange={(e) => {
                    const updated = [...data.positions];
                    updated[idx] = { ...pos, points: e.target.value.split('\n') };
                    onChange({ ...data, positions: updated });
                  }}
                  className="w-full p-2 border border-input rounded bg-background text-xs"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                positions: [
                  ...data.positions,
                  {
                    id: `pos_${Date.now()}`,
                    title: '',
                    duration: '',
                    points: [''],
                  },
                ],
              })
            }
            className="w-full py-2 border border-dashed border-border hover:border-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Position
          </button>
        </div>
      </section>

      {/* EXTRACURRICULAR ACTIVITIES */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SectionHeader
          icon={Heart}
          title={data.sectionTitles.extracurricular || 'Extracurricular Activities'}
          onClear={() => onChange({ ...data, extracurricular: [] })}
        />
        <div className="space-y-4">
          {data.extracurricular.map((extra, idx) => (
            <div key={extra.id} className="p-4 rounded-xl bg-background border border-border/60 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Activity Name</label>
                    <input
                      type="text"
                      value={extra.title}
                      onChange={(e) => {
                        const updated = [...data.extracurricular];
                        updated[idx] = { ...extra, title: e.target.value };
                        onChange({ ...data, extracurricular: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Duration</label>
                    <input
                      type="text"
                      value={extra.duration}
                      onChange={(e) => {
                        const updated = [...data.extracurricular];
                        updated[idx] = { ...extra, duration: e.target.value };
                        onChange({ ...data, extracurricular: updated });
                      }}
                      className="w-full p-2 border border-input rounded bg-background"
                    />
                  </div>
                </div>
                {data.extracurricular.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...data,
                        extracurricular: data.extracurricular.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block font-medium">
                  Bullet Points (One per line)
                </label>
                <textarea
                  value={extra.points.join('\n')}
                  rows={2}
                  onChange={(e) => {
                    const updated = [...data.extracurricular];
                    updated[idx] = { ...extra, points: e.target.value.split('\n') };
                    onChange({ ...data, extracurricular: updated });
                  }}
                  className="w-full p-2 border border-input rounded bg-background text-xs"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                extracurricular: [
                  ...data.extracurricular,
                  {
                    id: `extra_${Date.now()}`,
                    title: '',
                    duration: '',
                    points: [''],
                  },
                ],
              })
            }
            className="w-full py-2 border border-dashed border-border hover:border-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Activity
          </button>
        </div>
      </section>

    </div>
  );
};
