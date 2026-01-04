'use client'

import { supabase } from '@/lib/supabaseClient'

export default function CreatePage() {
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
        onClick={() => alert('READY TO UPLOAD IMAGE')}
      >
        Generate Video
      </button>
    </div>
  )
}
