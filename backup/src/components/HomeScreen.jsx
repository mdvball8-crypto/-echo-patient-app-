import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AlertTriangle, Activity, Bell, Check, Droplets, UtensilsCrossed, Bath, Thermometer, Snowflake, RotateCcw, Moon, Heart } from 'lucide-react';

const HomeScreen = () => {
  const { t, handleQuickButton, playSound } = useApp();

  const buttons = [
    {
      id: 'emergency',
      emoji: '🚨',
      icon: AlertTriangle,
      label: t('emergency'),
      desc: t('emergencyDesc'),
      gradient: 'from-red-600 to-red-700',
      size: 'xl',
      pulse: true
    },
    {
      id: 'pain',
      emoji: '😣',
      icon: Activity,
      label: t('pain'),
      desc: t('painDesc'),
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'help',
      emoji: '🔔',
      icon: Bell,
      label: t('help'),
      desc: t('helpDesc'),
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'okay',
      emoji: '✅',
      icon: Check,
      label: t('okay'),
      desc: t('okayDesc'),
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'thirsty',
      emoji: '💧',
      icon: Droplets,
      label: t('thirsty'),
      desc: t('thirstyDesc'),
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'hungry',
      emoji: '🍽️',
      icon: UtensilsCrossed,
      label: t('hungry'),
      desc: t('hungryDesc'),
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 'bathroom',
      emoji: '🚽',
      icon: Bath,
      label: t('bathroom'),
      desc: t('bathroomDesc'),
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'hot',
      emoji: '🥵',
      icon: Thermometer,
      label: t('hot'),
      desc: t('hotDesc'),
      gradient: 'from-red-500 to-orange-500'
    },
    {
      id: 'cold',
      emoji: '🥶',
      icon: Snowflake,
      label: t('cold'),
      desc: t('coldDesc'),
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'dizzy',
      emoji: '😵‍💫',
      icon: RotateCcw,
      label: t('dizzy'),
      desc: t('dizzyDesc'),
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 'tired',
      emoji: '😴',
      icon: Moon,
      label: t('tired'),
      desc: t('tiredDesc'),
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'anxious',
      emoji: '😰',
      icon: Heart,
      label: t('anxious'),
      desc: t('anxiousDesc'),
      gradient: 'from-pink-500 to-rose-500'
    },
  ];

  const handlePress = (buttonId) => {
    playSound(buttonId === 'emergency' ? 'emergency' : 'beep');
    handleQuickButton(buttonId);
  };

  return (
    <div className="p-4 space-y-3">
      {buttons.map((button) => {
        const Icon = button.icon;
        const isEmergency = button.size === 'xl';

        return (
          <button
            key={button.id}
            onClick={() => handlePress(button.id)}
            className={`
              w-full rounded-2xl bg-gradient-to-r ${button.gradient}
              transform transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              shadow-lg hover:shadow-xl
              ${isEmergency ? 'py-6' : 'py-4'}
              ${button.pulse ? 'emergency-pulse' : ''}
              relative overflow-hidden
            `}
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
                    {button.label}
                  </span>
                  <p className="text-white/70 text-sm hidden sm:block">
                    {button.desc}
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
