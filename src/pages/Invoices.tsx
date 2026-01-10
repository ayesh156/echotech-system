import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { mockInvoices as initialMockInvoices, mockCustomers, mockProducts } from '../data/mockData';
import type { Invoice } from '../data/mockData';
import { 
  FileText, Search, Plus, Eye, Edit, Trash2, 
  CheckCircle, Clock, AlertTriangle, Filter,
  Grid, List, SortAsc, SortDesc, ChevronDown, RefreshCw,
  TrendingUp, Calendar, User, Building2
} from 'lucide-react';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { InvoiceEditModal } from '../components/modals/InvoiceEditModal';
import { SearchableSelect } from '../components/ui/searchable-select';

type ViewMode = 'grid' | 'table';

export const Invoices: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>(initialMockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Get unique customers from invoices
  const invoiceCustomers = useMemo(() => {
    const customerIds = [...new Set(invoices.map(inv => inv.customerId))];
    return mockCustomers.filter(c => customerIds.includes(c.id));
  }, [invoices]);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchesCustomer = customerFilter === 'all' || invoice.customerId === customerFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const invoiceDate = new Date(invoice.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case 'today':
            matchesDate = invoiceDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = invoiceDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDate = invoiceDate >= monthAgo;
            break;
          case 'year':
            matchesDate = invoiceDate.getFullYear() === today.getFullYear();
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesCustomer && matchesDate;
    });

    // Apply sorting by date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [invoices, searchQuery, statusFilter, customerFilter, dateFilter, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(startIndex, startIndex + pageSize);
  }, [filteredInvoices, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, customerFilter, dateFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
    const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total, 0);
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);
    const paidCount = invoices.filter(i => i.status === 'paid').length;
    const pendingCount = invoices.filter(i => i.status === 'pending').length;
    const overdueCount = invoices.filter(i => i.status === 'overdue').length;
    return { totalInvoices, totalRevenue, pendingAmount, overdueAmount, paidCount, pendingCount, overdueCount };
  }, [invoices]);

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || customerFilter !== 'all' || dateFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCustomerFilter('all');
    setDateFilter('all');
  };

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': 
        return theme === 'dark' 
          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
          : 'bg-green-50 text-green-600 border-green-200';
      case 'pending': 
        return theme === 'dark' 
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
          : 'bg-amber-50 text-amber-600 border-amber-200';
      case 'overdue': 
        return theme === 'dark' 
          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
          : 'bg-red-50 text-red-600 border-red-200';
      default: return '';
    }
  };

  // Handlers
  const handleViewClick = (invoice: Invoice) => {
    navigate(`/invoices/${invoice.id}`);
  };

  const handleEditClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedInvoice: Invoice) => {
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedInvoice) {
      setInvoices(invoices.filter(inv => inv.id !== selectedInvoice.id));
      setShowDeleteModal(false);
      setSelectedInvoice(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Invoices
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage and track all your invoices
          </p>
        </div>
        <button 
          onClick={() => navigate('/invoices/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats.totalInvoices}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Total Invoices</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Rs. {(stats.totalRevenue / 1000).toFixed(0)}K</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{stats.paidCount} Paid</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Rs. {(stats.pendingAmount / 1000).toFixed(0)}K</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{stats.pendingCount} Pending</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Rs. {(stats.overdueAmount / 1000).toFixed(0)}K</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{stats.overdueCount} Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border ${
                hasActiveFilters
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : theme === 'dark' 
                    ? 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                  {[statusFilter !== 'all', customerFilter !== 'all', dateFilter !== 'all'].filter(Boolean).length}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Button */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`p-2 rounded-xl border transition-colors ${
                theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
              title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>

            {/* View Mode Toggle */}
            <div className={`flex items-center rounded-xl border p-1 ${
              theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-500 text-white' 
                    : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-emerald-500 text-white' 
                    : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className={`flex flex-wrap gap-4 pt-4 mt-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
            {/* Status Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Status
              </label>
              <SearchableSelect
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
                placeholder="All Status"
                searchPlaceholder="Search..."
                emptyMessage="No options"
                theme={theme}
                options={[
                  { value: 'all', label: 'All Status', icon: <Filter className="w-4 h-4" /> },
                  { value: 'paid', label: 'Paid', icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
                  { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4 text-amber-500" /> },
                  { value: 'overdue', label: 'Overdue', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
                ]}
              />
            </div>

            {/* Customer Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Customer
              </label>
              <SearchableSelect
                value={customerFilter}
                onValueChange={(value) => setCustomerFilter(value)}
                placeholder="All Customers"
                searchPlaceholder="Search..."
                emptyMessage="No customers"
                theme={theme}
                options={[
                  { value: 'all', label: 'All Customers', icon: <User className="w-4 h-4" /> },
                  ...invoiceCustomers.map(c => ({ value: c.id, label: c.name, icon: <Building2 className="w-4 h-4" /> }))
                ]}
              />
            </div>

            {/* Date Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Time Period
              </label>
              <SearchableSelect
                value={dateFilter}
                onValueChange={(value) => setDateFilter(value)}
                placeholder="All Time"
                searchPlaceholder="Search..."
                emptyMessage="No options"
                theme={theme}
                options={[
                  { value: 'all', label: 'All Time', icon: <Calendar className="w-4 h-4" /> },
                  { value: 'today', label: 'Today', icon: <Calendar className="w-4 h-4" /> },
                  { value: 'week', label: 'This Week', icon: <Calendar className="w-4 h-4" /> },
                  { value: 'month', label: 'This Month', icon: <Calendar className="w-4 h-4" /> },
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Invoices Display */}
      {filteredInvoices.length > 0 ? (
        viewMode === 'grid' ? (
          /* Grid/Card View */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`group rounded-2xl border overflow-hidden transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Status bar */}
                  <div className={`h-1 ${
                    invoice.status === 'paid' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : invoice.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-rose-500'
                  }`} />
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className={`text-base font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {invoice.id}
                        </p>
                        <div className={`flex items-center gap-1.5 mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          <User className="w-3.5 h-3.5" />
                          <span>{invoice.customerName}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-50'}`}>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Issue</p>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-50'}`}>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Due</p>
                        <p className={`text-sm font-medium ${new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' ? 'text-red-400' : theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* Amount */}
                    <div className={`p-3 rounded-xl mb-3 ${theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total</span>
                        <span className="text-lg font-bold text-emerald-500">{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className={`flex gap-2 pt-3 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
                      <button 
                        onClick={() => handleViewClick(invoice)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium ${
                          theme === 'dark' ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button 
                        onClick={() => handleEditClick(invoice)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium ${
                          theme === 'dark' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(invoice)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium ${
                          theme === 'dark' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-xl border disabled:opacity-50 ${
                    theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Previous
                </button>
                <span className={`px-3 py-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-xl border disabled:opacity-50 ${
                    theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          /* Table View */
          <div className={`rounded-2xl border overflow-hidden ${
            theme === 'dark' 
              ? 'bg-slate-800/30 border-slate-700/50' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Invoice
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Customer
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Date
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Status
                    </th>
                    <th className={`text-right px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Amount
                    </th>
                    <th className={`text-right px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id}
                      className={`border-b transition-colors ${
                        theme === 'dark' 
                          ? 'border-slate-700/30 hover:bg-slate-800/30' 
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <FileText className="w-4 h-4 text-emerald-500" />
                          </div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {invoice.id}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {invoice.customerName}
                      </td>
                      <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusStyle(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleViewClick(invoice)}
                            className={`p-2 rounded-xl transition-colors ${
                              theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditClick(invoice)}
                            className={`p-2 rounded-xl transition-colors ${
                              theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(invoice)}
                            className={`p-2 rounded-xl transition-colors ${
                              theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            {totalPages > 1 && (
              <div className={`flex justify-between items-center px-6 py-4 border-t ${
                theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
              }`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredInvoices.length)} of {filteredInvoices.length} invoices
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-xl border disabled:opacity-50 ${
                      theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-xl border disabled:opacity-50 ${
                      theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* Empty State */
        <div className={`text-center py-16 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'
        }`}>
          <FileText className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            No invoices found
          </h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {hasActiveFilters ? 'Try adjusting your filters' : 'Create your first invoice to get started'}
          </p>
          {hasActiveFilters ? (
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button 
              onClick={() => navigate('/invoices/create')}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Create Invoice
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <InvoiceEditModal
        isOpen={showEditModal}
        invoice={selectedInvoice}
        products={mockProducts}
        onClose={() => {
          setShowEditModal(false);
          setSelectedInvoice(null);
        }}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice "${selectedInvoice?.id}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedInvoice(null);
        }}
      />
    </div>
  );
};
