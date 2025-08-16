// app/api/get-aptitude-questions/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/app/components/supabaseClient';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const interview_id = searchParams.get('interview_id');

  if (!interview_id) {
    return NextResponse.json({ error: 'Missing interview_id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('aptitude_questions')
    .select('question, options')
    .eq('interview_id', interview_id);

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'No questions found' }, { status: 404 });
  }

  return NextResponse.json({ questions: data });
}
