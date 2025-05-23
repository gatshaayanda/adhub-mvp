import { supabaseAdmin } from '@/utils/supabase/admin'

/**
 * Lightweight replacement for Resend while you’re using Supabase’s
 * built-in SMTP.  Call sendMail(...) instead of resend.emails.send(...).
 */
export async function sendMail(
  to: string,
  subject: string,
  html: string,
) {
  const { error } = await supabaseAdmin.functions.invoke('email', {
    body: { to, subject, html },
  })
  if (error) throw error
}
