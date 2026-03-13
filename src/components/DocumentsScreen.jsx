import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Camera, Image, Trash2, Download, Eye, Plus, X, FileText } from 'lucide-react';
import { format } from 'date-fns';

const DocumentsScreen = () => {
  const { playSound, isKidsMode, language } = useApp();
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('echoDocuments');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Separate refs for camera and gallery inputs
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const labels = {
    en: {
      title: 'Documents & Photos',
      kidsTitle: 'My Pictures!',
      addPhotoDoc: 'Add Photo / Document',
      kidsAdd: 'Add Picture!',
      takePhoto: 'Take Photo',
      fromGallery: 'From Gallery',
      noDocuments: 'No documents yet',
      noDocsHint: 'Add photos of prescriptions, test results, or anything important',
      kidsNoDocsHint: 'Tap the big button to add a picture!',
      yourDocs: 'Your Documents',
      addNote: 'Add a note...',
      delete: 'Delete',
      save: 'Save',
    },
    es: {
      title: 'Documentos y Fotos',
      kidsTitle: '¡Mis Fotos!',
      addPhotoDoc: 'Agregar Foto / Documento',
      kidsAdd: '¡Agregar Foto!',
      takePhoto: 'Tomar Foto',
      fromGallery: 'De la Galería',
      noDocuments: 'No hay documentos aún',
      noDocsHint: 'Agrega fotos de recetas, resultados de pruebas, o cualquier cosa importante',
      kidsNoDocsHint: '¡Toca el botón grande para agregar una foto!',
      yourDocs: 'Tus Documentos',
      addNote: 'Agregar una nota...',
      delete: 'Eliminar',
      save: 'Guardar',
    }
  };

  const l = labels[language] || labels.en;

  const saveDocuments = (docs) => {
    setDocuments(docs);
    localStorage.setItem('echoDocuments', JSON.stringify(docs));
  };

  // Handle Take Photo button - uses capture attribute for native camera on mobile
  const handleTakePhoto = () => {
    playSound('click');
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Handle From Gallery button - opens photo library
  const handleFromGallery = () => {
    playSound('click');
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  // Handle file selection from either input
  const handleFileChange = (e, source) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert(language === 'es' ? 'El archivo es muy grande (máx 10MB)' : 'File too large (max 10MB)');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc = {
          id: Date.now(),
          name: file.name || `Photo_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.jpg`,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          data: reader.result,
          timestamp: new Date().toISOString(),
          notes: '',
          source: source
        };
        saveDocuments([newDoc, ...documents]);
        playSound('success');
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleDelete = (id) => {
    playSound('click');
    const newDocs = documents.filter(doc => doc.id !== id);
    saveDocuments(newDocs);
    setSelectedDoc(null);
  };

  const handleAddNote = (id, note) => {
    const newDocs = documents.map(doc =>
      doc.id === id ? { ...doc, notes: note } : doc
    );
    saveDocuments(newDocs);
    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc({ ...selectedDoc, notes: note });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center gradient-text mb-6">
        {isKidsMode ? `📷 ${l.kidsTitle}` : l.title}
      </h2>

      {/* Hidden file inputs */}
      {/* Camera input - capture="environment" triggers native camera on mobile */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={(e) => handleFileChange(e, 'camera')}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Gallery input - no capture attribute, opens photo library */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={(e) => handleFileChange(e, 'gallery')}
        accept="image/*"
        className="hidden"
      />

      {/* Add Photo Button */}
      <button
        onClick={handleTakePhoto}
        className="w-full py-6 mb-6 rounded-2xl text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent), #5856d6)',
          boxShadow: '0 8px 24px var(--color-shadow-elevated)'
        }}
      >
        <Plus className="w-8 h-8" />
        {isKidsMode ? `📸 ${l.kidsAdd}` : l.addPhotoDoc}
      </button>

      {/* Quick capture buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={handleTakePhoto}
          className="py-4 rounded-2xl transition-all flex flex-col items-center gap-2"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)'
          }}
        >
          <Camera className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
          <span style={{ color: 'var(--color-text-primary)' }} className="font-medium">
            {l.takePhoto}
          </span>
        </button>
        <button
          onClick={handleFromGallery}
          className="py-4 rounded-2xl transition-all flex flex-col items-center gap-2"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)'
          }}
        >
          <Image className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
          <span style={{ color: 'var(--color-text-primary)' }} className="font-medium">
            {l.fromGallery}
          </span>
        </button>
      </div>

      {/* Documents list */}
      {documents.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)'
          }}
        >
          <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>{l.noDocuments}</p>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
            {isKidsMode ? l.kidsNoDocsHint : l.noDocsHint}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            {l.yourDocs} ({documents.length})
          </h3>

          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div
                onClick={() => { setSelectedDoc(doc); playSound('click'); }}
                className="w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                style={{ background: 'var(--color-bg-tertiary)' }}
              >
                {doc.type === 'image' ? (
                  <img src={doc.data} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{doc.name}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                  {format(new Date(doc.timestamp), 'MMM d, yyyy h:mm a')}
                </p>
                {doc.notes && (
                  <p className="text-sm mt-1" style={{ color: 'var(--color-accent)' }}>📝 {doc.notes}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedDoc(doc); playSound('click'); }}
                  className="p-2 rounded-lg transition-all"
                  style={{ background: 'var(--color-bg-tertiary)' }}
                >
                  <Eye className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-lg transition-all hover:bg-red-500/20"
                  style={{ background: 'var(--color-bg-tertiary)' }}
                >
                  <Trash2 className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document viewer modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'var(--color-overlay)' }}
        >
          <div
            className="flex items-center justify-between p-4"
            style={{
              background: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <h3 className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{selectedDoc.name}</h3>
            <button
              onClick={() => setSelectedDoc(null)}
              className="p-2 rounded-lg"
              style={{ background: 'var(--color-bg-tertiary)' }}
            >
              <X className="w-6 h-6" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
            {selectedDoc.type === 'image' ? (
              <img
                src={selectedDoc.data}
                alt=""
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center">
                <FileText className="w-24 h-24 mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {language === 'es' ? 'Vista previa no disponible' : 'Document preview not available'}
                </p>
              </div>
            )}
          </div>

          <div
            className="p-4"
            style={{
              background: 'var(--color-bg-secondary)',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <input
              type="text"
              placeholder={l.addNote}
              value={selectedDoc.notes}
              onChange={(e) => handleAddNote(selectedDoc.id, e.target.value)}
              className="input-field mb-3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(selectedDoc.id)}
                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255, 59, 48, 0.15)',
                  color: 'var(--color-danger)'
                }}
              >
                <Trash2 className="w-5 h-5" /> {l.delete}
              </button>
              <a
                href={selectedDoc.data}
                download={selectedDoc.name}
                onClick={() => playSound('click')}
                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                style={{
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)'
                }}
              >
                <Download className="w-5 h-5" /> {l.save}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsScreen;
