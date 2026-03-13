import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

const KidsMode = () => {
  const { t, handleQuickButton, playSound, speak, language, theme } = useApp();
  const [slothMessage, setSlothMessage] = useState('');
  const [isSlothTalking, setIsSlothTalking] = useState(false);

  // Sloth messages in both languages - friendlier and more encouraging
  const slothMessages = {
    en: {
      greeting: ["Hi friend! I'm Sammy the Sloth!", "How can I help you today?", "Take your time, I'm right here!"],
      emergency: ["Help is coming really fast!", "Don't worry, you're safe with me!", "Someone is coming to help!"],
      pain: ["Oh no! Let me get the grown-ups!", "I'll tell someone right away!", "Help is on the way, friend!"],
      thirsty: ["Yummy water coming soon!", "Good job telling me you're thirsty!", "Water is the best!"],
      hungry: ["Yummy food is coming!", "I get hungry too sometimes!", "Food will be here soon!"],
      bathroom: ["Someone will help you!", "Great job asking for help!", "Help is coming right now!"],
      okay: ["Yay! That makes me so happy!", "That's wonderful news!", "You're doing great!"],
      cold: ["Let's get you nice and warm!", "A cozy blanket is coming!", "We'll warm you up!"],
      hot: ["Let's cool you down!", "We'll make you comfy!", "Help is coming to cool you off!"],
      tired: ["Rest is super important!", "It's okay to rest!", "Maybe a nice nap?"],
      anxious: ["It's okay to feel scared sometimes", "I'm right here with you!", "You're so brave!"],
      encouragement: ["You're doing amazing!", "I'm so proud of you!", "You're the best!", "Great job!"]
    },
    es: {
      greeting: ["¡Hola amiguito! ¡Soy Sammy el Perezoso!", "¿Cómo te puedo ayudar hoy?", "¡Tómate tu tiempo, estoy aquí contigo!"],
      emergency: ["¡La ayuda viene muy rápido!", "¡No te preocupes, estás seguro conmigo!", "¡Alguien viene a ayudarte!"],
      pain: ["¡Oh no! ¡Voy a llamar a los adultos!", "¡Les digo ahora mismo!", "¡La ayuda viene, amiguito!"],
      thirsty: ["¡Rica agua viene pronto!", "¡Qué bien que me dijiste que tienes sed!", "¡El agua es lo mejor!"],
      hungry: ["¡Rica comida viene!", "¡Yo también tengo hambre a veces!", "¡La comida llegará pronto!"],
      bathroom: ["¡Alguien te va a ayudar!", "¡Muy bien por pedir ayuda!", "¡La ayuda viene ahora!"],
      okay: ["¡Yay! ¡Eso me hace muy feliz!", "¡Qué maravillosas noticias!", "¡Lo estás haciendo genial!"],
      cold: ["¡Vamos a calentarte bien!", "¡Una cobijita viene!", "¡Te vamos a calentar!"],
      hot: ["¡Vamos a refrescarte!", "¡Te vamos a poner cómodo!", "¡Viene ayuda para refrescarte!"],
      tired: ["¡Descansar es muy importante!", "¡Está bien descansar!", "¿Quizás una siestita?"],
      anxious: ["Está bien sentir miedo a veces", "¡Estoy aquí contigo!", "¡Eres muy valiente!"],
      encouragement: ["¡Lo estás haciendo increíble!", "¡Estoy muy orgulloso de ti!", "¡Eres el mejor!", "¡Muy bien!"]
    }
  };

  // Initialize voices when component mounts
  useEffect(() => {
    // Load voices (needed for some browsers)
    window.speechSynthesis.getVoices();
  }, []);

  const speakMessage = useCallback((type) => {
    const messages = slothMessages[language]?.[type] || slothMessages.en[type] || slothMessages[language].encouragement;
    const message = messages[Math.floor(Math.random() * messages.length)];
    setSlothMessage(message);
    setIsSlothTalking(true);
    speak(message);
    setTimeout(() => setIsSlothTalking(false), 3000);
  }, [language, speak]);

  // Greet on mount and language change
  useEffect(() => {
    const timer = setTimeout(() => {
      speakMessage('greeting');
    }, 500);
    return () => clearTimeout(timer);
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKidsButton = (type, label) => {
    playSound(type === 'emergency' ? 'emergency' : 'beep');
    handleQuickButton(type);
    // Speak the label and then Sammy's response together
    const messages = slothMessages[language]?.[type] || slothMessages.en[type] || slothMessages[language].encouragement;
    const sammyResponse = messages[Math.floor(Math.random() * messages.length)];
    // Combine both messages so they're spoken together without interruption
    speak(`${label}. ${sammyResponse}`);
    setSlothMessage(sammyResponse);
    setIsSlothTalking(true);
    setTimeout(() => setIsSlothTalking(false), 3000);
  };

  // Kids buttons with pastel colors - vertical layout
  const kidsButtons = [
    { id: 'emergency', emoji: '🚨', labelKey: 'helpMe', color: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', size: 'xl' },
    { id: 'pain', emoji: '🤕', labelKey: 'ouchItHurts', color: 'linear-gradient(135deg, #ffa94d, #ff922b)' },
    { id: 'okay', emoji: '😊', labelKey: 'imFeelingGood', color: 'linear-gradient(135deg, #69db7c, #51cf66)' },
    { id: 'thirsty', emoji: '💧', labelKey: 'iWantWater', color: 'linear-gradient(135deg, #74c0fc, #4dabf7)' },
    { id: 'hungry', emoji: '🍎', labelKey: 'imHungry', color: 'linear-gradient(135deg, #a9e34b, #94d82d)' },
    { id: 'bathroom', emoji: '🚽', labelKey: 'bathroomPlease', color: 'linear-gradient(135deg, #63e6be, #38d9a9)' },
    { id: 'cold', emoji: '🥶', labelKey: 'imCold', color: 'linear-gradient(135deg, #91a7ff, #748ffc)' },
    { id: 'hot', emoji: '🥵', labelKey: 'imHot', color: 'linear-gradient(135deg, #ffc078, #ffa94d)' },
    { id: 'tired', emoji: '😴', labelKey: 'imSleepy', color: 'linear-gradient(135deg, #b197fc, #9775fa)' },
    { id: 'anxious', emoji: '😰', labelKey: 'imScared', color: 'linear-gradient(135deg, #faa2c1, #f783ac)' },
  ];

  // Background colors based on theme
  const bgGradient = theme === 'dark'
    ? 'linear-gradient(180deg, rgba(255,182,193,0.1) 0%, rgba(186,85,211,0.1) 50%, rgba(135,206,250,0.1) 100%)'
    : 'linear-gradient(180deg, rgba(255,182,193,0.2) 0%, rgba(186,85,211,0.15) 50%, rgba(135,206,250,0.2) 100%)';

  return (
    <div className="p-4 min-h-screen" style={{ background: bgGradient }}>
      {/* Sloth mascot */}
      <div className="relative mb-4 flex items-center justify-center">
        <div className={`relative ${isSlothTalking ? 'animate-bounce' : ''}`}>
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-6xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #ffd43b, #fab005)',
              border: '4px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            🦥
          </div>
        </div>
        {slothMessage && (
          <div
            className="ml-4 rounded-2xl px-4 py-3 shadow-lg max-w-[200px]"
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'white',
              border: '3px solid #fcc2d7'
            }}
          >
            <p className="font-medium text-sm" style={{ color: '#495057' }}>{slothMessage}</p>
          </div>
        )}
      </div>

      {/* Title */}
      <h1
        className="text-3xl font-bold text-center mb-6"
        style={{
          color: theme === 'dark' ? '#ffd43b' : '#e67700',
          textShadow: theme === 'dark' ? '0 2px 8px rgba(255, 212, 59, 0.3)' : 'none'
        }}
      >
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
              className="w-full rounded-3xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              style={{
                background: button.color,
                padding: button.size === 'xl' ? '24px' : '16px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
              }}
              aria-label={label}
            >
              <div className="flex items-center justify-center gap-4">
                <span className={button.size === 'xl' ? 'text-5xl' : 'text-4xl'}>
                  {button.emoji}
                </span>
                <span
                  className={`font-bold text-white ${button.size === 'xl' ? 'text-2xl' : 'text-xl'}`}
                  style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                >
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p
          className="text-lg font-medium"
          style={{ color: theme === 'dark' ? '#ffd43b' : '#e67700' }}
        >
          {t('sammyProud')}
        </p>
      </div>
    </div>
  );
};

export default KidsMode;
