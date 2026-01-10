import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { mockCustomers } from '../data/mockData';
import type { Customer } from '../data/mockData';
import { CustomerFormModal } from '../components/modals/CustomerFormModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { 
  Search, Plus, Edit, Trash2, Mail, Phone
} from 'lucide-react';

export const Customers: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  
  // Local customers state for demo
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;

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
            Manage your customer relationships
          </p>
        </div>
        <button 
          onClick={handleAddCustomer}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div 
            key={customer.id}
            className={`rounded-2xl border p-6 transition-all hover:shadow-lg ${
              theme === 'dark' 
                ? 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30' 
                : 'bg-white border-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
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
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleEditCustomer(customer)}
                  className={`p-2 rounded-xl transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(customer)}
                  className={`p-2 rounded-xl transition-colors ${
                    theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Mail className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
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

            <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Total Spent
                </span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {formatCurrency(customer.totalSpent)}
                </span>
              </div>
            </div>
          </div>
        ))}
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
