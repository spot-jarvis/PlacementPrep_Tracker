import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Building2, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    upcoming: 0,
    companies: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tasks, companies] = await Promise.all([
          api.get('tasks/'),
          api.get('companies/')
        ]);
        
        const pending = tasks.data.filter(t => !t.completed).length;
        const completed = tasks.data.filter(t => t.completed).length;
        // Simple upcoming check for next 7 days
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcoming = tasks.data.filter(t => {
          if (!t.target_date) return false;
          const d = new Date(t.target_date);
          return d >= now && d <= nextWeek;
        }).length;

        setStats({
          pending,
          completed,
          upcoming,
          companies: companies.data.length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Clock} label="Pending Tasks" value={stats.pending} color="bg-orange-600" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="bg-emerald-600" />
        <StatCard icon={Clock} label="Upcoming Deadlines" value={stats.upcoming} color="bg-primary-600" />
        <StatCard icon={Building2} label="Companies Tracked" value={stats.companies} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <Link to="/tasks" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all group border border-transparent hover:border-primary-100">
              <div className="flex items-center gap-3">
                <CheckSquare className="text-primary-500" />
                <span className="font-medium">Add New Study Task</span>
              </div>
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
            <Link to="/companies" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all group border border-transparent hover:border-primary-100">
              <div className="flex items-center gap-3">
                <Building2 className="text-primary-500" />
                <span className="font-medium">Add Company Target</span>
              </div>
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Preparation Progress</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Task Completion</span>
                <span className="font-bold text-slate-700">{Math.round((stats.completed / (stats.pending + stats.completed || 1)) * 100)}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.completed / (stats.pending + stats.completed || 1)) * 100}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
            {/* Add more progress bars for topics/categories if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}

import { CheckSquare } from 'lucide-react';
