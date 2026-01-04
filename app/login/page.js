'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    if (!email) {
      setMessage('Please enter your email')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/create',
      },
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the login link')
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
        style={{ padding: 10, width: '100%' }}
      />

      <br /><br />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        {loading ? 'Sending link…' : 'Send Login Link'}
      </button>

      <p>{message}</p>
    </div>
  )
}
