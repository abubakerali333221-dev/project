
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_MERCHANTS, BUSINESS_TYPES } from '../constants';
import { Download, Search, Filter, Store, Mail, Phone, Calendar as CalendarIcon, Globe } from 'lucide-react';

const FounderDashboard: React.FC = () => {
  const { t, lang, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');

  const filteredMerchants = useMemo(() => {
    return MOCK_MERCHANTS.filter(m => {
      const matchesSearch = m.storeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            m.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesField = selectedField === 'all' || m.businessType === selectedField;
      return matchesSearch && matchesField;
    });
  }, [searchTerm, selectedField]);

  const handleExport = () => {
    const headers = ["ID", "Store Name", "Field", "Country", "Email", "Phone", "Join Date", "Status"];
    const rows = filteredMerchants.map(m => [
      m.id, m.storeName, m.businessType, m.country, m.email, m.phone, m.createdAt, m.status
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `merchants_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">{t.founderDashboard}</h2>
          <p className="text-slate-500 dark:text-gray-400 mt-1">{t.merchantCount}: {MOCK_MERCHANTS.length}</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          <Download size={20} />
          {t.exportData}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={t.searchStore}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-2xl pr-12 pl-4 py-3 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="md:w-64 relative">
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-2xl pr-12 pl-4 py-3 focus:ring-2 focus:ring-indigo-500 appearance-none"
          >
            <option value="all">{t.allFields}</option>
            {BUSINESS_TYPES.map(type => (
              <option key={type} value={type}>{t[type as keyof typeof t] || type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMerchants.map((merchant) => (
          <div key={merchant.id} className="bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 transition-all overflow-hidden group">
            <div className="h-2 gradient-bg"></div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 overflow-hidden">
                  <Store size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{merchant.storeName}</h4>
                  <span className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold uppercase tracking-wider">
                    {t[merchant.businessType as keyof typeof t] || merchant.businessType}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400">
                  <Mail size={16} className="shrink-0" />
                  <span className="truncate">{merchant.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400">
                  <Phone size={16} className="shrink-0" />
                  <span>{merchant.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400">
                  <Globe size={16} className="shrink-0" />
                  <span>{merchant.country}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400">
                  <CalendarIcon size={16} className="shrink-0" />
                  <span>{t.createdAt}: {merchant.createdAt}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  merchant.status === 'active' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {merchant.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <button className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMerchants.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center border-2 border-dashed dark:border-gray-700">
          <p className="text-slate-400 font-medium">لا توجد متاجر تطابق بحثك</p>
        </div>
      )}
    </div>
  );
};

export default FounderDashboard;
