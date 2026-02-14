import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';
import { Users, LogIn, LogOut, X, Trash2, Stethoscope, Heart, UserCheck, User } from 'lucide-react';

const VisitorLog = () => {
  const {
    t,
    visitors,
    checkInVisitor,
    checkOutVisitor,
    visitorHistory,
    deleteVisitorHistory,
    playSound,
    isKidsMode
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    type: 'family',
  });

  const visitorTypes = [
    { id: 'nurse', icon: UserCheck, label: t('nurse'), emoji: '👩‍⚕️' },
    { id: 'doctor', icon: Stethoscope, label: t('doctor'), emoji: '👨‍⚕️' },
    { id: 'family', icon: Heart, label: t('family'), emoji: '👨‍👩‍👧' },
    { id: 'friend', icon: Users, label: t('friend'), emoji: '🤝' },
    { id: 'other', icon: User, label: t('other'), emoji: '👤' },
  ];

  const handleCheckIn = () => {
    if (!newVisitor.name) {
      playSound('alert');
      return;
    }

    checkInVisitor(newVisitor);
    setNewVisitor({ name: '', type: 'family' });
    setShowAddForm(false);
  };

  const getTypeIcon = (type) => {
    const found = visitorTypes.find(v => v.id === type);
    return found ? found.icon : User;
  };

  const getTypeEmoji = (type) => {
    const found = visitorTypes.find(v => v.id === type);
    return found ? found.emoji : '👤';
  };

  return (
    <div className="p-4">
      <h2 className={`text-2xl font-bold mb-6 text-center ${isKidsMode ? 'text-yellow-400' : 'gradient-text'}`}>
        {isKidsMode ? '👋 Who Came to Visit!' : t('visitors')}
      </h2>

      {/* Check in visitor button */}
      <button
        onClick={() => { setShowAddForm(true); playSound('click'); }}
        className={`w-full mb-6 py-4 rounded-2xl font-bold transition-all btn-glow flex items-center justify-center gap-2 ${
          isKidsMode
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
        }`}
      >
        <LogIn className="w-6 h-6" />
        {t('addVisitor')}
      </button>

      {/* Current visitors */}
      {visitors.length > 0 && (
        <div className="glass rounded-2xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            {t('currentVisitors')}
          </h3>

          <div className="space-y-3">
            {visitors.map((visitor) => {
              const TypeIcon = getTypeIcon(visitor.type);
              return (
                <div
                  key={visitor.id}
                  className="p-4 bg-dark-700 rounded-xl border border-cyan-500/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-cyan-500/20">
                        {isKidsMode ? getTypeEmoji(visitor.type) : (
                          <TypeIcon className="w-6 h-6 text-cyan-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{visitor.name}</h4>
                        <p className="text-sm text-gray-400">{t(visitor.type)}</p>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                          <LogIn className="w-3 h-3" />
                          {t('inTime')}: {format(new Date(visitor.checkInTime), 'h:mm a')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => checkOutVisitor(visitor.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('checkOut')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {visitors.length > 0 && isKidsMode && (
            <div className="mt-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <p className="text-yellow-400 text-center">
                🎉 You have {visitors.length} visitor{visitors.length > 1 ? 's' : ''} right now!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add visitor form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{t('addVisitor')}</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-dark-600 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('visitorName')} *</label>
                <input
                  type="text"
                  value={newVisitor.name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter visitor's name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('visitorType')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {visitorTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewVisitor({ ...newVisitor, type: type.id })}
                        className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          newVisitor.type === type.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                        }`}
                      >
                        {isKidsMode ? (
                          <span className="text-2xl">{type.emoji}</span>
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                        <span className="text-xs">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 rounded-xl text-gray-300 font-semibold transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleCheckIn}
                  className="flex-1 py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                >
                  <LogIn className="w-5 h-5" />
                  {t('checkIn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visitor history */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">
          {t('visitorHistory')}
        </h3>

        {visitorHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noVisitors')}</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {visitorHistory.map((entry) => {
              const TypeIcon = getTypeIcon(entry.type);
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {isKidsMode ? (
                      <span className="text-xl">{getTypeEmoji(entry.type)}</span>
                    ) : (
                      <TypeIcon className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <span className="text-white font-medium">{entry.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({t(entry.type)})</span>
                      <div className="text-xs text-gray-500">
                        <span className="text-green-400">{t('inTime')}: {format(new Date(entry.checkInTime), 'h:mm a')}</span>
                        {entry.checkOutTime && (
                          <span className="text-red-400 ml-2">{t('outTime')}: {format(new Date(entry.checkOutTime), 'h:mm a')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {format(new Date(entry.checkInTime), 'MMM d')}
                    </span>
                    <button
                      onClick={() => deleteVisitorHistory(entry.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-all group"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                    </button>
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

export default VisitorLog;
