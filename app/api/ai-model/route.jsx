import { NextResponse } from "next/server";
import OpenAI from "openai";

export const QUESTION_PROMPT = `You are a Principal Engineer and a seasoned Hiring Manager at a FAANG-level company (like Google, Amazon). Your standards are exceptionally high, and you are tasked with creating a comprehensive and balanced interview question set.

Based on the following inputs, generate a world-class interview question plan.

**Job Title:** {{jobTitle}}
**Job Description:** {{jobDescription}}
**Interview Duration:** {{duration}}
**Interview Type:** {{type}}

---
**Your CRITICAL Directives:**

1.  **Structure as an Interview Funnel:** The question set MUST follow a logical progression.
    *   **Start Broad (Foundational):** Begin with 1-2 foundational questions to verify the candidate's core understanding of essential concepts. Questions like "What is the difference between X and Y?" are appropriate here to establish a baseline.
    *   **Go Deeper (Applied Knowledge):** Transition into more complex, open-ended questions that require practical application, code analysis, or design thinking.
    *   **Assess Behavior:** Weave in behavioral questions to understand their past experiences and impact.

2.  **Balance Depth with Fundamentals:** While the main goal is to assess deep problem-solving skills, you must include a few foundational checks. This ensures the candidate isn't just reciting memorized answers to complex problems without understanding the basics.

3.  **Incorporate Practical Code Logic:** Where relevant to the role, generate questions that require the candidate to **write, analyze, or debug a small code snippet.** This is crucial for testing the practical application of their theoretical knowledge (e.g., "What is the output of this code and why?", "Find the bug in this function.", "Write a function to...").

4.  **Demand Problem-Solving, Not Just Knowledge:** For technical roles, generate complex algorithmic or system design questions with multiple valid approaches. The focus should be on the candidate's thought process, their ability to discuss trade-offs (scalability, performance, maintainability), and how they navigate ambiguity.

5.  **Drill Down on Behavioral Impact (STAR Method):** Behavioral questions must be framed to elicit detailed stories. They should force the candidate to articulate the **S**ituation, **T**ask, **A**ction, and measurable **R**esult. Probe for ownership, impact, and how they handled complex situations or failures.

6.  **Time-Optimize Ruthlessly:** Adjust the number and complexity of questions to realistically fit the interview duration. A 30-minute interview might have one foundational, one code logic, and one behavioral question. A 60-minute interview can accommodate a larger system design problem.

---
**Output Format (Strict):**
You MUST respond in a clean JSON format. The root object should contain a single key, "interviewQuestions", which is an array of question objects.

**JSON Schema:**
\`\`\`json
{
  "interviewQuestions": [
    {
      "question": "A very specific and challenging question text.",
      "type": "Foundational" | "Problem Solving" | "System Design" | "Behavioral" | "Code Logic"
    }
  ]
}
\`\`\`
---

**Primary Goal:** Create a challenging, insightful, and **balanced** interview plan that a real hiring manager at Google or Amazon would use to identify top-tier talent for the **{{jobTitle}}** role.`;

export async function POST(req) {
  const { jobPosition, jobDescription, duration, type } = await req.json();

  const FINAL_PROMPT = QUESTION_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{duration}}', duration)
    .replace('{{type}}', type);

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'google/gemma-3n-e2b-it:free',
      messages: [
        {
          role: 'user',
          content: FINAL_PROMPT,
        },
      ],
    });

    let messageContent = completion.choices[0].message.content;

   
    const jsonString = messageContent
      .replace(/```(?:json)?\s*/gi, '') 
      .replace(/```/g, '')             
      .trim();

   
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (jsonError) {
      console.error("JSON parsing failed. Raw content:\n", jsonString);
      throw new Error("Failed to parse JSON from AI response");
    }

    
    return NextResponse.json(parsed.interviewQuestions);
  } catch (e) {
    console.error("Parsing or API error:", e);
    return NextResponse.json({ error: "Server error", details: e.message || String(e) }, { status: 500 });
  }
}