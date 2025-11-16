"use server";

import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient"; // your Firebase config
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { interview_id, feedback, rating } = body;

    const parsedRating = Number(rating);
    if (!interview_id || typeof feedback !== "string" || isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: "Invalid input: interview_id, feedback, and rating are required. Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    // Insert into Firestore
    const docRef = await addDoc(collection(db, "aptitude_feedback"), {
      interview_id,
      feedback,
      rating: parsedRating,
      created_at: Timestamp.now()
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully!", id: docRef.id },
      { status: 200 }
    );

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error", detail: error.message },
      { status: 500 }
    );
  }
}
