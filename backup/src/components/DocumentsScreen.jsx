import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Camera, Image, Trash2, Download, Eye, Plus, X, FileText } from 'lucide-react';
import { format } from 'date-fns';

const DocumentsScreen = () => {
  const { playSound, isKidsMode } = useApp();
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddPhoto = () => {
    playSound('click');
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc = {
          id: Date.now(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          data: reader.result,
          timestamp: new Date(),
          notes: ''
        };
        setDocuments(prev => [newDoc, ...prev]);
        playSound('success');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDelete = (id) => {
    playSound('click');
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setSelectedDoc(null);
  };

  const handleAddNote = (id, note) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id ? { ...doc, notes: note } : doc
    ));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center gradient-text mb-6">
        {isKidsMode ? '📷 My Pictures!' : 'Documents & Photos'}
      </h2>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx"
        className="hidden"
      />

      {/* Add Photo Button */}
      <button
        onClick={handleAddPhoto}
        className="w-full py-6 mb-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/30"
      >
        <Plus className="w-8 h-8" />
        {isKidsMode ? '📸 Add Picture!' : 'Add Photo / Document'}
      </button>

      {/* Quick capture buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={handleAddPhoto}
          className="py-4 rounded-2xl bg-dark-700 hover:bg-dark-600 transition-all flex flex-col items-center gap-2"
        >
          <Camera className="w-8 h-8 text-cyan-400" />
          <span className="text-gray-300 font-medium">Take Photo</span>
        </button>
        <button
          onClick={handleAddPhoto}
          className="py-4 rounded-2xl bg-dark-700 hover:bg-dark-600 transition-all flex flex-col items-center gap-2"
        >
          <Image className="w-8 h-8 text-cyan-400" />
          <span className="text-gray-300 font-medium">From Gallery</span>
        </button>
      </div>

      {/* Documents list */}
      {documents.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No documents yet</p>
          <p className="text-gray-500 text-sm mt-2">
            {isKidsMode
              ? 'Tap the big button to add a picture!'
              : 'Add photos of prescriptions, test results, or anything important'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">
            Your Documents ({documents.length})
          </h3>

          {documents.map((doc) => (
            <div
              key={doc.id}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div
                onClick={() => { setSelectedDoc(doc); playSound('click'); }}
                className="w-16 h-16 rounded-lg bg-dark-600 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
              >
                {doc.type === 'image' ? (
                  <img src={doc.data} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-white font-medium truncate">{doc.name}</p>
                <p className="text-gray-500 text-sm">
                  {format(new Date(doc.timestamp), 'MMM d, yyyy h:mm a')}
                </p>
                {doc.notes && (
                  <p className="text-cyan-400 text-sm mt-1">📝 {doc.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedDoc(doc); playSound('click'); }}
                  className="p-2 rounded-lg bg-dark-600 hover:bg-cyan-500/20 transition-all"
                >
                  <Eye className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-lg bg-dark-600 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document viewer modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-dark-600">
            <h3 className="text-white font-semibold truncate">{selectedDoc.name}</h3>
            <button
              onClick={() => setSelectedDoc(null)}
              className="p-2 hover:bg-dark-700 rounded-lg"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            {selectedDoc.type === 'image' ? (
              <img
                src={selectedDoc.data}
                alt=""
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center">
                <FileText className="w-24 h-24 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Document preview not available</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-dark-600">
            <input
              type="text"
              placeholder="Add a note..."
              value={selectedDoc.notes}
              onChange={(e) => handleAddNote(selectedDoc.id, e.target.value)}
              className="w-full p-3 bg-dark-700 rounded-xl text-white placeholder-gray-500 border border-dark-600 focus:border-cyan-500 focus:outline-none mb-3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(selectedDoc.id)}
                className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> Delete
              </button>
              <a
                href={selectedDoc.data}
                download={selectedDoc.name}
                onClick={() => playSound('click')}
                className="flex-1 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Save
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsScreen;
