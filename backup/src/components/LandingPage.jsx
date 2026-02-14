import React from 'react';
import { Zap, Heart, Mic, Globe, Baby, Shield, Clock, Users } from 'lucide-react';

const LandingPage = ({ onEnterApp }) => {
  const features = [
    { icon: Zap, title: '12 Quick Buttons', desc: 'One-tap communication for urgent needs' },
    { icon: Heart, title: 'Body & Pain Map', desc: 'Point to where it hurts with visual guides' },
    { icon: Mic, title: 'Voice Control', desc: 'Speak commands when tapping is difficult' },
    { icon: Globe, title: 'Bilingual', desc: 'Full English and Spanish support' },
    { icon: Baby, title: 'Kids Mode', desc: 'Child-friendly interface with Sammy the Sloth' },
    { icon: Shield, title: 'Caregiver Dashboard', desc: 'Real-time monitoring and reports' },
    { icon: Clock, title: 'Medication Tracking', desc: 'Log all medications with timestamps' },
    { icon: Users, title: 'Visitor Log', desc: 'Track who visits and when' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-dark-900 to-blue-900/30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400">
              ECHO
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-2">Patient Communication App</p>
          <p className="text-2xl md:text-3xl font-semibold text-white mt-6 mb-8">
            "When Words Aren't Possible, <span className="text-cyan-400">ECHO Speaks</span>"
          </p>
        </header>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onEnterApp('free')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold text-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:scale-105 transition-all btn-glow"
          >
            Try ECHO Free
          </button>
          <button
            onClick={() => onEnterApp('subscribe')}
            className="w-full sm:w-auto px-8 py-4 bg-dark-700 border-2 border-cyan-500 rounded-2xl text-cyan-400 font-bold text-xl hover:bg-cyan-500/10 transform hover:scale-105 transition-all"
          >
            Subscribe $10/mo
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="glass rounded-2xl p-4 text-center hover:border-cyan-500/50 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Demo Preview */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
            How ECHO Helps
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🚨</div>
              <h3 className="font-semibold text-white mb-2">Emergency Alerts</h3>
              <p className="text-gray-400 text-sm">One tap sends immediate alerts to caregivers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🎯</div>
              <h3 className="font-semibold text-white mb-2">Pinpoint Pain</h3>
              <p className="text-gray-400 text-sm">Interactive body map shows exactly where it hurts</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🗣️</div>
              <h3 className="font-semibold text-white mb-2">Voice Commands</h3>
              <p className="text-gray-400 text-sm">Speak your needs when typing isn't possible</p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center text-gray-500 text-sm">
          <p>Designed for hospitals, care facilities, and home care</p>
          <p className="mt-2">HIPAA-compliant • Secure • Accessible</p>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-dark-600 text-center text-gray-500 text-sm">
          <p>© 2024 ECHO Patient Communication. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
