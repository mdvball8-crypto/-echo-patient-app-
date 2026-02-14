import React, { useState } from 'react';
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
  Globe,
  Baby,
  Heart
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
    setVoiceEnabled
  } = useApp();

  return (
    <header className="glass sticky top-0 z-50 border-b border-cyan-500/20 no-print">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">ECHO</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Kids Mode */}
          <button
            onClick={() => { setIsKidsMode(!isKidsMode); playSound('click'); }}
            className={`p-2 rounded-lg transition-all ${
              isKidsMode
                ? 'bg-yellow-500 text-black'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
            title="Kids Mode"
          >
            {isKidsMode ? '🦥' : <Baby className="w-5 h-5" />}
          </button>

          {/* Sound */}
          <button
            onClick={() => { setSoundEnabled(!soundEnabled); if (!soundEnabled) playSound('click'); }}
            className={`p-2 rounded-lg transition-all ${
              soundEnabled
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
            title="Sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Voice */}
          <button
            onClick={() => { setVoiceEnabled(!voiceEnabled); playSound('click'); }}
            className={`p-2 rounded-lg transition-all ${
              voiceEnabled
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
            title="Voice"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Language */}
          <button
            onClick={() => { setLanguage(language === 'en' ? 'es' : 'en'); playSound('click'); }}
            className="px-2 py-1 rounded-lg bg-dark-700 text-gray-300 hover:text-white transition-all text-sm font-bold"
            title="Language"
          >
            {language === 'en' ? 'EN' : 'ES'}
          </button>
        </div>
      </div>
    </header>
  );
};

const Navigation = ({ currentScreen, setCurrentScreen }) => {
  const { playSound, isKidsMode, t } = useApp();

  const navItems = [
    { id: 'home', icon: Home, label: '🏠', tooltip: 'Home' },
    { id: 'body', icon: User, label: '🧍', tooltip: 'Body' },
    { id: 'voice', icon: Mic, label: '🎤', tooltip: 'Voice' },
    { id: 'comfort', icon: Sofa, label: '🛋️', tooltip: 'Comfort' },
    { id: 'docs', icon: Camera, label: '📷', tooltip: 'Docs' },
    { id: 'visitors', icon: Users, label: '👥', tooltip: 'Visitors' },
    { id: 'meds', icon: Pill, label: '💊', tooltip: 'Meds' },
    { id: 'dashboard', icon: BarChart3, label: '📊', tooltip: 'Dashboard' },
  ];

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
                onClick={() => { setCurrentScreen(item.id); playSound('click'); }}
                className={`
                  flex flex-col items-center p-2 rounded-xl transition-all min-w-[50px]
                  ${isActive
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }
                `}
                title={item.tooltip}
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
  const { isKidsMode } = useApp();

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
