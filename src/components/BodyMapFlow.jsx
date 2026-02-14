import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, ArrowRight, Flame, ArrowDownCircle, Zap, Circle, Activity, Hash, Sparkles, Bug, Frown, Maximize } from 'lucide-react';

const BodyMapFlow = ({ onComplete }) => {
  const { t, playSound, recordPain, addActivityLog, isKidsMode, speak, language } = useApp();

  // Flow steps: 1=body, 2=sensations, 3=pain scale, 4=help options
  const [step, setStep] = useState(1);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedSensations, setSelectedSensations] = useState([]);
  const [painLevel, setPainLevel] = useState(5);
  const [viewMode, setViewMode] = useState('external');
  const [hoveredPart, setHoveredPart] = useState(null);

  // External body parts - positioned as clickable regions on SVG body
  const externalParts = [
    { id: 'head', labelKey: 'head' },
    { id: 'neck', labelKey: 'neck' },
    { id: 'chest', labelKey: 'chest' },
    { id: 'stomach', labelKey: 'abdomen' },
    { id: 'leftArm', labelKey: 'leftArm' },
    { id: 'rightArm', labelKey: 'rightArm' },
    { id: 'leftHand', labelKey: 'leftHand' },
    { id: 'rightHand', labelKey: 'rightHand' },
    { id: 'hips', labelKey: 'hips' },
    { id: 'leftLeg', labelKey: 'leftLeg' },
    { id: 'rightLeg', labelKey: 'rightLeg' },
    { id: 'leftFoot', labelKey: 'leftFoot' },
    { id: 'rightFoot', labelKey: 'rightFoot' },
  ];

  // Internal organs
  const internalParts = [
    { id: 'brain', labelKey: 'brain' },
    { id: 'throat', labelKey: 'throat' },
    { id: 'heart', labelKey: 'heart' },
    { id: 'leftLung', labelKey: 'leftLung' },
    { id: 'rightLung', labelKey: 'rightLung' },
    { id: 'liver', labelKey: 'liver' },
    { id: 'stomachOrgan', labelKey: 'stomachOrgan' },
    { id: 'intestines', labelKey: 'intestines' },
    { id: 'bladder', labelKey: 'bladder' },
  ];

  // Sensations with translations
  const sensations = [
    { id: 'burning', icon: Flame, emoji: '🔥', labelKey: 'burning', color: 'from-orange-500 to-red-500' },
    { id: 'pressure', icon: ArrowDownCircle, emoji: '⬇️', labelKey: 'pressure', color: 'from-blue-500 to-indigo-500' },
    { id: 'sharp', icon: Zap, emoji: '⚡', labelKey: 'sharp', color: 'from-yellow-500 to-orange-500' },
    { id: 'dull', icon: Circle, emoji: '⚫', labelKey: 'dull', color: 'from-gray-500 to-gray-600' },
    { id: 'throbbing', icon: Activity, emoji: '💓', labelKey: 'throbbing', color: 'from-red-500 to-pink-500' },
    { id: 'numbness', icon: Hash, emoji: '🧊', labelKey: 'numbness', color: 'from-cyan-400 to-blue-400' },
    { id: 'tingling', icon: Sparkles, emoji: '✨', labelKey: 'tingling', color: 'from-purple-400 to-pink-400' },
    { id: 'itching', icon: Bug, emoji: '🐛', labelKey: 'itching', color: 'from-green-500 to-lime-500' },
    { id: 'nausea', icon: Frown, emoji: '🤢', labelKey: 'nausea', color: 'from-green-600 to-teal-500' },
    { id: 'tightness', icon: Maximize, emoji: '🔒', labelKey: 'tightness', color: 'from-indigo-500 to-purple-500' },
  ];

  // Help options with translations
  const helpOptions = [
    { id: 'nurse', emoji: '👩‍⚕️', labelKey: 'callNurse' },
    { id: 'medicine', emoji: '💊', labelKey: 'needMedicine' },
    { id: 'position', emoji: '🛏️', labelKey: 'changePosition' },
    { id: 'ice', emoji: '🧊', labelKey: 'icePack' },
    { id: 'heat', emoji: '🔥', labelKey: 'heatPack' },
    { id: 'rest', emoji: '😴', labelKey: 'justRest' },
  ];

  const toggleBodyPart = (partId, labelKey) => {
    playSound('click');
    const label = t(labelKey);

    if (selectedBodyParts.includes(partId)) {
      setSelectedBodyParts(prev => prev.filter(p => p !== partId));
      speak(`${label} ${language === 'es' ? 'deseleccionado' : 'deselected'}`);
    } else {
      setSelectedBodyParts(prev => [...prev, partId]);
      speak(`${label} ${language === 'es' ? 'seleccionado' : 'selected'}`);
    }
  };

  const toggleSensation = (sensation) => {
    playSound('click');
    const label = t(sensation.labelKey);

    if (selectedSensations.includes(sensation.id)) {
      setSelectedSensations(prev => prev.filter(s => s !== sensation.id));
    } else {
      setSelectedSensations(prev => [...prev, sensation.id]);
      speak(label);
    }
  };

  const handlePainLevelChange = (level) => {
    setPainLevel(level);
    playSound('click');

    let severity;
    if (level <= 2) severity = t('noPain');
    else if (level <= 4) severity = t('mildPain');
    else if (level <= 6) severity = t('moderatePain');
    else if (level <= 8) severity = t('severePain');
    else severity = t('worstPain');

    speak(`${level}, ${severity}`);
  };

  const goNext = () => {
    playSound('click');
    if (step < 4) {
      setStep(step + 1);
      if (step === 1) speak(t('selectSensations'));
      else if (step === 2) speak(t('currentPainLevel'));
      else if (step === 3) speak(t('howCanWeHelp'));
    }
  };

  const goBack = () => {
    playSound('click');
    speak(t('back'));
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = (helpOption) => {
    playSound('success');
    const helpLabel = t(helpOption.labelKey);
    speak(helpLabel);

    recordPain(painLevel, selectedBodyParts, selectedSensations);

    const allParts = [...externalParts, ...internalParts];
    const bodyPartLabels = selectedBodyParts.map(id => {
      const part = allParts.find(p => p.id === id);
      return part ? t(part.labelKey) : id;
    });
    const sensationLabels = selectedSensations.map(id => {
      const sens = sensations.find(s => s.id === id);
      return sens ? t(sens.labelKey) : id;
    });

    addActivityLog('pain', `Pain logged: ${painLevel}/10 in ${bodyPartLabels.join(', ')}. Sensations: ${sensationLabels.join(', ')}. Requested: ${helpLabel}`);
    onComplete();
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    playSound('click');
    speak(mode === 'external' ? t('externalBody') : t('internalOrgans'));
  };

  // Check if a part is selected
  const isSelected = (partId) => selectedBodyParts.includes(partId);
  const isHovered = (partId) => hoveredPart === partId;

  // Get fill color for body part
  const getPartColor = (partId, baseColor = '#E8BEAC') => {
    if (isSelected(partId)) return '#06b6d4';
    if (isHovered(partId)) return '#67e8f9';
    return baseColor;
  };

  // Get stroke for body part
  const getPartStroke = (partId) => {
    if (isSelected(partId)) return { stroke: '#0891b2', strokeWidth: 3 };
    if (isHovered(partId)) return { stroke: '#22d3ee', strokeWidth: 2 };
    return { stroke: '#c9a388', strokeWidth: 1 };
  };

  // External Body SVG
  const ExternalBodySVG = () => (
    <svg viewBox="0 0 200 340" className="w-full h-full max-h-[420px]">
      {/* Head */}
      <ellipse
        cx="100" cy="30" rx="28" ry="30"
        fill={getPartColor('head')}
        {...getPartStroke('head')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('head', 'head')}
        onMouseEnter={() => setHoveredPart('head')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      {(isHovered('head') || isSelected('head')) && (
        <text x="100" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{t('head')}</text>
      )}

      {/* Neck */}
      <rect
        x="88" y="58" width="24" height="20" rx="4"
        fill={getPartColor('neck')}
        {...getPartStroke('neck')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('neck', 'neck')}
        onMouseEnter={() => setHoveredPart('neck')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Chest/Torso */}
      <path
        d="M60 78 Q60 75 70 75 L130 75 Q140 75 140 78 L145 140 Q145 145 140 145 L60 145 Q55 145 55 140 Z"
        fill={getPartColor('chest')}
        {...getPartStroke('chest')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('chest', 'chest')}
        onMouseEnter={() => setHoveredPart('chest')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      {(isHovered('chest') || isSelected('chest')) && (
        <text x="100" y="115" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{t('chest')}</text>
      )}

      {/* Stomach/Abdomen */}
      <path
        d="M60 145 L140 145 L135 195 Q130 200 100 200 Q70 200 65 195 Z"
        fill={getPartColor('stomach')}
        {...getPartStroke('stomach')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('stomach', 'abdomen')}
        onMouseEnter={() => setHoveredPart('stomach')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      {(isHovered('stomach') || isSelected('stomach')) && (
        <text x="100" y="175" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{t('abdomen')}</text>
      )}

      {/* Hips */}
      <ellipse
        cx="100" cy="215" rx="40" ry="18"
        fill={getPartColor('hips')}
        {...getPartStroke('hips')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('hips', 'hips')}
        onMouseEnter={() => setHoveredPart('hips')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Left Arm */}
      <path
        d="M55 80 Q45 80 40 90 L25 160 Q22 170 28 172 L38 172 Q44 170 46 160 L58 100 Q60 90 55 80"
        fill={getPartColor('leftArm')}
        {...getPartStroke('leftArm')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('leftArm', 'leftArm')}
        onMouseEnter={() => setHoveredPart('leftArm')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Right Arm */}
      <path
        d="M145 80 Q155 80 160 90 L175 160 Q178 170 172 172 L162 172 Q156 170 154 160 L142 100 Q140 90 145 80"
        fill={getPartColor('rightArm')}
        {...getPartStroke('rightArm')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('rightArm', 'rightArm')}
        onMouseEnter={() => setHoveredPart('rightArm')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Left Hand */}
      <ellipse
        cx="30" cy="185" rx="14" ry="18"
        fill={getPartColor('leftHand')}
        {...getPartStroke('leftHand')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('leftHand', 'leftHand')}
        onMouseEnter={() => setHoveredPart('leftHand')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Right Hand */}
      <ellipse
        cx="170" cy="185" rx="14" ry="18"
        fill={getPartColor('rightHand')}
        {...getPartStroke('rightHand')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('rightHand', 'rightHand')}
        onMouseEnter={() => setHoveredPart('rightHand')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Left Leg */}
      <path
        d="M75 230 Q70 230 68 240 L60 300 Q58 310 65 312 L80 312 Q87 310 85 300 L88 240 Q90 230 85 230 Z"
        fill={getPartColor('leftLeg')}
        {...getPartStroke('leftLeg')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('leftLeg', 'leftLeg')}
        onMouseEnter={() => setHoveredPart('leftLeg')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Right Leg */}
      <path
        d="M125 230 Q130 230 132 240 L140 300 Q142 310 135 312 L120 312 Q113 310 115 300 L112 240 Q110 230 115 230 Z"
        fill={getPartColor('rightLeg')}
        {...getPartStroke('rightLeg')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('rightLeg', 'rightLeg')}
        onMouseEnter={() => setHoveredPart('rightLeg')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Left Foot */}
      <ellipse
        cx="68" cy="328" rx="18" ry="10"
        fill={getPartColor('leftFoot')}
        {...getPartStroke('leftFoot')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('leftFoot', 'leftFoot')}
        onMouseEnter={() => setHoveredPart('leftFoot')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Right Foot */}
      <ellipse
        cx="132" cy="328" rx="18" ry="10"
        fill={getPartColor('rightFoot')}
        {...getPartStroke('rightFoot')}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('rightFoot', 'rightFoot')}
        onMouseEnter={() => setHoveredPart('rightFoot')}
        onMouseLeave={() => setHoveredPart(null)}
      />
    </svg>
  );

  // Internal Organs SVG
  const InternalOrgansSVG = () => (
    <svg viewBox="0 0 200 300" className="w-full h-full max-h-[420px]">
      {/* Body outline (faded) */}
      <ellipse cx="100" cy="25" rx="25" ry="25" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
      <path d="M75 50 L125 50 L130 180 Q100 190 70 180 Z" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4" />

      {/* Brain */}
      <ellipse
        cx="100" cy="25" rx="22" ry="20"
        fill={isSelected('brain') ? '#06b6d4' : isHovered('brain') ? '#f9a8d4' : '#ec4899'}
        stroke={isSelected('brain') ? '#0891b2' : '#be185d'}
        strokeWidth={isSelected('brain') ? 3 : 1.5}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('brain', 'brain')}
        onMouseEnter={() => setHoveredPart('brain')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="100" y="32" textAnchor="middle" fontSize="28" style={{pointerEvents: 'none'}}>🧠</text>

      {/* Throat/Esophagus */}
      <rect
        x="92" y="48" width="16" height="25" rx="6"
        fill={isSelected('throat') ? '#06b6d4' : isHovered('throat') ? '#fda4af' : '#f87171'}
        stroke={isSelected('throat') ? '#0891b2' : '#dc2626'}
        strokeWidth={isSelected('throat') ? 3 : 1.5}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('throat', 'throat')}
        onMouseEnter={() => setHoveredPart('throat')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="100" y="66" textAnchor="middle" fontSize="16" style={{pointerEvents: 'none'}}>🔴</text>

      {/* Left Lung */}
      <ellipse
        cx="68" cy="95" rx="20" ry="30"
        fill={isSelected('leftLung') ? '#06b6d4' : isHovered('leftLung') ? '#fda4af' : '#f472b6'}
        stroke={isSelected('leftLung') ? '#0891b2' : '#be185d'}
        strokeWidth={isSelected('leftLung') ? 3 : 1.5}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('leftLung', 'leftLung')}
        onMouseEnter={() => setHoveredPart('leftLung')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="68" y="102" textAnchor="middle" fontSize="26" style={{pointerEvents: 'none'}}>🫁</text>

      {/* Right Lung */}
      <ellipse
        cx="132" cy="95" rx="20" ry="30"
        fill={isSelected('rightLung') ? '#06b6d4' : isHovered('rightLung') ? '#fda4af' : '#f472b6'}
        stroke={isSelected('rightLung') ? '#0891b2' : '#be185d'}
        strokeWidth={isSelected('rightLung') ? 3 : 1.5}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('rightLung', 'rightLung')}
        onMouseEnter={() => setHoveredPart('rightLung')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="132" y="102" textAnchor="middle" fontSize="26" style={{pointerEvents: 'none'}}>🫁</text>

      {/* Heart - center between lungs, slightly left */}
      <ellipse
        cx="100" cy="95" rx="16" ry="18"
        fill={isSelected('heart') ? '#06b6d4' : isHovered('heart') ? '#fca5a5' : '#ef4444'}
        stroke={isSelected('heart') ? '#0891b2' : '#b91c1c'}
        strokeWidth={isSelected('heart') ? 3 : 2}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('heart', 'heart')}
        onMouseEnter={() => setHoveredPart('heart')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="100" y="102" textAnchor="middle" fontSize="22" style={{pointerEvents: 'none'}}>🫀</text>

      {/* Stomach - left side with J-shape appearance */}
      <ellipse
        cx="78" cy="145" rx="22" ry="18"
        fill={isSelected('stomachOrgan') ? '#06b6d4' : isHovered('stomachOrgan') ? '#fde68a' : '#facc15'}
        stroke={isSelected('stomachOrgan') ? '#0891b2' : '#ca8a04'}
        strokeWidth={isSelected('stomachOrgan') ? 3 : 1.5}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('stomachOrgan', 'stomachOrgan')}
        onMouseEnter={() => setHoveredPart('stomachOrgan')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="78" y="152" textAnchor="middle" fontSize="24" style={{pointerEvents: 'none'}}>🫗</text>

      {/* Liver - right side, larger, reddish-brown */}
      <ellipse
        cx="125" cy="140" rx="25" ry="20"
        fill={isSelected('liver') ? '#06b6d4' : isHovered('liver') ? '#fca5a5' : '#b91c1c'}
        stroke={isSelected('liver') ? '#0891b2' : '#7f1d1d'}
        strokeWidth={isSelected('liver') ? 3 : 1.5}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('liver', 'liver')}
        onMouseEnter={() => setHoveredPart('liver')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="125" y="147" textAnchor="middle" fontSize="26" style={{pointerEvents: 'none'}}>🟤</text>

      {/* Intestines */}
      <ellipse
        cx="100" cy="190" rx="38" ry="25"
        fill={isSelected('intestines') ? '#06b6d4' : isHovered('intestines') ? '#fda4af' : '#fb7185'}
        stroke={isSelected('intestines') ? '#0891b2' : '#be123c'}
        strokeWidth={isSelected('intestines') ? 3 : 1.5}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('intestines', 'intestines')}
        onMouseEnter={() => setHoveredPart('intestines')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="100" y="198" textAnchor="middle" fontSize="32" style={{pointerEvents: 'none'}}>🌀</text>

      {/* Bladder */}
      <ellipse
        cx="100" cy="235" rx="20" ry="16"
        fill={isSelected('bladder') ? '#06b6d4' : isHovered('bladder') ? '#67e8f9' : '#22d3ee'}
        stroke={isSelected('bladder') ? '#0891b2' : '#0891b2'}
        strokeWidth={isSelected('bladder') ? 3 : 1.5}
        className="cursor-pointer transition-all duration-200"
        onClick={() => toggleBodyPart('bladder', 'bladder')}
        onMouseEnter={() => setHoveredPart('bladder')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      <text x="100" y="243" textAnchor="middle" fontSize="22" style={{pointerEvents: 'none'}}>💧</text>
    </svg>
  );

  const currentParts = viewMode === 'external' ? externalParts : internalParts;

  return (
    <div className="p-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-3 rounded-full transition-all ${
              s === step
                ? 'bg-cyan-500 w-8'
                : s < step
                  ? 'bg-cyan-500 w-3'
                  : 'bg-dark-600 w-3'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Body Map */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-center gradient-text mb-3">
            {isKidsMode ? t('showMeWhere') : t('selectBodyPart')}
          </h2>

          {/* View toggle */}
          <div className="flex justify-center gap-2 mb-3">
            <button
              onClick={() => handleViewModeChange('external')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
                viewMode === 'external'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-dark-700 text-gray-400 hover:text-white'
              }`}
              aria-label={t('externalBody')}
            >
              🧍 {t('externalBody')}
            </button>
            <button
              onClick={() => handleViewModeChange('internal')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
                viewMode === 'internal'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-dark-700 text-gray-400 hover:text-white'
              }`}
              aria-label={t('internalOrgans')}
            >
              🫀 {t('internalOrgans')}
            </button>
          </div>

          {/* Body visualization */}
          <div className="glass rounded-2xl p-4 mb-3 flex justify-center items-center" style={{ minHeight: '440px' }}>
            {viewMode === 'external' ? <ExternalBodySVG /> : <InternalOrgansSVG />}
          </div>

          {/* Selected parts display */}
          {selectedBodyParts.length > 0 && (
            <div className="glass rounded-xl p-3 mb-3">
              <p className="text-gray-400 text-sm mb-2">{t('selected')}:</p>
              <div className="flex flex-wrap gap-2">
                {selectedBodyParts.map((partId) => {
                  const part = [...externalParts, ...internalParts].find(p => p.id === partId);
                  return (
                    <span
                      key={partId}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium"
                    >
                      {part ? t(part.labelKey) : partId}
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
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-dark-700 text-gray-500 cursor-not-allowed'
            }`}
            aria-label={t('next')}
          >
            {t('next')} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Sensations */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold text-center gradient-text mb-4">
            {isKidsMode ? '🤔 ' + t('selectSensations') : t('selectSensations')}
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {sensations.map((sensation) => {
              const Icon = sensation.icon;
              const isSelectedSens = selectedSensations.includes(sensation.id);
              const label = t(sensation.labelKey);

              return (
                <button
                  key={sensation.id}
                  onClick={() => toggleSensation(sensation)}
                  className={`
                    p-4 rounded-2xl transition-all duration-200
                    ${isSelectedSens
                      ? `bg-gradient-to-br ${sensation.color} scale-105 shadow-lg`
                      : 'bg-dark-700 hover:bg-dark-600'
                    }
                  `}
                  aria-label={label}
                >
                  <div className="flex flex-col items-center gap-2">
                    {isKidsMode ? (
                      <span className="text-3xl">{sensation.emoji}</span>
                    ) : (
                      <Icon className={`w-8 h-8 ${isSelectedSens ? 'text-white' : 'text-gray-400'}`} />
                    )}
                    <span className={`font-medium text-sm ${isSelectedSens ? 'text-white' : 'text-gray-300'}`}>
                      {label}
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
              aria-label={t('back')}
            >
              <ArrowLeft className="w-5 h-5" /> {t('back')}
            </button>
            <button
              onClick={goNext}
              className="flex-1 py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
              aria-label={t('next')}
            >
              {t('next')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Pain Scale */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold text-center gradient-text mb-4">
            {isKidsMode ? '📊 ' + t('currentPainLevel') : t('currentPainLevel')}
          </h2>

          {/* Pain level display */}
          <div className="flex flex-col items-center mb-6">
            <div className={`
              w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold mb-3
              ${painLevel <= 3 ? 'bg-green-500' :
                painLevel <= 6 ? 'bg-yellow-500' :
                painLevel <= 8 ? 'bg-orange-500' : 'bg-red-500'
              } text-white shadow-2xl
            `}>
              {painLevel}
            </div>
            <span className="text-lg font-semibold text-gray-300">
              {painLevel <= 2 ? t('noPain') :
                painLevel <= 4 ? t('mildPain') :
                painLevel <= 6 ? t('moderatePain') :
                painLevel <= 8 ? t('severePain') : t('worstPain')
              }
            </span>
          </div>

          {/* Pain scale buttons */}
          <div className="flex justify-between gap-1 mb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button
                key={level}
                onClick={() => handlePainLevelChange(level)}
                className={`
                  flex-1 py-3 rounded-xl font-bold transition-all text-sm
                  ${painLevel === level
                    ? `${level <= 3 ? 'bg-green-500' :
                        level <= 6 ? 'bg-yellow-500' :
                        level <= 8 ? 'bg-orange-500' : 'bg-red-500'
                      } text-white scale-110 shadow-lg`
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                  }
                `}
                aria-label={`${t('painLevel')} ${level}`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Color bar */}
          <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 mb-4" />

          {/* Kids mode faces */}
          {isKidsMode && (
            <div className="flex justify-around mb-4">
              <span className="text-2xl">😊</span>
              <span className="text-2xl">🙂</span>
              <span className="text-2xl">😐</span>
              <span className="text-2xl">😟</span>
              <span className="text-2xl">😢</span>
              <span className="text-2xl">😭</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-4 rounded-2xl font-bold bg-dark-700 text-gray-300 flex items-center justify-center gap-2"
              aria-label={t('back')}
            >
              <ArrowLeft className="w-5 h-5" /> {t('back')}
            </button>
            <button
              onClick={goNext}
              className="flex-1 py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
              aria-label={t('next')}
            >
              {t('next')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Help Options */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold text-center gradient-text mb-4">
            {isKidsMode ? '🩹 ' + t('howCanWeHelp') : t('howCanWeHelp')}
          </h2>

          {/* Summary */}
          <div className="glass rounded-xl p-4 mb-4">
            <p className="text-gray-400 text-sm mb-2">{t('yourReport')}:</p>
            <div className="space-y-1 text-sm">
              <p className="text-white">
                <span className="text-cyan-400">{t('painLevel')}:</span> {painLevel}/10
              </p>
              <p className="text-white">
                <span className="text-cyan-400">{t('location')}:</span> {selectedBodyParts.map(id => {
                  const part = [...externalParts, ...internalParts].find(p => p.id === id);
                  return part ? t(part.labelKey) : id;
                }).join(', ') || t('notSpecified')}
              </p>
              <p className="text-white">
                <span className="text-cyan-400">{t('sensations')}:</span> {selectedSensations.map(id => {
                  const sens = sensations.find(s => s.id === id);
                  return sens ? t(sens.labelKey) : id;
                }).join(', ') || t('notSpecified')}
              </p>
            </div>
          </div>

          {/* Help options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {helpOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleComplete(option)}
                className="p-4 rounded-2xl bg-dark-700 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 transition-all group"
                aria-label={t(option.labelKey)}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="font-medium text-gray-300 group-hover:text-white text-sm">
                    {t(option.labelKey)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={goBack}
            className="w-full py-4 rounded-2xl font-bold bg-dark-700 text-gray-300 flex items-center justify-center gap-2"
            aria-label={t('back')}
          >
            <ArrowLeft className="w-5 h-5" /> {t('back')}
          </button>
        </div>
      )}
    </div>
  );
};

export default BodyMapFlow;
