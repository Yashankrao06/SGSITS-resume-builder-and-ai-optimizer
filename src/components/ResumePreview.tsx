import React, { forwardRef } from 'react';
import { CvData, CvMode } from '../types';

interface ResumePreviewProps {
  data: CvData;
  type: CvMode;
  printRef?: React.RefObject<HTMLDivElement | null>;
  onSectionClick?: (sectionKey: string) => void;
}

export const SectionHeading: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick,
}) => (
  <div
    style={{ marginTop: '9pt', marginBottom: '3pt', cursor: onClick ? 'pointer' : 'default' }}
    onClick={onClick}
  >
    <div
      style={{
        fontSize: '11.5pt',
        fontWeight: 700,
        letterSpacing: '0.4pt',
        paddingBottom: '2pt',
        borderBottom: '1pt solid #000',
        color: '#000',
        lineHeight: 1.25,
      }}
    >
      {children}
    </div>
  </div>
);

export const BulletList: React.FC<{ items: string[] }> = ({ items }) => {
  const validItems = items.filter(Boolean);
  if (!validItems.length) return null;
  return (
    <ul
      style={{
        margin: '1.5pt 0 0 0',
        paddingLeft: '16pt',
        listStyleType: 'disc',
        color: '#000',
      }}
    >
      {validItems.map((pt, idx) => (
        <li key={idx} style={{ marginBottom: '0.5pt', lineHeight: 1.3, color: '#000' }}>
          {pt}
        </li>
      ))}
    </ul>
  );
};

export const CvPage = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; pageNumber?: number; totalPages?: number; breakAfter?: boolean; isOnePage?: boolean }
>(({ children, pageNumber, totalPages, breakAfter = false, isOnePage = false }, ref) => (
  <div
    ref={ref}
    className={`cv-page ${breakAfter ? 'cv-page-break' : ''}`}
    style={{
      width: '210mm',
      height: '297mm',
      overflow: 'hidden',
      padding: isOnePage ? '0.45in 0.55in' : '0.5in 0.6in',
      backgroundColor: '#fff',
      color: '#000',
      fontFamily: "'Georgia', 'Times New Roman', 'CMU Serif', serif",
      fontSize: '9.5pt',
      lineHeight: 1.3,
      position: 'relative',
      boxShadow: '0 2px 12px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
      boxSizing: 'border-box',
    }}
  >
    {children}
    {pageNumber && totalPages && (
      <div
        style={{
          position: 'absolute',
          bottom: '0.35in',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '8.5pt',
          color: '#000',
          fontWeight: 600,
        }}
      >
        Page {pageNumber} of {totalPages}
      </div>
    )}
  </div>
));

CvPage.displayName = 'CvPage';

export const HeaderView: React.FC<{ data: CvData['header']; onClick?: () => void }> = ({
  data,
  onClick,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '6pt',
      marginLeft: '-6pt',
      cursor: onClick ? 'pointer' : 'default',
    }}
    onClick={onClick}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', marginRight: '12pt', shrink: 0 }}>
      <img
        src="https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png"
        alt="SGSITS Official Seal"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/sgsits_official_logo.png';
        }}
        style={{
          height: '3.1cm',
          width: 'auto',
          objectFit: 'contain',
          marginTop: '-4pt',
        }}
      />
    </div>
    <div style={{ width: '45%', lineHeight: 1.25, color: '#000' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, marginBottom: '2pt', color: '#000' }}>
        {data.name}
      </div>
      <div style={{ fontWeight: 700, color: '#000' }}>{data.ugYear}</div>
      <div style={{ fontWeight: 700, color: '#000' }}>{data.college}</div>
      <div style={{ fontWeight: 700, color: '#000' }}>D.O.B.: {data.dob}</div>
      <div style={{ fontWeight: 700, color: '#000' }}>
        Email:{' '}
        <span style={{ color: '#000000', textDecoration: 'underline' }}>{data.email}</span>
      </div>
    </div>
    <div style={{ width: '45%', marginLeft: 'auto', lineHeight: 1.25, color: '#000' }}>
      <div style={{ fontWeight: 700, color: '#000' }}>Enrollment No.: {data.enrollmentNo}</div>
      <div style={{ fontWeight: 700, color: '#000' }}>Department : {data.department}</div>
      <div style={{ fontWeight: 700, color: '#000' }}>Gender : {data.gender}</div>
      <div style={{ fontWeight: 700, color: '#000' }}>Specialization : {data.specialization}</div>
      <div style={{ fontWeight: 700, color: '#000' }}>Mobile # : {data.mobile}</div>
    </div>
  </div>
);

export const EducationTable: React.FC<{
  education: CvData['education'];
  headers?: CvData['educationHeaders'];
}> = ({ education = [], headers }) => (
  <div>
    <div
      style={{
        display: 'flex',
        fontWeight: 700,
        fontSize: '9pt',
        color: '#000',
        borderBottom: '0.5pt solid #000',
        paddingBottom: '2.5pt',
        marginBottom: '2.5pt',
      }}
    >
      <div style={{ width: '18%' }}>{headers?.degree || 'Degree / Certificate'}</div>
      <div style={{ width: '20%' }}>{headers?.university || 'University / Board'}</div>
      <div style={{ width: '28%' }}>{headers?.institute || 'Institute / School'}</div>
      <div style={{ width: '16%' }}>{headers?.year || 'Year of Passing'}</div>
      <div style={{ width: '18%', textAlign: 'right' }}>
        {headers?.score || 'CGPA / Percentage'}
      </div>
    </div>
    {education.map((item) => (
      <div key={item.id}>
        <div
          style={{
            display: 'flex',
            fontSize: '9pt',
            color: '#000',
            paddingTop: '1.5pt',
            paddingBottom: '1.5pt',
            borderBottom: '0.5pt solid #888',
          }}
        >
          <div style={{ width: '18%', fontWeight: 600 }}>{item.degree}</div>
          <div style={{ width: '20%' }}>{item.university}</div>
          <div style={{ width: '28%' }}>{item.institute}</div>
          <div style={{ width: '16%' }}>{item.year}</div>
          <div style={{ width: '18%', textAlign: 'right', fontWeight: 700 }}>
            {item.score}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ExperienceList: React.FC<{ entries: CvData['experience'] }> = ({ entries }) => (
  <>
    {entries
      .filter((e) => e.company)
      .map((item) => (
        <div key={item.id} style={{ marginBottom: '4pt', color: '#000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#000' }}>
            <span style={{ fontWeight: 700 }}>{item.company}</span>
            <span style={{ fontWeight: 600 }}>{item.duration}</span>
          </div>
          {item.role && (
            <div style={{ fontStyle: 'italic', fontSize: '9pt', color: '#000' }}>{item.role}</div>
          )}
          <BulletList items={item.points} />
        </div>
      ))}
  </>
);

export const ProjectsList: React.FC<{
  projects: CvData['projects'];
  filterType?: 'academic' | 'technical';
}> = ({ projects, filterType }) => {
  const filtered = filterType
    ? projects.filter((p) => p.type === filterType)
    : projects;

  return (
    <>
      {filtered
        .filter((p) => p.title)
        .map((p) => {
          const links = p.githubLinks?.filter((g) => g.url) ?? [];
          return (
            <div key={p.id} style={{ marginBottom: '4pt', color: '#000' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  color: '#000',
                }}
              >
                <span>
                  <span style={{ fontWeight: 700 }}>{p.title}</span>
                  {p.techStack && (
                    <span style={{ fontSize: '8.5pt', fontStyle: 'italic' }}>
                      {' '}
                      | {p.techStack}
                    </span>
                  )}
                  {links.length > 0 && (
                    <span style={{ fontSize: '8.5pt' }}>
                      {' | '}
                      {links.map((link, idx, arr) => (
                        <span key={idx}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#000000', textDecoration: 'underline' }}
                          >
                            {link.label || 'GitHub'}
                          </a>
                          {idx !== arr.length - 1 && ' | '}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <span style={{ fontWeight: 600 }}>{p.date}</span>
              </div>
              <BulletList items={p.points} />
            </div>
          );
        })}
    </>
  );
};

export const SimpleEntriesList: React.FC<{ entries: CvData['positions'] }> = ({ entries }) => (
  <>
    {entries
      .filter((e) => e.title)
      .map((item) => (
        <div key={item.id} style={{ marginBottom: '4pt', color: '#000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#000' }}>
            <span style={{ fontWeight: 700 }}>{item.title}</span>
            <span style={{ fontWeight: 600 }}>{item.duration}</span>
          </div>
          <BulletList items={item.points} />
        </div>
      ))}
  </>
);

export const SkillsView: React.FC<{ skills: CvData['skills']; type: CvMode }> = ({
  skills,
  type,
}) => (
  <ul
    style={{
      margin: '1.5pt 0 0 0',
      paddingLeft: '16pt',
      listStyleType: 'disc',
      color: '#000',
    }}
  >
    {skills.os && (
      <li style={{ marginBottom: '0.5pt', lineHeight: 1.3, color: '#000', wordBreak: 'break-word' }}>
        <span style={{ fontWeight: 700 }}>
          {skills.osLabel || 'Operating Systems'}
        </span>{' '}
        : {skills.os}
      </li>
    )}
    {skills.programming && (
      <li style={{ marginBottom: '0.5pt', lineHeight: 1.3, color: '#000', wordBreak: 'break-word' }}>
        <span style={{ fontWeight: 700 }}>
          {skills.programmingLabel || 'Programming Skills'}
        </span>{' '}
        : {skills.programming}
      </li>
    )}
    {skills.web && (
      <li style={{ marginBottom: '0.5pt', lineHeight: 1.3, color: '#000', wordBreak: 'break-word' }}>
        <span style={{ fontWeight: 700 }}>
          {skills.webLabel || (type === '2page' ? 'Web Technologies' : 'Web Designing')}
        </span>{' '}
        : {skills.web}
      </li>
    )}
    {skills.software && (
      <li style={{ marginBottom: '0.5pt', lineHeight: 1.3, color: '#000', wordBreak: 'break-word' }}>
        <span style={{ fontWeight: 700 }}>
          {skills.softwareLabel || (type === '2page' ? 'Tools' : 'Software Skills')}
        </span>{' '}
        : {skills.software}
      </li>
    )}
  </ul>
);

export const CoursesView: React.FC<{ core: string[]; breadth: string[] }> = ({
  core,
  breadth,
}) => (
  <div style={{ display: 'flex', gap: '12pt', color: '#000' }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, marginBottom: '2pt', paddingLeft: '16pt' }}>
        Core
      </div>
      <BulletList items={core} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, marginBottom: '2pt', paddingLeft: '16pt' }}>
        Breadth
      </div>
      <BulletList items={breadth} />
    </div>
  </div>
);

// One Page Layout
export const OnePageCv: React.FC<{ data: CvData; onSectionClick?: (key: string) => void }> = ({
  data,
  onSectionClick,
}) => {
  const {
    header,
    education = [],
    educationHeaders,
    achievements = [],
    experience = [],
    projects = [],
    skills = { os: '', programming: '', web: '', software: '' },
    positions = [],
    extracurricular = [],
    sectionTitles,
  } = data || {};

  const hasSkills = Boolean(skills?.os || skills?.programming || skills?.web || skills?.software);

  return (
    <CvPage isOnePage={true}>
      <HeaderView data={header} onClick={() => onSectionClick && onSectionClick('header')} />

      {education && education.length > 0 && (
        <>
          <SectionHeading onClick={() => onSectionClick && onSectionClick('education')}>
            {sectionTitles?.education || 'Academic Details'}
          </SectionHeading>
          <EducationTable education={education} headers={educationHeaders} />
        </>
      )}

      {achievements && achievements.filter(Boolean).length > 0 && (
        <>
          <SectionHeading onClick={() => onSectionClick && onSectionClick('achievements')}>
            {sectionTitles?.achievements || 'Scholastic Achievements'}
          </SectionHeading>
          <BulletList items={achievements} />
        </>
      )}

      {experience && experience.length > 0 && (
        <>
          <SectionHeading onClick={() => onSectionClick && onSectionClick('experience')}>
            {sectionTitles?.experience || 'Work Experience'}
          </SectionHeading>
          <ExperienceList entries={experience} />
        </>
      )}

      {projects && projects.length > 0 && (
        <>
          <SectionHeading onClick={() => onSectionClick && onSectionClick('projects')}>
            {sectionTitles?.projects || 'Projects'}
          </SectionHeading>
          <ProjectsList projects={projects} />
        </>
      )}

      {hasSkills && (
        <>
          <SectionHeading onClick={() => onSectionClick && onSectionClick('skills')}>
            {sectionTitles?.skills || 'Platforms Worked'}
          </SectionHeading>
          <SkillsView skills={skills} type="1page" />
        </>
      )}

      {positions && positions.length > 0 && (
        <>
          <SectionHeading onClick={() => onSectionClick && onSectionClick('positions')}>
            {sectionTitles?.positions || 'Positions of Responsibility'}
          </SectionHeading>
          <SimpleEntriesList entries={positions} />
        </>
      )}

      {extracurricular && extracurricular.length > 0 && (
        <>
          <SectionHeading onClick={() => onSectionClick && onSectionClick('extracurricular')}>
            {sectionTitles?.extracurricular || 'Extracurricular Activities'}
          </SectionHeading>
          <SimpleEntriesList entries={extracurricular} />
        </>
      )}
    </CvPage>
  );
};

// Two Page Layout
export const TwoPageCv: React.FC<{ data: CvData; onSectionClick?: (key: string) => void }> = ({
  data,
  onSectionClick,
}) => {
  const {
    header,
    education = [],
    educationHeaders,
    achievements = [],
    experience = [],
    projects = [],
    skills = { os: '', programming: '', web: '', software: '' },
    coreCourses = [],
    breadthCourses = [],
    positions = [],
    extracurricular = [],
    sectionTitles,
  } = data || {};

  const hasSkills = Boolean(skills?.os || skills?.programming || skills?.web || skills?.software);
  const hasAcademicProjects = projects.some((p) => p.type === 'academic');
  const hasTechnicalProjects = projects.some((p) => p.type === 'technical');
  const hasCourses =
    (coreCourses && coreCourses.filter(Boolean).length > 0) ||
    (breadthCourses && breadthCourses.filter(Boolean).length > 0);

  return (
    <div className="cv-pages-wrapper flex flex-col gap-6">
      {/* PAGE 1 */}
      <CvPage pageNumber={1} totalPages={2} breakAfter={true}>
        <HeaderView data={header} onClick={() => onSectionClick && onSectionClick('header')} />

        {education && education.length > 0 && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('education')}>
              {sectionTitles?.education || 'Academic Details'}
            </SectionHeading>
            <EducationTable education={education} headers={educationHeaders} />
          </>
        )}

        {achievements && achievements.filter(Boolean).length > 0 && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('achievements')}>
              {sectionTitles?.achievements || 'Scholastic Achievements'}
            </SectionHeading>
            <BulletList items={achievements} />
          </>
        )}

        {experience && experience.length > 0 && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('experience')}>
              {sectionTitles?.experience || 'Work Experience'}
            </SectionHeading>
            <ExperienceList entries={experience} />
          </>
        )}

        {hasAcademicProjects && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('projects')}>
              {sectionTitles?.academicProjects || 'Academic Projects'}
            </SectionHeading>
            <ProjectsList projects={projects} filterType="academic" />
          </>
        )}

        {hasTechnicalProjects && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('projects')}>
              {sectionTitles?.technicalProjects || 'Technical Projects'}
            </SectionHeading>
            <ProjectsList projects={projects} filterType="technical" />
          </>
        )}
      </CvPage>

      {/* PAGE 2 */}
      <CvPage pageNumber={2} totalPages={2}>
        {hasSkills && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('skills')}>
              {sectionTitles?.skills ||
                'Platforms, Languages, Technologies & Tools Worked'}
            </SectionHeading>
            <SkillsView skills={skills} type="2page" />
          </>
        )}

        {hasCourses && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('courses')}>
              {sectionTitles?.courses || 'Courses Undertaken'}
            </SectionHeading>
            <CoursesView core={coreCourses} breadth={breadthCourses} />
            <div style={{ marginTop: '3pt', fontSize: '8.5pt', fontStyle: 'italic', color: '#000' }}>
              * Courses marked are ongoing in current semester
            </div>
          </>
        )}

        {positions && positions.length > 0 && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('positions')}>
              {sectionTitles?.positions || 'Positions of Responsibility'}
            </SectionHeading>
            <SimpleEntriesList entries={positions} />
          </>
        )}

        {extracurricular && extracurricular.length > 0 && (
          <>
            <SectionHeading onClick={() => onSectionClick && onSectionClick('extracurricular')}>
              {sectionTitles?.extracurricular || 'Extracurricular Activities'}
            </SectionHeading>
            <SimpleEntriesList entries={extracurricular} />
          </>
        )}
      </CvPage>
    </div>
  );
};

// Canvas Wrapper with scale
export const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  type,
  printRef,
  onSectionClick,
}) => {
  const scale = 0.72;

  return (
    <div
      style={{
        background: 'hsl(220 20% 94%)',
        backgroundImage:
          'radial-gradient(circle, hsl(220 15% 78%) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        padding: '28px',
        paddingBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
          marginBottom: `calc((${scale} - 1) * 100%)`,
        }}
      >
        <div ref={printRef}>
          {type === '1page' ? (
            <OnePageCv data={data} onSectionClick={onSectionClick} />
          ) : (
            <TwoPageCv data={data} onSectionClick={onSectionClick} />
          )}
        </div>
      </div>
    </div>
  );
};

