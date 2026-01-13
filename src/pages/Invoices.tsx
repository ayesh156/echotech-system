import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { mockInvoices as initialMockInvoices, mockCustomers, mockProducts, mockWhatsAppSettings } from '../data/mockData';
import type { Invoice } from '../data/mockData';
import { 
  FileText, Search, Plus, Eye, Edit, Trash2, 
  CheckCircle, Filter,
  List, SortAsc, SortDesc, RefreshCw, LayoutGrid,
  Calendar, User, Building2, XCircle, CircleDollarSign, DollarSign,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Shield, AlertTriangle, MessageCircle
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
  
  // Date range filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Price filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Warranty expiration filter
  const [showWarrantyIssuesOnly, setShowWarrantyIssuesOnly] = useState(false);
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  // Calendar states
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target as Node)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target as Node)) {
        setShowEndCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique customers from invoices
  const invoiceCustomers = useMemo(() => {
    const customerIds = [...new Set(invoices.map(inv => inv.customerId))];
    return mockCustomers.filter(c => customerIds.includes(c.id));
  }, [invoices]);

  // Check invoice warranty status
  const getInvoiceWarrantyStatus = (invoice: Invoice): { hasExpired: boolean; hasExpiringSoon: boolean; expiredCount: number; expiringSoonCount: number } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let expiredCount = 0;
    let expiringSoonCount = 0;
    
    invoice.items.forEach(item => {
      if (item.warrantyDueDate) {
        const warrantyDate = new Date(item.warrantyDueDate);
        warrantyDate.setHours(0, 0, 0, 0);
        
        const diffTime = warrantyDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          expiredCount++;
        } else if (diffDays <= 30) {
          expiringSoonCount++;
        }
      }
    });
    
    return {
      hasExpired: expiredCount > 0,
      hasExpiringSoon: expiringSoonCount > 0,
      expiredCount,
      expiringSoonCount
    };
  };

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchesCustomer = customerFilter === 'all' || invoice.customerId === customerFilter;
      
      // Date range filter
      let matchesDate = true;
      if (startDate || endDate) {
        const invoiceDate = new Date(invoice.date);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && invoiceDate >= start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && invoiceDate <= end;
        }
      }
      
      // Price filter
      const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
      const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = invoice.total >= minPriceNum && invoice.total <= maxPriceNum;
      
      // Warranty expiration filter
      let matchesWarranty = true;
      if (showWarrantyIssuesOnly) {
        const { hasExpired, hasExpiringSoon } = getInvoiceWarrantyStatus(invoice);
        matchesWarranty = hasExpired || hasExpiringSoon;
      }
      
      return matchesSearch && matchesStatus && matchesCustomer && matchesDate && matchesPrice && matchesWarranty;
    });

    // Apply sorting by date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [invoices, searchQuery, statusFilter, customerFilter, startDate, endDate, minPrice, maxPrice, showWarrantyIssuesOnly, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, customerFilter, startDate, endDate, minPrice, maxPrice, showWarrantyIssuesOnly]);

  // Reset items per page when view mode changes
  useEffect(() => {
    if (viewMode === 'table') {
      setItemsPerPage(10);
    } else {
      setItemsPerPage(9);
    }
    setCurrentPage(1);
  }, [viewMode]);

  // Generate page numbers for pagination
  const getPageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  // Stats
  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.filter(i => i.status === 'fullpaid').reduce((sum, i) => sum + i.total, 0);
    const halfpayAmount = invoices.filter(i => i.status === 'halfpay').reduce((sum, i) => sum + (i.paidAmount || 0), 0);
    const unpaidAmount = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.total, 0);
    const fullpaidCount = invoices.filter(i => i.status === 'fullpaid').length;
    const halfpayCount = invoices.filter(i => i.status === 'halfpay').length;
    const unpaidCount = invoices.filter(i => i.status === 'unpaid').length;
    return { totalInvoices, totalRevenue, halfpayAmount, unpaidAmount, fullpaidCount, halfpayCount, unpaidCount };
  }, [invoices]);

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || customerFilter !== 'all' || startDate || endDate || minPrice || maxPrice || showWarrantyIssuesOnly;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCustomerFilter('all');
    setStartDate('');
    setEndDate('');
    setMinPrice('');
    setMaxPrice('');
    setShowWarrantyIssuesOnly(false);
  };

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;

  // WhatsApp payment reminder function
  const sendWhatsAppReminder = (invoice: Invoice) => {
    const customer = mockCustomers.find(c => c.id === invoice.customerId);
    if (!customer?.phone) {
      alert('Customer phone number not found!');
      return;
    }

    // Calculate amounts
    const dueAmount = invoice.total - (invoice.paidAmount || 0);
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today && invoice.status !== 'fullpaid';
    const daysOverdue = isOverdue ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Choose template based on overdue status
    let message = isOverdue 
      ? mockWhatsAppSettings.overdueReminderTemplate 
      : mockWhatsAppSettings.paymentReminderTemplate;

    // Replace placeholders
    message = message
      .replace(/\{\{customerName\}\}/g, invoice.customerName)
      .replace(/\{\{invoiceId\}\}/g, invoice.id)
      .replace(/\{\{totalAmount\}\}/g, invoice.total.toLocaleString())
      .replace(/\{\{paidAmount\}\}/g, (invoice.paidAmount || 0).toLocaleString())
      .replace(/\{\{dueAmount\}\}/g, dueAmount.toLocaleString())
      .replace(/\{\{dueDate\}\}/g, dueDate.toLocaleDateString('en-GB'))
      .replace(/\{\{daysOverdue\}\}/g, daysOverdue.toString());

    // Format phone number (remove dashes and ensure country code)
    let phone = customer.phone.replace(/[-\s]/g, '');
    // If starts with 0, replace with Sri Lanka country code
    if (phone.startsWith('0')) {
      phone = '94' + phone.substring(1);
    }
    // If doesn't start with country code, add it
    if (!phone.startsWith('94') && !phone.startsWith('+94')) {
      phone = '94' + phone;
    }
    phone = phone.replace('+', '');

    // Open WhatsApp with the message using wa.me format
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Check if invoice needs reminder (unpaid or halfpay)
  const needsReminder = (invoice: Invoice) => {
    return invoice.status !== 'fullpaid';
  };

  // Check if invoice is overdue
  const isOverdue = (invoice: Invoice) => {
    return new Date(invoice.dueDate) < new Date() && invoice.status !== 'fullpaid';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fullpaid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'halfpay': return <CircleDollarSign className="w-4 h-4 text-amber-500" />;
      case 'unpaid': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'fullpaid': 
        return theme === 'dark' 
          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
          : 'bg-green-50 text-green-600 border-green-200';
      case 'halfpay': 
        return theme === 'dark' 
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
          : 'bg-amber-50 text-amber-600 border-amber-200';
      case 'unpaid': 
        return theme === 'dark' 
          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
          : 'bg-red-50 text-red-600 border-red-200';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'fullpaid': return 'Full Paid';
      case 'halfpay': return 'Half Pay';
      case 'unpaid': return 'Unpaid';
      default: return status;
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderCalendar = (
    selectedDate: string, 
    setSelectedDate: (date: string) => void, 
    setShowCalendar: (show: boolean) => void
  ) => {
    const { daysInMonth, startingDay } = getDaysInMonth(calendarMonth);
    const days = [];
    const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
      const isSelected = selectedDateObj && 
        currentDate.getDate() === selectedDateObj.getDate() &&
        currentDate.getMonth() === selectedDateObj.getMonth() &&
        currentDate.getFullYear() === selectedDateObj.getFullYear();
      const isToday = new Date().toDateString() === currentDate.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => {
            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            setSelectedDate(dateStr);
            setShowCalendar(false);
          }}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
            isSelected
              ? 'bg-emerald-500 text-white'
              : isToday
              ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
              : theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className={`absolute top-full left-0 mt-2 p-3 rounded-xl border shadow-xl z-50 min-w-[280px] ${
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
            className={`p-1 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
            className={`p-1 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className={`w-8 h-8 flex items-center justify-center text-xs font-medium ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        <button
          onClick={() => {
            setSelectedDate('');
            setShowCalendar(false);
          }}
          className={`w-full mt-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          Clear
        </button>
      </div>
    );
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
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Rs. {(stats.totalRevenue / 1000).toFixed(0)}K</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{stats.fullpaidCount} Full Paid</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Rs. {(stats.halfpayAmount / 1000).toFixed(0)}K</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{stats.halfpayCount} Half Pay</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Rs. {(stats.unpaidAmount / 1000).toFixed(0)}K</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{stats.unpaidCount} Unpaid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters - Single Line */}
      <div className={`p-3 sm:p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border flex-1 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
            <Search className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent border-none outline-none flex-1 min-w-0 text-sm ${theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-emerald-500 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                  {[statusFilter !== 'all', customerFilter !== 'all', startDate, endDate, minPrice, maxPrice, showWarrantyIssuesOnly].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Sort Button */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`p-2 rounded-xl border transition-colors ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
              title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>

            {/* View Mode Toggle */}
            <div className={`flex items-center rounded-xl overflow-hidden border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-emerald-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                }`}
                title="Card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className={`pt-3 sm:pt-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="w-full sm:w-40">
                <SearchableSelect
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                  placeholder="All Status"
                  searchPlaceholder="Search..."
                  emptyMessage="No options"
                  theme={theme}
                  options={[
                    { value: 'all', label: 'All Status', icon: <Filter className="w-4 h-4" /> },
                    { value: 'fullpaid', label: 'Full Paid', icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
                    { value: 'halfpay', label: 'Half Pay', icon: <CircleDollarSign className="w-4 h-4 text-amber-500" /> },
                    { value: 'unpaid', label: 'Unpaid', icon: <XCircle className="w-4 h-4 text-red-500" /> },
                  ]}
                />
              </div>

              {/* Customer Filter */}
              <div className="w-full sm:w-52">
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

              {/* Date Range with Calendar */}
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'}`} />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Date:</span>
                
                {/* Start Date */}
                <div className="relative" ref={startCalendarRef}>
                  <button
                    onClick={() => {
                      setShowStartCalendar(!showStartCalendar);
                      setShowEndCalendar(false);
                      setCalendarMonth(startDate ? new Date(startDate) : new Date());
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-sm min-w-[110px] text-left ${
                      theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {startDate ? formatDateDisplay(startDate) : 'Start Date'}
                  </button>
                  {showStartCalendar && renderCalendar(startDate, setStartDate, setShowStartCalendar)}
                </div>
                
                <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>-</span>
                
                {/* End Date */}
                <div className="relative" ref={endCalendarRef}>
                  <button
                    onClick={() => {
                      setShowEndCalendar(!showEndCalendar);
                      setShowStartCalendar(false);
                      setCalendarMonth(endDate ? new Date(endDate) : new Date());
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-sm min-w-[110px] text-left ${
                      theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {endDate ? formatDateDisplay(endDate) : 'End Date'}
                  </button>
                  {showEndCalendar && renderCalendar(endDate, setEndDate, setShowEndCalendar)}
                </div>
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <DollarSign className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'}`} />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Price:</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className={`w-24 px-3 py-1.5 rounded-xl border text-sm ${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className={`w-24 px-3 py-1.5 rounded-xl border text-sm ${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Warranty Issues Filter */}
              <button
                onClick={() => setShowWarrantyIssuesOnly(!showWarrantyIssuesOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  showWarrantyIssuesOnly
                    ? 'bg-amber-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-4 h-4" />
                Warranty Issues
              </button>
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
                    invoice.status === 'fullpaid' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : invoice.status === 'halfpay' ? 'bg-gradient-to-r from-amber-500 to-orange-500'
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
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {getStatusLabel(invoice.status)}
                        </span>
                        {/* Warranty Alert Badge */}
                        {(() => {
                          const warrantyStatus = getInvoiceWarrantyStatus(invoice);
                          if (warrantyStatus.hasExpired || warrantyStatus.hasExpiringSoon) {
                            return (
                              <div className="flex items-center gap-1">
                                {warrantyStatus.hasExpired && (
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                    theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                                  }`} title={`${warrantyStatus.expiredCount} warranty expired`}>
                                    <AlertTriangle className="w-3 h-3" />
                                    {warrantyStatus.expiredCount}
                                  </span>
                                )}
                                {warrantyStatus.hasExpiringSoon && (
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                    theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                                  }`} title={`${warrantyStatus.expiringSoonCount} warranty expiring soon`}>
                                    <Shield className="w-3 h-3" />
                                    {warrantyStatus.expiringSoonCount}
                                  </span>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
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
                        <p className={`text-sm font-medium ${new Date(invoice.dueDate) < new Date() && invoice.status !== 'fullpaid' ? 'text-red-400' : theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* Amount */}
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total</span>
                        <span className="text-lg font-bold text-emerald-500">{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className={`flex flex-wrap gap-2 pt-3 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
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
                      {/* WhatsApp Reminder Button - Only show for unpaid/partial invoices */}
                      {needsReminder(invoice) ? (
                        <button 
                          onClick={() => sendWhatsAppReminder(invoice)}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                            isOverdue(invoice)
                              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 shadow-lg'
                              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                          }`}
                          title={isOverdue(invoice) ? 'Send Overdue Reminder via WhatsApp' : 'Send Payment Reminder via WhatsApp'}
                        >
                          <MessageCircle className="w-4 h-4" />
                          {isOverdue(invoice) ? '⚠️ Send Overdue Reminder' : '💬 WhatsApp Reminder'}
                        </button>
                      ) : (
                        <div className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ${
                          theme === 'dark' 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                            : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                        }`}>
                          <CheckCircle className="w-4 h-4" />
                          ✨ Payment Complete
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className={`mt-4 p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Left side - Info and Items Per Page */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Result Info */}
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                  </p>
                  
                  {/* Items Per Page Selector */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Show:</span>
                    <div className={`flex items-center rounded-full p-0.5 ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      {[6, 9, 12, 18].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setItemsPerPage(num);
                            setCurrentPage(1);
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            itemsPerPage === num
                              ? 'bg-emerald-500 text-white shadow-md'
                              : theme === 'dark'
                                ? 'text-slate-400 hover:text-white'
                                : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    {/* First Page */}
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? theme === 'dark' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                          : theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="First page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>

                    {/* Previous Page */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? theme === 'dark' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                          : theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                      {getPageNumbers.map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className={`px-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                              currentPage === page
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                : theme === 'dark'
                                  ? 'hover:bg-slate-700 text-slate-300'
                                  : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Mobile Page Indicator */}
                    <div className={`sm:hidden px-3 py-1 rounded-lg text-sm font-medium ${
                      theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {currentPage} / {totalPages}
                    </div>

                    {/* Next Page */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? theme === 'dark' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                          : theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Last Page */}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? theme === 'dark' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                          : theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Last page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
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
                    <th className={`text-center px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Warranty
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
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {(() => {
                          const warrantyStatus = getInvoiceWarrantyStatus(invoice);
                          if (warrantyStatus.hasExpired || warrantyStatus.hasExpiringSoon) {
                            return (
                              <div className="flex items-center justify-center gap-1">
                                {warrantyStatus.hasExpired && (
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                                  }`}>
                                    <AlertTriangle className="w-3 h-3" />
                                    {warrantyStatus.expiredCount}
                                  </span>
                                )}
                                {warrantyStatus.hasExpiringSoon && (
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                                  }`}>
                                    <Shield className="w-3 h-3" />
                                    {warrantyStatus.expiringSoonCount}
                                  </span>
                                )}
                              </div>
                            );
                          }
                          return (
                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>—</span>
                          );
                        })()}
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
                          {/* WhatsApp Reminder Button for Table View */}
                          {needsReminder(invoice) && (
                            <button 
                              onClick={() => sendWhatsAppReminder(invoice)}
                              className={`p-2 rounded-xl transition-colors ${
                                isOverdue(invoice)
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                  : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                              }`}
                              title={isOverdue(invoice) ? 'Send Overdue Reminder via WhatsApp' : 'Send Payment Reminder via WhatsApp'}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <div className={`px-6 py-4 border-t ${
              theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Left side - Info and Items Per Page */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Result Info */}
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                  </p>
                  
                  {/* Items Per Page Selector */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Show:</span>
                    <div className={`flex items-center rounded-full p-0.5 ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      {[5, 10, 20, 50].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setItemsPerPage(num);
                            setCurrentPage(1);
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            itemsPerPage === num
                              ? 'bg-emerald-500 text-white shadow-md'
                              : theme === 'dark'
                                ? 'text-slate-400 hover:text-white'
                                : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    {/* First Page */}
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? theme === 'dark' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                          : theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="First page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>

                    {/* Previous Page */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? theme === 'dark' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                          : theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                      {getPageNumbers.map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className={`px-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                              currentPage === page
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                : theme === 'dark'
                                  ? 'hover:bg-slate-700 text-slate-300'
                                  : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Mobile Page Indicator */}
                    <div className={`sm:hidden px-3 py-1 rounded-lg text-sm font-medium ${
                      theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {currentPage} / {totalPages}
                    </div>

                    {/* Next Page */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? theme === 'dark' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                          : theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Last Page */}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? theme === 'dark' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                          : theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title="Last page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
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
