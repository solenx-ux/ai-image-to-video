'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CreatePage() {
  const [image, setImage] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!image) {
      alert('Please select an image')
      return
    }

    if (!prompt) {
      alert('Please enter a prompt')
      return
    }

    setLoading(true)

    // 1. Check auth
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      alert('Please login first')
      setLoading(false)
      return
    }

    // 2. Upload image to Supabase Storage
    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, image)

    if (uploadError) {
      alert(uploadError.message)
      setLoading(false)
      return
    }

    // 3. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    const imageUrl = publicUrlData.publicUrl

    // 4. TEMP success message (AI comes next)
    alert('Image uploaded successfully!\n' + imageUrl)

    setLoading(false)
  }

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Create Video</h1>

      <label>
        Upload Image
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>

      <br /><br />

      <label>
        Prompt
        <br />
        <textarea
          placeholder="Describe how the image should turn into a video"
          rows={4}
          style={{ width: '100%' }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </label>

      <br /><br />

      <button
        onClick
