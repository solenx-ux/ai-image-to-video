'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreatePage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const uploadImage = async () => {
    setError('');
    setSuccess('');

    if (!user) {
      setError('Not logged in');
      return;
    }

    if (!file) {
      setError('No file selected');
      return;
    }

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess('Upload successful');
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Create Video</h1>

      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}

      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <textarea
        placeholder="Describe how the image should turn into a video"
        style={{ width: 400, height: 100 }}
      />

      <br /><br />

      <button onClick={uploadImage}>Upload Image</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
