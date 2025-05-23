// src/app/auth/callback/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import AdminHubLoader from '@/components/AdminHubLoader'

export const dynamic = 'force-dynamic'

export default function Callback() {
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const url = new URL(window.location.href)
      const access_token  = url.searchParams.get('access_token')
      const refresh_token = url.searchParams.get('refresh_token')

      if (!access_token || !refresh_token) {
        setError('Invalid or expired link.')
        return
      }

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token
      })

      if (error || !data.session) {
        setError('Authentication failed.')
        return
      }

      const { user } = data.session
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      router.replace(profile?.role === 'Admin'
        ? '/admin/dashboard'
        : '/client/dashboard')
    })()
  }, [router])

  return error
    ? <p className="text-red-500 text-center mt-10">{error}</p>
    : <AdminHubLoader />
}
