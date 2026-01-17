import React, { useEffect, useState } from 'react';
import { Book, Plus, Tag, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchTopics();
  }, []);

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
          <h2 className="text-2xl font-bold text-slate-800">Study Topics</h2>
          <p className="text-slate-500">Curated topics and preparation material.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          New Topic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 border-l-4 border-l-primary-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                <Book size={20} />
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(topic.difficulty)}`}>
                {topic.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{topic.name}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Layers size={14} /> {topic.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
