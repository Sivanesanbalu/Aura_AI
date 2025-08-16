import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/app/components/supabaseClient";
import { v4 as uuidv4 } from "uuid";

// --- MODIFIED PROMPT_TEMPLATE ---
const PROMPT_TEMPLATE = `
You are an expert in creating aptitude tests for engineering interviews.

🧠 Generate {{count}} aptitude questions of {{difficulty}} difficulty, specifically designed to assess an engineering candidate's analytical and problem-solving skills. The questions should cover a mix of the following categories:
- Logical Reasoning (e.g., pattern recognition, deductions, series completion)
- Numerical Reasoning (e.g., data interpretation, word problems involving rates, ratios, or percentages)
- Spatial Reasoning (e.g., 2D/3D visualizations, mental rotation, paper folding)
- Basic Mechanical or Technical Reasoning (e.g., simple physics problems involving levers, gears, pressure, or basic electrical circuit concepts)

Each question must be multiple-choice with 4 distinct options and only 1 correct answer.

Format the output as a valid JSON array of objects:
[
  {
    "question": "A gear with 30 teeth is connected to a gear with 10 teeth. If the larger gear makes 5 rotations, how many rotations does the smaller gear make?",
    "options": ["5", "10", "15", "30"],
    "answer": "15"
  },
  ...
]
`;

export async function POST(request) {
  try {
    const { difficulty, questionCount } = await request.json();
    const count = Math.min(Math.max(Number(questionCount) || 5, 1), 20);

    const prompt = PROMPT_TEMPLATE
      .replace('{{count}}', count)
      .replace('{{difficulty}}', difficulty || 'Medium');

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'google/gemma-3-27b-it:free',
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = completion.choices[0]?.message?.content || "";

    const cleanJson = raw
      .replace(/```(?:json)?/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (err) {
      console.error("❌ JSON parse failed. Content was:\n", cleanJson);
      return NextResponse.json({ error: "JSON parsing failed." }, { status: 500 });
    }

    
    const interview_id = uuidv4();

    
    const { error } = await supabase
      .from("aptitude_questions")
      .insert(
        parsed.map((q) => ({
          interview_id,
          question: q.question,
          options: q.options,
          answer: q.answer,
          difficulty,
        }))
      );

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: "Database insert failed" }, { status: 500 });
    }

   
    return NextResponse.json({ interview_id, questions: parsed });
  } catch (e) {
    console.error("❌ API error:", e);
    return NextResponse.json({ error: "Server error", detail: e.message }, { status: 500 });
  }
}