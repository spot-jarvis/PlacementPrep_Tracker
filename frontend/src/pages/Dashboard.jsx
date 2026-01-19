import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Building2, ArrowRight, CheckSquare } from 'lucide-react';
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

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    upcoming: 0,
    companies: 0,
    roles: 0,
    topicData: [],
    packageData: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tasks, companies, roles] = await Promise.all([
          api.get('tasks/'),
          api.get('companies/'),
          api.get('roles/')
        ]);
        
        if (!tasks.data || !Array.isArray(tasks.data)) return;

        const pending = tasks.data.filter(t => !t.completed).length;
        const completed = tasks.data.filter(t => t.completed).length;
        
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcoming = tasks.data.filter(t => {
          if (!t.target_date) return false;
          const d = new Date(t.target_date);
          return d >= now && d <= nextWeek;
        }).length;

        const topicCounts = {};
        tasks.data.forEach(task => {
          const name = task.topic_name || 'Uncategorized';
          topicCounts[name] = (topicCounts[name] || 0) + 1;
        });
        const topicData = Object.keys(topicCounts).map(name => ({
          name,
          value: topicCounts[name]
        }));

        const packageCounts = {};
        roles.data.forEach(role => {
          const pkg = role.package || 'TBD';
          packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;
        });
        const packageData = Object.keys(packageCounts).map(name => ({
          name,
          value: packageCounts[name]
        }));

        setStats({
          pending,
          completed,
          upcoming,
          companies: companies.data?.length || 0,
          roles: roles.data?.length || 0,
          topicData,
          packageData
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const taskData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
  ];

  const hasChartData = stats.pending > 0 || stats.completed > 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Clock} label="Pending Tasks" value={stats.pending} color="bg-orange-600" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="bg-emerald-600" />
        <StatCard icon={CheckSquare} label="Total Roles" value={stats.roles} color="bg-purple-600" />
        <StatCard icon={Building2} label="Companies" value={stats.companies} color="bg-primary-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 font-display text-center lg:text-left">Task Distribution</h3>
          {hasChartData ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400 italic">
              Add some tasks to see distribution
            </div>
          )}
        </div>

        <div className="glass-card p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center lg:text-left">Roles by Package</h3>
          {stats.packageData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.packageData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400 italic">
              Add roles with package info to see trends
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <Link to="/tasks" className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all group border border-slate-100 hover:border-primary-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                  <CheckSquare size={20} />
                </div>
                <span className="font-semibold text-slate-700">Manage Study Tasks</span>
              </div>
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
            <Link to="/companies" className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all group border border-slate-100 hover:border-primary-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Building2 size={20} />
                </div>
                <span className="font-semibold text-slate-700">View Target Companies</span>
              </div>
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Overall Progress</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 font-medium">Completion Rate</span>
                <span className="font-bold text-slate-700">{Math.round((stats.completed / (stats.pending + stats.completed || 1)) * 100)}%</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.completed / (stats.pending + stats.completed || 1)) * 100}%` }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center">Keep going! You are doing great.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
