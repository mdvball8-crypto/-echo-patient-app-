import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AlertTriangle, Activity, Bell, Check, Droplets, UtensilsCrossed, Bath, Thermometer, Snowflake, RotateCcw, Moon, Heart } from 'lucide-react';

const HomeScreen = () => {
  const { t, handleQuickButton, playSound, speak } = useApp();

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
    // Speak the button label
    speak(t(button.labelKey));
    // Handle the button action
    handleQuickButton(button.id);
  };

  return (
    <div className="p-4 space-y-3">
      {buttons.map((button) => {
        const Icon = button.icon;
        const isEmergency = button.size === 'xl';
        const label = t(button.labelKey);
        const desc = t(button.descKey);

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
              relative overflow-hidden
            `}
            aria-label={label}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12" />

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
    </div>
  );
};

export default HomeScreen;
