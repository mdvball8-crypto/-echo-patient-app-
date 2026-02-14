import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Lightbulb, Volume2, Thermometer, Wind, Bed, Tv, Music, Coffee } from 'lucide-react';

const ComfortScreen = () => {
  const { t, playSound, addAlert, isKidsMode } = useApp();

  const comfortOptions = [
    {
      id: 'lights',
      emoji: '💡',
      icon: Lightbulb,
      label: 'Adjust Lights',
      options: ['Brighter', 'Dimmer', 'Off'],
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'volume',
      emoji: '🔊',
      icon: Volume2,
      label: 'Adjust Volume',
      options: ['Louder', 'Quieter', 'Mute'],
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'temperature',
      emoji: '🌡️',
      icon: Thermometer,
      label: 'Room Temperature',
      options: ['Warmer', 'Cooler'],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'fan',
      emoji: '🌀',
      icon: Wind,
      label: 'Fan',
      options: ['Turn On', 'Turn Off', 'Faster', 'Slower'],
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'bed',
      emoji: '🛏️',
      icon: Bed,
      label: 'Bed Position',
      options: ['Raise Head', 'Lower Head', 'Raise Feet', 'Lower Feet'],
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 'tv',
      emoji: '📺',
      icon: Tv,
      label: 'TV',
      options: ['Turn On', 'Turn Off', 'Change Channel'],
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      id: 'music',
      emoji: '🎵',
      icon: Music,
      label: 'Music',
      options: ['Play', 'Pause', 'Next', 'Previous'],
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'blanket',
      emoji: '🧣',
      icon: Coffee,
      label: 'Blanket',
      options: ['Extra Blanket', 'Remove Blanket'],
      gradient: 'from-amber-600 to-orange-600'
    },
  ];

  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleOptionSelect = (itemLabel, option) => {
    playSound('success');
    addAlert('info', `${itemLabel}: ${option} requested`);
    setSelectedItem(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center gradient-text mb-6">
        {isKidsMode ? '🛋️ Make yourself comfy!' : 'Comfort Controls'}
      </h2>

      {selectedItem ? (
        // Options view
        <div>
          <button
            onClick={() => { setSelectedItem(null); playSound('click'); }}
            className="mb-4 text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
          >
            ← Back
          </button>

          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <span className="text-4xl">{selectedItem.emoji}</span>
            {selectedItem.label}
          </h3>

          <div className="space-y-3">
            {selectedItem.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(selectedItem.label, option)}
                className={`w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r ${selectedItem.gradient} text-white hover:scale-[1.02] transition-all`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Main grid
        <div className="grid grid-cols-2 gap-4">
          {comfortOptions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedItem(item); playSound('click'); }}
                className={`
                  p-6 rounded-2xl bg-gradient-to-br ${item.gradient}
                  hover:scale-105 transition-all shadow-lg
                `}
              >
                <div className="flex flex-col items-center gap-3">
                  {isKidsMode ? (
                    <span className="text-5xl">{item.emoji}</span>
                  ) : (
                    <Icon className="w-10 h-10 text-white" />
                  )}
                  <span className="font-bold text-white text-lg">{item.label}</span>
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
