import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Detects if running locally (npm run dev)
function getBaseUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://adminhub.vercel.app';
}

function getMagicLink(email: string) {
  // This is the ONLY place you control the link!
  const baseUrl = getBaseUrl();
  return `${baseUrl}/login?email=${encodeURIComponent(email)}&magic=1`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const magicLink = getMagicLink(email);

    const msg = {
      to: email,
      from: {
        email: 'noreplyadhubmvp@gmail.com',
        name: 'Admin Hub',
      },
      subject: 'Your Magic Link – Access Your Admin Hub Dashboard',
      text: `Hello${name ? ' ' + name : ''},\n\nClick this link to access your project dashboard: ${magicLink}\n\nThis link is for you only. If you did not request this, please ignore this email.`,
      html: `
        <div style="font-family:sans-serif;">
          <h2>Hi${name ? ' ' + name : ''},</h2>
          <p>Click the button below to access your project dashboard:</p>
          <a href="${magicLink}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:bold;">Open Dashboard</a>
          <p style="color:#888;margin-top:18px;font-size:13px;">If you did not request this, please ignore this email.</p>
        </div>
      `
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send magic link.' }, { status: 500 });
  }
}
