import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { TrendingUp, DollarSign, ShoppingCart, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockInvoices, mockProducts, mockCustomers } from '../data/mockData';

export const Reports: React.FC = () => {
  const { theme } = useTheme();

  const totalRevenue = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingRevenue = mockInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  
  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), change: '+12.5%', positive: true, icon: DollarSign, color: 'emerald' },
    { label: 'Pending Revenue', value: formatCurrency(pendingRevenue), change: '-5.2%', positive: false, icon: TrendingUp, color: 'amber' },
    { label: 'Total Orders', value: mockInvoices.length.toString(), change: '+8.3%', positive: true, icon: ShoppingCart, color: 'purple' },
    { label: 'New Customers', value: mockCustomers.length.toString(), change: '+15.1%', positive: true, icon: Users, color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Reports
        </h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Financial reports and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className={`rounded-2xl border p-6 ${
                theme === 'dark' 
                  ? 'bg-slate-800/30 border-slate-700/50' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Coming Soon */}
      <div className={`rounded-2xl border p-12 text-center ${
        theme === 'dark' 
          ? 'bg-slate-800/30 border-slate-700/50' 
          : 'bg-white border-slate-200'
      }`}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
          theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
        }`}>
          <TrendingUp className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Advanced Reports Coming Soon
        </h2>
        <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Detailed charts, export options, and more analytics features are on the way.
        </p>
      </div>
    </div>
  );
};
