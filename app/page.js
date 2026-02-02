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

  function getCharacterCount() {
    return (title?.length || 0) + (content?.length || 0);
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>
        123456<span style={styles.badge}>{notes.length}</span>
      </h1>

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
        <div style={styles.formFooter}>
          <span style={styles.charCount}>{getCharacterCount()} characters</span>
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
  main: { maxWidth: 480, margin: '0 auto', padding: 24, fontFamily: 'system-ui', color: '#1e3a8a' },
  h1: { marginBottom: 24, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 10 },
  badge: { fontSize: 14, background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: 20, fontWeight: 500 },
  form: { marginBottom: 32 },
  input: { width: '100%', padding: 12, marginBottom: 12, border: '1px solid #93c5fd', borderRadius: 6, boxSizing: 'border-box', background: '#fff', color: '#1e3a8a' },
  textarea: { resize: 'vertical', minHeight: 60 },
  formFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  charCount: { fontSize: 12, color: '#3b82f6' },
  buttons: { display: 'flex', gap: 8 },
  btn: { padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  btnSecondary: { padding: '10px 20px', background: '#93c5fd', color: '#1e3a8a', border: 'none', borderRadius: 6, cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  note: { padding: 16, border: '1px solid #93c5fd', borderRadius: 8, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f8fafc' },
  content: { margin: '8px 0 0', color: '#3b82f6', fontSize: 14 },
  noteActions: { display: 'flex', gap: 8 },
  smallBtn: { padding: '6px 12px', fontSize: 12, background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: 4, cursor: 'pointer' },
  deleteBtn: { background: '#fee2e2', color: '#dc2626' },
};
