

import { NextResponse } from "next/server";
import { supabase } from "@/app/components/supabaseClient";

export async function POST(request) {
  try {
    const { interview_id, answers } = await request.json();

    if (!interview_id || !answers) {
      return NextResponse.json({ error: "Missing interview_id or answers" }, { status: 400 });
    }

  
    const { data, error } = await supabase
      .from("aptitude_questions")
      .select("question, answer")
      .eq("interview_id", interview_id);

    if (error) {
      console.error("❌ Supabase fetch error:", error);
      return NextResponse.json({ error: "Database fetch failed" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No questions found" }, { status: 404 });
    }

    let score = 0;

    data.forEach((q, idx) => {
      if (
        answers.hasOwnProperty(idx) &&
        answers[idx]?.toString().trim().toLowerCase() === q.answer?.toString().trim().toLowerCase()
      ) {
        score++;
      }
    });

   
    return NextResponse.json({
      score,
      total: data.length,
      correctAnswers: data, 
    });

  } catch (e) {
    console.error("❌ API error:", e);
    return NextResponse.json({ error: "Server error", detail: e.message }, { status: 500 });
  }
}
