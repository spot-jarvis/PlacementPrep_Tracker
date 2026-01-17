import React, { useEffect, useState } from 'react';
import { Plus, Building2, MapPin, Globe, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, roleRes] = await Promise.all([
          api.get('companies/'),
          api.get('roles/')
        ]);
        setCompanies(compRes.data);
        setRoles(roleRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Companies & Roles</h2>
          <p className="text-slate-500">Manage your applications and target companies.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Target Companies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map(company => (
              <motion.div 
                key={company.id}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                    <Building2 size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {company.company_type}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">{company.name}</h4>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} /> {company.location}
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2 text-primary-600">
                      <Globe size={14} /> 
                      <a href={company.website} target="_blank" rel="noreferrer" className="hover:underline">Website</a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Open Roles</h3>
          <div className="space-y-4">
            {roles.map(role => (
              <div key={role.id} className="glass-card p-4 hover:border-primary-200 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{role.title}</h4>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    {role.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-3">{role.company_name}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-600 mb-0.5">
                    <CreditCard size={12} /> {role.package}
                  </span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
