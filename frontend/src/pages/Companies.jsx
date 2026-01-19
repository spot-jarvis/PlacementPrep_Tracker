import { Plus, Building2, MapPin, Globe, CreditCard, ChevronRight, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', website: '', location: '', company_type: 'Product', notes: '' });
  const [newRole, setNewRole] = useState({ company: '', title: '', package: '', status: 'Open', notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('companies/', newCompany);
      setCompanies([...companies, res.data]);
      setShowCompanyModal(false);
      setNewCompany({ name: '', website: '', location: '', company_type: 'Product', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('roles/', newRole);
      setRoles([...roles, res.data]);
      setShowRoleModal(false);
      setNewRole({ company: '', title: '', package: '', status: 'Open', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompanyDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this company? All associated roles will be removed.')) return;
    try {
      await api.delete(`companies/${id}/`);
      setCompanies(companies.filter(c => c.id !== id));
      setRoles(roles.filter(r => r.company !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`roles/${id}/`);
      setRoles(roles.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Companies & Roles</h2>
          <p className="text-slate-500">Manage your applications and target companies.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowRoleModal(true)} className="btn-primary bg-purple-600 hover:bg-purple-700">
            <Plus size={20} />
            Add Role
          </button>
          <button onClick={() => setShowCompanyModal(true)} className="btn-primary">
            <Plus size={20} />
            Add Company
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Target Companies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {companies.map(company => (
                <motion.div 
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 relative group"
                >
                  <button 
                    onClick={() => handleCompanyDelete(company.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
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
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Open Roles</h3>
          <div className="space-y-4">
            <AnimatePresence>
              {roles.map(role => (
                <motion.div 
                  key={role.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-4 hover:border-primary-200 transition-all cursor-pointer group relative"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRoleDelete(role.id); }}
                    className="absolute top-4 right-8 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Company Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCompanyModal(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New Company</h3>
              <button onClick={() => setShowCompanyModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleCompanySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input required className="input-field" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                <input type="url" className="input-field" value={newCompany.website} onChange={e => setNewCompany({...newCompany, website: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input required className="input-field" value={newCompany.location} onChange={e => setNewCompany({...newCompany, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Type</label>
                <input required className="input-field" placeholder="e.g. Product, Service, Startup" value={newCompany.company_type} onChange={e => setNewCompany({...newCompany, company_type: e.target.value})} />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowCompanyModal(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 btn-primary justify-center">Add Company</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRoleModal(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New Role</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <select required className="input-field" value={newRole.company} onChange={e => setNewRole({...newRole, company: e.target.value})}>
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role Title</label>
                <input required className="input-field" value={newRole.title} onChange={e => setNewRole({...newRole, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Package (LPA)</label>
                <input required className="input-field" placeholder="e.g. 12 LPA" value={newRole.package} onChange={e => setNewRole({...newRole, package: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select className="input-field" value={newRole.status} onChange={e => setNewRole({...newRole, status: e.target.value})}>
                  <option value="Open">Open</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowRoleModal(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 btn-primary bg-purple-600 hover:bg-purple-700 justify-center">Add Role</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
