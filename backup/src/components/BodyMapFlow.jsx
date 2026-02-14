import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, ArrowRight, Check, Flame, ArrowDownCircle, Zap, Circle, Activity, Hash, Sparkles, Bug, Frown, Maximize } from 'lucide-react';

const BodyMapFlow = ({ onComplete }) => {
  const { t, playSound, recordPain, addActivityLog, isKidsMode } = useApp();

  // Flow steps: 1=body, 2=sensations, 3=pain scale, 4=help options
  const [step, setStep] = useState(1);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedSensations, setSelectedSensations] = useState([]);
  const [painLevel, setPainLevel] = useState(5);
  const [viewMode, setViewMode] = useState('external');

  // External body parts
  const externalParts = [
    { id: 'head', label: t('head'), emoji: '🧠', x: 50, y: 8 },
    { id: 'neck', label: t('neck'), emoji: '📍', x: 50, y: 18 },
    { id: 'chest', label: t('chest'), emoji: '💪', x: 50, y: 28 },
    { id: 'stomach', label: t('stomach'), emoji: '🫃', x: 50, y: 42 },
    { id: 'leftArm', label: t('leftArm'), emoji: '💪', x: 25, y: 35 },
    { id: 'rightArm', label: t('rightArm'), emoji: '💪', x: 75, y: 35 },
    { id: 'leftHand', label: t('leftHand'), emoji: '🖐️', x: 18, y: 50 },
    { id: 'rightHand', label: t('rightHand'), emoji: '🖐️', x: 82, y: 50 },
    { id: 'leftLeg', label: t('leftLeg'), emoji: '🦵', x: 38, y: 65 },
    { id: 'rightLeg', label: t('rightLeg'), emoji: '🦵', x: 62, y: 65 },
    { id: 'leftFoot', label: t('leftFoot'), emoji: '🦶', x: 35, y: 88 },
    { id: 'rightFoot', label: t('rightFoot'), emoji: '🦶', x: 65, y: 88 },
  ];

  // Internal organs
  const internalParts = [
    { id: 'brain', label: t('brain'), emoji: '🧠', x: 50, y: 10, color: '#ec4899' },
    { id: 'heart', label: t('heart'), emoji: '❤️', x: 45, y: 30, color: '#ef4444' },
    { id: 'lungs', label: t('lungs'), emoji: '🫁', x: 50, y: 28, color: '#f97316' },
    { id: 'liver', label: t('liver'), emoji: '🫀', x: 60, y: 42, color: '#84cc16' },
    { id: 'stomach', label: t('stomach'), emoji: '🟡', x: 45, y: 45, color: '#eab308' },
    { id: 'kidneys', label: t('kidneys'), emoji: '🫘', x: 50, y: 52, color: '#8b5cf6' },
    { id: 'intestines', label: t('intestines'), emoji: '🌀', x: 50, y: 62, color: '#f472b6' },
    { id: 'bladder', label: t('bladder'), emoji: '💧', x: 50, y: 72, color: '#06b6d4' },
  ];

  // Sensations
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

  // Help options
  const helpOptions = [
    { id: 'nurse', emoji: '👩‍⚕️', label: 'Call Nurse' },
    { id: 'medicine', emoji: '💊', label: 'Need Medicine' },
    { id: 'position', emoji: '🛏️', label: 'Change Position' },
    { id: 'ice', emoji: '🧊', label: 'Ice Pack' },
    { id: 'heat', emoji: '🔥', label: 'Heat Pack' },
    { id: 'rest', emoji: '😴', label: 'Just Rest' },
  ];

  const toggleBodyPart = (partId) => {
    playSound('click');
    setSelectedBodyParts(prev =>
      prev.includes(partId)
        ? prev.filter(p => p !== partId)
        : [...prev, partId]
    );
  };

  const toggleSensation = (sensationId) => {
    playSound('click');
    setSelectedSensations(prev =>
      prev.includes(sensationId)
        ? prev.filter(s => s !== sensationId)
        : [...prev, sensationId]
    );
  };

  const goNext = () => {
    playSound('click');
    if (step < 4) setStep(step + 1);
  };

  const goBack = () => {
    playSound('click');
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = (helpType) => {
    playSound('success');
    // Record the pain with all details
    recordPain(painLevel, selectedBodyParts, selectedSensations);
    addActivityLog('pain', `Pain logged: ${painLevel}/10 in ${selectedBodyParts.join(', ')}. Sensations: ${selectedSensations.join(', ')}. Requested: ${helpType}`);
    // Go back to home
    onComplete();
  };

  const currentParts = viewMode === 'external' ? externalParts : internalParts;

  return (
    <div className="p-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              s === step
                ? 'bg-cyan-500 w-8'
                : s < step
                  ? 'bg-cyan-500'
                  : 'bg-dark-600'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Body Map */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-center gradient-text mb-4">
            {isKidsMode ? '👆 Show me where it hurts!' : t('selectBodyPart')}
          </h2>

          {/* View toggle */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => { setViewMode('external'); playSound('click'); }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                viewMode === 'external'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-dark-700 text-gray-400'
              }`}
            >
              {t('externalBody')}
            </button>
            <button
              onClick={() => { setViewMode('internal'); playSound('click'); }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                viewMode === 'internal'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-dark-700 text-gray-400'
              }`}
            >
              {t('internalOrgans')}
            </button>
          </div>

          {/* Body visualization */}
          <div className="relative w-full max-w-sm mx-auto aspect-[3/4] glass rounded-3xl p-4 mb-4">
            {/* Body outline */}
            <div className="absolute inset-4 flex items-center justify-center opacity-20">
              <span className="text-[200px]">🧍</span>
            </div>

            {/* Clickable body parts */}
            {currentParts.map((part) => (
              <button
                key={part.id}
                onClick={() => toggleBodyPart(part.id)}
                className={`
                  absolute transform -translate-x-1/2 -translate-y-1/2
                  w-14 h-14 rounded-full flex items-center justify-center
                  transition-all duration-200 text-2xl
                  ${selectedBodyParts.includes(part.id)
                    ? 'bg-cyan-500 scale-125 shadow-lg shadow-cyan-500/50 ring-4 ring-cyan-400/50'
                    : 'bg-dark-600 hover:bg-dark-500'
                  }
                `}
                style={{ left: `${part.x}%`, top: `${part.y}%` }}
              >
                {part.emoji}
              </button>
            ))}
          </div>

          {/* Selected parts */}
          {selectedBodyParts.length > 0 && (
            <div className="glass rounded-xl p-3 mb-4">
              <p className="text-gray-400 text-sm mb-2">Selected:</p>
              <div className="flex flex-wrap gap-2">
                {selectedBodyParts.map((partId) => {
                  const part = [...externalParts, ...internalParts].find(p => p.id === partId);
                  return (
                    <span
                      key={partId}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm"
                    >
                      {part?.emoji} {part?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={goNext}
            disabled={selectedBodyParts.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              selectedBodyParts.length > 0
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'bg-dark-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {t('next')} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Sensations */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-center gradient-text mb-4">
            {isKidsMode ? '🤔 What does it feel like?' : t('selectSensations')}
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {sensations.map((sensation) => {
              const Icon = sensation.icon;
              const isSelected = selectedSensations.includes(sensation.id);

              return (
                <button
                  key={sensation.id}
                  onClick={() => toggleSensation(sensation.id)}
                  className={`
                    p-4 rounded-2xl transition-all duration-200
                    ${isSelected
                      ? `bg-gradient-to-br ${sensation.color} scale-105 shadow-lg`
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
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {sensation.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-4 rounded-2xl font-bold bg-dark-700 text-gray-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> {t('back')}
            </button>
            <button
              onClick={goNext}
              className="flex-1 py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center gap-2"
            >
              {t('next')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Pain Scale */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-center gradient-text mb-4">
            {isKidsMode ? '📊 How much does it hurt?' : t('currentPainLevel')}
          </h2>

          {/* Pain level display */}
          <div className="flex flex-col items-center mb-6">
            <div className={`
              w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold mb-4
              ${painLevel <= 3 ? 'bg-green-500' :
                painLevel <= 6 ? 'bg-yellow-500' :
                painLevel <= 8 ? 'bg-orange-500' : 'bg-red-500'
              } text-white shadow-2xl
            `}>
              {painLevel}
            </div>
            <span className="text-xl font-semibold text-gray-300">
              {painLevel <= 2 ? t('noPain') :
                painLevel <= 4 ? t('mildPain') :
                painLevel <= 6 ? t('moderatePain') :
                painLevel <= 8 ? t('severePain') : t('worstPain')
              }
            </span>
          </div>

          {/* Pain scale buttons */}
          <div className="flex justify-between gap-1 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button
                key={level}
                onClick={() => { setPainLevel(level); playSound('click'); }}
                className={`
                  flex-1 py-3 rounded-xl font-bold transition-all
                  ${painLevel === level
                    ? `${level <= 3 ? 'bg-green-500' :
                        level <= 6 ? 'bg-yellow-500' :
                        level <= 8 ? 'bg-orange-500' : 'bg-red-500'
                      } text-white scale-110 shadow-lg`
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Color bar */}
          <div className="h-4 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 mb-6" />

          {/* Kids mode faces */}
          {isKidsMode && (
            <div className="flex justify-around mb-6">
              <span className="text-3xl">😊</span>
              <span className="text-3xl">🙂</span>
              <span className="text-3xl">😐</span>
              <span className="text-3xl">😟</span>
              <span className="text-3xl">😢</span>
              <span className="text-3xl">😭</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-4 rounded-2xl font-bold bg-dark-700 text-gray-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> {t('back')}
            </button>
            <button
              onClick={goNext}
              className="flex-1 py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center gap-2"
            >
              {t('next')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Help Options */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold text-center gradient-text mb-4">
            {isKidsMode ? '🩹 How can we help?' : 'How can we help?'}
          </h2>

          {/* Summary */}
          <div className="glass rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm mb-2">Your report:</p>
            <div className="space-y-2">
              <p className="text-white">
                <span className="text-cyan-400">Pain Level:</span> {painLevel}/10
              </p>
              <p className="text-white">
                <span className="text-cyan-400">Location:</span> {selectedBodyParts.map(id => {
                  const part = [...externalParts, ...internalParts].find(p => p.id === id);
                  return part?.label;
                }).join(', ') || 'Not specified'}
              </p>
              <p className="text-white">
                <span className="text-cyan-400">Sensations:</span> {selectedSensations.map(id => {
                  const sens = sensations.find(s => s.id === id);
                  return sens?.label;
                }).join(', ') || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Help options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {helpOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleComplete(option.label)}
                className="p-4 rounded-2xl bg-dark-700 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 transition-all group"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="font-medium text-gray-300 group-hover:text-white">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={goBack}
            className="w-full py-4 rounded-2xl font-bold bg-dark-700 text-gray-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> {t('back')}
          </button>
        </div>
      )}
    </div>
  );
};

export default BodyMapFlow;
