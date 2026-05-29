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
import NotesScreen from './components/NotesScreen';
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
  X,
  Sun,
  Moon,
  FileText
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
    t,
    theme,
    toggleTheme
  } = useApp();

  // Hidden safety feature state
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [momPhone, setMomPhone] = useState(() => localStorage.getItem('safetyMomPhone') || '');
  const [dadPhone, setDadPhone] = useState(() => localStorage.getItem('safetyDadPhone') || '');
  const [contact1Name, setContact1Name] = useState(() => localStorage.getItem('safetyContact1Name') || '');
  const [contact2Name, setContact2Name] = useState(() => localStorage.getItem('safetyContact2Name') || '');
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
    localStorage.setItem('safetyContact1Name', contact1Name);
    localStorage.setItem('safetyContact2Name', contact2Name);
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

  // State for send status
  const [sendStatus, setSendStatus] = useState(null); // null, 'sending', 'success', 'error'
  const [sendError, setSendError] = useState('');
  const [sentToName, setSentToName] = useState('');

  const sendToContact = async (phone, name) => {
    if (!phone) {
      setShowSetup(true);
      return;
    }

    setSendStatus('sending');
    setSendError('');
    setSentToName(name || phone);

    const message = language === 'es'
      ? `Mensaje urgente de ECHO: Necesito ayuda. Por favor llama. - ${name || 'Paciente'}`
      : `Urgent ECHO message: I need help. Please call. - ${name || 'Patient'}`;

    try {
      // Call Twilio API
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success - SMS was actually sent
        setSendStatus('success');
        setAudioBlob(null);
        // Reset after showing success
        setTimeout(() => {
          setSendStatus(null);
          setShowSafetyMenu(false);
        }, 3000);
      } else {
        // API call failed - show actual error
        const errorMsg = data.details || data.error || 'Failed to send SMS';
        console.error('SMS send failed:', errorMsg);
        setSendStatus('error');
        setSendError(errorMsg);
      }
    } catch (err) {
      // Network or other error
      console.error('SMS send error:', err);
      setSendStatus('error');
      setSendError(err.message || 'Network error - please try again');
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setSendStatus(null);
    setSendError('');
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

  const handleThemeToggle = () => {
    toggleTheme();
    playSound('click');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    speak(newTheme === 'dark'
      ? (language === 'es' ? 'Modo oscuro' : 'Dark mode')
      : (language === 'es' ? 'Modo claro' : 'Light mode')
    );
  };

  return (
    <header className="glass sticky top-0 z-50 no-print" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo - Clickable for hidden safety menu */}
        <div className="flex items-center gap-2 relative" ref={safetyMenuRef}>
          <div className="flex flex-col items-center">
            <button
              onClick={handleLogoClick}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-105 transition-transform relative"
              style={{
                background: 'var(--color-accent)',
                boxShadow: '0 4px 12px var(--color-shadow-elevated)'
              }}
              aria-label="Emergency help menu"
            >
              <Heart className="w-6 h-6 text-white" />
              {/* Subtle pulsing dot indicator */}
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                style={{ background: 'var(--color-danger)', border: '2px solid var(--color-bg-primary)' }}
              />
            </button>
            <span
              className="text-[10px] mt-0.5 whitespace-nowrap"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {language === 'es' ? 'Pide ayuda' : 'Tap for help'}
            </span>
          </div>
          <span className="text-2xl font-semibold text-headline gradient-text">ECHO</span>

          {/* Hidden Safety Menu - appears as a normal dropdown */}
          {showSafetyMenu && (
            <div
              className="absolute top-12 left-0 w-64 rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 32px var(--color-shadow-elevated)'
              }}
            >
              {/* Header */}
              <div
                className="p-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{language === 'es' ? 'Opciones' : 'Options'}</span>
                <button
                  onClick={() => { setShowSafetyMenu(false); setShowSetup(false); }}
                  className="p-1 rounded transition-colors"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Setup contacts view */}
              {showSetup ? (
                <div className="p-3">
                  <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    {language === 'es' ? 'Configurar contactos' : 'Setup contacts'}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                        {language === 'es' ? 'Contacto 1' : 'Contact 1'}
                      </label>
                      <input
                        type="text"
                        value={contact1Name}
                        onChange={(e) => setContact1Name(e.target.value)}
                        placeholder={language === 'es' ? 'Nombre' : 'Name'}
                        className="input-field text-sm mb-2"
                      />
                      <input
                        type="tel"
                        value={momPhone}
                        onChange={(e) => setMomPhone(e.target.value)}
                        placeholder={language === 'es' ? 'Número de teléfono' : 'Phone number'}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                        {language === 'es' ? 'Contacto 2' : 'Contact 2'}
                      </label>
                      <input
                        type="text"
                        value={contact2Name}
                        onChange={(e) => setContact2Name(e.target.value)}
                        placeholder={language === 'es' ? 'Nombre' : 'Name'}
                        className="input-field text-sm mb-2"
                      />
                      <input
                        type="tel"
                        value={dadPhone}
                        onChange={(e) => setDadPhone(e.target.value)}
                        placeholder={language === 'es' ? 'Número de teléfono' : 'Phone number'}
                        className="input-field text-sm"
                      />
                    </div>
                    <button
                      onClick={saveContacts}
                      className="w-full py-2 rounded-lg text-sm transition-colors"
                      style={{
                        background: 'var(--color-accent-soft)',
                        color: 'var(--color-accent)'
                      }}
                    >
                      {language === 'es' ? 'Guardar' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : audioBlob && !isRecording ? (
                /* Send options after recording */
                <div className="p-3">
                  {sendStatus === 'sending' ? (
                    <div className="text-center py-6">
                      <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-3" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
                      <p style={{ color: 'var(--color-text-secondary)' }}>
                        {language === 'es' ? 'Enviando...' : 'Sending...'}
                      </p>
                    </div>
                  ) : sendStatus === 'success' ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(48, 209, 88, 0.2)' }}>
                        <span className="text-2xl">✓</span>
                      </div>
                      <p className="font-medium" style={{ color: 'var(--color-success)' }}>
                        {language === 'es' ? `¡Enviado a ${sentToName}!` : `Sent to ${sentToName}!`}
                      </p>
                    </div>
                  ) : sendStatus === 'error' ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255, 59, 48, 0.2)' }}>
                        <span className="text-2xl">✕</span>
                      </div>
                      <p className="font-medium mb-2" style={{ color: 'var(--color-danger)' }}>
                        {language === 'es' ? 'No se pudo enviar' : "Couldn't send"}
                      </p>
                      <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                        {sendError}
                      </p>
                      <button
                        onClick={() => { setSendStatus(null); setSendError(''); }}
                        className="px-4 py-2 rounded-lg text-sm"
                        style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                      >
                        {language === 'es' ? 'Intentar de nuevo' : 'Try again'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                        {language === 'es' ? 'Enviar grabación a:' : 'Send recording to:'}
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={sendTo911}
                          className="w-full py-4 px-4 rounded-lg text-base font-medium transition-all text-left flex items-center gap-3"
                          style={{ background: 'rgba(255, 59, 48, 0.15)', color: 'var(--color-danger)' }}
                        >
                          <span className="text-xl">🚨</span>
                          {language === 'es' ? 'Servicios de emergencia' : 'Emergency services'}
                        </button>
                        {momPhone && (
                          <button
                            onClick={() => sendToContact(momPhone, contact1Name || 'Contact 1')}
                            className="w-full py-4 px-4 rounded-lg text-base transition-all text-left flex items-center gap-3"
                            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                          >
                            <span className="text-xl">📱</span>
                            {contact1Name || momPhone}
                          </button>
                        )}
                        {dadPhone && (
                          <button
                            onClick={() => sendToContact(dadPhone, contact2Name || 'Contact 2')}
                            className="w-full py-4 px-4 rounded-lg text-base transition-all text-left flex items-center gap-3"
                            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                          >
                            <span className="text-xl">📱</span>
                            {contact2Name || dadPhone}
                          </button>
                        )}
                        {!momPhone && !dadPhone && (
                          <button
                            onClick={() => setShowSetup(true)}
                            className="w-full py-4 px-4 rounded-lg text-base transition-all text-left flex items-center gap-3"
                            style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}
                          >
                            <span className="text-xl">➕</span>
                            {language === 'es' ? 'Agregar contacto' : 'Add a contact'}
                          </button>
                        )}
                        <button
                          onClick={resetRecording}
                          className="w-full py-2 px-4 rounded-lg text-xs transition-all mt-2"
                          style={{ background: 'var(--color-border)', color: 'var(--color-text-tertiary)' }}
                        >
                          {language === 'es' ? 'Cancelar' : 'Cancel'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Recording controls */
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {language === 'es' ? 'Nota de voz' : 'Voice note'}
                    </span>
                    {isRecording && (
                      <span className="text-xs animate-pulse" style={{ color: 'var(--color-danger)' }}>
                        {formatTime(recordingTime)}
                      </span>
                    )}
                  </div>
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-full py-3 px-4 rounded-lg text-sm transition-all"
                      style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                    >
                      {language === 'es' ? 'Grabar mensaje' : 'Record message'}
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-full py-3 px-4 rounded-lg text-sm transition-all"
                      style={{ background: 'rgba(255, 59, 48, 0.15)', color: 'var(--color-danger)' }}
                    >
                      {language === 'es' ? 'Detener grabación' : 'Stop recording'}
                    </button>
                  )}

                  {/* Setup link */}
                  <button
                    onClick={() => setShowSetup(true)}
                    className="w-full mt-3 py-2 text-xs transition-all"
                    style={{ color: 'var(--color-text-tertiary)' }}
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
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="theme-toggle"
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <Sun className="theme-toggle-icon theme-toggle-sun w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />
            <Moon className="theme-toggle-icon theme-toggle-moon w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />
          </button>

          {/* Kids Mode */}
          <button
            onClick={handleKidsModeToggle}
            className={`p-2 rounded-lg transition-all ${
              isKidsMode
                ? 'bg-yellow-500 text-black'
                : 'btn-icon'
            }`}
            title={t('kidsMode')}
            aria-label={t('kidsMode')}
          >
            {isKidsMode ? '🦥' : <Baby className="w-5 h-5" />}
          </button>

          {/* Sound */}
          <button
            onClick={handleSoundToggle}
            className="btn-icon"
            style={{
              background: soundEnabled ? 'var(--color-accent-soft)' : 'var(--color-bg-tertiary)',
              color: soundEnabled ? 'var(--color-accent)' : 'var(--color-text-secondary)'
            }}
            title={soundEnabled ? t('soundOn') : t('soundOff')}
            aria-label={soundEnabled ? t('soundOn') : t('soundOff')}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Voice (Text-to-Speech) */}
          <button
            onClick={handleVoiceToggle}
            className="btn-icon"
            style={{
              background: voiceEnabled ? 'rgba(48, 209, 88, 0.15)' : 'var(--color-bg-tertiary)',
              color: voiceEnabled ? 'var(--color-success)' : 'var(--color-text-secondary)'
            }}
            title={voiceEnabled ? t('voiceOn') : t('voiceOff')}
            aria-label={voiceEnabled ? t('voiceOn') : t('voiceOff')}
          >
            <span className="text-lg">🗣️</span>
          </button>

          {/* Language */}
          <button
            onClick={handleLanguageToggle}
            className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)'
            }}
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
    { id: 'notes', icon: FileText, label: '📝', tooltip: t('navNotes'), screenAnnounce: 'screenNotes' },
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
    <nav className="glass no-print sticky top-[68px] z-40" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-4xl mx-auto px-2 py-2">
        <div className="flex justify-around items-center overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="flex flex-col items-center p-2 rounded-xl transition-all min-w-[44px]"
                style={{
                  background: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  boxShadow: isActive ? '0 4px 12px var(--color-shadow-elevated)' : 'none'
                }}
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
      return <HomeScreen onNavigate={setCurrentScreen} />;
    case 'body':
      return <BodyMapFlow onComplete={() => setCurrentScreen('home')} />;
    case 'voice':
      return <VoiceRecognition />;
    case 'comfort':
      return <ComfortScreen />;
    case 'notes':
      return <NotesScreen />;
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
  const { theme } = useApp();

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Background gradient - subtle based on theme */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at top left, rgba(10, 132, 255, 0.08), transparent 50%), radial-gradient(ellipse at bottom right, rgba(94, 92, 230, 0.08), transparent 50%)'
            : 'radial-gradient(ellipse at top left, rgba(0, 113, 227, 0.04), transparent 50%), radial-gradient(ellipse at bottom right, rgba(94, 92, 230, 0.04), transparent 50%)'
        }}
      />

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
