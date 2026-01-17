import React, { useEffect, useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', topic: '', target_date: '' });
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchTopics();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await api.get('topics/');
      setTopics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.patch(`tasks/${id}/`, { completed: !currentStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`tasks/${id}/`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('tasks/', newTask);
      setTasks([...tasks, res.data]);
      setShowModal(false);
      setNewTask({ title: '', description: '', topic: '', target_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Study Tasks</h2>
          <p className="text-slate-500">Track your learning goals and progress.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 italic">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No tasks found. Start by adding one!</p>
          </div>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card p-4 flex items-center gap-4 group ${task.completed ? 'opacity-60' : ''}`}
              >
                <button 
                  onClick={() => handleToggle(task.id, task.completed)}
                  className={`p-2 rounded-full transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-primary-500'}`}
                >
                  {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1">
                  <h3 className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    {task.target_date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(task.target_date).toLocaleDateString()}
                      </span>
                    )}
                    {task.topic_name && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                        {task.topic_name}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Basic Modal Implementation */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-6">Create New Task</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  required
                  className="input-field"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                <input 
                  type="date"
                  className="input-field"
                  value={newTask.target_date}
                  onChange={e => setNewTask({...newTask, target_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                <select 
                  className="input-field"
                  value={newTask.topic}
                  onChange={e => setNewTask({...newTask, topic: e.target.value})}
                >
                  <option value="">Select a topic</option>
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
