import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';
import { Pill, Plus, X, Trash2, Syringe, Droplet, Hand } from 'lucide-react';

const MedicationTracker = () => {
  const {
    t,
    addMedication,
    deleteMedication,
    medicationHistory,
    playSound,
    isKidsMode
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    method: 'oral',
    givenBy: '',
    notes: ''
  });

  const methods = [
    { id: 'oral', icon: Pill, label: t('oral') },
    { id: 'iv', icon: Droplet, label: t('iv') },
    { id: 'injection', icon: Syringe, label: t('injection') },
    { id: 'topical', icon: Hand, label: t('topical') },
  ];

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.dosage) {
      playSound('alert');
      return;
    }

    addMedication(newMed);
    setNewMed({ name: '', dosage: '', method: 'oral', givenBy: '', notes: '' });
    setShowAddForm(false);
  };

  const getMethodIcon = (method) => {
    const found = methods.find(m => m.id === method);
    return found ? found.icon : Pill;
  };

  return (
    <div className="p-4">
      <h2 className={`text-2xl font-bold mb-6 text-center ${isKidsMode ? 'text-yellow-400' : 'gradient-text'}`}>
        {isKidsMode ? '💊 Medicine Time!' : t('medications')}
      </h2>

      {/* Add medication button */}
      <button
        onClick={() => { setShowAddForm(true); playSound('click'); }}
        className={`w-full mb-6 py-4 rounded-2xl font-bold transition-all btn-glow flex items-center justify-center gap-2 ${
          isKidsMode
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
        }`}
      >
        <Plus className="w-6 h-6" />
        {t('addMedication')}
      </button>

      {/* Add medication form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{t('addMedication')}</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-dark-600 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('medicationName')} *</label>
                <input
                  type="text"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g., Acetaminophen"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('dosage')} *</label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('method')}</label>
                <div className="grid grid-cols-4 gap-2">
                  {methods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setNewMed({ ...newMed, method: method.id })}
                        className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          newMed.method === method.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('givenBy')}</label>
                <input
                  type="text"
                  value={newMed.givenBy}
                  onChange={(e) => setNewMed({ ...newMed, givenBy: e.target.value })}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g., Nurse Sarah"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('notes')}</label>
                <input
                  type="text"
                  value={newMed.notes}
                  onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 rounded-xl text-gray-300 font-semibold transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddMedication}
                  className="flex-1 py-3 rounded-xl text-white font-semibold transition-all bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medication history */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">
          {t('medicationHistory')}
        </h3>

        {medicationHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noMedications')}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {medicationHistory.map((med) => {
              const MethodIcon = getMethodIcon(med.method);
              return (
                <div
                  key={med.id}
                  className="p-4 bg-dark-700 rounded-xl border border-dark-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/20">
                        <MethodIcon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{med.name}</h4>
                        <p className="text-sm text-gray-400">{med.dosage} • {t(med.method)}</p>
                        {med.givenBy && (
                          <p className="text-xs text-gray-500">By: {med.givenBy}</p>
                        )}
                        {med.notes && (
                          <p className="text-xs text-gray-500 mt-1">📝 {med.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {format(new Date(med.timestamp), 'MMM d, h:mm a')}
                      </span>
                      <button
                        onClick={() => deleteMedication(med.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;
