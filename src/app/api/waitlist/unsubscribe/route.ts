import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const unsubscribeSchema = z.object({
  token: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 400 }
      );
    }

    const { token } = parsed.data;

    // Find entry by token
    const { data: entry, error: fetchError } = await supabase
      .from('waitlist_entries')
      .select('id, unsubscribed_at')
      .eq('unsubscribe_token', token)
      .single();

    if (fetchError || !entry) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 404 }
      );
    }

    if (entry.unsubscribed_at !== null) {
      // Already unsubscribed
      return NextResponse.json({ status: 'already_unsubscribed' });
    }

    // Set unsubscribed_at
    const { error: updateError } = await supabase
      .from('waitlist_entries')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('id', entry.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { status: 'error', message: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'unsubscribed' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
