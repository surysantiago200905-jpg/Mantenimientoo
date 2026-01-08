
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Calendar from './components/Calendar';
import TaskForm from './components/TaskForm';
import { MaintenanceTask, TaskStatus, User, Attachment } from './types';
import { USERS, CUSTOMS_LOCATIONS, STATUS_COLORS } from './constants';
import { getMaintenanceAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [aiInsight, setAiInsight] = useState<{ steps: string[], tools: string[] } | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('aduanas_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      // Sample data
      const initial: MaintenanceTask[] = [
        {
          id: '1',
          title: 'Revisión aire acondicionado central',
          description: 'Mantenimiento preventivo de los equipos centrales en el ala norte.',
          customsLocation: 'Aduana de Tijuana',
          status: TaskStatus.PENDING,
          startDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          assignedTo: 'Luis Gomez',
          attachments: [],
          cost: 15000
        }
      ];
      setTasks(initial);
      localStorage.setItem('aduanas_tasks', JSON.stringify(initial));
    }
  }, []);

  const saveToLocalStorage = (updatedTasks: MaintenanceTask[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('aduanas_tasks', JSON.stringify(updatedTasks));
  };

  const handleSaveTask = (taskData: Partial<MaintenanceTask>) => {
    if (selectedTask) {
      const updated = tasks.map(t => t.id === selectedTask.id ? { ...t, ...taskData } as MaintenanceTask : t);
      saveToLocalStorage(updated);
    } else {
      const newTask: MaintenanceTask = {
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        attachments: [],
      } as MaintenanceTask;
      saveToLocalStorage([...tasks, newTask]);
    }
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };

  const handleFileUpload = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newAttachment: Attachment = {
        id: Math.random().toString(36).substr(2, 5),
        name: file.name,
        type: file.type,
        data: base64,
        uploadDate: new Date().toISOString()
      };

      const updated = tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, attachments: [...t.attachments, newAttachment] };
        }
        return t;
      });
      saveToLocalStorage(updated);
      
      // Update selected task if open
      if (selectedTask?.id === taskId) {
        setSelectedTask(prev => prev ? ({ ...prev, attachments: [...prev.attachments, newAttachment] }) : null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGetInsight = async (desc: string) => {
    setIsLoadingInsight(true);
    try {
      const result = await getMaintenanceAdvice(desc);
      setAiInsight(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Tareas" value={tasks.length} color="bg-indigo-50 text-indigo-700" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>} />
        <StatCard title="Pendientes" value={tasks.filter(t => t.status === TaskStatus.PENDING).length} color="bg-amber-50 text-amber-700" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} />
        <StatCard title="Realizadas" value={tasks.filter(t => t.status === TaskStatus.COMPLETED).length} color="bg-emerald-50 text-emerald-700" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>} />
        <StatCard title="Inversión Total" value={`$${tasks.reduce((acc, curr) => acc + (curr.cost || 0), 0).toLocaleString()}`} color="bg-blue-50 text-blue-700" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Actividades Recientes</h3>
            <button onClick={() => setIsTaskFormOpen(true)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Añadir Actividad</button>
          </div>
          <div className="space-y-4">
            {tasks.slice(-5).reverse().map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={() => { setSelectedTask(task); setAiInsight(null); }}>
                <div>
                  <h4 className="font-semibold text-slate-800">{task.title}</h4>
                  <p className="text-xs text-slate-500">{task.customsLocation} • {task.dueDate}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[task.status]}`}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Distribución por Aduana</h3>
          <div className="space-y-6">
            {CUSTOMS_LOCATIONS.map(loc => {
              const count = tasks.filter(t => t.customsLocation === loc.name).length;
              const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
              return (
                <div key={loc.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{loc.name}</span>
                    <span className="text-slate-500 font-bold">{count} tareas</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, color, icon }: { title: string, value: string | number, color: string, icon: React.ReactNode }) => (
    <div className={`p-6 rounded-2xl border border-transparent shadow-sm flex flex-col items-center justify-center text-center space-y-2 ${color} transition hover:scale-105 duration-300`}>
      <div className="p-3 bg-white/50 rounded-xl mb-2">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-widest opacity-80">{title}</p>
      <h3 className="text-3xl font-black">{value}</h3>
    </div>
  );

  return (
    <Layout 
      currentUser={currentUser} 
      onSwitchUser={setCurrentUser} 
      activeView={activeView} 
      setActiveView={setActiveView}
    >
      {activeView === 'dashboard' && renderDashboard()}
      
      {activeView === 'calendar' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Programación de Mantenimiento</h2>
              <p className="text-slate-500">Visualiza todas las tareas programadas en el tiempo.</p>
            </div>
            <button 
              onClick={() => setIsTaskFormOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center space-x-2 hover:bg-indigo-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              <span>Agendar Tarea</span>
            </button>
          </div>
          <Calendar tasks={tasks} onSelectTask={(t) => { setSelectedTask(t); setAiInsight(null); }} />
        </div>
      )}

      {activeView === 'tasks' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Listado de Actividades</h2>
            <button 
              onClick={() => { setSelectedTask(null); setIsTaskFormOpen(true); }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
            >
              Nueva Tarea
            </button>
          </div>
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actividad</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Aduana</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Responsable</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasks.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => { setSelectedTask(t); setAiInsight(null); }}>
                    <td className="px-6 py-4 font-semibold text-slate-800">{t.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{t.customsLocation}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{t.assignedTo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{t.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'documents' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {tasks.map(t => (
             <div key={t.id} className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
               <div className="flex justify-between items-start">
                 <h4 className="font-bold text-slate-800">{t.title}</h4>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_COLORS[t.status]}`}>{t.status}</span>
               </div>
               <div className="text-xs text-slate-500">
                 Archivos adjuntos: {t.attachments.length}
               </div>
               <div className="space-y-2">
                 {t.attachments.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                      <span className="truncate max-w-[150px]">{att.name}</span>
                      <a href={att.data} download={att.name} className="text-indigo-600 font-bold hover:underline">Descargar</a>
                    </div>
                 ))}
               </div>
               <div className="pt-4 border-t">
                 <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition text-slate-400 hover:text-indigo-600 group">
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(t.id, e)} />
                    <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-8l-3-3m0 0l-3 3m3-3v12"/></svg>
                    <span className="text-sm font-semibold">Subir Factura</span>
                 </label>
               </div>
             </div>
           ))}
         </div>
      )}

      {/* Modals */}
      {(isTaskFormOpen || (selectedTask && !selectedTask.id)) && (
        <TaskForm 
          onSave={handleSaveTask} 
          onCancel={() => { setIsTaskFormOpen(false); setSelectedTask(null); }} 
          initialTask={selectedTask || undefined} 
        />
      )}

      {selectedTask && selectedTask.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${STATUS_COLORS[selectedTask.status]} mb-1 inline-block`}>{selectedTask.status}</span>
                <h3 className="text-xl font-bold text-slate-800">{selectedTask.title}</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Detalles</h5>
                  <p className="text-slate-600 leading-relaxed mb-4">{selectedTask.description || 'Sin descripción.'}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ubicación:</span>
                      <span className="font-semibold text-slate-800">{selectedTask.customsLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Asignado a:</span>
                      <span className="font-semibold text-slate-800">{selectedTask.assignedTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inversión:</span>
                      <span className="font-semibold text-emerald-600">${selectedTask.cost?.toLocaleString()} MXN</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xs font-bold text-indigo-700 uppercase">IA Maintenance Insight</h5>
                    <button 
                      onClick={() => selectedTask.description && handleGetInsight(selectedTask.description)}
                      disabled={isLoadingInsight || !selectedTask.description}
                      className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isLoadingInsight ? 'Analizando...' : 'Obtener Consejos'}
                    </button>
                  </div>
                  {aiInsight ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Pasos de seguridad</p>
                        <ul className="text-xs text-indigo-900 space-y-1">
                          {aiInsight.steps.map((s, i) => <li key={i} className="flex items-start"><span className="mr-2 text-indigo-400">•</span> {s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Herramientas sugeridas</p>
                        <div className="flex flex-wrap gap-1">
                          {aiInsight.tools.map((t, i) => <span key={i} className="bg-white px-2 py-0.5 rounded text-[10px] border border-indigo-100">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-indigo-400 text-center py-4 italic">Haz clic para generar recomendaciones de IA basadas en la tarea.</p>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase mb-3">Facturas y Evidencias</h5>
                <div className="grid grid-cols-2 gap-4">
                  {selectedTask.attachments.map(att => (
                    <div key={att.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-slate-50">
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center border text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{att.name}</p>
                        <p className="text-[10px] text-slate-400">{new Date(att.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <a href={att.data} download={att.name} className="p-2 text-indigo-600 hover:bg-white rounded transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      </a>
                    </div>
                  ))}
                  <label className="flex items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition text-slate-400 hover:text-indigo-600">
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(selectedTask.id, e)} />
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    <span className="text-sm font-semibold">Subir Archivo</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t flex space-x-3">
              <button 
                onClick={() => { setIsTaskFormOpen(true); setSelectedTask(null); }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
              >
                Editar Actividad
              </button>
              <button 
                onClick={() => setSelectedTask(null)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-white transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
