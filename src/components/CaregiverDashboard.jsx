import React, { useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';
import {
  Bell,
  Activity,
  Pill,
  Users,
  TrendingUp,
  AlertTriangle,
  Check,
  Clock,
  Heart,
  Trash2,
  Download,
  Printer,
  FileText,
  RefreshCw,
  CheckCircle,
  Droplets,
  UtensilsCrossed,
  Bath,
  Thermometer,
  Snowflake,
  Moon,
  Frown,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

const CaregiverDashboard = () => {
  const {
    t,
    language,
    alerts,
    acknowledgeAlert,
    deleteAlert,
    clearAlerts,
    currentPainLevel,
    painHistory,
    medicationHistory,
    visitors,
    activityLog,
    deleteActivityLog,
    clearActivityLog,
    clearPainHistory,
    clearMedicationHistory,
    clearVisitors,
    clearAll,
    patientStatus,
    playSound,
    generateReportData
  } = useApp();

  const [selectedTab, setSelectedTab] = useState('overview');

  // Labels for both languages
  const labels = {
    en: {
      title: 'Caregiver Dashboard',
      patientStatus: 'Patient Status',
      stable: 'Stable',
      needsAttention: 'Needs Attention',
      critical: 'Critical',
      overview: 'Overview',
      alerts: 'Alerts',
      activity: 'Activity',
      currentPain: 'Current Pain',
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      outOf10: 'out of 10',
      medsToday: 'Meds Today',
      dosesGiven: 'Doses Given',
      today: 'today',
      currentVisitors: 'Current Visitors',
      noVisitors: 'No visitors',
      visitors: 'visitors',
      visitor: 'visitor',
      currentlyAlone: 'Currently alone',
      unreadAlerts: 'Unread Alerts',
      allClear: 'All clear',
      needAttention: 'Need attention',
      totalToday: 'total today',
      painTrend: 'Pain Trend',
      last10: 'Last 10 readings',
      noPainData: 'No pain data recorded',
      noAlerts: 'No alerts',
      recentActivity: 'Recent Activity',
      noActivity: 'No recent activity',
      refresh: 'Refresh',
      updated: 'Updated!',
      acknowledge: 'Acknowledge',
    },
    es: {
      title: 'Panel del Cuidador',
      patientStatus: 'Estado del Paciente',
      stable: 'Estable',
      needsAttention: 'Necesita Atención',
      critical: 'Crítico',
      overview: 'Resumen',
      alerts: 'Alertas',
      activity: 'Actividad',
      currentPain: 'Dolor Actual',
      low: 'Bajo',
      moderate: 'Moderado',
      high: 'Alto',
      outOf10: 'de 10',
      medsToday: 'Medicinas Hoy',
      dosesGiven: 'Dosis Dadas',
      today: 'hoy',
      currentVisitors: 'Visitantes Actuales',
      noVisitors: 'Sin visitantes',
      visitors: 'visitantes',
      visitor: 'visitante',
      currentlyAlone: 'Actualmente solo/a',
      unreadAlerts: 'Alertas Sin Leer',
      allClear: 'Todo bien',
      needAttention: 'Necesitan atención',
      totalToday: 'total hoy',
      painTrend: 'Tendencia del Dolor',
      last10: 'Últimas 10 lecturas',
      noPainData: 'No hay datos de dolor',
      noAlerts: 'Sin alertas',
      recentActivity: 'Actividad Reciente',
      noActivity: 'Sin actividad reciente',
      refresh: 'Actualizar',
      updated: '¡Actualizado!',
      acknowledge: 'Reconocer',
    }
  };

  const l = labels[language] || labels.en;

  // Refresh state
  const [refreshState, setRefreshState] = useState({
    all: 'idle',
    pain: 'idle',
    meds: 'idle',
    visitors: 'idle',
    alerts: 'idle',
    activity: 'idle'
  });

  const handleRefresh = useCallback((key) => {
    try {
      playSound('click');
    } catch (e) {}

    setRefreshState(prev => ({ ...prev, [key]: 'spinning' }));

    setTimeout(() => {
      switch (key) {
        case 'all': clearAll(); break;
        case 'pain': clearPainHistory(); break;
        case 'meds': clearMedicationHistory(); break;
        case 'visitors': clearVisitors(); break;
        case 'alerts': clearAlerts(); break;
        case 'activity': clearActivityLog(); break;
        default: break;
      }

      setRefreshState(prev => ({ ...prev, [key]: 'success' }));
      try { playSound('success'); } catch (e) {}

      setTimeout(() => {
        setRefreshState(prev => ({ ...prev, [key]: 'idle' }));
      }, 1000);
    }, 600);
  }, [playSound, clearAll, clearPainHistory, clearMedicationHistory, clearVisitors, clearAlerts, clearActivityLog]);

  const medsToday = medicationHistory.filter(m => {
    const today = new Date();
    const medDate = new Date(m.timestamp);
    return medDate.toDateString() === today.toDateString();
  }).length;

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const getStatusDisplay = () => {
    switch (patientStatus) {
      case 'critical':
        return {
          label: l.critical,
          color: 'var(--color-danger)',
          bg: 'rgba(255, 59, 48, 0.15)',
          border: 'var(--color-danger)',
          icon: AlertTriangle,
          pulse: true
        };
      case 'attention':
        return {
          label: l.needsAttention,
          color: 'var(--color-warning)',
          bg: 'rgba(255, 159, 10, 0.15)',
          border: 'var(--color-warning)',
          icon: Bell,
          pulse: false
        };
      default:
        return {
          label: l.stable,
          color: 'var(--color-success)',
          bg: 'rgba(48, 209, 88, 0.15)',
          border: 'var(--color-success)',
          icon: Heart,
          pulse: false
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  const getAlertStyle = (type) => {
    switch (type) {
      case 'emergency':
        return { icon: AlertTriangle, color: '#ff3b30', bg: 'rgba(255, 59, 48, 0.15)' };
      case 'pain':
        return { icon: Activity, color: '#ff9500', bg: 'rgba(255, 149, 0, 0.15)' };
      case 'help':
        return { icon: HelpCircle, color: '#ffcc00', bg: 'rgba(255, 204, 0, 0.15)' };
      case 'okay':
        return { icon: ThumbsUp, color: '#34c759', bg: 'rgba(52, 199, 89, 0.15)' };
      case 'thirsty':
        return { icon: Droplets, color: '#5ac8fa', bg: 'rgba(90, 200, 250, 0.15)' };
      case 'hungry':
        return { icon: UtensilsCrossed, color: '#ff9500', bg: 'rgba(255, 149, 0, 0.15)' };
      case 'bathroom':
        return { icon: Bath, color: '#007aff', bg: 'rgba(0, 122, 255, 0.15)' };
      case 'hot':
        return { icon: Thermometer, color: '#ff3b30', bg: 'rgba(255, 59, 48, 0.15)' };
      case 'cold':
        return { icon: Snowflake, color: '#5ac8fa', bg: 'rgba(90, 200, 250, 0.15)' };
      case 'dizzy':
        return { icon: Frown, color: '#af52de', bg: 'rgba(175, 82, 222, 0.15)' };
      case 'tired':
        return { icon: Moon, color: '#5856d6', bg: 'rgba(88, 86, 214, 0.15)' };
      case 'anxious':
        return { icon: Heart, color: '#ff2d55', bg: 'rgba(255, 45, 85, 0.15)' };
      default:
        return { icon: Bell, color: 'var(--color-accent)', bg: 'var(--color-accent-soft)' };
    }
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  const handleDownload = () => {
    playSound('click');
    const data = generateReportData('today');

    let reportText = `ECHO Caregiver Report\n`;
    reportText += `${'='.repeat(50)}\n\n`;
    reportText += `Patient Status: ${status.label}\n`;
    reportText += `Generated: ${format(new Date(), 'MMM d, yyyy h:mm a')}\n\n`;

    reportText += `ACTIVITY LOG\n${'-'.repeat(30)}\n`;
    data.activityLog.forEach(entry => {
      reportText += `[${format(new Date(entry.timestamp), 'h:mm a')}] ${entry.message}\n`;
    });

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echo-caregiver-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderRefreshIcon = (key) => {
    const state = refreshState[key];
    if (state === 'success') {
      return <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-success)' }} />;
    }
    return (
      <RefreshCw
        className={`w-4 h-4 ${state === 'spinning' ? 'animate-spin' : ''}`}
        style={{ color: state === 'spinning' ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}
      />
    );
  };

  const tabs = [
    { id: 'overview', label: l.overview, icon: Heart },
    { id: 'alerts', label: l.alerts, icon: Bell, badge: unacknowledgedAlerts.length },
    { id: 'activity', label: l.activity, icon: Activity },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
        {l.title}
      </h2>

      {/* Patient Status Banner */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{
          background: 'var(--color-bg-secondary)',
          border: `2px solid ${status.border}`,
          animation: status.pulse ? 'pulse 2s infinite' : 'none'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: status.bg }}>
              <StatusIcon className="w-8 h-8" style={{ color: status.color }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{l.patientStatus}</p>
              <p className="text-2xl font-bold" style={{ color: status.color }}>{status.label}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleRefresh('all')}
              disabled={refreshState.all === 'spinning'}
              className="p-3 rounded-xl transition-all active:scale-95"
              style={{
                background: refreshState.all === 'success' ? 'rgba(48, 209, 88, 0.2)' : 'var(--color-accent-soft)',
              }}
              title="Refresh All"
            >
              {refreshState.all === 'success' ? (
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              ) : (
                <RefreshCw className={`w-5 h-5 ${refreshState.all === 'spinning' ? 'animate-spin' : ''}`} style={{ color: 'var(--color-accent)' }} />
              )}
            </button>
            <button
              onClick={handlePrint}
              className="p-3 rounded-xl transition-all"
              style={{ background: 'var(--color-bg-tertiary)' }}
              title="Print Report"
            >
              <Printer className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            <button
              onClick={handleDownload}
              className="p-3 rounded-xl transition-all"
              style={{ background: 'var(--color-bg-tertiary)' }}
              title="Download Report"
            >
              <Download className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setSelectedTab(tab.id); playSound('click'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all"
              style={{
                background: isActive ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                color: isActive ? 'white' : 'var(--color-text-secondary)'
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="px-2 py-0.5 text-white text-xs rounded-full" style={{ background: 'var(--color-danger)' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Pain Level Card */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Activity className="w-4 h-4" />
                  {l.currentPain}
                </div>
                <button
                  type="button"
                  onClick={() => handleRefresh('pain')}
                  disabled={refreshState.pain === 'spinning'}
                  className="p-2 rounded-lg transition-all active:scale-95"
                >
                  {renderRefreshIcon('pain')}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{
                    background: currentPainLevel <= 3 ? 'var(--color-success)' :
                      currentPainLevel <= 6 ? 'var(--color-warning)' : 'var(--color-danger)'
                  }}
                >
                  {currentPainLevel}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {currentPainLevel <= 3 ? l.low : currentPainLevel <= 6 ? l.moderate : l.high}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{l.outOf10}</p>
                </div>
              </div>
            </div>

            {/* Medications Today Card */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Pill className="w-4 h-4" />
                  {l.medsToday}
                </div>
                <button
                  type="button"
                  onClick={() => handleRefresh('meds')}
                  disabled={refreshState.meds === 'spinning'}
                  className="p-2 rounded-lg transition-all active:scale-95"
                >
                  {renderRefreshIcon('meds')}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent-soft)' }}>
                  <span className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{medsToday}</span>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{l.dosesGiven}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{l.today}</p>
                </div>
              </div>
            </div>

            {/* Visitors Card */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Users className="w-4 h-4" />
                  {l.currentVisitors}
                </div>
                <button
                  type="button"
                  onClick={() => handleRefresh('visitors')}
                  disabled={refreshState.visitors === 'spinning'}
                  className="p-2 rounded-lg transition-all active:scale-95"
                >
                  {renderRefreshIcon('visitors')}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                  <span className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{visitors.length}</span>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {visitors.length === 0 ? l.noVisitors :
                      visitors.length === 1 ? `1 ${l.visitor}` : `${visitors.length} ${l.visitors}`}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                    {visitors[0]?.name || l.currentlyAlone}
                  </p>
                </div>
              </div>
            </div>

            {/* Alerts Card */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Bell className="w-4 h-4" />
                  {l.unreadAlerts}
                </div>
                <button
                  type="button"
                  onClick={() => handleRefresh('alerts')}
                  disabled={refreshState.alerts === 'spinning'}
                  className="p-2 rounded-lg transition-all active:scale-95"
                >
                  {renderRefreshIcon('alerts')}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${unacknowledgedAlerts.length > 0 ? 'animate-pulse' : ''}`}
                  style={{ background: unacknowledgedAlerts.length > 0 ? 'rgba(255, 59, 48, 0.15)' : 'rgba(48, 209, 88, 0.15)' }}
                >
                  <span className="text-2xl font-bold" style={{ color: unacknowledgedAlerts.length > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {unacknowledgedAlerts.length}
                  </span>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {unacknowledgedAlerts.length === 0 ? l.allClear : l.needAttention}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                    {alerts.length} {l.totalToday}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pain trend */}
          <div className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <TrendingUp className="w-5 h-5" />
                {l.painTrend}
              </h3>
              <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{l.last10}</span>
            </div>

            {painHistory.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--color-text-tertiary)' }}>{l.noPainData}</p>
            ) : (
              <div className="flex items-end justify-around h-24 gap-1">
                {[...painHistory].reverse().slice(0, 10).map((entry, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${(entry.level / 10) * 100}%`,
                        minHeight: '4px',
                        background: entry.level <= 3 ? 'var(--color-success)' :
                          entry.level <= 6 ? 'var(--color-warning)' : 'var(--color-danger)'
                      }}
                    />
                    <span className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                      {format(new Date(entry.timestamp), 'HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {selectedTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <Bell className="w-5 h-5" />
              {l.alerts} ({alerts.length})
            </h3>
            <button
              type="button"
              onClick={() => handleRefresh('alerts')}
              disabled={refreshState.alerts === 'spinning'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all active:scale-95 text-sm font-medium"
              style={{
                background: refreshState.alerts === 'success' ? 'rgba(48, 209, 88, 0.2)' : 'var(--color-bg-tertiary)',
                color: refreshState.alerts === 'success' ? 'var(--color-success)' : 'var(--color-text-secondary)'
              }}
            >
              {renderRefreshIcon('alerts')}
              {refreshState.alerts === 'success' ? l.updated : l.refresh}
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <Bell className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--color-text-tertiary)' }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>{l.noAlerts}</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const style = getAlertStyle(alert.type);
              const Icon = style.icon;

              return (
                <div
                  key={alert.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: `1px solid ${alert.acknowledged ? 'var(--color-border)' : 'var(--color-accent)'}`,
                    opacity: alert.acknowledged ? 0.6 : 1
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl" style={{ background: style.bg }}>
                      <Icon className="w-6 h-6" style={{ color: style.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{alert.message}</p>
                          <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                            <Clock className="w-3 h-3" />
                            {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!alert.acknowledged && (
                            <button
                              onClick={() => { acknowledgeAlert(alert.id); playSound('success'); }}
                              className="p-2 rounded-lg transition-all"
                              style={{ background: 'rgba(48, 209, 88, 0.15)' }}
                              title={l.acknowledge}
                            >
                              <Check className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-2 rounded-lg transition-all hover:bg-red-500/20"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" style={{ color: 'var(--color-text-tertiary)' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Activity Tab */}
      {selectedTab === 'activity' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <Activity className="w-5 h-5" />
              {l.recentActivity}
            </h3>
            <button
              type="button"
              onClick={() => handleRefresh('activity')}
              disabled={refreshState.activity === 'spinning'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all active:scale-95 text-sm font-medium"
              style={{
                background: refreshState.activity === 'success' ? 'rgba(48, 209, 88, 0.2)' : 'var(--color-bg-tertiary)',
                color: refreshState.activity === 'success' ? 'var(--color-success)' : 'var(--color-text-secondary)'
              }}
            >
              {renderRefreshIcon('activity')}
              {refreshState.activity === 'success' ? l.updated : l.refresh}
            </button>
          </div>

          <div className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <FileText className="w-5 h-5" />
              {l.recentActivity}
            </h3>

            {activityLog.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--color-text-tertiary)' }}>{l.noActivity}</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activityLog.map((activity) => {
                  const style = getAlertStyle(activity.type);
                  const Icon = style.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-xl group"
                      style={{ background: 'var(--color-bg-tertiary)' }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: style.bg }}>
                        <Icon className="w-5 h-5" style={{ color: style.color }} />
                      </div>
                      <div className="flex-1">
                        <p style={{ color: 'var(--color-text-primary)' }}>{activity.message}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          {format(new Date(activity.timestamp), 'h:mm a')}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteActivityLog(activity.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 rounded-lg transition-all hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverDashboard;
