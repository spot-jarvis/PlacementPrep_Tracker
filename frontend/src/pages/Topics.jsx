import React, { useEffect, useState } from 'react';
import { Book, Plus, Tag, Layers, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', category: '', difficulty: 'Medium' });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await api.get('topics/');
      setTopics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('topics/', newTopic);
      setTopics([...topics, res.data]);
      setShowModal(false);
      setNewTopic({ name: '', category: '', difficulty: 'Medium' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
      await api.delete(`topics/${id}/`);
      setTopics(topics.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getDifficultyColor = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'hard': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Study Topics</h2>
          <p className="text-slate-500 dark:text-slate-400">Curated topics and preparation material.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          New Topic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 border-l-4 border-l-primary-500 group relative"
            >
              <button 
                onClick={() => handleDelete(topic.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                  <Book size={20} />
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{topic.name}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Layers size={14} /> {topic.category}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-md relative shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create New Topic</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic Name</label>
                <input 
                  required
                  placeholder="e.g. Dynamic Programming"
                  className="input-field"
                  value={newTopic.name}
                  onChange={e => setNewTopic({...newTopic, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <input 
                  required
                  placeholder="e.g. Algorithms"
                  className="input-field"
                  value={newTopic.category}
                  onChange={e => setNewTopic({...newTopic, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                <select 
                  className="input-field"
                  value={newTopic.difficulty}
                  onChange={e => setNewTopic({...newTopic, difficulty: e.target.value})}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
                  Create Topic
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
