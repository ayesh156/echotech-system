import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { mockCustomers } from '../data/mockData';
import type { Customer } from '../data/mockData';
import { CustomerFormModal } from '../components/modals/CustomerFormModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { 
  Search, Plus, Edit, Trash2, Mail, Phone, AlertTriangle, CheckCircle, 
  Clock, CreditCard, Calendar, MessageCircle, DollarSign, Package
} from 'lucide-react';

export const Customers: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  
  // Local customers state for demo
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || customer.creditStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalCredit = customers.reduce((sum, c) => sum + (c.creditBalance || 0), 0);
    const overdueCount = customers.filter(c => c.creditStatus === 'overdue').length;
    const activeCount = customers.filter(c => c.creditStatus === 'active').length;
    const clearCount = customers.filter(c => c.creditStatus === 'clear').length;
    return { totalCredit, overdueCount, activeCount, clearCount };
  }, [customers]);

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getCreditStatusStyle = (status?: string) => {
    switch (status) {
      case 'clear':
        return theme === 'dark' 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
          : 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'active':
        return theme === 'dark' 
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
          : 'bg-blue-50 text-blue-600 border-blue-200';
      case 'overdue':
        return theme === 'dark' 
          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
          : 'bg-red-50 text-red-600 border-red-200';
      default:
        return theme === 'dark' 
          ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' 
          : 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getCreditStatusIcon = (status?: string) => {
    switch (status) {
      case 'clear': return <CheckCircle className="w-4 h-4" />;
      case 'active': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 70) return 'from-amber-500 to-orange-500';
    return 'from-emerald-500 to-teal-500';
  };

  // Handlers
  const handleAddCustomer = () => {
    setSelectedCustomer(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCustomer = (customer: Customer) => {
    if (selectedCustomer) {
      setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    } else {
      setCustomers(prev => [...prev, customer]);
    }
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Customers
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage customer relationships and credit accounts
          </p>
        </div>
        <button 
          onClick={handleAddCustomer}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl border p-4 ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <CreditCard className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Credit</p>
              <p className="text-lg font-bold text-red-500">{formatCurrency(stats.totalCredit)}</p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-4 ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Overdue</p>
              <p className="text-lg font-bold text-amber-500">{stats.overdueCount} Customers</p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-4 ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Active Credit</p>
              <p className="text-lg font-bold text-blue-500">{stats.activeCount} Customers</p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-4 ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Clear</p>
              <p className="text-lg font-bold text-emerald-500">{stats.clearCount} Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white border-slate-200'
        }`}>
          <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent border-none outline-none flex-1 ${
              theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Status Filter Buttons */}
        <div className={`flex items-center gap-2 p-1 rounded-xl ${
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'
        }`}>
          {[
            { value: 'all', label: 'All', icon: Package },
            { value: 'overdue', label: 'Overdue', icon: AlertTriangle },
            { value: 'active', label: 'Active', icon: Clock },
            { value: 'clear', label: 'Clear', icon: CheckCircle },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === value
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const daysUntilDue = getDaysUntilDue(customer.creditDueDate);
          const creditPercentage = customer.creditLimit ? (customer.creditBalance || 0) / customer.creditLimit * 100 : 0;
          const isOverdue = customer.creditStatus === 'overdue';
          const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue > 0;
          const hasCredit = (customer.creditBalance || 0) > 0;

          return (
            <div 
              key={customer.id}
              className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
                isOverdue
                  ? theme === 'dark' 
                    ? 'bg-slate-800/30 border-red-500/50 shadow-red-500/10' 
                    : 'bg-white border-red-300 shadow-red-100'
                  : theme === 'dark' 
                    ? 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30' 
                    : 'bg-white border-slate-200 hover:border-emerald-500/50'
              }`}
            >
              {/* Overdue Warning Banner */}
              {isOverdue && (
                <div className="bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    ⚠️ Payment Overdue!
                  </span>
                </div>
              )}

              {/* Due Soon Warning */}
              {isDueSoon && !isOverdue && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    ⏰ Due in {daysUntilDue} days
                  </span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                      isOverdue 
                        ? 'bg-gradient-to-br from-red-500 to-rose-600' 
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}>
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {customer.name}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {customer.totalOrders} orders
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getCreditStatusStyle(customer.creditStatus)}`}>
                      {getCreditStatusIcon(customer.creditStatus)}
                      {customer.creditStatus === 'clear' ? 'Clear' : customer.creditStatus === 'active' ? 'Active' : customer.creditStatus === 'overdue' ? 'Overdue' : 'N/A'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditCustomer(customer)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(customer)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={`text-sm truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      {customer.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      {customer.phone}
                    </span>
                  </div>
                </div>

                {/* Credit Section */}
                {hasCredit && (
                  <div className={`p-3 rounded-xl mb-4 ${
                    isOverdue
                      ? theme === 'dark' ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'
                      : theme === 'dark' ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50 border border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Credit (Naya)
                      </span>
                      <span className={`text-sm font-bold ${isOverdue ? 'text-red-500' : 'text-blue-500'}`}>
                        {formatCurrency(customer.creditBalance || 0)}
                      </span>
                    </div>
                    
                    {/* Credit Limit Progress Bar */}
                    {customer.creditLimit && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}>Limit Used</span>
                          <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}>
                            {creditPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(creditPercentage)} transition-all`}
                            style={{ width: `${Math.min(creditPercentage, 100)}%` }}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                          Max: {formatCurrency(customer.creditLimit)}
                        </p>
                      </div>
                    )}

                    {/* Due Date */}
                    {customer.creditDueDate && (
                      <div className="flex items-center justify-between pt-2 border-t border-dashed ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}">
                        <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Due
                        </span>
                        <span className={`text-xs font-medium ${
                          isOverdue ? 'text-red-500' : isDueSoon ? 'text-amber-500' : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {new Date(customer.creditDueDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Total Spent
                    </span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {formatCurrency(customer.totalSpent)}
                    </span>
                  </div>
                  
                  {/* Quick Actions */}
                  {hasCredit && (
                    <div className="flex gap-2">
                      <button className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium ${
                        theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}>
                        <DollarSign className="w-3.5 h-3.5" /> Collect
                      </button>
                      <button className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium ${
                        isOverdue
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      }`}>
                        <MessageCircle className="w-3.5 h-3.5" /> 
                        {isOverdue ? 'Urgent!' : 'Remind'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Results count */}
      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        Showing {filteredCustomers.length} of {customers.length} customers
      </p>

      {/* Modals */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        customer={selectedCustomer}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCustomer}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        itemName={customerToDelete?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
