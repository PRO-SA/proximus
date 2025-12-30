import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const resubscribeSchema = z.object({
  token: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resubscribeSchema.safeParse(body);

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
      .select('id')
      .eq('unsubscribe_token', token)
      .single();

    if (fetchError || !entry) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 404 }
      );
    }

    // Clear unsubscribed_at
    const { error: updateError } = await supabase
      .from('waitlist_entries')
      .update({ unsubscribed_at: null })
      .eq('id', entry.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { status: 'error', message: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'resubscribed' });
  } catch (error) {
    console.error('Resubscribe error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
