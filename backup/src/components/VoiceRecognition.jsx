import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { Mic, MicOff, Volume2 } from 'lucide-react';

const VoiceRecognition = () => {
  const { t, handleQuickButton, playSound, isKidsMode, language } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);

  // Voice command mappings
  const voiceCommands = {
    en: {
      emergency: ['emergency', 'help me', '911', 'urgent'],
      pain: ['pain', 'hurt', 'hurts', 'ache', 'aching', 'sore'],
      help: ['help', 'assist', 'assistance', 'nurse'],
      thirsty: ['thirsty', 'water', 'drink', 'beverage'],
      hungry: ['hungry', 'food', 'eat', 'meal', 'snack'],
      bathroom: ['bathroom', 'toilet', 'restroom', 'lavatory', 'pee', 'potty'],
      hot: ['hot', 'warm', 'heat', 'sweating'],
      cold: ['cold', 'freezing', 'chilly', 'blanket'],
      dizzy: ['dizzy', 'lightheaded', 'spinning', 'vertigo'],
      tired: ['tired', 'sleepy', 'exhausted', 'fatigue', 'sleep'],
      anxious: ['anxious', 'nervous', 'worried', 'scared', 'anxiety', 'panic'],
      okay: ['okay', 'ok', 'fine', 'good', 'better', 'alright'],
    },
    es: {
      emergency: ['emergencia', 'ayudame', 'urgente'],
      pain: ['dolor', 'duele', 'doliendo'],
      help: ['ayuda', 'asistencia', 'enfermera'],
      thirsty: ['sed', 'agua', 'beber'],
      hungry: ['hambre', 'comida', 'comer'],
      bathroom: ['baño', 'inodoro'],
      hot: ['calor', 'caliente'],
      cold: ['frío', 'fría', 'manta'],
      dizzy: ['mareo', 'mareado', 'mareada'],
      tired: ['cansado', 'cansada', 'sueño', 'dormir'],
      anxious: ['ansiedad', 'nervioso', 'nerviosa', 'preocupado'],
      okay: ['bien', 'bueno', 'mejor'],
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language === 'es' ? 'es-ES' : 'en-US';

    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript.toLowerCase();
      setTranscript(result);

      if (event.results[current].isFinal) {
        processVoiceCommand(result);
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [language]);

  // Process voice commands
  const processVoiceCommand = useCallback((text) => {
    const commands = voiceCommands[language] || voiceCommands.en;

    for (const [action, keywords] of Object.entries(commands)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        handleQuickButton(action);
        // Speak feedback
        speakFeedback(action);
        return;
      }
    }
  }, [language, handleQuickButton]);

  // Text-to-speech feedback
  const speakFeedback = (action) => {
    if (!window.speechSynthesis) return;

    const feedbacks = {
      en: {
        emergency: 'Emergency alert sent. Help is on the way.',
        pain: 'Pain alert recorded.',
        help: 'Help request sent.',
        thirsty: 'Thirst alert sent. Someone will bring water.',
        hungry: 'Hunger alert sent.',
        bathroom: 'Bathroom assistance requested.',
        hot: 'Temperature alert sent. You feel hot.',
        cold: 'Temperature alert sent. You feel cold.',
        dizzy: 'Dizziness alert sent.',
        tired: 'Fatigue alert recorded.',
        anxious: 'Anxiety alert sent. Someone will come to help.',
        okay: 'Great! Marked as feeling okay.',
      },
      es: {
        emergency: 'Alerta de emergencia enviada. La ayuda viene en camino.',
        pain: 'Alerta de dolor registrada.',
        help: 'Solicitud de ayuda enviada.',
        thirsty: 'Alerta de sed enviada.',
        hungry: 'Alerta de hambre enviada.',
        bathroom: 'Asistencia para el baño solicitada.',
        hot: 'Alerta de temperatura enviada. Siente calor.',
        cold: 'Alerta de temperatura enviada. Siente frío.',
        dizzy: 'Alerta de mareo enviada.',
        tired: 'Alerta de fatiga registrada.',
        anxious: 'Alerta de ansiedad enviada.',
        okay: '¡Genial! Registrado como sintiéndose bien.',
      }
    };

    const utterance = new SpeechSynthesisUtterance(feedbacks[language]?.[action] || feedbacks.en[action]);
    utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Toggle listening
  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.lang = language === 'es' ? 'es-ES' : 'en-US';
      recognition.start();
      setIsListening(true);
      playSound('click');
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4">
        <div className="glass rounded-2xl p-6 text-center">
          <MicOff className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            Voice Recognition Unavailable
          </h3>
          <p className="text-gray-500">
            Your browser doesn't support voice recognition. Please use Chrome or Edge for this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className={`text-2xl font-bold mb-6 text-center ${isKidsMode ? 'text-yellow-400' : 'gradient-text'}`}>
        {t('voiceControl')}
      </h2>

      {/* Main microphone button */}
      <div className="flex flex-col items-center mb-8">
        <button
          onClick={toggleListening}
          className={`
            w-32 h-32 rounded-full flex items-center justify-center
            transition-all duration-300 relative
            ${isListening
              ? 'bg-gradient-to-br from-red-500 to-pink-600 scale-110 shadow-2xl'
              : isKidsMode
                ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }
          `}
        >
          {/* Pulse rings when listening */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
              <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-50" />
            </>
          )}

          <Mic className={`w-16 h-16 text-white ${isListening ? 'animate-pulse' : ''}`} />
        </button>

        <p className="mt-4 text-lg font-semibold text-gray-300">
          {isListening ? t('listening') : t('tapToSpeak')}
        </p>

        {/* Voice wave animation when listening */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 mt-4 h-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full voice-wave-bar"
                style={{ height: '100%' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transcript display */}
      {transcript && (
        <div className="glass rounded-2xl p-4 mb-6">
          <p className="text-gray-300 text-center">
            <Volume2 className="inline w-5 h-5 mr-2" />
            "{transcript}"
          </p>
        </div>
      )}

      {/* Voice commands help */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">
          {t('voiceCommands')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'emergency', color: 'text-red-400', examples: language === 'es' ? '"Emergencia"' : '"Emergency"' },
            { key: 'pain', color: 'text-orange-400', examples: language === 'es' ? '"Dolor"' : '"Pain", "Hurt"' },
            { key: 'thirsty', color: 'text-blue-400', examples: language === 'es' ? '"Agua", "Sed"' : '"Water", "Thirsty"' },
            { key: 'bathroom', color: 'text-cyan-400', examples: language === 'es' ? '"Baño"' : '"Bathroom", "Restroom"' },
            { key: 'help', color: 'text-yellow-400', examples: language === 'es' ? '"Ayuda"' : '"Help", "Nurse"' },
            { key: 'okay', color: 'text-green-400', examples: language === 'es' ? '"Bien"' : '"Okay", "Good"' },
          ].map((cmd) => (
            <div key={cmd.key} className="flex items-center gap-3 p-2 bg-dark-700 rounded-lg">
              <span className={`font-semibold ${cmd.color}`}>{t(cmd.key)}:</span>
              <span className="text-gray-400 text-sm">{cmd.examples}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-4 text-center">
          {isKidsMode
            ? '🎤 Just talk to tell us how you feel!'
            : 'Speak naturally - the app will recognize your needs'
          }
        </p>
      </div>
    </div>
  );
};

export default VoiceRecognition;
