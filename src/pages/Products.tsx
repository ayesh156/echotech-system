import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { mockProducts, productCategories, productBrands } from '../data/mockData';
import type { Product } from '../data/mockData';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { SearchableSelect } from '../components/ui/searchable-select';
import { 
  Package, Search, Plus, Edit, Trash2,
  Cpu, Monitor, HardDrive, MemoryStick, Keyboard,
  Calendar, DollarSign, X, Filter, ChevronLeft, ChevronRight,
  LayoutGrid, List, ChevronsLeft, ChevronsRight
} from 'lucide-react';

export const Products: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  
  // Price filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Date filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);
  
  // Sort state
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc'>('date-desc');
  
  // View mode state (table or card)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Calendar states
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Local products state for demo
  const [products, setProducts] = useState<Product[]>(mockProducts);

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

  const filteredProducts = products.filter(product => {
    // Search filter - includes name, serial number, and barcode
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.barcode && product.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    
    // Price filter
    const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = product.price >= minPriceNum && product.price <= maxPriceNum;
    
    // Date filter
    let matchesDate = true;
    if (startDate || endDate) {
      const productDate = new Date(product.createdAt);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (productDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (productDate > end) matchesDate = false;
      }
    }
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesDate;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, startDate, endDate, sortBy]);

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

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'Processors': return <Cpu className="w-5 h-5 text-emerald-500" />;
      case 'Graphics Cards': return <Monitor className="w-5 h-5 text-purple-500" />;
      case 'Storage': return <HardDrive className="w-5 h-5 text-blue-500" />;
      case 'Memory': return <MemoryStick className="w-5 h-5 text-amber-500" />;
      case 'Peripherals': return <Keyboard className="w-5 h-5 text-pink-500" />;
      default: return <Package className="w-5 h-5 text-emerald-500" />;
    }
  };

  // Category options for searchable select
  const categoryOptions = [
    { value: 'all', label: 'All Categories', count: products.length },
    ...productCategories.map(cat => ({
      value: cat,
      label: cat,
      count: products.filter(p => p.category === cat).length
    }))
  ];

  // Brand options for searchable select
  const brandOptions = [
    { value: 'all', label: 'All Brands', count: products.length },
    ...productBrands.map(brand => ({
      value: brand,
      label: brand,
      count: products.filter(p => p.brand === brand).length
    }))
  ];

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

    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
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
        {/* Calendar Header */}
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
        
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className={`w-8 h-8 flex items-center justify-center text-xs font-medium ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        {/* Clear Button */}
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
  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const clearAdvancedFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setStartDate('');
    setEndDate('');
  };

  const advancedFiltersCount = [minPrice, maxPrice, startDate, endDate].filter(Boolean).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Products
          </h1>
          <p className={`mt-1 text-sm sm:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your computer shop inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle Buttons */}
          <div className={`flex items-center rounded-xl overflow-hidden border ${
            theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700'
              }`}
              title="Table view"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2.5 transition-colors ${
                viewMode === 'card'
                  ? 'bg-emerald-500 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters - Single Line */}
      <div className={`p-3 sm:p-4 rounded-2xl border ${
        theme === 'dark' 
          ? 'bg-slate-800/30 border-slate-700/50' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border flex-1 ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <Search className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search by name, serial number, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent border-none outline-none flex-1 min-w-0 text-sm ${
                theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="w-full sm:w-40">
              <SearchableSelect
                options={categoryOptions}
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="All Categories"
                searchPlaceholder="Search categories..."
                emptyMessage="No categories found"
                theme={theme}
              />
            </div>

            {/* Brand Filter */}
            <div className="w-full sm:w-40">
              <SearchableSelect
                options={brandOptions}
                value={selectedBrand}
                onValueChange={setSelectedBrand}
                placeholder="All Brands"
                searchPlaceholder="Search brands..."
                emptyMessage="No brands found"
                theme={theme}
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                showFilters || advancedFiltersCount > 0
                  ? 'bg-emerald-500 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Filters</span>
              {advancedFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                  {advancedFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Button */}
            <button
              onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Sort by date created"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">
                {sortBy === 'date-desc' ? 'Newest' : 'Oldest'}
              </span>
            </button>
          </div>
        </div>

        {/* Advanced Filters (Collapsible) */}
        {showFilters && (
          <div className={`pt-3 sm:pt-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
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

              {/* Clear Advanced Filters */}
              {advancedFiltersCount > 0 && (
                <button
                  onClick={clearAdvancedFilters}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">Clear</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Products Display */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className={`rounded-2xl border overflow-hidden ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white border-slate-200'
        }`}>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
                  <th className={`text-left px-3 py-3 text-xs font-semibold w-[25%] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Product
                  </th>
                  <th className={`text-left px-3 py-3 text-xs font-semibold w-[10%] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    S/N
                  </th>
                  <th className={`text-left px-3 py-3 text-xs font-semibold w-[12%] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Category
                  </th>
                  <th className={`text-left px-3 py-3 text-xs font-semibold w-[10%] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Brand
                  </th>
                  <th className={`text-right px-3 py-3 text-xs font-semibold w-[12%] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Price
                  </th>
                  <th className={`text-center px-3 py-3 text-xs font-semibold w-[8%] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Stock
                  </th>
                  <th className={`text-left px-3 py-3 text-xs font-semibold w-[10%] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Created
                  </th>
                  <th className={`text-right px-3 py-3 text-xs font-semibold w-[13%] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr 
                    key={product.id}
                    className={`border-b transition-colors ${
                      theme === 'dark' 
                        ? 'border-slate-700/30 hover:bg-slate-800/30' 
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                        }`}>
                          {getProductIcon(product.category)}
                        </div>
                        <div className="min-w-0">
                          <span className={`font-medium block truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {product.name}
                          </span>
                          {product.barcode && (
                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Barcode: {product.barcode}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={`px-3 py-3 text-xs font-mono truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {product.serialNumber}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full truncate block ${
                        theme === 'dark' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className={`px-3 py-3 text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {product.brand}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        product.stock < 10
                          ? 'bg-red-500/10 text-red-500'
                          : product.stock < 20
                          ? 'bg-amber-500/10 text-amber-500'
                          : theme === 'dark' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className={`px-3 py-3 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {new Date(product.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit'
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className={`p-2 rounded-xl transition-colors ${
                            theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product)}
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

          {/* Mobile List View (for table mode on mobile) */}
          <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700/50">
            {paginatedProducts.map((product) => (
              <div 
                key={product.id}
                className={`p-4 ${theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                  }`}>
                    {getProductIcon(product.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {product.name}
                        </h3>
                        <p className={`text-xs font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                          S/N: {product.serialNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        theme === 'dark' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {product.category}
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {product.brand}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {formatCurrency(product.price)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          product.stock < 10
                            ? 'bg-red-500/10 text-red-500'
                            : product.stock < 20
                            ? 'bg-amber-500/10 text-amber-500'
                            : theme === 'dark' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {paginatedProducts.map((product) => (
            <div 
              key={product.id}
              className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
                theme === 'dark' 
                  ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header with Icon */}
              <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-white'
                  }`}>
                    {getProductIcon(product.category)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className={`font-semibold line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {product.name}
                  </h3>
                  <p className={`text-xs font-mono mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    S/N: {product.serialNumber}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    theme === 'dark' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {product.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-slate-300' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {product.brand}
                  </span>
                </div>
                
                <div className={`pt-3 border-t flex items-center justify-between ${
                  theme === 'dark' ? 'border-slate-700/50' : 'border-slate-100'
                }`}>
                  <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(product.price)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.stock < 10
                      ? 'bg-red-500/10 text-red-500'
                      : product.stock < 20
                      ? 'bg-amber-500/10 text-amber-500'
                      : theme === 'dark' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    Stock: {product.stock}
                  </span>
                </div>
                
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Added: {new Date(product.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className={`p-4 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results Info */}
            <div className="flex items-center gap-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Showing <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(endIndex, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> products
              </p>
              
              {/* Items Per Page Selector - Creative Pill Buttons */}
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

            {/* Pagination Controls */}
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
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className={`p-8 rounded-2xl border text-center ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white border-slate-200'
        }`}>
          <Package className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`} />
          <p className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            No products found
          </p>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        itemName={productToDelete?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
