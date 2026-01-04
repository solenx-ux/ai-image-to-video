'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CreatePage() {
  const [user, setUser] = useState(null)
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const uploadImage = async () => {
    if (!file) {
      setStatus('Please select an image')
      return
    }

    if (!user) {
      setStatus('Not logged in')
      return
    }

    setStatus('Uploading image...')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('IMAGES')
      .upload(fileName, file)

    if (error) {
      console.error(error)
      setStatus('Upload failed')
      return
    }

    const { data } = supabase.storage
      .from('IMAGES')
      .getPublicUrl(fileName)

    console.log('Image URL:', data.publicUrl)

    setStatus('Image uploaded successfully')
  }

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Create Video</h1>

      {user && (
        <p>
          Logged in as:<br />
          {user.email}
        </p>
      )}

      <label>
        Upload Image<br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      <br /><br />

      <label>
        Prompt<br />
        <textarea
          placeholder="Describe how the image should turn into a video"
          rows={4}
          style={{ width: '100%' }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </label>

      <br /><br />

      <button onClick={uploadImage}>
        Upload Image
      </button>

      <p>{status}</p>
    </div>
  )
}
