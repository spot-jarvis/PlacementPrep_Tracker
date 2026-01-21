import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, ShieldCheck, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            User Profile
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center mx-auto ring-4 ring-primary-50 dark:ring-primary-900/50">
              <User size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Active Member</p>
            </div>
            <div className="pt-4">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-primary-600 dark:text-primary-400" /> Account Security
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Password</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last changed 2 months ago</p>
                  </div>
                </div>
                <button className="text-primary-600 dark:text-primary-400 text-sm font-bold hover:underline">Change</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Email Address</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.toLowerCase()}@example.com</p>
                  </div>
                </div>
                <button className="text-primary-600 dark:text-primary-400 text-sm font-bold hover:underline">Verify</button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-red-100 dark:border-red-900/30">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
              <Trash2 size={20} /> Danger Zone
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Permanently delete your account and all preparation data. This action cannot be undone.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-shadow shadow-sm hover:shadow-md">
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
