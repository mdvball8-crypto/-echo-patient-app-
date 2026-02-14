import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Lightbulb, Volume2, Thermometer, Wind, Bed, Tv, Music, Coffee } from 'lucide-react';

const ComfortScreen = () => {
  const { t, playSound, addAlert, isKidsMode, speak, language } = useApp();

  // Comfort options with translation support
  const comfortOptions = [
    {
      id: 'lights',
      emoji: '💡',
      icon: Lightbulb,
      labelKey: 'lights',
      options: [
        { key: 'brighter', en: 'Brighter', es: 'Más Brillante' },
        { key: 'dimmer', en: 'Dimmer', es: 'Más Tenue' },
        { key: 'off', en: 'Off', es: 'Apagado' }
      ],
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'volume',
      emoji: '🔊',
      icon: Volume2,
      labelKey: 'volume',
      options: [
        { key: 'louder', en: 'Louder', es: 'Más Fuerte' },
        { key: 'quieter', en: 'Quieter', es: 'Más Bajo' },
        { key: 'mute', en: 'Mute', es: 'Silencio' }
      ],
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'temperature',
      emoji: '🌡️',
      icon: Thermometer,
      labelKey: 'temperature',
      options: [
        { key: 'warmer', en: 'Warmer', es: 'Más Caliente' },
        { key: 'cooler', en: 'Cooler', es: 'Más Frío' }
      ],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'fan',
      emoji: '🌀',
      icon: Wind,
      labelKey: 'fan',
      options: [
        { key: 'turnOn', en: 'Turn On', es: 'Encender' },
        { key: 'turnOff', en: 'Turn Off', es: 'Apagar' },
        { key: 'faster', en: 'Faster', es: 'Más Rápido' },
        { key: 'slower', en: 'Slower', es: 'Más Lento' }
      ],
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'bed',
      emoji: '🛏️',
      icon: Bed,
      labelKey: 'bedPosition',
      options: [
        { key: 'raiseHead', en: 'Raise Head', es: 'Subir Cabecera' },
        { key: 'lowerHead', en: 'Lower Head', es: 'Bajar Cabecera' },
        { key: 'raiseFeet', en: 'Raise Feet', es: 'Subir Pies' },
        { key: 'lowerFeet', en: 'Lower Feet', es: 'Bajar Pies' }
      ],
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 'tv',
      emoji: '📺',
      icon: Tv,
      labelKey: 'tv',
      options: [
        { key: 'turnOn', en: 'Turn On', es: 'Encender' },
        { key: 'turnOff', en: 'Turn Off', es: 'Apagar' },
        { key: 'changeChannel', en: 'Change Channel', es: 'Cambiar Canal' }
      ],
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      id: 'music',
      emoji: '🎵',
      icon: Music,
      labelKey: 'music',
      options: [
        { key: 'play', en: 'Play', es: 'Reproducir' },
        { key: 'pause', en: 'Pause', es: 'Pausar' },
        { key: 'next', en: 'Next', es: 'Siguiente' },
        { key: 'previous', en: 'Previous', es: 'Anterior' }
      ],
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'blanket',
      emoji: '🧣',
      icon: Coffee,
      labelKey: 'blanket',
      options: [
        { key: 'extraBlanket', en: 'Extra Blanket', es: 'Cobija Extra' },
        { key: 'removeBlanket', en: 'Remove Blanket', es: 'Quitar Cobija' }
      ],
      gradient: 'from-amber-600 to-orange-600'
    },
  ];

  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    playSound('click');
    speak(t(item.labelKey));
  };

  const handleOptionSelect = (itemLabel, option) => {
    const optionLabel = option[language] || option.en;
    playSound('success');
    speak(optionLabel);
    addAlert('info', `${itemLabel}: ${optionLabel} ${language === 'es' ? 'solicitado' : 'requested'}`);
    setSelectedItem(null);
  };

  const handleBack = () => {
    setSelectedItem(null);
    playSound('click');
    speak(t('back'));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center gradient-text mb-6">
        {isKidsMode
          ? (language === 'es' ? '🛋️ ¡Ponte cómodo!' : '🛋️ Make yourself comfy!')
          : t('comfortControls')
        }
      </h2>

      {selectedItem ? (
        // Options view
        <div>
          <button
            onClick={handleBack}
            className="mb-4 text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
            aria-label={t('back')}
          >
            ← {t('back')}
          </button>

          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <span className="text-4xl">{selectedItem.emoji}</span>
            {t(selectedItem.labelKey)}
          </h3>

          <div className="space-y-3">
            {selectedItem.options.map((option) => {
              const optionLabel = option[language] || option.en;
              return (
                <button
                  key={option.key}
                  onClick={() => handleOptionSelect(t(selectedItem.labelKey), option)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r ${selectedItem.gradient} text-white hover:scale-[1.02] transition-all`}
                  aria-label={optionLabel}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // Main grid
        <div className="grid grid-cols-2 gap-4">
          {comfortOptions.map((item) => {
            const Icon = item.icon;
            const label = t(item.labelKey);
            return (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className={`
                  p-6 rounded-2xl bg-gradient-to-br ${item.gradient}
                  hover:scale-105 transition-all shadow-lg
                `}
                aria-label={label}
              >
                <div className="flex flex-col items-center gap-3">
                  {isKidsMode ? (
                    <span className="text-5xl">{item.emoji}</span>
                  ) : (
                    <Icon className="w-10 h-10 text-white" />
                  )}
                  <span className="font-bold text-white text-lg">{label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComfortScreen;
