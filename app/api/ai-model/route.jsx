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

1. **Always Generate 10 Questions:** Every plan must contain exactly 10 questions — distributed across Foundational, Problem Solving, System Design, Behavioral, and Code Logic.

2. **Structure as an Interview Funnel:** The question set MUST follow a logical progression.
   * **Start Broad (Foundational):** 2 questions verifying essential CS/AI/IT fundamentals.
   * **Go Deeper (Applied Knowledge):** 4–5 open-ended problem-solving or system design questions requiring practical application and trade-off reasoning.
   * **Assess Behavior:** 2 questions framed with the STAR method.
   * **Practical Code Logic:** 1 question MUST be role-specific coding (MANDATORY, ~5 minutes, intermediate difficulty).

3. **Incorporate Practical Code Logic (MANDATORY):**
   * One role-tailored coding task is REQUIRED in every plan. Select the most relevant coding challenge based on {{jobTitle}} and {{jobDescription}}:
     - **Frontend (IT / CSE focus):** Build/modify a React/Next component, debug UI bug, implement debounce, explain performance trade-offs.
     - **Backend (IT / CSE focus):** Implement/optimize an API route, design schema, add pagination, rate limiting, or secure input validation.
     - **AI / ML / AI&DS:** Write/debug a preprocessing function, implement a loss, compute precision/recall, handle dataset drift, optimize inference loop.
     - **Data / Analytics (AI&DS):** Craft SQL with window functions, implement feature engineering, check data quality.
     - **Systems / Platform (CSE):** Implement concurrency primitive, memory-safe parsing, or efficient data structure method.
   * Bite-sized code (10–40 lines). Must include **task**, **expected output**, and **edge cases**.

4. **Balance Depth with Fundamentals:** Mix conceptual checks (e.g., supervised vs. unsupervised learning) with deeper design/algorithmic problems. Ensure candidate is tested on both understanding and application.

5. **Demand Problem-Solving, Not Just Knowledge:** Include algorithmic/system design trade-offs (scalability, performance, security, maintainability, privacy).

6. **Behavioral Depth (STAR Method):** 2 questions must demand clear Situation, Task, Action, Result narratives. Probe ownership, measurable impact, incident handling, cross-team work.

7. **Time-Optimize Ruthlessly:**
   * **~30 min:** 1 Foundational, 1 Code Logic (MANDATORY), 1 Behavioral.
   * **~45–60 min:** 1 Foundational, 1 Code Logic (MANDATORY), 1 Problem Solving or System Design, 1 Behavioral.
   * **>60 min:** 2 Foundational, 1–2 Code Logic (at least 1 role-tailored, MANDATORY), 1 Problem Solving, 1 System Design, 1 Behavioral.
   * Still always generate **10 total questions**, scaled in complexity.

8. **Role/Domain Tailoring Guide (use what applies):**
   * **AI / ML / AI&DS:** leakage checks, offline vs. online metrics, dataset shift, fairness/ethics, RAG/prompt trade-offs, inference latency vs. quality.
   * **Frontend:** accessibility (a11y), responsiveness, hydration issues, caching/state trade-offs, XSS/CSRF.
   * **Backend:** schema/indexing, consistency models, circuit breakers, observability (logs, metrics, traces).
   * **CSE / IT (General):** OS, processes/threads, networking (TCP/HTTP), complexity analysis, CI/CD, testing strategy.

9. **Evaluation Hints (baked into questions):**
   * Require assumptions, trade-offs, and edge-case reasoning.
   * Ask for time/space complexity analysis.
   * For code: ask how they’d test and monitor in production.

---
**Output Format (Strict):**
You MUST respond in a clean JSON format. The root object should contain a single key, "interviewQuestions", which is an array of exactly 10 question objects.

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
**Primary Goal:** Create a challenging, insightful, and **balanced** 10-question interview plan that a real hiring manager at Google or Amazon would use to identify top-tier talent for the **{{jobTitle}}** role, with at least **one role-specific code task (MANDATORY)** aligned to IT, AI&DS, or Computer Science contexts.`;

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
      model: 'mistralai/mistral-small-3.1-24b-instruct:free',
      messages: [
        { role: 'user', content: FINAL_PROMPT },
      ],
    });

    let messageContent = completion.choices[0].message.content;

    // Extract JSON block
    const match = messageContent.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("No JSON found in AI response:\n", messageContent);
      throw new Error("No JSON found in AI response");
    }

    // Remove trailing commas to fix common AI formatting issues
    const cleanedJson = match[0].replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

    let parsed;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch (jsonError) {
      console.error("JSON parsing failed. Raw content:\n", cleanedJson);
      throw new Error("Failed to parse JSON from AI response");
    }

    return NextResponse.json(parsed.interviewQuestions);
  } catch (e) {
    console.error("Parsing or API error:", e);
    return NextResponse.json(
      { error: "Server error", details: e.message || String(e) },
      { status: 500 }
    );
  }
}