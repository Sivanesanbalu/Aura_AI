import { NextResponse } from 'next/server';
import { supabase } from '@/app/components/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { interview_id, feedback, rating } = body;

    const parsedRating = Number(rating);
    if (!interview_id || typeof feedback !== 'string' || isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: "Invalid input: interview_id, feedback, and rating are required. Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from('aptitude_feedback').insert([
      {
        interview_id,
        feedback,
        rating: parsedRating
      }
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message, error.details, error.hint);
      return NextResponse.json(
        { error: "Database insert failed", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Feedback submitted successfully!", data }, { status: 200 });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error", detail: error.message },
      { status: 500 }
    );
  }
}
