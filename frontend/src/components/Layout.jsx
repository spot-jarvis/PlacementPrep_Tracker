import React from 'react';
import { LayoutDashboard, Briefcase, BookOpen, CheckSquare, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export default function Layout({ children, user, onLogout }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const location = useLocation();

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'Study Tasks' },
    { to: '/companies', icon: Briefcase, label: 'Companies' },
    { to: '/topics', icon: BookOpen, label: 'Topics' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 flex flex-col"
      >
        <div className="p-6 flex items-center justify-between">
          {isOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-primary-600"
            >
              PrepTracker
            </motion.h1>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              {...link}
              active={location.pathname === link.to}
              isOpen={isOpen}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isOpen ? 280 : 80 }}
      >
        <header className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-40 flex items-center px-8">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-800 uppercase tracking-wider text-sm">
              {links.find(l => l.to === location.pathname)?.label || 'PrepTracker'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:block">
              {user}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              {user?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
