import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import HomeScreen from './components/HomeScreen';
import BodyMapFlow from './components/BodyMapFlow';
import VoiceRecognition from './components/VoiceRecognition';
import ComfortScreen from './components/ComfortScreen';
import DocumentsScreen from './components/DocumentsScreen';
import VisitorLog from './components/VisitorLog';
import MedicationTracker from './components/MedicationTracker';
import CaregiverDashboard from './components/CaregiverDashboard';
import KidsMode from './components/KidsMode';
import {
  Home,
  User,
  Mic,
  Sofa,
  Camera,
  Users,
  Pill,
  BarChart3,
  Volume2,
  VolumeX,
  Baby,
  Heart,
  X
} from 'lucide-react';

const Header = () => {
  const {
    isKidsMode,
    setIsKidsMode,
    soundEnabled,
    setSoundEnabled,
    language,
    setLanguage,
    playSound,
    voiceEnabled,
    setVoiceEnabled,
    speak,
    t
  } = useApp();

  // Hidden safety feature state
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [momPhone, setMomPhone] = useState(() => localStorage.getItem('safetyMomPhone') || '');
  const [dadPhone, setDadPhone] = useState(() => localStorage.getItem('safetyDadPhone') || '');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const safetyMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (safetyMenuRef.current && !safetyMenuRef.current.contains(event.target)) {
        setShowSafetyMenu(false);
      }
    };
    if (showSafetyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSafetyMenu]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleLogoClick = () => {
    setShowSafetyMenu(!showSafetyMenu);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Could not start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveContacts = () => {
    localStorage.setItem('safetyMomPhone', momPhone);
    localStorage.setItem('safetyDadPhone', dadPhone);
    setShowSetup(false);
  };

  const sendTo911 = async () => {
    // Save recording first
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emergency-${new Date().toISOString()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
    // Call 911
    window.location.href = 'tel:911';
    setAudioBlob(null);
  };

  const sendToContact = async (phone, name) => {
    if (!phone) {
      setShowSetup(true);
      return;
    }

    // Try Web Share API first (works on mobile with files)
    if (navigator.share && audioBlob) {
      try {
        const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: 'audio/webm' });
        await navigator.share({
          files: [file],
          title: language === 'es' ? 'Mensaje de voz urgente' : 'Urgent voice message',
          text: language === 'es' ? 'Por favor escucha este mensaje' : 'Please listen to this message'
        });
        setAudioBlob(null);
        return;
      } catch (err) {
        // If sharing fails, fallback to SMS
        console.log('Share failed, using SMS fallback');
      }
    }

    // Fallback: Save recording and open SMS
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-message-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }

    // Open SMS with message
    const message = language === 'es'
      ? 'Necesito ayuda. Por favor llama.'
      : 'I need help. Please call.';
    window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
    setAudioBlob(null);
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const handleKidsModeToggle = () => {
    const newMode = !isKidsMode;
    setIsKidsMode(newMode);
    playSound('click');
    speak(newMode ? t('kidsModeOn') : t('kidsModeOff'));
  };

  const handleSoundToggle = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (newState) playSound('click');
    speak(newState ? t('soundOn') : t('soundOff'));
  };

  const handleVoiceToggle = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    playSound('click');
    // Use a timeout so the state updates before speaking
    setTimeout(() => {
      if (newState) {
        const utterance = new SpeechSynthesisUtterance(t('voiceOn'));
        utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }, 100);
  };

  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    playSound('click');
    // Speak in the NEW language
    setTimeout(() => {
      const langName = newLang === 'es' ? 'Español' : 'English';
      const utterance = new SpeechSynthesisUtterance(
        newLang === 'es' ? `Idioma cambiado a ${langName}` : `Language changed to ${langName}`
      );
      utterance.lang = newLang === 'es' ? 'es-ES' : 'en-US';
      if (voiceEnabled) {
        window.speechSynthesis.speak(utterance);
      }
    }, 100);
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-cyan-500/20 no-print">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo - Clickable for hidden safety menu */}
        <div className="flex items-center gap-2 relative" ref={safetyMenuRef}>
          <button
            onClick={handleLogoClick}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
            aria-label="Menu"
          >
            <Heart className="w-6 h-6 text-white" />
          </button>
          <span className="text-2xl font-bold gradient-text">ECHO</span>

          {/* Hidden Safety Menu - appears as a normal dropdown */}
          {showSafetyMenu && (
            <div className="absolute top-12 left-0 w-64 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="p-3 border-b border-dark-600 flex items-center justify-between">
                <span className="text-sm text-gray-400">{language === 'es' ? 'Opciones' : 'Options'}</span>
                <button
                  onClick={() => { setShowSafetyMenu(false); setShowSetup(false); }}
                  className="p-1 hover:bg-dark-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Setup contacts view */}
              {showSetup ? (
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-3">
                    {language === 'es' ? 'Configurar contactos' : 'Setup contacts'}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        {language === 'es' ? 'Contacto 1' : 'Contact 1'}
                      </label>
                      <input
                        type="tel"
                        value={momPhone}
                        onChange={(e) => setMomPhone(e.target.value)}
                        placeholder={language === 'es' ? 'Número de teléfono' : 'Phone number'}
                        className="w-full p-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        {language === 'es' ? 'Contacto 2' : 'Contact 2'}
                      </label>
                      <input
                        type="tel"
                        value={dadPhone}
                        onChange={(e) => setDadPhone(e.target.value)}
                        placeholder={language === 'es' ? 'Número de teléfono' : 'Phone number'}
                        className="w-full p-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white"
                      />
                    </div>
                    <button
                      onClick={saveContacts}
                      className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-sm text-cyan-400"
                    >
                      {language === 'es' ? 'Guardar' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : audioBlob && !isRecording ? (
                /* Send options after recording */
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-3">
                    {language === 'es' ? 'Enviar grabación a:' : 'Send recording to:'}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={sendTo911}
                      className="w-full py-3 px-4 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-gray-300 transition-all text-left"
                    >
                      {language === 'es' ? 'Servicios de emergencia' : 'Emergency services'}
                    </button>
                    <button
                      onClick={() => sendToContact(momPhone, 'Mom')}
                      className="w-full py-3 px-4 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-gray-300 transition-all text-left"
                    >
                      {language === 'es' ? 'Contacto 1 (Mamá)' : 'Contact 1 (Mom)'}
                    </button>
                    <button
                      onClick={() => sendToContact(dadPhone, 'Dad')}
                      className="w-full py-3 px-4 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-gray-300 transition-all text-left"
                    >
                      {language === 'es' ? 'Contacto 2 (Papá)' : 'Contact 2 (Dad)'}
                    </button>
                    <button
                      onClick={resetRecording}
                      className="w-full py-2 px-4 bg-dark-600 hover:bg-dark-500 rounded-lg text-xs text-gray-400 transition-all"
                    >
                      {language === 'es' ? 'Cancelar' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Recording controls */
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-300">
                      {language === 'es' ? 'Nota de voz' : 'Voice note'}
                    </span>
                    {isRecording && (
                      <span className="text-xs text-red-400 animate-pulse">
                        {formatTime(recordingTime)}
                      </span>
                    )}
                  </div>
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-full py-3 px-4 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-gray-300 transition-all"
                    >
                      {language === 'es' ? 'Grabar mensaje' : 'Record message'}
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm text-red-400 transition-all"
                    >
                      {language === 'es' ? 'Detener grabación' : 'Stop recording'}
                    </button>
                  )}

                  {/* Setup link */}
                  <button
                    onClick={() => setShowSetup(true)}
                    className="w-full mt-3 py-2 text-xs text-gray-500 hover:text-gray-400 transition-all"
                  >
                    {language === 'es' ? 'Configurar contactos' : 'Setup contacts'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Kids Mode */}
          <button
            onClick={handleKidsModeToggle}
            className={`p-2 rounded-lg transition-all ${
              isKidsMode
                ? 'bg-yellow-500 text-black'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
            title={t('kidsMode')}
            aria-label={t('kidsMode')}
          >
            {isKidsMode ? '🦥' : <Baby className="w-5 h-5" />}
          </button>

          {/* Sound */}
          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-lg transition-all ${
              soundEnabled
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
            title={soundEnabled ? t('soundOn') : t('soundOff')}
            aria-label={soundEnabled ? t('soundOn') : t('soundOff')}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Voice (Text-to-Speech) */}
          <button
            onClick={handleVoiceToggle}
            className={`p-2 rounded-lg transition-all ${
              voiceEnabled
                ? 'bg-green-500/20 text-green-400'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
            title={voiceEnabled ? t('voiceOn') : t('voiceOff')}
            aria-label={voiceEnabled ? t('voiceOn') : t('voiceOff')}
          >
            <span className="text-lg">🗣️</span>
          </button>

          {/* Language */}
          <button
            onClick={handleLanguageToggle}
            className="px-2 py-1 rounded-lg bg-dark-700 text-gray-300 hover:text-white transition-all text-sm font-bold"
            title={t('language')}
            aria-label={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
          >
            {language === 'en' ? 'EN' : 'ES'}
          </button>
        </div>
      </div>
    </header>
  );
};

const Navigation = ({ currentScreen, setCurrentScreen }) => {
  const { playSound, isKidsMode, t, speak } = useApp();

  const navItems = [
    { id: 'home', icon: Home, label: '🏠', tooltip: t('navHome'), screenAnnounce: 'screenHome' },
    { id: 'body', icon: User, label: '🧍', tooltip: t('navBody'), screenAnnounce: 'screenBody' },
    { id: 'voice', icon: Mic, label: '🎤', tooltip: t('navVoice'), screenAnnounce: 'screenVoice' },
    { id: 'comfort', icon: Sofa, label: '🛋️', tooltip: t('navComfort'), screenAnnounce: 'screenComfort' },
    { id: 'docs', icon: Camera, label: '📷', tooltip: t('navDocs'), screenAnnounce: 'screenDocs' },
    { id: 'visitors', icon: Users, label: '👥', tooltip: t('navVisitors'), screenAnnounce: 'screenVisitors' },
    { id: 'meds', icon: Pill, label: '💊', tooltip: t('navMeds'), screenAnnounce: 'screenMeds' },
    { id: 'dashboard', icon: BarChart3, label: '📊', tooltip: t('navDashboard'), screenAnnounce: 'screenDashboard' },
  ];

  const handleNavClick = (item) => {
    setCurrentScreen(item.id);
    playSound('click');
    // Announce the screen name
    speak(t(item.screenAnnounce));
  };

  return (
    <nav className="glass border-b border-cyan-500/20 no-print sticky top-[68px] z-40">
      <div className="max-w-4xl mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`
                  flex flex-col items-center p-2 rounded-xl transition-all min-w-[50px]
                  ${isActive
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }
                `}
                title={item.tooltip}
                aria-label={item.tooltip}
              >
                {isKidsMode ? (
                  <span className="text-xl">{item.label}</span>
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

const MainContent = ({ currentScreen, setCurrentScreen }) => {
  const { isKidsMode, t, speak } = useApp();
  const isFirstRender = useRef(true);

  // Announce screen on first load
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Small delay to ensure voice is ready
      setTimeout(() => {
        speak(t('screenHome'));
      }, 500);
    }
  }, []);

  // Kids mode shows special interface
  if (isKidsMode && currentScreen === 'home') {
    return <KidsMode />;
  }

  switch (currentScreen) {
    case 'home':
      return <HomeScreen />;
    case 'body':
      return <BodyMapFlow onComplete={() => setCurrentScreen('home')} />;
    case 'voice':
      return <VoiceRecognition />;
    case 'comfort':
      return <ComfortScreen />;
    case 'docs':
      return <DocumentsScreen />;
    case 'visitors':
      return <VisitorLog />;
    case 'meds':
      return <MedicationTracker />;
    case 'dashboard':
      return <CaregiverDashboard />;
    default:
      return <HomeScreen />;
  }
};

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-900/20 via-dark-900 to-blue-900/20 pointer-events-none" />

      {/* Decorative orbs */}
      <div className="fixed top-40 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <Navigation currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        <main className="max-w-4xl mx-auto pb-8">
          <MainContent currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
