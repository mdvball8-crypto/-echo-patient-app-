import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from '../utils/translations';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Theme state (light/dark)
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('echoTheme');
    if (savedTheme) return savedTheme;
    // Then check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('echoTheme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('echoTheme');
      // Only auto-switch if user hasn't manually set a preference
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Language state
  const [language, setLanguage] = useState('en');

  // Kids mode state
  const [isKidsMode, setIsKidsMode] = useState(false);

  // Sound enabled state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Voice enabled state (text-to-speech)
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Notes state
  const [notes, setNotes] = useState([]);

  // Speak text aloud using Web Speech API
  const speak = useCallback((text, options = {}) => {
    if (!voiceEnabled || !text) return;

    // Don't cancel - let it queue up so speech doesn't get cut off
    // Only cancel if explicitly requested
    if (options.interrupt) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Set language based on current language setting
    utterance.lang = language === 'es' ? 'es-ES' : 'en-US';

    // Get available voices
    let voices = window.speechSynthesis.getVoices();

    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
      };
    }

    // Kids mode: Use a friendlier, higher-pitched, slower voice
    if (isKidsMode) {
      utterance.rate = options.rate || 0.8;   // Slower for kids
      utterance.pitch = options.pitch || 1.3; // Higher pitch sounds friendlier
      utterance.volume = options.volume || 1.0;

      // Try to find a more child-friendly voice
      const preferredVoices = language === 'es'
        ? ['paulina', 'monica', 'spanish', 'español']
        : ['samantha', 'karen', 'victoria', 'female'];

      for (const prefVoice of preferredVoices) {
        const foundVoice = voices.find(v =>
          v.name.toLowerCase().includes(prefVoice.toLowerCase())
        );
        if (foundVoice) {
          utterance.voice = foundVoice;
          break;
        }
      }
    } else {
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
    }

    // Use a small delay to prevent speech synthesis issues
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [voiceEnabled, language, isKidsMode]);

  // Current view/tab
  const [currentView, setCurrentView] = useState('quick');

  // Pain data
  const [currentPainLevel, setCurrentPainLevel] = useState(0);
  const [painHistory, setPainHistory] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedSensations, setSelectedSensations] = useState([]);

  // Patient status
  const [patientStatus, setPatientStatus] = useState('stable'); // 'stable', 'attention', 'critical'

  // Medications with extended fields
  const [medications, setMedications] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);

  // Visitors with extended fields
  const [visitors, setVisitors] = useState([]);
  const [visitorHistory, setVisitorHistory] = useState([]);

  // Alerts for caregiver
  const [alerts, setAlerts] = useState([]);

  // Selected quick buttons (for "Next" button flow)
  const [selectedQuickButtons, setSelectedQuickButtons] = useState([]);

  // Communication/Activity log
  const [activityLog, setActivityLog] = useState([]);

  // Translation helper
  const t = useCallback((key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  // Play sound feedback
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const sounds = {
        click: { freq: 800, duration: 0.08, type: 'sine' },
        success: { freq: 1200, duration: 0.15, type: 'sine' },
        alert: { freq: 600, duration: 0.2, type: 'square' },
        emergency: { freq: 400, duration: 0.4, type: 'sawtooth' },
        beep: { freq: 1000, duration: 0.1, type: 'sine' },
      };

      const sound = sounds[type] || sounds.beep;

      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(sound.freq, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + sound.duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  // Add to activity log
  const addActivityLog = useCallback((type, message, details = {}) => {
    const entry = {
      id: Date.now(),
      type,
      message,
      details,
      timestamp: new Date(),
    };
    setActivityLog(prev => [entry, ...prev].slice(0, 200));
    return entry;
  }, []);

  // Add alert
  const addAlert = useCallback((type, message) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date(),
      acknowledged: false,
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 50));

    // Add to activity log
    addActivityLog(type, message);

    // Update patient status based on alert type
    if (type === 'emergency') {
      setPatientStatus('critical');
      playSound('emergency');
    } else if (type === 'pain' || type === 'help') {
      setPatientStatus('attention');
      playSound('alert');
    } else {
      playSound('beep');
    }
  }, [playSound, addActivityLog]);

  // Record pain
  const recordPain = useCallback((level, bodyParts = [], sensations = []) => {
    const entry = {
      id: Date.now(),
      level,
      bodyParts,
      sensations,
      timestamp: new Date(),
    };
    setPainHistory(prev => [entry, ...prev].slice(0, 100));
    setCurrentPainLevel(level);

    // Add to activity log
    addActivityLog('pain', `Pain recorded: ${level}/10`, { bodyParts, sensations });

    if (level >= 7) {
      addAlert('pain', `High pain level reported: ${level}/10`);
    }
  }, [addAlert, addActivityLog]);

  // Medication functions
  const addMedication = useCallback((medication) => {
    const newMed = {
      ...medication,
      id: Date.now(),
      timestamp: new Date(),
    };
    setMedicationHistory(prev => [newMed, ...prev].slice(0, 200));
    addActivityLog('medication', `Medication given: ${medication.name} ${medication.dosage}`, medication);
    playSound('success');
  }, [playSound, addActivityLog]);

  const deleteMedication = useCallback((id) => {
    setMedicationHistory(prev => prev.filter(med => med.id !== id));
    playSound('click');
  }, [playSound]);

  // Visitor functions
  const checkInVisitor = useCallback((visitor) => {
    const newVisitor = {
      ...visitor,
      id: Date.now(),
      checkInTime: new Date(),
      checkOutTime: null,
    };
    setVisitors(prev => [...prev, newVisitor]);
    addActivityLog('visitor', `Visitor checked in: ${visitor.name} (${visitor.type})`, visitor);
    playSound('success');
  }, [playSound, addActivityLog]);

  const checkOutVisitor = useCallback((id) => {
    setVisitors(prev => {
      const visitor = prev.find(v => v.id === id);
      if (visitor) {
        const completedVisit = {
          ...visitor,
          checkOutTime: new Date(),
        };
        setVisitorHistory(history => [completedVisit, ...history].slice(0, 200));
        addActivityLog('visitor', `Visitor checked out: ${visitor.name}`, visitor);
      }
      return prev.filter(v => v.id !== id);
    });
    playSound('click');
  }, [playSound, addActivityLog]);

  const deleteVisitorHistory = useCallback((id) => {
    setVisitorHistory(prev => prev.filter(v => v.id !== id));
    playSound('click');
  }, [playSound]);

  // Delete activity log entry
  const deleteActivityLog = useCallback((id) => {
    setActivityLog(prev => prev.filter(entry => entry.id !== id));
    playSound('click');
  }, [playSound]);

  // ===== Notes CRUD Functions =====
  const addNote = useCallback((note) => {
    const newNote = {
      id: Date.now(),
      title: note.title || '',
      content: note.content || '',
      isPinned: note.isPinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    addActivityLog('note', `Note created: ${newNote.title || 'Untitled'}`, { noteId: newNote.id });
    playSound('success');
    return newNote;
  }, [playSound, addActivityLog]);

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
    playSound('click');
  }, [playSound]);

  const deleteNote = useCallback((id) => {
    const note = notes.find(n => n.id === id);
    setNotes(prev => prev.filter(note => note.id !== id));
    if (note) {
      addActivityLog('note', `Note deleted: ${note.title || 'Untitled'}`, { noteId: id });
    }
    playSound('click');
  }, [notes, playSound, addActivityLog]);

  const toggleNotePin = useCallback((id) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
        : note
    ));
    playSound('click');
  }, [playSound]);

  const clearNotes = useCallback(() => {
    setNotes([]);
    playSound('click');
  }, [playSound]);

  // Get notes sorted with pinned first
  const getSortedNotes = useCallback(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [notes]);

  // Quick button press
  const handleQuickButton = useCallback((buttonType) => {
    playSound(buttonType === 'emergency' ? 'emergency' : 'beep');

    const messages = {
      emergency: 'EMERGENCY - Immediate assistance needed!',
      pain: 'Patient is experiencing pain',
      help: 'Patient needs help',
      okay: 'Patient is doing okay',
      thirsty: 'Patient is thirsty',
      hungry: 'Patient is hungry',
      bathroom: 'Patient needs bathroom assistance',
      hot: 'Patient feels too hot',
      cold: 'Patient feels too cold',
      dizzy: 'Patient feels dizzy',
      tired: 'Patient is tired',
      anxious: 'Patient feels anxious',
    };

    // Pass the actual button type so dashboard can show appropriate icons
    addAlert(buttonType, messages[buttonType]);

    // Track selected button for "Next" flow (avoid duplicates)
    setSelectedQuickButtons(prev => {
      if (prev.includes(buttonType)) return prev;
      return [...prev, buttonType];
    });

    // Update patient status
    if (buttonType === 'emergency') {
      setPatientStatus('critical');
    } else if (buttonType === 'okay') {
      setPatientStatus('stable');
    } else if (['pain', 'help', 'dizzy'].includes(buttonType)) {
      setPatientStatus('attention');
    }
  }, [addAlert, playSound]);

  // Clear selected quick buttons (after navigating to dashboard)
  const clearSelectedQuickButtons = useCallback(() => {
    setSelectedQuickButtons([]);
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((id) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
    // Check if all critical alerts acknowledged, reset status
    const unackCritical = alerts.filter(a => !a.acknowledged && a.type === 'emergency');
    if (unackCritical.length <= 1) {
      setPatientStatus('stable');
    }
  }, [alerts]);

  // Delete alert
  const deleteAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    playSound('click');
  }, [playSound]);

  // Clear all functions for each section
  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setPatientStatus('stable');
  }, []);

  const clearActivityLog = useCallback(() => {
    setActivityLog([]);
  }, []);

  const clearPainHistory = useCallback(() => {
    setPainHistory([]);
    setCurrentPainLevel(0);
  }, []);

  const clearMedicationHistory = useCallback(() => {
    setMedicationHistory([]);
  }, []);

  const clearVisitors = useCallback(() => {
    setVisitors([]);
  }, []);

  const clearVisitorHistory = useCallback(() => {
    setVisitorHistory([]);
  }, []);

  const clearAll = useCallback(() => {
    clearAlerts();
    clearActivityLog();
    clearPainHistory();
    clearMedicationHistory();
    clearVisitors();
    clearVisitorHistory();
  }, [clearAlerts, clearActivityLog, clearPainHistory, clearMedicationHistory, clearVisitors, clearVisitorHistory]);

  // Refresh data from localStorage
  const refreshData = useCallback((section = 'all') => {
    const savedData = localStorage.getItem('echoAppData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        if (section === 'all' || section === 'pain') {
          if (data.painHistory) setPainHistory(data.painHistory);
        }
        if (section === 'all' || section === 'meds') {
          if (data.medicationHistory) setMedicationHistory(data.medicationHistory);
        }
        if (section === 'all' || section === 'visitors') {
          if (data.visitorHistory) setVisitorHistory(data.visitorHistory);
        }
        if (section === 'all' || section === 'activity') {
          if (data.activityLog) setActivityLog(data.activityLog);
        }
        if (section === 'all' || section === 'alerts') {
          // Alerts are session-based, just trigger a re-render
          setAlerts(prev => [...prev]);
        }

        return true;
      } catch (e) {
        console.error('Failed to refresh data:', e);
        return false;
      }
    }
    return true;
  }, []);

  // Generate report data
  const generateReportData = useCallback((period = 'today') => {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return {
      period,
      startDate,
      endDate: now,
      patientStatus,
      painHistory: painHistory.filter(p => new Date(p.timestamp) >= startDate),
      medicationHistory: medicationHistory.filter(m => new Date(m.timestamp) >= startDate),
      visitorHistory: visitorHistory.filter(v => new Date(v.checkInTime) >= startDate),
      alerts: alerts.filter(a => new Date(a.timestamp) >= startDate),
      activityLog: activityLog.filter(c => new Date(c.timestamp) >= startDate),
    };
  }, [painHistory, medicationHistory, visitorHistory, alerts, activityLog, patientStatus]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('echoAppData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.language) setLanguage(data.language);
        if (data.soundEnabled !== undefined) setSoundEnabled(data.soundEnabled);
        if (data.painHistory) setPainHistory(data.painHistory);
        if (data.medicationHistory) setMedicationHistory(data.medicationHistory);
        if (data.visitorHistory) setVisitorHistory(data.visitorHistory);
        if (data.activityLog) setActivityLog(data.activityLog);
        if (data.notes) setNotes(data.notes);
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const dataToSave = {
      language,
      soundEnabled,
      painHistory,
      medicationHistory,
      visitorHistory,
      activityLog,
      notes,
    };
    localStorage.setItem('echoAppData', JSON.stringify(dataToSave));
  }, [language, soundEnabled, painHistory, medicationHistory, visitorHistory, activityLog, notes]);

  const value = {
    // Theme
    theme,
    setTheme,
    toggleTheme,

    // Language
    language,
    setLanguage,
    t,

    // Mode
    isKidsMode,
    setIsKidsMode,

    // Sound
    soundEnabled,
    setSoundEnabled,
    playSound,

    // Voice (text-to-speech)
    voiceEnabled,
    setVoiceEnabled,
    speak,

    // Navigation
    currentView,
    setCurrentView,

    // Pain
    currentPainLevel,
    setCurrentPainLevel,
    painHistory,
    recordPain,
    selectedBodyParts,
    setSelectedBodyParts,
    selectedSensations,
    setSelectedSensations,

    // Patient status
    patientStatus,
    setPatientStatus,

    // Medications
    medications,
    addMedication,
    deleteMedication,
    medicationHistory,

    // Visitors
    visitors,
    checkInVisitor,
    checkOutVisitor,
    visitorHistory,
    deleteVisitorHistory,

    // Alerts
    alerts,
    addAlert,
    acknowledgeAlert,
    deleteAlert,
    clearAlerts,

    // Activity log
    activityLog,
    addActivityLog,
    deleteActivityLog,
    clearActivityLog,

    // Quick buttons
    handleQuickButton,
    selectedQuickButtons,
    clearSelectedQuickButtons,

    // Reports
    generateReportData,

    // Refresh
    refreshData,

    // Clear functions
    clearPainHistory,
    clearMedicationHistory,
    clearVisitors,
    clearVisitorHistory,
    clearAll,

    // Notes
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleNotePin,
    clearNotes,
    getSortedNotes,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
