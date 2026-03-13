import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Pin, Edit3, Trash2, X, FileText } from 'lucide-react';

const NotesScreen = () => {
  const {
    language,
    addNote,
    updateNote,
    deleteNote,
    toggleNotePin,
    getSortedNotes,
    playSound
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const notes = getSortedNotes();

  const labels = {
    en: {
      title: 'Notes',
      subtitle: 'Keep track of important information',
      addNote: 'Add Note',
      editNote: 'Edit Note',
      noteTitle: 'Title',
      noteContent: 'Content',
      titlePlaceholder: 'Note title...',
      contentPlaceholder: 'Write your note here...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      pin: 'Pin',
      unpin: 'Unpin',
      edit: 'Edit',
      emptyTitle: 'No Notes Yet',
      emptySubtitle: 'Tap the button below to create your first note',
      pinned: 'Pinned',
      updated: 'Updated',
    },
    es: {
      title: 'Notas',
      subtitle: 'Mantén un registro de información importante',
      addNote: 'Agregar Nota',
      editNote: 'Editar Nota',
      noteTitle: 'Título',
      noteContent: 'Contenido',
      titlePlaceholder: 'Título de la nota...',
      contentPlaceholder: 'Escribe tu nota aquí...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      pin: 'Fijar',
      unpin: 'Desfijar',
      edit: 'Editar',
      emptyTitle: 'Sin Notas Aún',
      emptySubtitle: 'Toca el botón de abajo para crear tu primera nota',
      pinned: 'Fijada',
      updated: 'Actualizada',
    }
  };

  const l = labels[language] || labels.en;

  const handleOpenEditor = (note = null) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
    }
    setIsEditing(true);
    playSound('click');
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      handleCloseEditor();
      return;
    }

    if (editingNote) {
      updateNote(editingNote.id, { title: title.trim(), content: content.trim() });
    } else {
      addNote({ title: title.trim(), content: content.trim() });
    }
    handleCloseEditor();
  };

  const handleDelete = (id) => {
    deleteNote(id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-headline" style={{ color: 'var(--color-text-primary)' }}>
          {l.title}
        </h1>
        <p className="text-caption mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          {l.subtitle}
        </p>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="notes-empty py-16">
          <div className="notes-empty-icon">
            <FileText size={64} style={{ color: 'var(--color-text-tertiary)' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            {l.emptyTitle}
          </h3>
          <p style={{ color: 'var(--color-text-tertiary)' }}>
            {l.emptySubtitle}
          </p>
        </div>
      ) : (
        <div className="notes-container space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`note-card ${note.isPinned ? 'pinned' : ''}`}
            >
              {note.isPinned && (
                <div className="flex items-center gap-1 mb-2">
                  <Pin size={12} style={{ color: 'var(--color-accent)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                    {l.pinned}
                  </span>
                </div>
              )}

              {note.title && (
                <h3 className="note-title">{note.title}</h3>
              )}

              {note.content && (
                <p className="note-content">
                  {note.content.length > 200
                    ? note.content.substring(0, 200) + '...'
                    : note.content}
                </p>
              )}

              <div className="note-meta">
                <span>{l.updated} {formatDate(note.updatedAt)}</span>

                <div className="note-actions">
                  <button
                    onClick={() => toggleNotePin(note.id)}
                    className="note-action-btn"
                    title={note.isPinned ? l.unpin : l.pin}
                  >
                    <Pin size={16} style={{
                      color: note.isPinned ? 'var(--color-accent)' : 'inherit',
                      fill: note.isPinned ? 'var(--color-accent)' : 'none'
                    }} />
                  </button>
                  <button
                    onClick={() => handleOpenEditor(note)}
                    className="note-action-btn"
                    title={l.edit}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="note-action-btn delete"
                    title={l.delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Note FAB */}
      <button
        onClick={() => handleOpenEditor()}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{
          background: 'var(--color-accent)',
          boxShadow: '0 4px 16px var(--color-shadow-elevated)'
        }}
      >
        <Plus size={24} color="white" />
      </button>

      {/* Editor Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'var(--color-overlay)' }}
          onClick={handleCloseEditor}
        >
          <div
            className="note-editor"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="note-editor-title">
                {editingNote ? l.editNote : l.addNote}
              </h2>
              <button
                onClick={handleCloseEditor}
                className="btn-icon"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {l.noteTitle}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={l.titlePlaceholder}
                  className="input-field"
                  autoFocus
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {l.noteContent}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={l.contentPlaceholder}
                  className="input-field"
                  rows={6}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseEditor}
                  className="btn-secondary flex-1"
                >
                  {l.cancel}
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex-1"
                >
                  {l.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesScreen;
