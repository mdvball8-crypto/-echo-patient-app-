import React from 'react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';

const PainScale = () => {
  const {
    t,
    currentPainLevel,
    setCurrentPainLevel,
    recordPain,
    painHistory,
    selectedBodyParts,
    playSound,
    isKidsMode
  } = useApp();

  const handlePainSelect = (level) => {
    playSound('click');
    setCurrentPainLevel(level);
  };

  const handleRecordPain = () => {
    recordPain(currentPainLevel, selectedBodyParts);
    playSound('success');
  };

  // Pain level colors
  const getPainColor = (level) => {
    if (level === 0) return 'bg-green-500';
    if (level <= 2) return 'bg-green-400';
    if (level <= 4) return 'bg-yellow-400';
    if (level <= 6) return 'bg-orange-400';
    if (level <= 8) return 'bg-orange-600';
    return 'bg-red-500';
  };

  // Pain level faces for kids mode
  const getPainFace = (level) => {
    if (level === 0) return '😊';
    if (level <= 2) return '🙂';
    if (level <= 4) return '😐';
    if (level <= 6) return '😟';
    if (level <= 8) return '😢';
    return '😭';
  };

  const getPainLabel = (level) => {
    if (level === 0) return t('noPain');
    if (level <= 3) return t('mildPain');
    if (level <= 6) return t('moderatePain');
    if (level <= 8) return t('severePain');
    return t('worstPain');
  };

  return (
    <div className="p-4">
      <h2 className={`text-2xl font-bold mb-6 text-center ${isKidsMode ? 'text-yellow-400' : 'gradient-text'}`}>
        {t('painScale')}
      </h2>

      {/* Current pain level display */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center">
          {t('currentPainLevel')}
        </h3>

        {/* Large pain indicator */}
        <div className="flex flex-col items-center mb-6">
          {isKidsMode ? (
            <span className="text-8xl mb-2">{getPainFace(currentPainLevel)}</span>
          ) : (
            <div className={`w-32 h-32 rounded-full ${getPainColor(currentPainLevel)} flex items-center justify-center shadow-2xl`}>
              <span className="text-5xl font-bold text-white">{currentPainLevel}</span>
            </div>
          )}
          <span className="text-xl font-semibold text-gray-300 mt-3">
            {getPainLabel(currentPainLevel)}
          </span>
        </div>

        {/* Pain scale slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[...Array(11)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePainSelect(i)}
                className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                  font-bold text-sm md:text-base transition-all
                  ${currentPainLevel === i
                    ? `${getPainColor(i)} text-white scale-125 shadow-lg`
                    : 'bg-dark-600 text-gray-400 hover:bg-dark-500'
                  }
                `}
              >
                {isKidsMode ? getPainFace(i) : i}
              </button>
            ))}
          </div>

          {/* Gradient bar */}
          <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 to-red-600 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-gray-700 transition-all duration-300"
              style={{ left: `${currentPainLevel * 10}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{t('noPain')}</span>
            <span>{t('worstPain')}</span>
          </div>
        </div>

        {/* Record button */}
        <button
          onClick={handleRecordPain}
          className={`w-full py-3 rounded-xl font-bold transition-all btn-glow
            ${isKidsMode
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400'
            } text-white`}
        >
          {t('recordPain')}
        </button>
      </div>

      {/* Pain history */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">
          {t('painHistory')}
        </h3>

        {painHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            {isKidsMode ? 'No pain recorded yet! 🌟' : 'No pain history recorded'}
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {painHistory.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-dark-700 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {isKidsMode ? (
                    <span className="text-2xl">{getPainFace(entry.level)}</span>
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${getPainColor(entry.level)} flex items-center justify-center`}>
                      <span className="font-bold text-white">{entry.level}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-300 font-medium">
                      {getPainLabel(entry.level)}
                    </span>
                    {entry.bodyParts?.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {entry.bodyParts.map(p => t(p)).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(entry.timestamp), 'HH:mm')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PainScale;
