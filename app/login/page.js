'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const signIn = async () => {
    setStatus('Sending magic link...')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/create`
      }
    })

    if (error) {
      console.error(error)
      setStatus('Login failed')
    } else {
      setStatus('Check your email for login link')
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      />

      <br /><br />

      <button onClick={signIn}>
        Send Login Link
      </button>

      <p>{status}</p>
    </div>
  )
}
