import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { User, Bell, Palette } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Settings
        </h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Appearance */}
        <div className={`rounded-2xl border p-6 ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <Palette className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Appearance
            </h2>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Dark Mode
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Toggle dark/light theme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className={`rounded-2xl border p-6 ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <User className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Profile
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Business Name
              </label>
              <input
                type="text"
                defaultValue="Ecotec Computer Solutions"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700 text-white' 
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@ecotec.lk"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700 text-white' 
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={`rounded-2xl border p-6 ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <Bell className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Notifications
            </h2>
          </div>
          
          <div className="space-y-3">
            {['Email notifications', 'Low stock alerts', 'Invoice reminders'].map((item) => (
              <div key={item} className="flex items-center justify-between py-2">
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                <button className={`relative w-12 h-6 rounded-full transition-colors bg-emerald-500`}>
                  <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
