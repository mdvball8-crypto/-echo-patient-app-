import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

const CaregiverDashboard = () => {
  const {
    t,
    alerts,
    acknowledgeAlert,
    deleteAlert,
    currentPainLevel,
    painHistory,
    medicationHistory,
    visitors,
    activityLog,
    deleteActivityLog,
    patientStatus,
    playSound,
    generateReportData
  } = useApp();

  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate stats
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  // Get status display
  const getStatusDisplay = () => {
    switch (patientStatus) {
      case 'critical':
        return {
          label: t('critical'),
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500',
          icon: AlertTriangle,
          pulse: true
        };
      case 'attention':
        return {
          label: t('needsAttention'),
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500',
          icon: Bell,
          pulse: false
        };
      default:
        return {
          label: t('stable'),
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500',
          icon: Heart,
          pulse: false
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  // Get alert icon and color
  const getAlertStyle = (type) => {
    switch (type) {
      case 'emergency':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/20' };
      case 'pain':
        return { icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/20' };
      default:
        return { icon: Bell, color: 'text-cyan-500', bg: 'bg-cyan-500/20' };
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unacknowledgedAlerts.length },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
        {t('caregiverDashboard')}
      </h2>

      {/* Patient Status Banner */}
      <div className={`glass rounded-2xl p-4 mb-6 border-2 ${status.border} ${status.pulse ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${status.bg}`}>
              <StatusIcon className={`w-8 h-8 ${status.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('patientStatus')}</p>
              <p className={`text-2xl font-bold ${status.color}`}>{status.label}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-3 bg-dark-600 hover:bg-dark-500 rounded-xl transition-all"
              title="Print Report"
            >
              <Printer className="w-5 h-5 text-gray-300" />
            </button>
            <button
              onClick={handleDownload}
              className="p-3 bg-dark-600 hover:bg-dark-500 rounded-xl transition-all"
              title="Download Report"
            >
              <Download className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setSelectedTab(tab.id); playSound('click'); }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all
                ${selectedTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
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
          {/* Status cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Pain Level */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Activity className="w-4 h-4" />
                Current Pain
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold
                  ${currentPainLevel <= 3 ? 'bg-green-500' :
                    currentPainLevel <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white`}>
                  {currentPainLevel}
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {currentPainLevel <= 3 ? 'Low' :
                      currentPainLevel <= 6 ? 'Moderate' : 'High'}
                  </p>
                  <p className="text-gray-500 text-sm">out of 10</p>
                </div>
              </div>
            </div>

            {/* Medications Today */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Pill className="w-4 h-4" />
                Meds Today
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cyan-400">
                    {medicationHistory.filter(m => {
                      const today = new Date();
                      const medDate = new Date(m.timestamp);
                      return medDate.toDateString() === today.toDateString();
                    }).length}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">Doses Given</p>
                  <p className="text-gray-500 text-sm">today</p>
                </div>
              </div>
            </div>

            {/* Visitors */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Users className="w-4 h-4" />
                Current Visitors
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-400">{visitors.length}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {visitors.length === 0 ? 'No visitors' :
                      visitors.length === 1 ? '1 visitor' : `${visitors.length} visitors`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {visitors[0]?.name || 'Currently alone'}
                  </p>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Bell className="w-4 h-4" />
                Unread Alerts
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center
                  ${unacknowledgedAlerts.length > 0 ? 'bg-red-500/20 animate-pulse' : 'bg-green-500/20'}`}>
                  <span className={`text-2xl font-bold ${unacknowledgedAlerts.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {unacknowledgedAlerts.length}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {unacknowledgedAlerts.length === 0 ? 'All clear' : 'Need attention'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {alerts.length} total today
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pain trend mini chart */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-300 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Pain Trend
              </h3>
              <span className="text-sm text-gray-500">Last 10 readings</span>
            </div>

            {painHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pain data recorded</p>
            ) : (
              <div className="flex items-end justify-around h-24 gap-1">
                {[...painHistory].reverse().slice(0, 10).map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className={`w-full rounded-t transition-all ${
                        entry.level <= 3 ? 'bg-green-500' :
                        entry.level <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${(entry.level / 10) * 100}%`, minHeight: '4px' }}
                    />
                    <span className="text-xs text-gray-500 mt-1">
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
          {alerts.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-500 mb-2" />
              <p className="text-gray-400">{t('noAlerts')}</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const style = getAlertStyle(alert.type);
              const Icon = style.icon;

              return (
                <div
                  key={alert.id}
                  className={`glass rounded-2xl p-4 border ${
                    alert.acknowledged ? 'border-dark-600 opacity-60' : 'border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${style.bg}`}>
                      <Icon className={`w-6 h-6 ${style.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-semibold">{alert.message}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!alert.acknowledged && (
                            <button
                              onClick={() => { acknowledgeAlert(alert.id); playSound('success'); }}
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all"
                              title="Acknowledge"
                            >
                              <Check className="w-5 h-5 text-green-400" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-400" />
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
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('activityLog')}
            </h3>

            {activityLog.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activityLog.map((activity) => {
                  const style = getAlertStyle(activity.type);
                  const Icon = style.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 bg-dark-700 rounded-xl group"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.bg}`}>
                        <Icon className={`w-5 h-5 ${style.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(activity.timestamp), 'h:mm a')}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteActivityLog(activity.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
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
