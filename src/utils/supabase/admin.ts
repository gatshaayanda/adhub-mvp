// src/utils/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

// ONLY run on the server – it uses your service-role key
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,   // **service-role**, not anon
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
)
