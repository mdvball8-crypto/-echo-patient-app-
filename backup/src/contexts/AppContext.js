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
  // Language state
  const [language, setLanguage] = useState('en');

  // Kids mode state
  const [isKidsMode, setIsKidsMode] = useState(false);

  // Sound enabled state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Voice enabled state
  const [voiceEnabled, setVoiceEnabled] = useState(false);

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

    addAlert(buttonType === 'emergency' ? 'emergency' : 'info', messages[buttonType]);

    // Update patient status
    if (buttonType === 'emergency') {
      setPatientStatus('critical');
    } else if (buttonType === 'okay') {
      setPatientStatus('stable');
    } else if (['pain', 'help', 'dizzy'].includes(buttonType)) {
      setPatientStatus('attention');
    }
  }, [addAlert, playSound]);

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
    };
    localStorage.setItem('echoAppData', JSON.stringify(dataToSave));
  }, [language, soundEnabled, painHistory, medicationHistory, visitorHistory, activityLog]);

  const value = {
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

    // Voice
    voiceEnabled,
    setVoiceEnabled,

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

    // Activity log
    activityLog,
    addActivityLog,
    deleteActivityLog,

    // Quick buttons
    handleQuickButton,

    // Reports
    generateReportData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
