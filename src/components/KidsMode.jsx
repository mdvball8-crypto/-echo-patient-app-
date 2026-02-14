import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const KidsMode = () => {
  const { t, handleQuickButton, playSound, speak, language } = useApp();
  const [slothMessage, setSlothMessage] = useState('');
  const [isSlothTalking, setIsSlothTalking] = useState(false);

  // Sloth messages in both languages
  const slothMessages = {
    en: {
      greeting: ["Hi friend! I'm Sammy!", "How can I help you today?", "Take your time!"],
      emergency: ["Help is coming!", "Don't worry, you're safe!"],
      pain: ["Oh no! Let's get help!", "I'll tell the grown-ups!"],
      thirsty: ["Water coming!", "Good job telling me!"],
      hungry: ["Yummy food soon!", "I'm hungry too sometimes!"],
      bathroom: ["Help is coming!", "Good job asking!"],
      okay: ["Yay! So happy!", "That's great news!"],
      cold: ["Let's get you warm!", "A blanket is coming!"],
      hot: ["Let's cool you down!", "Help is on the way!"],
      tired: ["Rest is important!", "Time for a nap?"],
      anxious: ["It's okay to feel scared", "I'm here with you!"],
      encouragement: ["You're amazing!", "So proud of you!", "Great job!"]
    },
    es: {
      greeting: ["¡Hola amigo! ¡Soy Sammy!", "¿Cómo te puedo ayudar?", "¡Tómate tu tiempo!"],
      emergency: ["¡La ayuda viene en camino!", "¡No te preocupes, estás seguro!"],
      pain: ["¡Oh no! ¡Vamos a buscar ayuda!", "¡Le diré a los adultos!"],
      thirsty: ["¡Agua en camino!", "¡Bien hecho por decirme!"],
      hungry: ["¡Comida rica pronto!", "¡Yo también tengo hambre a veces!"],
      bathroom: ["¡La ayuda viene!", "¡Bien hecho por pedir!"],
      okay: ["¡Yay! ¡Qué feliz!", "¡Qué buenas noticias!"],
      cold: ["¡Vamos a calentarte!", "¡Una cobija viene!"],
      hot: ["¡Vamos a refrescarte!", "¡La ayuda viene!"],
      tired: ["¡Descansar es importante!", "¿Hora de una siesta?"],
      anxious: ["Está bien sentir miedo", "¡Estoy aquí contigo!"],
      encouragement: ["¡Eres increíble!", "¡Muy orgulloso de ti!", "¡Buen trabajo!"]
    }
  };

  const speakMessage = (type) => {
    const messages = slothMessages[language]?.[type] || slothMessages.en[type] || slothMessages[language].encouragement;
    const message = messages[Math.floor(Math.random() * messages.length)];
    setSlothMessage(message);
    setIsSlothTalking(true);
    speak(message);
    setTimeout(() => setIsSlothTalking(false), 3000);
  };

  useEffect(() => {
    speakMessage('greeting');
  }, [language]);

  const handleKidsButton = (type, label) => {
    playSound(type === 'emergency' ? 'emergency' : 'beep');
    speak(label);
    handleQuickButton(type);
    speakMessage(type);
  };

  // Kids buttons with translation keys - pastel colors, vertical layout
  const kidsButtons = [
    { id: 'emergency', emoji: '🚨', labelKey: 'helpMe', color: 'from-red-400 to-red-500', size: 'xl' },
    { id: 'pain', emoji: '🤕', labelKey: 'ouchItHurts', color: 'from-orange-300 to-orange-400' },
    { id: 'okay', emoji: '😊', labelKey: 'imFeelingGood', color: 'from-green-300 to-emerald-400' },
    { id: 'thirsty', emoji: '💧', labelKey: 'iWantWater', color: 'from-sky-300 to-blue-400' },
    { id: 'hungry', emoji: '🍎', labelKey: 'imHungry', color: 'from-lime-300 to-green-400' },
    { id: 'bathroom', emoji: '🚽', labelKey: 'bathroomPlease', color: 'from-cyan-300 to-teal-400' },
    { id: 'cold', emoji: '🥶', labelKey: 'imCold', color: 'from-blue-200 to-blue-400' },
    { id: 'hot', emoji: '🥵', labelKey: 'imHot', color: 'from-amber-300 to-orange-400' },
    { id: 'tired', emoji: '😴', labelKey: 'imSleepy', color: 'from-indigo-300 to-purple-400' },
    { id: 'anxious', emoji: '😰', labelKey: 'imScared', color: 'from-pink-300 to-rose-400' },
  ];

  return (
    <div className="p-4 bg-gradient-to-b from-pink-100/10 via-purple-100/10 to-blue-100/10 min-h-screen">
      {/* Sloth mascot */}
      <div className="relative mb-4 flex items-center justify-center">
        <div className={`relative ${isSlothTalking ? 'animate-bounce' : ''}`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-5xl shadow-lg border-4 border-amber-100">
            🦥
          </div>
        </div>
        {slothMessage && (
          <div className="ml-4 bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-pink-200 max-w-[200px]">
            <p className="text-gray-700 font-medium text-sm">{slothMessage}</p>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-amber-400 mb-4">
        {t('hiThere')}
      </h1>

      {/* Big vertical buttons */}
      <div className="space-y-3">
        {kidsButtons.map((button) => {
          const label = t(button.labelKey);
          return (
            <button
              key={button.id}
              onClick={() => handleKidsButton(button.id, label)}
              className={`
                w-full rounded-3xl bg-gradient-to-r ${button.color}
                transform transition-all duration-200
                hover:scale-[1.02] active:scale-[0.98]
                shadow-lg hover:shadow-xl
                ${button.size === 'xl' ? 'py-6' : 'py-4'}
                relative overflow-hidden
              `}
              aria-label={label}
            >
              <div className="flex items-center justify-center gap-4">
                <span className={`${button.size === 'xl' ? 'text-5xl' : 'text-4xl'}`}>
                  {button.emoji}
                </span>
                <span className={`font-bold text-white drop-shadow-md ${button.size === 'xl' ? 'text-2xl' : 'text-xl'}`}>
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-amber-300">{t('sammyProud')}</p>
      </div>
    </div>
  );
};

export default KidsMode;
