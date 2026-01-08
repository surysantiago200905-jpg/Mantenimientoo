
import React from 'react';
import { USERS } from '../constants';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onSwitchUser: (user: User) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onSwitchUser, activeView, setActiveView }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
            A
          </div>
          <div>
            <h1 className="text-white font-bold leading-tight">ADUANAS</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Mantenimiento</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
            label="Dashboard" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>}
          />
          <NavItem 
            active={activeView === 'calendar'} 
            onClick={() => setActiveView('calendar')} 
            label="Calendario" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
          />
          <NavItem 
            active={activeView === 'tasks'} 
            onClick={() => setActiveView('tasks')} 
            label="Actividades" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
          />
          <NavItem 
            active={activeView === 'documents'} 
            onClick={() => setActiveView('documents')} 
            label="Facturas" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 mb-2 uppercase tracking-tighter px-2">Cambiar Usuario</div>
          <div className="space-y-2">
            {USERS.map(u => (
              <button 
                key={u.id}
                onClick={() => onSwitchUser(u)}
                className={`flex items-center space-x-2 w-full px-2 py-1.5 rounded transition ${currentUser.id === u.id ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}
              >
                <img src={u.avatar} className="w-6 h-6 rounded-full" alt={u.name} />
                <span className="text-sm">{u.name}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">{activeView}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
              <p className="text-xs text-slate-500">{currentUser.role}</p>
            </div>
            <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm" alt="User" />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default Layout;
