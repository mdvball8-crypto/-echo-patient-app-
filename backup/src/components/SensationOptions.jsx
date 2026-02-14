import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Flame, ArrowDownCircle, Zap, Circle, Activity, Hash, Sparkles, Bug, Frown, Maximize } from 'lucide-react';

const SensationOptions = () => {
  const { t, selectedSensations, setSelectedSensations, playSound, isKidsMode } = useApp();

  const sensations = [
    { id: 'burning', icon: Flame, emoji: '🔥', label: t('burning'), color: 'from-orange-500 to-red-500' },
    { id: 'pressure', icon: ArrowDownCircle, emoji: '⬇️', label: t('pressure'), color: 'from-blue-500 to-indigo-500' },
    { id: 'sharp', icon: Zap, emoji: '⚡', label: t('sharp'), color: 'from-yellow-500 to-orange-500' },
    { id: 'dull', icon: Circle, emoji: '⚫', label: t('dull'), color: 'from-gray-500 to-gray-600' },
    { id: 'throbbing', icon: Activity, emoji: '💓', label: t('throbbing'), color: 'from-red-500 to-pink-500' },
    { id: 'numbness', icon: Hash, emoji: '🧊', label: t('numbness'), color: 'from-cyan-400 to-blue-400' },
    { id: 'tingling', icon: Sparkles, emoji: '✨', label: t('tingling'), color: 'from-purple-400 to-pink-400' },
    { id: 'itching', icon: Bug, emoji: '🐛', label: t('itching'), color: 'from-green-500 to-lime-500' },
    { id: 'nausea', icon: Frown, emoji: '🤢', label: t('nausea'), color: 'from-green-600 to-teal-500' },
    { id: 'tightness', icon: Maximize, emoji: '🔒', label: t('tightness'), color: 'from-indigo-500 to-purple-500' },
  ];

  const toggleSensation = (id) => {
    playSound('click');
    setSelectedSensations(prev => {
      if (prev.includes(id)) {
        return prev.filter(s => s !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <div className="p-4">
      <h2 className={`text-2xl font-bold mb-6 text-center ${isKidsMode ? 'text-yellow-400' : 'gradient-text'}`}>
        {t('sensationOptions')}
      </h2>

      <p className="text-gray-400 text-center mb-6">
        {t('selectSensations')}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {sensations.map((sensation) => {
          const Icon = sensation.icon;
          const isSelected = selectedSensations.includes(sensation.id);

          return (
            <button
              key={sensation.id}
              onClick={() => toggleSensation(sensation.id)}
              className={`
                relative p-4 rounded-2xl transition-all duration-200
                ${isSelected
                  ? `bg-gradient-to-br ${sensation.color} shadow-lg scale-105`
                  : 'bg-dark-700 hover:bg-dark-600'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                {isKidsMode ? (
                  <span className="text-3xl">{sensation.emoji}</span>
                ) : (
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                )}
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {sensation.label}
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected sensations summary */}
      {selectedSensations.length > 0 && (
        <div className="mt-6 glass rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            {t('selectedSensations')}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedSensations.map((id) => {
              const sensation = sensations.find(s => s.id === id);
              return (
                <span
                  key={id}
                  onClick={() => toggleSensation(id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                    bg-gradient-to-r ${sensation.color} text-white hover:opacity-80 transition-opacity`}
                >
                  {isKidsMode && sensation.emoji} {sensation.label} ×
                </span>
              );
            })}
          </div>
          <button
            onClick={() => { setSelectedSensations([]); playSound('click'); }}
            className="mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default SensationOptions;
