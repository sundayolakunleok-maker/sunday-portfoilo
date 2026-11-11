export interface CourseActivity {
  id: string;
  type: 'discussion' | 'task';
  number: string;
  title: string;
  subtitle?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  description: string;
  instructions?: string;
  // Configurable external links
  youtubeUrl?: string; // e.g. "https://www.youtube.com/watch?v=..." or "https://youtu.be/..."
  githubUrl?: string;  // e.g. "https://github.com/sunday-okegbemi/..."
  documentUrl?: string; // e.g. Google Docs, PDF, or Drive link
  presentationUrl?: string; // e.g. Slides or portfolio link
  // Optional screenshots or evidence
  screenshots?: { caption: string; url: string }[];
  // Specific Discussion 1 details
  discussion1Details?: {
    reflectionTechnologyFuture: string;
    aiAgentBuildingGoals: string;
    cameraRecordedNote: string;
    peerResponsePrompt: string;
  };
  peerFeedbackGuidelines?: string;
}

export interface AcademicCourse {
  code: string;
  title: string;
  description: string;
  link: string;
  term?: string;
  status: 'Current' | 'Completed' | 'Upcoming';
  topics: string[];
}

export const academicCourses: AcademicCourse[] = [
  {
    code: "MIT 624",
    title: "AI-Powered Software Development",
    description: "Practical study of AI-powered software development, AI coding agents, software creation, enterprise technology modernization, and project deployment.",
    link: "/mit-624",
    term: "Active Term",
    status: "Current",
    topics: [
      "AI Coding Agents & Autonomous Development",
      "Modernizing Enterprise Technology Estates",
      "Software Design, Testing & Continuous Deployment",
      "Prompt Engineering & Automated Workflows"
    ]
  }
  // Future academic courses can be easily added here
];

export const mit624CourseInfo = {
  courseCode: "MIT 624",
  courseTitle: "AI-Powered Software Development",
  courseFocus: "Modernizing Enterprise Technology Estates",
  learningApproach: "Practical assignments, AI-assisted software development, recorded presentations, peer discussions, and project development.",
  portfolioPurpose: "To document coursework, practical projects, discussions, and completed deliverables.",
  studentName: "Sunday Okegbemi",
  studentRole: "Master of Information Technology / Data Analyst",
  studentPhoto: "/sunday-okegbemi.jpg",
  academicInstitution: "MIT Academic Coursework",
  pageSubtitle: "My Academic Journey in AI-Powered Software Development",
  introDescription: "Welcome to my MIT 624 course portfolio. This page documents my academic activities, practical assignments, discussions, software development projects, and learning experiences in AI-powered software development. It serves as a central record of my progress throughout the course, including the use of AI coding agents to design, develop, test, and deploy software applications."
};

export const courseActivities: CourseActivity[] = [
  {
    id: "discussion-1",
    type: "discussion",
    number: "1",
    title: "Discussion 1: Program Onboarding and Your Technology Future",
    subtitle: "Course onboarding, personal technology reflection, and AI development aspirations",
    status: "In Progress",
    description: "Course onboarding and introduction. Personal technology interests, future career goals, and a recorded 1–2 minute video presentation exploring AI-powered software engineering.",
    instructions: "Record a 1-to-2 minute presentation with your camera on reflecting on what interests you about the future of technology and what you hope to build with an AI coding agent. Share your video, portfolio link, and engage in peer discussions.",
    // Paste your YouTube video link here when ready:
    youtubeUrl: "", // e.g. "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
    presentationUrl: "https://okegbemisunday.netlify.app/mit-624",
    documentUrl: "",
    githubUrl: "",
    discussion1Details: {
      reflectionTechnologyFuture: "Technology is undergoing a profound paradigm shift where data analysis and software engineering converge through generative AI. As a data analyst with over 5 years of industry experience across FMCG, Banking, and Logistics, I am energized by how AI coding agents accelerate the transformation of raw enterprise data into robust, automated full-stack software solutions.",
      aiAgentBuildingGoals: "By the end of MIT 624, I aim to master autonomous AI coding agents to design, build, test, and deploy end-to-end intelligent enterprise analytics platforms—bridging automated data pipelines, predictive intelligence, and responsive web user interfaces.",
      cameraRecordedNote: "1-to-2 minute recorded video presentation with camera on, uploaded as Public or Unlisted on YouTube.",
      peerResponsePrompt: "Engage with classmates by evaluating their technology roadmaps, sharing insights on AI coding workflows, and providing constructive peer critique."
    },
    peerFeedbackGuidelines: "Leave feedback or questions regarding my technology goals, AI agent methodologies, or enterprise modernization approach."
  },
  {
    id: "task-1",
    type: "task",
    number: "1",
    title: "Task 1",
    subtitle: "Practical Assignment & Implementation",
    status: "Not Started",
    description: "Hands-on assignment focusing on initial software architecture, environment setup, and practical application development using modern tooling.",
    instructions: "Assignment instructions and specific deliverables will be updated here as released by the instructor.",
    youtubeUrl: "",
    githubUrl: "",
    documentUrl: "",
    screenshots: []
  },
  {
    id: "discussion-3",
    type: "discussion",
    number: "3",
    title: "Discussion 3",
    subtitle: "Collaborative Topic & Artifact Discussion",
    status: "Not Started",
    description: "Academic discussion, video recording or completed project artifact analysis, accompanied by peer evaluations.",
    instructions: "Discussion prompts, required reading, and video response specifications will be published here upon assignment release.",
    youtubeUrl: "",
    documentUrl: "",
    githubUrl: "",
    peerFeedbackGuidelines: "Peer responses and interactive evaluation guidelines will appear here."
  },
  {
    id: "task-2",
    type: "task",
    number: "2",
    title: "Task 2",
    subtitle: "Practical Software Implementation & Code Artifacts",
    status: "Not Started",
    description: "Intermediate technical project implementing core system features, enterprise data integrations, and software quality testing.",
    instructions: "Assignment requirements, problem specifications, and architectural constraints will be populated here.",
    youtubeUrl: "",
    githubUrl: "",
    documentUrl: "",
    screenshots: []
  },
  {
    id: "discussion-5",
    type: "discussion",
    number: "5",
    title: "Discussion 5",
    subtitle: "Recorded Presentation & Topic Synthesis",
    status: "Not Started",
    description: "Advanced topic synthesis, technical presentation, or completed project walkthrough with peer peer review.",
    instructions: "Discussion guidelines and presentation requirements will be added here once provided by the instructor.",
    youtubeUrl: "",
    documentUrl: "",
    githubUrl: "",
    peerFeedbackGuidelines: "Peer feedback and collaborative commentary area."
  },
  {
    id: "task-3",
    type: "task",
    number: "3",
    title: "Task 3",
    subtitle: "Advanced Implementation & System Verification",
    status: "Not Started",
    description: "Comprehensive software build incorporating AI-assisted optimization, testing frameworks, and deployment readiness.",
    instructions: "Task instructions, testing guidelines, and submission criteria will be placed here.",
    youtubeUrl: "",
    githubUrl: "",
    documentUrl: "",
    screenshots: []
  },
  {
    id: "discussion-7",
    type: "discussion",
    number: "7",
    title: "Discussion 7",
    subtitle: "Recorded Video & Artifact Evaluation",
    status: "Not Started",
    description: "Deep dive evaluation into course project outcomes, architectural lessons learned, and peer response interactions.",
    instructions: "Discussion focus and presentation deliverables will be updated here as the term advances.",
    youtubeUrl: "",
    documentUrl: "",
    githubUrl: "",
    peerFeedbackGuidelines: "Peer commentary and feedback synthesis section."
  },
  {
    id: "task-4",
    type: "task",
    number: "4",
    title: "Task 4",
    subtitle: "Capstone Project & Final System Delivery",
    status: "Not Started",
    description: "Final comprehensive course deliverable, full system deployment, production screenshots, and project demonstration repository.",
    instructions: "Final submission criteria, evaluation rubrics, and project guidelines will be detailed here.",
    youtubeUrl: "",
    githubUrl: "",
    documentUrl: "",
    screenshots: []
  }
];
