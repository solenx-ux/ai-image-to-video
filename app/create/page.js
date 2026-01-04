'use client'

import { supabase } from '@/lib/supabaseClient'

export default function CreatePage() {
  const testSupabase = async () => {
    const { data, error } = await supabase.auth.getSession()
    console.log('Supabase session:', data)
    console.log('Supabase error:', error)
    alert('SUPABASE TEST CLICKED — CHECK CONSOLE')
  }

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Create Video</h1>

      <label>
        Upload Image
        <br />
        <input type="file" accept="image/*" />
      </label>

      <br /><br />

      <label>
        Prompt
        <br />
        <textarea
          placeholder="Describe how the image should turn into a video"
          rows={4}
          style={{ width: '100%' }}
        />
      </label>

      <br /><br />

      <button
        style={{ padding: '10px 20px', cursor: 'pointer' }}
        onClick={testSupabase}
      >
        Test Supabase
      </button>
    </div>
  )
}
