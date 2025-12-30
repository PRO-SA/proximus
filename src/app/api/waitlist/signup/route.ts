import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { normalizeEmail } from '@/lib/utils';

const signupSchema = z.object({
  email: z.string().email(),
});

const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 60;

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

  // Count attempts in the window
  const { count, error } = await supabase
    .from('rate_limit_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .eq('endpoint', '/api/waitlist/signup')
    .gte('attempted_at', windowStart);

  if (error) {
    console.error('Rate limit check error:', error);
    // Fail open - allow request if we can't check
    return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS };
  }

  const attempts = count || 0;
  const remaining = Math.max(0, RATE_LIMIT_MAX_ATTEMPTS - attempts);

  return { allowed: attempts < RATE_LIMIT_MAX_ATTEMPTS, remaining };
}

async function logRateLimitAttempt(ip: string): Promise<void> {
  const { error } = await supabase
    .from('rate_limit_attempts')
    .insert({ ip_address: ip, endpoint: '/api/waitlist/signup' });

  if (error) {
    console.error('Rate limit log error:', error);
  }

  // Cleanup old entries (older than 2 hours) - fire and forget
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  supabase
    .from('rate_limit_attempts')
    .delete()
    .lt('attempted_at', cutoff)
    .then(() => {});
}

function getClientIp(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback for local development
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Check rate limit
    const { allowed, remaining } = await checkRateLimit(clientIp);

    if (!allowed) {
      return NextResponse.json(
        { status: 'rate_limited', message: 'Too many attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(RATE_LIMIT_WINDOW_MINUTES * 60),
          }
        }
      );
    }

    // Log the attempt
    await logRateLimitAttempt(clientIp);

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email address' },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);

    // Check if email already exists
    const { data: existing, error: fetchError } = await supabase
      .from('waitlist_entries')
      .select('id, unsubscribed_at')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Supabase fetch error:', fetchError);
      return NextResponse.json(
        { status: 'error', message: 'Database error' },
        { status: 500 }
      );
    }

    const response = (data: object, status = 200) =>
      NextResponse.json(data, {
        status,
        headers: {
          'X-RateLimit-Remaining': String(remaining - 1),
        },
      });

    if (existing) {
      if (existing.unsubscribed_at === null) {
        return response({ status: 'exists' });
      }

      // Reactivate unsubscribed user
      const { error: updateError } = await supabase
        .from('waitlist_entries')
        .update({ unsubscribed_at: null })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Supabase update error:', updateError);
        return response({ status: 'error', message: 'Database error' }, 500);
      }

      return response({ status: 'reactivated' });
    }

    // Insert new entry
    const { error: insertError } = await supabase
      .from('waitlist_entries')
      .insert({ email });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return response({ status: 'error', message: 'Database error' }, 500);
    }

    return response({ status: 'created' });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
