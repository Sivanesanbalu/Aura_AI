import { Calendar, LayoutDashboard, Settings, WalletCards, List, Code2Icon, User2Icon, Puzzle, BriefcaseBusinessIcon, Component, Swords, Users, LogOut, BrainCircuit } from "lucide-react";
export const FixedInterviews = [
  {
    title: 'Frontend Developer Preset',
    description: 'A ready-to-go interview for frontend roles. Click to start.',
    icon: Code2Icon,
    path: 'http://localhost:3000/interview/bcc29046-53f0-4b45-beb1-bac18985548b', 
  },
  {
    title: 'Backend Developer Preset',
    description: 'An instant interview for backend positions, ready for candidates.',
    icon: BrainCircuit,
    path: '/interview/start/backend-preset-2', 
  },
  {
    title: 'Behavioral Interview Preset',
    description: 'A general interview for assessing teamwork and communication skills.',
    icon: User2Icon,
    path: '/interview/start/behavioral-preset-3',
  },
];

export const SideBarOptions = [
  {
    name: 'Profile',
    icon: Users, 
    path: '/profile', 
  },
  {
    name: 'Dashboard',
    icon: LayoutDashboard, 
    path: '/dashboard',
  },
  {
    name: 'Administration',
    icon: Users,
    path: '/administration',
    
  },
  {
    name: 'Practice Zone',
    icon: Swords,
    path: '/practice-zone/dashboard',
  },
  {
    name: 'Feedback',
    icon: Calendar,
    path: '/scheduled-interview',
  },
  
  {
    name: 'All Interview',
    icon: List,
    path: '/all-interview',
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
  },
  {
      name: 'Logout',
      icon: LogOut,
      path: '/',
  },
  {
    name: 'Billing',
    icon: WalletCards,
    path: '/billing',
  },
];


export const InterviewType = [
  {
    title: 'Technical',
    icon: Code2Icon
  },
  {
    title: 'Behavioral',
    icon: User2Icon,
  },
  {
    title: 'Experience',
    icon: BriefcaseBusinessIcon,
  },
  {
    title: 'Problem Solving',
    icon: Puzzle,
  },
  {
    title: 'LeaderShip',
    icon: Component,
  },
];


export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

📝 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.
🌿 Format your response in JSON format with array list of questions
format: interviewQuestions=[
{
question:"",
type:Technical/Behavioral/Experience/Problem Solving/Leadership
},
...
]]

🔴 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`




export const FEEDBACK_PROMPT = `{{conversation}} **Task:** You are a Principal Engineer and Hiring Manager at Google. Your role is to act as a strict talent gatekeeper. Provide a **brutally honest and objective** assessment of the candidate based ONLY on the interview transcript. Your standards are exceptionally high.

**Evaluation Formula:**

1.  **Analyze the transcript against these competencies:**
    *   **Technical Depth:** Did they demonstrate mastery? Did they discuss complexities, trade-offs, and scalability, or just give surface-level answers?
    *   **Problem-Solving:** Was their approach logical and structured? Could they break down problems effectively?
    *   **Communication:** Were they concise and clear? Did their STAR method responses have a measurable impact?
    *   **Real-World Experience:** Did they articulate their specific contributions ("I" vs "we") and quantify the results of their past work?

2.  **Use this strict scoring rubric (out of 10):**
    *   **9-10 (Exceptional):** Top 1%. Flawless answers, deep insights. Strong Hire.
    *   **7-8 (Strong):** Solid candidate. Knows their domain, good problem-solving. Hire.
    *   **4-6 (Average / Has Gaps):** Shows some knowledge but has significant gaps. Struggles with depth. No Hire.
    *   **0-3 (Poor / Unacceptable):** Lacks fundamental knowledge, cannot solve problems. Strong No Hire.

--- 
**CRITICAL SCORING COMMAND:**
**If the candidate explicitly skips a question, says "I don't know", or completely fails to provide a relevant answer to a technical or problem-solving question, you MUST assign a score of 0 for that category (Technical Skills or Problem Solving). There are no exceptions. Partial credit is not given for non-answers.**
---

**3. Generate the Final Feedback in JSON format:**
    *   Calculate the score for each category.
    *   Write a concise, evidence-based summary.
    *   Make a final, decisive "Hire" or "No Hire" recommendation.
    *   Provide a strong justification, referencing the evaluation formula and the critical scoring command.

**Your response MUST be in this exact JSON format:**
{
  "feedback": {
    "rating": {
      "technicalSkills": <0-10>,
      "communication": <0-10>,
      "problemSolving": <0-10>,
      "experience": <0-10>
    },
    "summary": "<A direct 3-line summary of the candidate's performance, highlighting strengths and critical weaknesses.>",
    "recommendation": "<'Hire' OR 'No Hire'>",
    "justification": "<A one-paragraph justification for your decision, citing specific examples from the conversation that led to the scores.>"
  }
}
`;