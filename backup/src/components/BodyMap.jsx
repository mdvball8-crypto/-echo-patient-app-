import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const BodyMap = () => {
  const { t, selectedBodyParts, setSelectedBodyParts, playSound, isKidsMode } = useApp();
  const [viewMode, setViewMode] = useState('external'); // 'external' or 'internal'

  const handleBodyPartClick = (part) => {
    playSound('click');
    setSelectedBodyParts(prev => {
      if (prev.includes(part)) {
        return prev.filter(p => p !== part);
      }
      return [...prev, part];
    });
  };

  const isSelected = (part) => selectedBodyParts.includes(part);

  // External body parts with SVG paths
  const externalBodyParts = [
    { id: 'head', label: t('head'), path: 'M150,30 C180,30 200,50 200,80 C200,110 180,130 150,130 C120,130 100,110 100,80 C100,50 120,30 150,30', cx: 150, cy: 80 },
    { id: 'neck', label: t('neck'), path: 'M135,130 L165,130 L165,155 L135,155 Z', cx: 150, cy: 142 },
    { id: 'chest', label: t('chest'), path: 'M100,155 L200,155 L210,230 L90,230 Z', cx: 150, cy: 192 },
    { id: 'abdomen', label: t('abdomen'), path: 'M90,230 L210,230 L200,310 L100,310 Z', cx: 150, cy: 270 },
    { id: 'leftArm', label: t('leftArm'), path: 'M90,160 L60,160 L40,280 L55,285 L70,180 L90,180 Z', cx: 65, cy: 220 },
    { id: 'rightArm', label: t('rightArm'), path: 'M210,160 L240,160 L260,280 L245,285 L230,180 L210,180 Z', cx: 235, cy: 220 },
    { id: 'leftHand', label: t('leftHand'), path: 'M35,280 L55,290 L50,320 L30,310 Z', cx: 42, cy: 300 },
    { id: 'rightHand', label: t('rightHand'), path: 'M245,280 L265,290 L270,320 L250,310 Z', cx: 258, cy: 300 },
    { id: 'leftLeg', label: t('leftLeg'), path: 'M100,310 L140,310 L130,450 L90,450 Z', cx: 115, cy: 380 },
    { id: 'rightLeg', label: t('rightLeg'), path: 'M160,310 L200,310 L210,450 L170,450 Z', cx: 185, cy: 380 },
    { id: 'leftFoot', label: t('leftFoot'), path: 'M85,450 L130,450 L125,480 L75,480 Z', cx: 102, cy: 465 },
    { id: 'rightFoot', label: t('rightFoot'), path: 'M170,450 L215,450 L225,480 L175,480 Z', cx: 198, cy: 465 },
  ];

  // Internal organs
  const internalOrgans = [
    { id: 'brain', label: t('brain'), cx: 150, cy: 70, rx: 35, ry: 30, color: '#ec4899' },
    { id: 'heart', label: t('heart'), cx: 160, cy: 190, rx: 25, ry: 25, color: '#ef4444' },
    { id: 'lungs', label: t('lungs'), cx: 150, cy: 185, rx: 55, ry: 35, color: '#f97316', isLungs: true },
    { id: 'liver', label: t('liver'), cx: 180, cy: 250, rx: 30, ry: 20, color: '#84cc16' },
    { id: 'stomach', label: t('stomach'), cx: 135, cy: 265, rx: 25, ry: 20, color: '#eab308' },
    { id: 'kidneys', label: t('kidneys'), cx: 150, cy: 285, rx: 50, ry: 15, color: '#8b5cf6', isKidneys: true },
    { id: 'intestines', label: t('intestines'), cx: 150, cy: 330, rx: 40, ry: 30, color: '#f472b6' },
    { id: 'bladder', label: t('bladder'), cx: 150, cy: 370, rx: 20, ry: 15, color: '#06b6d4' },
  ];

  return (
    <div className="p-4">
      <h2 className={`text-2xl font-bold mb-4 text-center ${isKidsMode ? 'text-yellow-400' : 'gradient-text'}`}>
        {isKidsMode ? t('showMeWhere') : t('selectBodyPart')}
      </h2>

      {/* View Mode Toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { setViewMode('external'); playSound('click'); }}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            viewMode === 'external'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
          }`}
        >
          {t('externalBody')}
        </button>
        <button
          onClick={() => { setViewMode('internal'); playSound('click'); }}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            viewMode === 'internal'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
          }`}
        >
          {t('internalOrgans')}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Body SVG */}
        <div className="relative w-full max-w-sm mx-auto">
          <svg viewBox="0 0 300 500" className="w-full h-auto">
            {/* Background glow */}
            <defs>
              <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={isKidsMode ? '#fbbf24' : '#8b5cf6'} stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <ellipse cx="150" cy="250" rx="140" ry="230" fill="url(#bodyGlow)" />

            {viewMode === 'external' ? (
              // External body parts
              <>
                {externalBodyParts.map((part) => (
                  <g key={part.id} onClick={() => handleBodyPartClick(part.id)} className="body-part">
                    <path
                      d={part.path}
                      fill={isSelected(part.id)
                        ? (isKidsMode ? '#fbbf24' : '#8b5cf6')
                        : '#374151'
                      }
                      stroke={isSelected(part.id) ? '#fff' : '#4b5563'}
                      strokeWidth="2"
                      filter={isSelected(part.id) ? 'url(#glow)' : 'none'}
                      className="transition-all duration-300"
                    />
                    {isSelected(part.id) && (
                      <text
                        x={part.cx}
                        y={part.cy}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {part.label}
                      </text>
                    )}
                  </g>
                ))}
              </>
            ) : (
              // Internal organs
              <>
                {/* Body outline */}
                <path
                  d="M150,30 C190,30 210,60 210,100 L210,150 L250,150 L270,300 L250,310 L210,180 L210,320 L190,470 L160,470 L150,340 L140,470 L110,470 L90,320 L90,180 L50,310 L30,300 L50,150 L90,150 L90,100 C90,60 110,30 150,30 Z"
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="2"
                />

                {internalOrgans.map((organ) => (
                  <g key={organ.id} onClick={() => handleBodyPartClick(organ.id)} className="body-part">
                    {organ.isLungs ? (
                      // Special lungs rendering (two ellipses)
                      <>
                        <ellipse
                          cx={organ.cx - 35}
                          cy={organ.cy}
                          rx={20}
                          ry={organ.ry}
                          fill={isSelected(organ.id) ? organ.color : '#374151'}
                          stroke={isSelected(organ.id) ? '#fff' : '#4b5563'}
                          strokeWidth="2"
                          filter={isSelected(organ.id) ? 'url(#glow)' : 'none'}
                          opacity={isSelected(organ.id) ? 1 : 0.7}
                        />
                        <ellipse
                          cx={organ.cx + 35}
                          cy={organ.cy}
                          rx={20}
                          ry={organ.ry}
                          fill={isSelected(organ.id) ? organ.color : '#374151'}
                          stroke={isSelected(organ.id) ? '#fff' : '#4b5563'}
                          strokeWidth="2"
                          filter={isSelected(organ.id) ? 'url(#glow)' : 'none'}
                          opacity={isSelected(organ.id) ? 1 : 0.7}
                        />
                      </>
                    ) : organ.isKidneys ? (
                      // Special kidneys rendering (two ellipses)
                      <>
                        <ellipse
                          cx={organ.cx - 35}
                          cy={organ.cy}
                          rx={15}
                          ry={12}
                          fill={isSelected(organ.id) ? organ.color : '#374151'}
                          stroke={isSelected(organ.id) ? '#fff' : '#4b5563'}
                          strokeWidth="2"
                          filter={isSelected(organ.id) ? 'url(#glow)' : 'none'}
                          opacity={isSelected(organ.id) ? 1 : 0.7}
                        />
                        <ellipse
                          cx={organ.cx + 35}
                          cy={organ.cy}
                          rx={15}
                          ry={12}
                          fill={isSelected(organ.id) ? organ.color : '#374151'}
                          stroke={isSelected(organ.id) ? '#fff' : '#4b5563'}
                          strokeWidth="2"
                          filter={isSelected(organ.id) ? 'url(#glow)' : 'none'}
                          opacity={isSelected(organ.id) ? 1 : 0.7}
                        />
                      </>
                    ) : (
                      <ellipse
                        cx={organ.cx}
                        cy={organ.cy}
                        rx={organ.rx}
                        ry={organ.ry}
                        fill={isSelected(organ.id) ? organ.color : '#374151'}
                        stroke={isSelected(organ.id) ? '#fff' : '#4b5563'}
                        strokeWidth="2"
                        filter={isSelected(organ.id) ? 'url(#glow)' : 'none'}
                        opacity={isSelected(organ.id) ? 1 : 0.7}
                      />
                    )}
                    <text
                      x={organ.cx}
                      y={organ.cy + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {isSelected(organ.id) ? organ.label : ''}
                    </text>
                  </g>
                ))}
              </>
            )}
          </svg>
        </div>

        {/* Selected parts list */}
        <div className="w-full md:w-64">
          <h3 className="text-lg font-semibold mb-3 text-gray-300">
            {isKidsMode ? '🎯 Selected:' : 'Selected Areas:'}
          </h3>
          {selectedBodyParts.length === 0 ? (
            <p className="text-gray-500 italic">
              {isKidsMode ? 'Tap where it hurts!' : 'Tap on body parts to select'}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedBodyParts.map((part) => (
                <span
                  key={part}
                  onClick={() => handleBodyPartClick(part)}
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all
                    ${isKidsMode
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                    }`}
                >
                  {t(part)} ×
                </span>
              ))}
            </div>
          )}

          {selectedBodyParts.length > 0 && (
            <button
              onClick={() => setSelectedBodyParts([])}
              className="mt-4 px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded-lg text-gray-300 text-sm transition-all"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyMap;
