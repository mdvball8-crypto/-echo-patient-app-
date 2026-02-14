import React from 'react';
import { useApp } from '../contexts/AppContext';
import {
  AlertTriangle,
  Activity,
  HelpCircle,
  ThumbsUp,
  Droplets,
  UtensilsCrossed,
  Bath,
  Thermometer,
  Snowflake,
  RotateCcw,
  Moon,
  Heart
} from 'lucide-react';

const QuickButtons = () => {
  const { t, handleQuickButton, isKidsMode } = useApp();

  const buttons = [
    { id: 'emergency', icon: AlertTriangle, emoji: '🚨', color: 'from-red-600 to-red-800', textColor: 'text-white', isEmergency: true },
    { id: 'pain', icon: Activity, emoji: '🤕', color: 'from-orange-500 to-red-600', textColor: 'text-white' },
    { id: 'help', icon: HelpCircle, emoji: '🙋', color: 'from-yellow-500 to-orange-500', textColor: 'text-black' },
    { id: 'okay', icon: ThumbsUp, emoji: '😊', color: 'from-green-500 to-emerald-600', textColor: 'text-white' },
    { id: 'thirsty', icon: Droplets, emoji: '💧', color: 'from-cyan-400 to-blue-500', textColor: 'text-white' },
    { id: 'hungry', icon: UtensilsCrossed, emoji: '🍎', color: 'from-amber-500 to-orange-600', textColor: 'text-white' },
    { id: 'bathroom', icon: Bath, emoji: '🚽', color: 'from-blue-400 to-indigo-500', textColor: 'text-white' },
    { id: 'hot', icon: Thermometer, emoji: '🥵', color: 'from-red-500 to-orange-500', textColor: 'text-white' },
    { id: 'cold', icon: Snowflake, emoji: '🥶', color: 'from-blue-300 to-cyan-500', textColor: 'text-black' },
    { id: 'dizzy', icon: RotateCcw, emoji: '😵', color: 'from-purple-500 to-pink-500', textColor: 'text-white' },
    { id: 'tired', icon: Moon, emoji: '😴', color: 'from-indigo-500 to-purple-600', textColor: 'text-white' },
    { id: 'anxious', icon: Heart, emoji: '😰', color: 'from-pink-500 to-rose-500', textColor: 'text-white' },
  ];

  return (
    <div className="p-4">
      <h2 className={`text-2xl font-bold mb-6 text-center ${isKidsMode ? 'text-yellow-400' : 'gradient-text'}`}>
        {t('quickButtons')}
      </h2>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {buttons.map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.id}
              onClick={() => handleQuickButton(button.id)}
              className={`
                relative overflow-hidden rounded-2xl p-4 md:p-6
                bg-gradient-to-br ${button.color}
                transform transition-all duration-200
                hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                ${button.isEmergency ? 'emergency-pulse col-span-3 md:col-span-4' : ''}
                btn-glow
              `}
            >
              <div className={`flex flex-col items-center justify-center gap-2 ${button.textColor}`}>
                {isKidsMode ? (
                  <span className="text-4xl md:text-5xl">{button.emoji}</span>
                ) : (
                  <Icon className={`w-8 h-8 md:w-10 md:h-10 ${button.isEmergency ? 'animate-pulse' : ''}`} />
                )}
                <span className={`font-bold text-sm md:text-lg ${button.isEmergency ? 'text-lg md:text-xl' : ''}`}>
                  {t(button.id)}
                </span>
                {!isKidsMode && (
                  <span className="text-xs opacity-80 hidden md:block">
                    {t(`${button.id}Desc`)}
                  </span>
                )}
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickButtons;
