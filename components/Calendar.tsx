
import React, { useState } from 'react';
import { MaintenanceTask, TaskStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface CalendarProps {
  tasks: MaintenanceTask[];
  onSelectTask: (task: MaintenanceTask) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, onSelectTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => null);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      const taskDate = new Date(t.startDate);
      return taskDate.getDate() === day && taskDate.getMonth() === month && taskDate.getFullYear() === year;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">{monthNames[month]} {year}</h3>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-b bg-slate-50">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
          <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[120px]">
        {padding.map((_, i) => (
          <div key={`pad-${i}`} className="border-r border-b border-slate-50 bg-slate-25/50"></div>
        ))}
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          return (
            <div key={day} className="border-r border-b border-slate-50 p-2 group hover:bg-indigo-50/20 transition-colors">
              <span className="text-sm font-semibold text-slate-400 group-hover:text-indigo-600">{day}</span>
              <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                {dayTasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className={`block w-full text-left px-2 py-1 rounded text-[10px] font-medium truncate shadow-sm transition-transform active:scale-95 ${STATUS_COLORS[t.status]}`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
