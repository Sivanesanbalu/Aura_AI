import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    let convoData;
    try {
      convoData = JSON.parse(conversation);
    } catch {
      convoData = conversation;
    }

    const FINAL_PROMPT = `
${FEEDBACK_PROMPT}

IMPORTANT:
Return ONLY valid JSON. No explanation text. No markdown. No commentary.
Your entire response MUST be 100% valid JSON.

Conversation:
${JSON.stringify(convoData)}
    `;

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3n-e2b-it:free",
      messages: [
        {
          role: "user",
          content: FINAL_PROMPT,
        },
      ],
    });

    let content = completion.choices[0].message.content;

    // 🔥 Extract ONLY the first valid JSON block
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("❌ No JSON found in model output");
      return NextResponse.json(
        { error: "AI did not return JSON", raw: content },
        { status: 500 }
      );
    }

    const jsonString = jsonMatch[0];

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.error("❌ JSON parsing failed:\n", jsonString);
      return NextResponse.json(
        { error: "Invalid JSON returned by AI", raw: jsonString },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      { error: "Server crashed", details: error.message },
      { status: 500 }
    );
  }
}
