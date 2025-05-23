// src/app/api/invite/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { sendMail } from '@/utils/resend'

export async function POST (req: Request) {
  /* ------------------------------------------------------------------ */
  /* 1 ▸ Get the e-mail address                                          */
  /* ------------------------------------------------------------------ */
  const body = await req.json()
  const email = (body?.email as string)?.trim()

  if (!email) {
    return NextResponse.json({ error: 'E-mail is required' }, { status: 400 })
  }

  /* ------------------------------------------------------------------ */
  /* 2 ▸ Ask Supabase Auth for a NON-PKCE magic-link                     */
  /* ------------------------------------------------------------------ */
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    email,
    type: 'magiclink',
    options: {
      redirectTo: 'https://adhubmvp.vercel.app/auth/callback'
    }
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // one-click URL the user will open
  const link = data!.properties!.action_link as string

  /* ------------------------------------------------------------------ */
  /* 3 ▸ Send the mail with our helper (uses Supabase Functions SMTP)   */
  /* ------------------------------------------------------------------ */
  await sendMail(
    email,
    'Your AdminHub login link',
    `<p>Click <a href="${link}">here</a> to open your dashboard.</p>`
  )

  return NextResponse.json({ ok: true })
}
