import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  mockCashAccounts, 
  mockCashTransactions,
  expenseCategories 
} from '../data/mockData';
import type {
  CashAccount,
  CashTransaction,
  CashAccountType,
  CashTransactionType
} from '../data/mockData';
import { CashTransactionModal } from '../components/modals/CashTransactionModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { SearchableSelect } from '../components/ui/searchable-select';
import { 
  Wallet, Plus, Edit, Trash2, Search, ArrowDownCircle, ArrowUpCircle, 
  ArrowLeftRight, Filter, ChevronLeft, ChevronRight, ChevronsLeft, 
  ChevronsRight, Banknote, Building2, PiggyBank, TrendingUp, TrendingDown,
  Clock, Tag, FileText, MoreVertical, RefreshCw, List, LayoutGrid,
  SortAsc, SortDesc, Calendar
} from 'lucide-react';

type ViewMode = 'grid' | 'table';

const getAccountIcon = (type: CashAccountType) => {
  switch (type) {
    case 'drawer': return Banknote;
    case 'cash_in_hand': return Wallet;
    case 'business': return Building2;
    default: return PiggyBank;
  }
};

const getAccountIconJsx = (type: CashAccountType) => {
  switch (type) {
    case 'drawer': return <Banknote className="w-4 h-4 text-amber-500" />;
    case 'cash_in_hand': return <Wallet className="w-4 h-4 text-emerald-500" />;
    case 'business': return <Building2 className="w-4 h-4 text-blue-500" />;
    default: return <PiggyBank className="w-4 h-4 text-slate-500" />;
  }
};

const getAccountColor = (type: CashAccountType, theme: string) => {
  switch (type) {
    case 'drawer': 
      return theme === 'dark' 
        ? 'from-amber-500/20 to-orange-500/10 border-amber-500/30' 
        : 'from-amber-50 to-orange-50 border-amber-200';
    case 'cash_in_hand': 
      return theme === 'dark' 
        ? 'from-emerald-500/20 to-green-500/10 border-emerald-500/30' 
        : 'from-emerald-50 to-green-50 border-emerald-200';
    case 'business': 
      return theme === 'dark' 
        ? 'from-blue-500/20 to-indigo-500/10 border-blue-500/30' 
        : 'from-blue-50 to-indigo-50 border-blue-200';
    default: 
      return theme === 'dark' 
        ? 'from-slate-500/20 to-slate-600/10 border-slate-500/30' 
        : 'from-slate-50 to-slate-100 border-slate-200';
  }
};

const getAccountIconColor = (type: CashAccountType) => {
  switch (type) {
    case 'drawer': return 'text-amber-500';
    case 'cash_in_hand': return 'text-emerald-500';
    case 'business': return 'text-blue-500';
    default: return 'text-slate-500';
  }
};

const getTransactionTypeIcon = (type: CashTransactionType) => {
  switch (type) {
    case 'income': return ArrowDownCircle;
    case 'expense': return ArrowUpCircle;
    case 'transfer': return ArrowLeftRight;
    default: return FileText;
  }
};

const getTransactionTypeColor = (type: CashTransactionType, theme: string) => {
  switch (type) {
    case 'income': 
      return theme === 'dark' 
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
        : 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'expense': 
      return theme === 'dark' 
        ? 'text-red-400 bg-red-500/10 border-red-500/20' 
        : 'text-red-600 bg-red-50 border-red-200';
    case 'transfer': 
      return theme === 'dark' 
        ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
        : 'text-blue-600 bg-blue-50 border-blue-200';
    default: 
      return theme === 'dark' 
        ? 'text-slate-400 bg-slate-500/10 border-slate-500/20' 
        : 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

export const CashManagement: React.FC = () => {
  const { theme } = useTheme();
  
  // State
  const [accounts, setAccounts] = useState<CashAccount[]>(mockCashAccounts);
  const [transactions, setTransactions] = useState<CashTransaction[]>(mockCashTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<CashTransaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<CashTransaction | null>(null);
  
  // Action menu
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  
  // Calendar states
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionMenu(null);
      }
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

  // Reset items per page when view mode changes
  useEffect(() => {
    if (viewMode === 'table') {
      setItemsPerPage(10);
    } else {
      setItemsPerPage(9);
    }
    setCurrentPage(1);
  }, [viewMode]);

  // Calculate totals
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  const todayTransactions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return transactions.filter(t => t.transactionDate.startsWith(today));
  }, [transactions]);

  const todayIncome = useMemo(() => {
    return todayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [todayTransactions]);

  const todayExpense = useMemo(() => {
    return todayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [todayTransactions]);

  // Stats
  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = transactions.filter(t => t.type === 'expense').length;
    const transferCount = transactions.filter(t => t.type === 'transfer').length;
    return { totalTransactions, totalIncome, totalExpense, incomeCount, expenseCount, transferCount };
  }, [transactions]);

  // Filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !txn.name.toLowerCase().includes(query) &&
          !txn.description?.toLowerCase().includes(query) &&
          !txn.transactionNumber.toLowerCase().includes(query) &&
          !txn.category?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      // Account filter
      if (selectedAccount !== 'all' && txn.accountId !== selectedAccount) {
        return false;
      }
      
      // Type filter
      if (selectedType !== 'all' && txn.type !== selectedType) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== 'all' && txn.category !== selectedCategory) {
        return false;
      }
      
      // Date filter
      if (startDate) {
        const txnDate = new Date(txn.transactionDate);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (txnDate < start) return false;
      }
      if (endDate) {
        const txnDate = new Date(txn.transactionDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (txnDate > end) return false;
      }
      
      return true;
    });
  }, [transactions, searchQuery, selectedAccount, selectedType, selectedCategory, startDate, endDate]);

  // Sorting by date
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const dateA = new Date(a.transactionDate).getTime();
      const dateB = new Date(b.transactionDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [filteredTransactions, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedAccount, selectedType, selectedCategory, startDate, endDate]);

  const hasActiveFilters = searchQuery || selectedAccount !== 'all' || selectedType !== 'all' || selectedCategory !== 'all' || startDate || endDate;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAccount('all');
    setSelectedType('all');
    setSelectedCategory('all');
    setStartDate('');
    setEndDate('');
  };

  // Handlers
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (transaction: CashTransaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
    setOpenActionMenu(null);
  };

  const handleDeleteClick = (transaction: CashTransaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
    setOpenActionMenu(null);
  };

  const handleSaveTransaction = (transaction: CashTransaction) => {
    if (selectedTransaction) {
      // Update existing
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? transaction : t)
      );
      // Update account balance
      const account = accounts.find(a => a.id === transaction.accountId);
      if (account) {
        const oldTxn = selectedTransaction;
        let balanceChange = 0;
        
        // Reverse old transaction effect
        if (oldTxn.type === 'income') {
          balanceChange -= oldTxn.amount;
        } else if (oldTxn.type === 'expense' || oldTxn.type === 'transfer') {
          balanceChange += oldTxn.amount;
        }
        
        // Apply new transaction effect
        if (transaction.type === 'income') {
          balanceChange += transaction.amount;
        } else if (transaction.type === 'expense' || transaction.type === 'transfer') {
          balanceChange -= transaction.amount;
        }
        
        setAccounts(prev => 
          prev.map(a => a.id === account.id 
            ? { ...a, balance: a.balance + balanceChange }
            : a
          )
        );
      }
    } else {
      // Add new
      setTransactions(prev => [transaction, ...prev]);
      // Update account balance
      const account = accounts.find(a => a.id === transaction.accountId);
      if (account) {
        const balanceChange = transaction.type === 'income' 
          ? transaction.amount 
          : -transaction.amount;
        
        setAccounts(prev => 
          prev.map(a => a.id === account.id 
            ? { ...a, balance: a.balance + balanceChange }
            : a
          )
        );
        
        // For transfers, also update destination account
        if (transaction.type === 'transfer' && transaction.transferToAccountId) {
          setAccounts(prev => 
            prev.map(a => a.id === transaction.transferToAccountId 
              ? { ...a, balance: a.balance + transaction.amount }
              : a
            )
          );
        }
      }
    }
    setIsTransactionModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      // Reverse the transaction effect on account balance
      const account = accounts.find(a => a.id === transactionToDelete.accountId);
      if (account) {
        const balanceChange = transactionToDelete.type === 'income' 
          ? -transactionToDelete.amount 
          : transactionToDelete.amount;
        
        setAccounts(prev => 
          prev.map(a => a.id === account.id 
            ? { ...a, balance: a.balance + balanceChange }
            : a
          )
        );
        
        // For transfers, also reverse destination account
        if (transactionToDelete.type === 'transfer' && transactionToDelete.transferToAccountId) {
          setAccounts(prev => 
            prev.map(a => a.id === transactionToDelete.transferToAccountId 
              ? { ...a, balance: a.balance - transactionToDelete.amount }
              : a
            )
          );
        }
      }
      
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  // Format helpers
  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;
  
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Generate page numbers
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

  // Select options
  const typeOptions = [
    { value: 'all', label: 'All Types', icon: <Filter className="w-4 h-4" /> },
    { value: 'income', label: 'Income', icon: <ArrowDownCircle className="w-4 h-4 text-emerald-500" /> },
    { value: 'expense', label: 'Expense', icon: <ArrowUpCircle className="w-4 h-4 text-red-500" /> },
    { value: 'transfer', label: 'Transfer', icon: <ArrowLeftRight className="w-4 h-4 text-blue-500" /> },
  ];

  const accountOptions = [
    { value: 'all', label: 'All Accounts', icon: <Wallet className="w-4 h-4" /> },
    ...accounts.map(a => ({ 
      value: a.id, 
      label: a.name, 
      icon: getAccountIconJsx(a.type) 
    })),
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: <Tag className="w-4 h-4" /> },
    { value: 'Other', label: 'Other', icon: <Tag className="w-4 h-4 text-slate-400" /> },
    ...expenseCategories.map(cat => ({ 
      value: cat, 
      label: cat, 
      icon: <Tag className="w-4 h-4 text-emerald-500" /> 
    })),
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Cash Management
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Track your cash drawer, petty cash, and business funds
          </p>
        </div>
        <button 
          onClick={handleAddTransaction}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(totalBalance)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Total Balance</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>+{formatCurrency(todayIncome)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Today Income</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>-{formatCurrency(todayExpense)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Today Expense</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats.totalTransactions}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Total Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.type);
          const colorClass = getAccountColor(account.type, theme);
          const iconColor = getAccountIconColor(account.type);
          
          return (
            <div 
              key={account.id}
              onClick={() => setSelectedAccount(selectedAccount === account.id ? 'all' : account.id)}
              className={`relative overflow-hidden rounded-2xl border p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                selectedAccount === account.id 
                  ? 'ring-2 ring-emerald-500 ring-offset-2 ' + (theme === 'dark' ? 'ring-offset-slate-900' : 'ring-offset-white')
                  : ''
              } bg-gradient-to-br ${colorClass}`}
            >
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-white/80'
                  }`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  {selectedAccount === account.id && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      Filtered
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {account.name}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className={`p-3 sm:p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border flex-1 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
            <Search className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search transactions..."
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
                  {[selectedAccount !== 'all', selectedType !== 'all', selectedCategory !== 'all', startDate, endDate].filter(Boolean).length}
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
          <div className={`pt-3 sm:pt-4 mt-3 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <div className="w-full sm:w-40">
                <SearchableSelect
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value)}
                  placeholder="All Types"
                  searchPlaceholder="Search..."
                  emptyMessage="No options"
                  theme={theme}
                  options={typeOptions}
                />
              </div>

              {/* Account Filter */}
              <div className="w-full sm:w-48">
                <SearchableSelect
                  value={selectedAccount}
                  onValueChange={(value) => setSelectedAccount(value)}
                  placeholder="All Accounts"
                  searchPlaceholder="Search..."
                  emptyMessage="No accounts"
                  theme={theme}
                  options={accountOptions}
                />
              </div>

              {/* Category Filter */}
              <div className="w-full sm:w-44">
                <SearchableSelect
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                  placeholder="All Categories"
                  searchPlaceholder="Search..."
                  emptyMessage="No categories"
                  theme={theme}
                  options={categoryOptions}
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
            </div>
          </div>
        )}
      </div>

      {/* Transactions Display */}
      {sortedTransactions.length > 0 ? (
        viewMode === 'grid' ? (
          /* Card View */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedTransactions.map((transaction) => {
                const TypeIcon = getTransactionTypeIcon(transaction.type);
                const typeColor = getTransactionTypeColor(transaction.type, theme);
                const account = accounts.find(a => a.id === transaction.accountId);
                const AccountIcon = account ? getAccountIcon(account.type) : Wallet;
                const { date, time } = formatDateTime(transaction.transactionDate);
                
                return (
                  <div
                    key={transaction.id}
                    className={`group rounded-2xl border overflow-hidden transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Type bar */}
                    <div className={`h-1 ${
                      transaction.type === 'income' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                        : transaction.type === 'expense' ? 'bg-gradient-to-r from-red-500 to-rose-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`} />
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${typeColor}`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {transaction.name}
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                              {transaction.transactionNumber}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setOpenActionMenu(openActionMenu === transaction.id ? null : transaction.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                            }`}
                          >
                            <MoreVertical className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                          </button>
                          {openActionMenu === transaction.id && (
                            <div 
                              ref={actionMenuRef}
                              className={`absolute right-0 top-full mt-1 w-32 rounded-xl border shadow-lg z-10 py-1 ${
                                theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                              }`}
                            >
                              <button
                                onClick={() => handleEditTransaction(transaction)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                                  theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(transaction)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Account */}
                      <div className="flex items-center gap-2 mb-3">
                        <AccountIcon className={`w-4 h-4 ${account ? getAccountIconColor(account.type) : 'text-slate-400'}`} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {account?.name || 'Unknown'}
                        </span>
                        {transaction.type === 'transfer' && transaction.transferToAccountId && (
                          <>
                            <ArrowLeftRight className="w-3 h-3 text-blue-500" />
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              {accounts.find(a => a.id === transaction.transferToAccountId)?.name}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Description */}
                      {transaction.description && (
                        <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {transaction.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}">
                        <div className="flex items-center gap-2">
                          {transaction.category && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              theme === 'dark' ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Tag className="w-3 h-3" />
                              {transaction.category}
                            </span>
                          )}
                        </div>
                        <p className={`text-lg font-bold ${
                          transaction.type === 'income' ? 'text-emerald-500' 
                            : transaction.type === 'expense' ? 'text-red-500' 
                            : 'text-blue-500'
                        }`}>
                          {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : '↔'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>

                      {/* Date/Time */}
                      <div className={`flex items-center gap-2 mt-2 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Clock className="w-3 h-3" />
                        <span>{date} at {time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination - Invoice Style */}
            <div className={`mt-4 p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Left side - Info and Items Per Page */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Result Info */}
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length} transactions
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
            theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Transaction</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Account</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Type</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Category</th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Amount</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Date & Time</th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700/50' : 'divide-slate-200'}`}>
                  {paginatedTransactions.map((transaction) => {
                    const TypeIcon = getTransactionTypeIcon(transaction.type);
                    const typeColor = getTransactionTypeColor(transaction.type, theme);
                    const account = accounts.find(a => a.id === transaction.accountId);
                    const AccountIcon = account ? getAccountIcon(account.type) : Wallet;
                    const { date, time } = formatDateTime(transaction.transactionDate);
                    
                    return (
                      <tr 
                        key={transaction.id}
                        className={`transition-colors ${
                          theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg border ${typeColor}`}>
                              <TypeIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {transaction.name}
                              </p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {transaction.transactionNumber}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <AccountIcon className={`w-4 h-4 ${account ? getAccountIconColor(account.type) : 'text-slate-400'}`} />
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              {account?.name || 'Unknown'}
                            </span>
                          </div>
                          {transaction.type === 'transfer' && transaction.transferToAccountId && (
                            <div className="flex items-center gap-1 mt-1">
                              <ArrowLeftRight className="w-3 h-3 text-blue-500" />
                              <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                → {accounts.find(a => a.id === transaction.transferToAccountId)?.name}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeColor}`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {transaction.category ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              theme === 'dark' ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Tag className="w-3 h-3" />
                              {transaction.category}
                            </span>
                          ) : (
                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-lg font-semibold ${
                            transaction.type === 'income' ? 'text-emerald-500' 
                              : transaction.type === 'expense' ? 'text-red-500' 
                              : 'text-blue-500'
                          }`}>
                            {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : '↔'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              {date}
                            </span>
                            <span className={`text-xs flex items-center gap-1 ${
                              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {time}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                              }`}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(transaction)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination for Table View - Invoice Style */}
            <div className={`rounded-b-2xl p-4 border-t ${
              theme === 'dark' ? 'border-slate-700/50 bg-slate-800/30' : 'border-slate-200 bg-white'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Left side - Info and Items Per Page */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Result Info */}
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length} transactions
                  </p>
                  
                  {/* Items Per Page Selector */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Show:</span>
                    <div className={`flex items-center rounded-full p-0.5 ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      {[10, 20].map((num) => (
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
        <div className={`rounded-2xl border p-12 text-center ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200'
        }`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <FileText className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
          <h3 className={`mt-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            No transactions found
          </h3>
          <p className={`mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {hasActiveFilters ? 'Try adjusting your filters' : 'Add your first transaction to get started'}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={handleAddTransaction}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          )}
        </div>
      )}

      {/* Transaction Modal */}
      <CashTransactionModal
        isOpen={isTransactionModalOpen}
        transaction={selectedTransaction}
        accounts={accounts}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSave={handleSaveTransaction}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transactionToDelete?.name}"? This action cannot be undone and will adjust the account balance.`}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
