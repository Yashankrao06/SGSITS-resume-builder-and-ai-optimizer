import { CvData } from '../types';

export const defaultEducationHeaders = {
  degree: 'Degree / Certificate',
  university: 'University / Board',
  institute: 'Institute / School',
  year: 'Year of Passing',
  score: 'CGPA / Percentage',
};

export const defaultSectionTitles: CvData['sectionTitles'] = {
  education: 'Academic Details',
  achievements: 'Scholastic Achievements',
  experience: 'Work Experience',
  projects: 'Projects',
  academicProjects: 'Academic Projects',
  technicalProjects: 'Technical Projects',
  skills: 'Platforms, Languages, Technologies & Tools Worked',
  courses: 'Courses Undertaken',
  positions: 'Positions of Responsibility',
  extracurricular: 'Extracurricular Activities',
};

export const onePageSampleData: CvData = {
  header: {
    name: 'Your Name Here',
    ugYear: 'UG 3rd Year',
    college: 'Your College, City',
    dob: 'YYYY-MM-DD',
    email: 'your.email@example.com',
    enrollmentNo: 'ENROLLMENT_NO',
    department: 'Your Department',
    gender: 'Your Gender',
    specialization: 'Your Specialization',
    mobile: '+91 XXXXXXXXXX',
    logoUrl: 'https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png',
    showLogo: true,
  },
  educationHeaders: { ...defaultEducationHeaders },
  education: [
    {
      id: 'edu_1',
      degree: 'Graduation',
      university: 'University Name',
      institute: 'College Name, City',
      year: '2027',
      score: '8.0',
    },
    {
      id: 'edu_2',
      degree: '12th',
      university: 'CBSE',
      institute: 'School Name, City',
      year: '2023',
      score: '90.0',
    },
    {
      id: 'edu_3',
      degree: '10th',
      university: 'CBSE',
      institute: 'School Name, City',
      year: '2021',
      score: '92.0',
    },
  ],
  achievements: [
    'Secured top percentile in national-level competitive examination.',
    'Selected among top teams in a national hackathon.',
    'Organized a major technical/cultural event in college.',
    'Active participant in coding competitions and workshops.',
  ],
  experience: [
    {
      id: 'exp_1',
      company: 'Tech Company Name',
      role: 'Software Development Intern',
      duration: 'Month Year – Month Year',
      points: [
        'Worked on real-world industry projects involving modern web stack.',
        'Collaborated with cross-functional teams to ship key application features.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Data Analytics Project',
      date: 'Jan 2025 - Present',
      points: [
        'Built an end-to-end data pipeline using cloud technologies.',
        'Processed real-world datasets and visualized insights.',
        'Deployed the project using modern tools.',
      ],
      type: 'academic',
      techStack: 'Python, Pandas, PostgreSQL, Streamlit',
      githubLinks: [
        { label: 'GitHub', url: 'https://github.com/example/data-analytics' },
      ],
    },
    {
      id: 'proj_2',
      title: 'Web Application',
      date: 'Nov 2024 – Jan 2025',
      points: [
        'Developed a full-stack web application.',
        'Used modern frontend and backend frameworks.',
        'Deployed the application on a cloud platform.',
      ],
      type: 'academic',
      techStack: 'React, Node.js, Express, MongoDB',
      githubLinks: [
        { label: 'Frontend', url: 'https://github.com/example/webapp-frontend' },
        { label: 'Backend', url: 'https://github.com/example/webapp-backend' },
      ],
    },
  ],
  skills: {
    osLabel: 'Operating Systems',
    os: 'Windows, Linux, macOS',
    programmingLabel: 'Programming Skills',
    programming: 'C++, Java, Python, SQL, JavaScript',
    webLabel: 'Web Designing',
    web: 'HTML, CSS, React, Node.js, Flask',
    softwareLabel: 'Software Skills',
    software: 'Git, VS Code, Jupyter Notebook, Agile, Jira',
  },
  coreCourses: [
    'Data Structures',
    'Object Oriented Programming',
    'Computer Networks',
    'Database Management Systems',
    'Operating Systems',
  ],
  breadthCourses: [
    'Web Development',
    'Cloud Computing',
    'Machine Learning',
    'Software Engineering',
    'Cyber Security',
  ],
  positions: [
    {
      id: 'pos_1',
      title: 'Technical Coordinator',
      duration: 'April 2024 – Present',
      points: ['Led a team for college technical events and logistics.'],
    },
  ],
  extracurricular: [
    {
      id: 'extra_1',
      title: 'Member, Coding Club',
      duration: '2023 – Present',
      points: [
        'Participated in weekly coding contests.',
        'Helped juniors with problem solving.',
      ],
    },
  ],
  sectionTitles: { ...defaultSectionTitles, skills: 'Platforms Worked' },
};

export const twoPageSampleData: CvData = {
  ...onePageSampleData,
  sectionTitles: { ...defaultSectionTitles },
  achievements: [
    ...onePageSampleData.achievements,
    'Won first prize in inter-college debate competition.',
    'Published a research paper in an international journal.',
  ],
  experience: [
    {
      id: 'exp_2p_1',
      company: 'Tech Company Name',
      role: 'Software Engineering Intern',
      duration: 'Month Year – Month Year',
      points: [
        'Worked on real-world industry projects involving microservices architecture.',
        'Collaborated with cross-functional teams to deliver features on time.',
        'Improved system performance by optimizing database queries.',
        'Wrote comprehensive unit and integration tests.',
      ],
    },
  ],
  projects: [
    ...onePageSampleData.projects,
    {
      id: 'proj_2p_3',
      title: 'Machine Learning Model',
      date: 'Aug 2024 – Oct 2024',
      points: [
        'Built a classification model using scikit-learn and TensorFlow.',
        'Achieved 95% accuracy on the test dataset.',
        'Deployed as a REST API using Flask.',
      ],
      type: 'technical',
      techStack: 'Python, TensorFlow, Scikit-Learn, Flask',
      githubLinks: [{ label: 'GitHub', url: 'https://github.com/example/ml-model' }],
    },
    {
      id: 'proj_2p_4',
      title: 'Mobile Application',
      date: 'May 2024 – Jul 2024',
      points: [
        'Developed a cross-platform mobile app using React Native.',
        'Integrated push notifications and real-time chat features.',
        'Published on Google Play Store with 1000+ downloads.',
      ],
      type: 'technical',
      techStack: 'React Native, Firebase, Redux',
      githubLinks: [{ label: 'Play Store', url: 'https://play.google.com/store' }],
    },
  ],
  skills: {
    osLabel: 'Operating Systems',
    os: 'Windows, Linux (Ubuntu, CentOS), macOS',
    programmingLabel: 'Programming Skills',
    programming: 'C, C++, Java, Python, SQL, JavaScript, TypeScript',
    webLabel: 'Web Technologies',
    web: 'HTML5, CSS3, React.js, Next.js, Node.js, Express.js, Flask, Django',
    softwareLabel: 'Tools',
    software: 'Git, GitHub, VS Code, Jupyter, Postman, Figma, Jira',
  },
  coreCourses: [
    'Data Structures & Algorithms',
    'Object Oriented Programming',
    'Computer Networks',
    'Database Management Systems',
    'Operating Systems',
    'Theory of Computation',
    'Compiler Design',
  ],
  breadthCourses: [
    'Web Development',
    'Cloud Computing',
    'Machine Learning',
    'Software Engineering',
    'Cyber Security',
    'Artificial Intelligence',
    'Data Science',
  ],
  positions: [
    {
      id: 'pos_2p_1',
      title: 'Technical Coordinator',
      duration: 'April 2024 – Present',
      points: [
        'Led a team of 15 members for college technical events.',
        'Organized 10+ workshops and coding competitions.',
        'Managed technical logistics for annual tech fest with 2000+ participants.',
      ],
    },
  ],
  extracurricular: [
    {
      id: 'extra_2p_1',
      title: 'Member, Coding Club',
      duration: '2023 – Present',
      points: [
        'Participated in weekly coding contests on Codeforces and LeetCode.',
        'Mentored 20+ juniors in competitive programming.',
      ],
    },
    {
      id: 'extra_2p_2',
      title: 'Volunteer, NSS',
      duration: '2022 – Present',
      points: [
        'Participated in community service and rural development programs.',
        'Organized blood donation camps and awareness drives.',
      ],
    },
  ],
};

export const getOnePageSampleData = (): CvData => {
  return JSON.parse(JSON.stringify(onePageSampleData));
};

export const getTwoPageSampleData = (): CvData => {
  return JSON.parse(JSON.stringify(twoPageSampleData));
};

export const ensureCvDataDefaults = (raw: any): CvData => {
  if (!raw || typeof raw !== 'object') {
    return getOnePageSampleData();
  }
  const cloned = JSON.parse(JSON.stringify(raw));
  return {
    header: {
      name: cloned?.header?.name || '',
      ugYear: cloned?.header?.ugYear || '',
      college: cloned?.header?.college || '',
      dob: cloned?.header?.dob || '',
      email: cloned?.header?.email || '',
      enrollmentNo: cloned?.header?.enrollmentNo || '',
      department: cloned?.header?.department || '',
      gender: cloned?.header?.gender || '',
      specialization: cloned?.header?.specialization || '',
      mobile: cloned?.header?.mobile || '',
      logoUrl: cloned?.header?.logoUrl || 'https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png',
      showLogo: cloned?.header?.showLogo !== undefined ? cloned.header.showLogo : true,
    },
    educationHeaders: {
      ...defaultEducationHeaders,
      ...(cloned?.educationHeaders || {}),
    },
    sectionTitles: {
      ...defaultSectionTitles,
      ...(cloned?.sectionTitles || {}),
    },
    education: Array.isArray(cloned?.education) ? cloned.education : [],
    achievements: Array.isArray(cloned?.achievements) ? cloned.achievements : [],
    experience: Array.isArray(cloned?.experience) ? cloned.experience : [],
    projects: Array.isArray(cloned?.projects) ? cloned.projects : [],
    skills: {
      os: cloned?.skills?.os || '',
      programming: cloned?.skills?.programming || '',
      web: cloned?.skills?.web || '',
      software: cloned?.skills?.software || '',
      osLabel: cloned?.skills?.osLabel || 'Operating Systems',
      programmingLabel: cloned?.skills?.programmingLabel || 'Programming Languages',
      webLabel: cloned?.skills?.webLabel || 'Web Technologies',
      softwareLabel: cloned?.skills?.softwareLabel || 'Tools & Software',
    },
    coreCourses: Array.isArray(cloned?.coreCourses) ? cloned.coreCourses : [],
    breadthCourses: Array.isArray(cloned?.breadthCourses) ? cloned.breadthCourses : [],
    positions: Array.isArray(cloned?.positions) ? cloned.positions : [],
    extracurricular: Array.isArray(cloned?.extracurricular) ? cloned.extracurricular : [],
  };
};
