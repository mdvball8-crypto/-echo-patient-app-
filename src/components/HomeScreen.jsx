import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AlertTriangle, Activity, Bell, Check, Droplets, UtensilsCrossed, Bath, Thermometer, Snowflake, RotateCcw, Moon, Heart, Send } from 'lucide-react';

const HomeScreen = ({ onNavigate }) => {
  const { t, handleQuickButton, playSound, speak, selectedQuickButtons, clearSelectedQuickButtons } = useApp();

  const buttons = [
    {
      id: 'emergency',
      emoji: '🚨',
      icon: AlertTriangle,
      labelKey: 'emergency',
      descKey: 'emergencyDesc',
      gradient: 'from-red-600 to-red-700',
      size: 'xl',
      pulse: true
    },
    {
      id: 'pain',
      emoji: '😣',
      icon: Activity,
      labelKey: 'pain',
      descKey: 'painDesc',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'help',
      emoji: '🔔',
      icon: Bell,
      labelKey: 'help',
      descKey: 'helpDesc',
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'okay',
      emoji: '✅',
      icon: Check,
      labelKey: 'okay',
      descKey: 'okayDesc',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'thirsty',
      emoji: '💧',
      icon: Droplets,
      labelKey: 'thirsty',
      descKey: 'thirstyDesc',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'hungry',
      emoji: '🍽️',
      icon: UtensilsCrossed,
      labelKey: 'hungry',
      descKey: 'hungryDesc',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 'bathroom',
      emoji: '🚽',
      icon: Bath,
      labelKey: 'bathroom',
      descKey: 'bathroomDesc',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'hot',
      emoji: '🥵',
      icon: Thermometer,
      labelKey: 'hot',
      descKey: 'hotDesc',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      id: 'cold',
      emoji: '🥶',
      icon: Snowflake,
      labelKey: 'cold',
      descKey: 'coldDesc',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'dizzy',
      emoji: '😵‍💫',
      icon: RotateCcw,
      labelKey: 'dizzy',
      descKey: 'dizzyDesc',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 'tired',
      emoji: '😴',
      icon: Moon,
      labelKey: 'tired',
      descKey: 'tiredDesc',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'anxious',
      emoji: '😰',
      icon: Heart,
      labelKey: 'anxious',
      descKey: 'anxiousDesc',
      gradient: 'from-pink-500 to-rose-500'
    },
  ];

  const handlePress = (button) => {
    // Play sound
    playSound(button.id === 'emergency' ? 'emergency' : 'beep');
    // Speak both the label AND description together so it doesn't get cut off
    const label = t(button.labelKey);
    const desc = t(button.descKey);
    speak(`${label}. ${desc}`);
    // Handle the button action
    handleQuickButton(button.id);
  };

  const handleNextClick = () => {
    playSound('success');
    speak(t('screenDashboard'));
    if (onNavigate) {
      onNavigate('dashboard');
    }
    // Don't clear selections yet - let dashboard show them
  };

  const hasSelections = selectedQuickButtons && selectedQuickButtons.length > 0;

  return (
    <div className={`p-4 space-y-3 ${hasSelections ? 'pb-24' : ''}`}>
      {buttons.map((button) => {
        const Icon = button.icon;
        const isEmergency = button.size === 'xl';
        const label = t(button.labelKey);
        const desc = t(button.descKey);
        const isSelected = selectedQuickButtons && selectedQuickButtons.includes(button.id);

        return (
          <button
            key={button.id}
            onClick={() => handlePress(button)}
            className={`
              w-full rounded-2xl bg-gradient-to-r ${button.gradient}
              transform transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              shadow-lg hover:shadow-xl
              ${isEmergency ? 'py-6' : 'py-4'}
              ${button.pulse ? 'emergency-pulse' : ''}
              ${isSelected ? 'ring-4 ring-white/50' : ''}
              relative overflow-hidden
            `}
            aria-label={label}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12" />

            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
            )}

            <div className="relative flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <span className={`${isEmergency ? 'text-5xl' : 'text-4xl'}`}>
                  {button.emoji}
                </span>
                <div className="text-left">
                  <span className={`font-bold text-white ${isEmergency ? 'text-2xl' : 'text-xl'}`}>
                    {label}
                  </span>
                  <p className="text-white/70 text-sm hidden sm:block">
                    {desc}
                  </p>
                </div>
              </div>
              <Icon className={`text-white/50 ${isEmergency ? 'w-10 h-10' : 'w-8 h-8'}`} />
            </div>
          </button>
        );
      })}

      {/* Sticky "Next" button - appears after first tap */}
      {hasSelections && (
        <div
          className="fixed bottom-0 left-0 right-0 p-4 z-40"
          style={{
            background: 'linear-gradient(to top, var(--color-bg-primary) 80%, transparent)',
            paddingTop: '2rem'
          }}
        >
          <button
            onClick={handleNextClick}
            className="w-full max-w-4xl mx-auto py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
            style={{
              background: 'var(--color-accent)',
              color: 'white'
            }}
          >
            <span className="text-lg font-bold">
              {t('next')} ({selectedQuickButtons.length})
            </span>
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
