'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  async function fetchNotes() {
    const sb = getSupabase();
    const { data } = await sb.from('notes').select('*').order('created_at', { ascending: false });
    setNotes(data || []);
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const sb = getSupabase();
    if (editingId) {
      await sb.from('notes').update({ title, content }).eq('id', editingId);
      setEditingId(null);
    } else {
      await sb.from('notes').insert([{ title, content }]);
    }
    setTitle('');
    setContent('');
    fetchNotes();
  }

  async function handleDelete(id) {
    await getSupabase().from('notes').delete().eq('id', id);
    fetchNotes();
  }

  function startEdit(note) {
    setTitle(note.title);
    setContent(note.content || '');
    setEditingId(note.id);
  }

  function cancelEdit() {
    setTitle('');
    setContent('');
    setEditingId(null);
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Notes</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...styles.input, ...styles.textarea }}
          rows={3}
        />
        <div style={styles.buttons}>
          <button type="submit" style={styles.btn}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={styles.btnSecondary}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul style={styles.list}>
        {notes.map((note) => (
          <li key={note.id} style={styles.note}>
            <div>
              <strong>{note.title}</strong>
              {note.content && <p style={styles.content}>{note.content}</p>}
            </div>
            <div style={styles.noteActions}>
              <button onClick={() => startEdit(note)} style={styles.smallBtn}>Edit</button>
              <button onClick={() => handleDelete(note.id)} style={{ ...styles.smallBtn, ...styles.deleteBtn }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

const styles = {
  main: { maxWidth: 480, margin: '0 auto', padding: 24, fontFamily: 'system-ui' },
  h1: { marginBottom: 24 },
  form: { marginBottom: 32 },
  input: { width: '100%', padding: 12, marginBottom: 12, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' },
  textarea: { resize: 'vertical', minHeight: 60 },
  buttons: { display: 'flex', gap: 8 },
  btn: { padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  btnSecondary: { padding: '10px 20px', background: '#666', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  note: { padding: 16, border: '1px solid #eee', borderRadius: 8, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  content: { margin: '8px 0 0', color: '#555', fontSize: 14 },
  noteActions: { display: 'flex', gap: 8 },
  smallBtn: { padding: '6px 12px', fontSize: 12, background: '#eee', border: 'none', borderRadius: 4, cursor: 'pointer' },
  deleteBtn: { background: '#fee', color: '#c00' },
};
