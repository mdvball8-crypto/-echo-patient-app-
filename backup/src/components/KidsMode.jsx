import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const KidsMode = () => {
  const { t, handleQuickButton, playSound, currentPainLevel, setCurrentPainLevel, recordPain } = useApp();
  const [slothMessage, setSlothMessage] = useState('');
  const [isSlothTalking, setIsSlothTalking] = useState(false);

  // Sloth messages
  const slothMessages = {
    greeting: [
      "Hi friend! I'm Sammy! 🦥",
      "How can I help you today?",
      "Take your time! 😊"
    ],
    emergency: ["Help is coming! 🚨", "Don't worry, you're safe!"],
    pain: ["Oh no! Let's get help! 😢", "I'll tell the grown-ups!"],
    thirsty: ["Water coming! 💧", "Good job telling me!"],
    hungry: ["Yummy food soon! 🍎", "I'm hungry too sometimes!"],
    bathroom: ["Help is coming! 🚽", "Good job asking!"],
    okay: ["Yay! So happy! 🌟", "That's great news! 😊"],
    encouragement: ["You're amazing! 🌟", "So proud of you! 💪", "Great job! ⭐"]
  };

  const speakMessage = (type) => {
    const messages = slothMessages[type] || slothMessages.encouragement;
    const message = messages[Math.floor(Math.random() * messages.length)];
    setSlothMessage(message);
    setIsSlothTalking(true);
    setTimeout(() => setIsSlothTalking(false), 3000);
  };

  useEffect(() => {
    speakMessage('greeting');
  }, []);

  const handleKidsButton = (type) => {
    playSound(type === 'emergency' ? 'emergency' : 'beep');
    handleQuickButton(type);
    speakMessage(type);
  };

  // Kids buttons - pastel colors, vertical layout
  const kidsButtons = [
    { id: 'emergency', emoji: '🚨', label: 'HELP ME!', color: 'from-red-400 to-red-500', size: 'xl' },
    { id: 'pain', emoji: '🤕', label: 'Ouch! It hurts!', color: 'from-orange-300 to-orange-400' },
    { id: 'okay', emoji: '😊', label: "I'm feeling good!", color: 'from-green-300 to-emerald-400' },
    { id: 'thirsty', emoji: '💧', label: 'I want water', color: 'from-sky-300 to-blue-400' },
    { id: 'hungry', emoji: '🍎', label: "I'm hungry", color: 'from-lime-300 to-green-400' },
    { id: 'bathroom', emoji: '🚽', label: 'Bathroom please', color: 'from-cyan-300 to-teal-400' },
    { id: 'cold', emoji: '🥶', label: "I'm cold", color: 'from-blue-200 to-blue-400' },
    { id: 'hot', emoji: '🥵', label: "I'm hot", color: 'from-amber-300 to-orange-400' },
    { id: 'tired', emoji: '😴', label: "I'm sleepy", color: 'from-indigo-300 to-purple-400' },
    { id: 'anxious', emoji: '😰', label: "I'm scared", color: 'from-pink-300 to-rose-400' },
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
        Hi there! How do you feel?
      </h1>

      {/* Big vertical buttons */}
      <div className="space-y-3">
        {kidsButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleKidsButton(button.id)}
            className={`
              w-full rounded-3xl bg-gradient-to-r ${button.color}
              transform transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              shadow-lg hover:shadow-xl
              ${button.size === 'xl' ? 'py-6' : 'py-4'}
              relative overflow-hidden
            `}
          >
            <div className="flex items-center justify-center gap-4">
              <span className={`${button.size === 'xl' ? 'text-5xl' : 'text-4xl'}`}>
                {button.emoji}
              </span>
              <span className={`font-bold text-white drop-shadow-md ${button.size === 'xl' ? 'text-2xl' : 'text-xl'}`}>
                {button.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-amber-300">Sammy is proud of you! ⭐ 🦥 ⭐</p>
      </div>
    </div>
  );
};

export default KidsMode;
