import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Package, FileText, Users, LayoutDashboard, Settings, 
  Moon, Sun, Menu, X, ChevronLeft, ChevronRight, Bell, Search,
  User, HelpCircle, ChevronDown, Sparkles, TrendingUp,
  FolderTree, Building, Shield, Truck, ClipboardCheck, Wrench, Layers
} from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import logoImage from '../assets/logo.jpg';

interface SubNavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge: string | null;
  subItems?: SubNavItem[];
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationCount] = useState(3);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setProfileDropdownOpen(false);
    if (profileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [profileDropdownOpen]);

  // Auto-expand menu when navigating to a sub-item
  useEffect(() => {
    navItems.forEach(item => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));
        const isParentActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
        if ((isSubItemActive || isParentActive) && !expandedMenus.includes(item.path)) {
          setExpandedMenus(prev => [...prev, item.path]);
        }
      }
    });
  }, [location.pathname]);

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const navItems: NavItem[] = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { path: '/invoices', icon: FileText, label: 'Invoices', badge: '12' },
    { 
      path: '/products', 
      icon: Package, 
      label: 'Products', 
      badge: null,
      subItems: [
        { path: '/categories', icon: FolderTree, label: 'Categories' },
        { path: '/brands', icon: Building, label: 'Brands' },
      ]
    },
    { 
      path: '/services', 
      icon: Wrench, 
      label: 'Services', 
      badge: null,
      subItems: [
        { path: '/service-categories', icon: Layers, label: 'Service Categories' },
      ]
    },
    { path: '/warranties', icon: Shield, label: 'Warranties', badge: '3' },
    { path: '/customers', icon: Users, label: 'Customers', badge: '3' },
    { path: '/suppliers', icon: Truck, label: 'Suppliers', badge: '2' },
    { path: '/grn', icon: ClipboardCheck, label: 'GRN', badge: null },
    { path: '/reports', icon: TrendingUp, label: 'Reports', badge: null },
  ];

  const bottomNavItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help Center' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isExactActive = (path: string) => location.pathname === path;
  const isParentActive = (item: NavItem) => {
    if (item.subItems) {
      return item.subItems.some(sub => isActive(sub.path)) || isActive(item.path);
    }
    return isActive(item.path);
  };

  // Sidebar Component
  const Sidebar = () => (
    <aside 
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50' 
          : 'bg-gradient-to-b from-white via-white to-slate-50 border-r border-slate-200 shadow-xl'
      }`}
    >
      {/* Logo Section */}
      <div className={`flex items-center h-16 px-4 border-b ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-200'}`}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex-shrink-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img src={logoImage} alt="Ecotec Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className={`text-lg font-bold whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Eco<span className="text-emerald-500">tec</span>
              </span>
              <span className={`text-[10px] -mt-0.5 tracking-wider uppercase whitespace-nowrap ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Computer Solutions
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100%-4rem)] px-3 py-4 overflow-y-auto">
        {/* Main Navigation */}
        <div className="flex-1 space-y-1">
          {!sidebarCollapsed && (
            <span className={`px-3 text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              Main Menu
            </span>
          )}
          <div className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus.includes(item.path);
              const parentActive = isParentActive(item);
              const exactActive = isExactActive(item.path);

              return (
                <div key={item.path}>
                  {/* Parent Menu Item */}
                  {hasSubItems ? (
                    <div
                      onClick={() => {
                        if (!sidebarCollapsed) {
                          toggleMenu(item.path);
                        }
                      }}
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                        parentActive
                          ? theme === 'dark' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                            : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/5 text-emerald-600 shadow-lg shadow-emerald-500/10'
                          : theme === 'dark' 
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {/* Active indicator bar */}
                      {parentActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-r-full" />
                      )}
                      
                      <Link to={item.path} onClick={(e) => e.stopPropagation()}>
                        <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          parentActive ? 'text-emerald-500' : ''
                        }`} />
                      </Link>
                      
                      {!sidebarCollapsed && (
                        <>
                          <Link to={item.path} className="flex-1" onClick={(e) => e.stopPropagation()}>
                            {item.label}
                          </Link>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              theme === 'dark' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          } ${parentActive ? 'text-emerald-500' : ''}`} />
                        </>
                      )}
                      
                      {/* Tooltip for collapsed sidebar with sub-items */}
                      {sidebarCollapsed && (
                        <div className={`absolute left-full ml-2 px-0 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 min-w-[180px] ${
                          theme === 'dark' ? 'bg-slate-800 text-white shadow-2xl border border-slate-700' : 'bg-white text-slate-900 shadow-2xl border border-slate-200'
                        }`}>
                          <Link 
                            to={item.path}
                            className={`flex items-center gap-2 px-4 py-2 ${
                              exactActive 
                                ? theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50'
                                : theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                            {item.badge && (
                              <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-emerald-500 text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                          <div className={`my-1 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`} />
                          {item.subItems?.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const subActive = isActive(subItem.path);
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`flex items-center gap-2 px-4 py-2 ${
                                  subActive 
                                    ? theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50'
                                    : theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                                }`}
                              >
                                <SubIcon className="w-4 h-4" />
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        exactActive
                          ? theme === 'dark' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                            : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/5 text-emerald-600 shadow-lg shadow-emerald-500/10'
                          : theme === 'dark' 
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {/* Active indicator bar */}
                      {exactActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-r-full" />
                      )}
                      
                      <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        exactActive ? 'text-emerald-500' : ''
                      }`} />
                      
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              theme === 'dark' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      
                      {/* Tooltip for collapsed sidebar */}
                      {sidebarCollapsed && (
                        <div className={`absolute left-full ml-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 ${
                          theme === 'dark' ? 'bg-slate-800 text-white shadow-xl' : 'bg-slate-900 text-white shadow-xl'
                        }`}>
                          {item.label}
                          {item.badge && (
                            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-emerald-500 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  )}

                  {/* Sub Items - Expanded Desktop */}
                  {hasSubItems && isExpanded && !sidebarCollapsed && (
                    <div className={`ml-4 mt-1 pl-4 border-l-2 space-y-1 ${
                      theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      {item.subItems?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subActive = isActive(subItem.path);
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              subActive
                                ? theme === 'dark' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : 'bg-emerald-50 text-emerald-600'
                                : theme === 'dark' 
                                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/30' 
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            {subActive && (
                              <div className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                                theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-500'
                              }`} />
                            )}
                            <SubIcon className={`w-4 h-4 flex-shrink-0 ${subActive ? 'text-emerald-500' : ''}`} />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 space-y-1 border-t border-slate-800/30">
          {!sidebarCollapsed && (
            <span className={`px-3 text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              Support
            </span>
          )}
          <div className="mt-2 space-y-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    active
                      ? theme === 'dark' 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                        : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/5 text-emerald-600 shadow-lg shadow-emerald-500/10'
                      : theme === 'dark' 
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-r-full" />
                  )}
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-emerald-500' : ''}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  
                  {sidebarCollapsed && (
                    <div className={`absolute left-full ml-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 ${
                      theme === 'dark' ? 'bg-slate-800 text-white shadow-xl' : 'bg-slate-900 text-white shadow-xl'
                    }`}>
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Collapse Button */}
        {!isMobile && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all ${
              theme === 'dark' 
                ? 'bg-slate-800/30 hover:bg-slate-800/50 text-slate-400' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        )}
      </nav>
    </aside>
  );

  // Mobile Sidebar Overlay
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-screen w-72 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950' 
            : 'bg-white'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className={`absolute right-4 top-4 p-2 rounded-lg ${
            theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
            <img src={logoImage} alt="Ecotec Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Eco<span className="text-emerald-500">tec</span>
            </span>
            <span className={`text-[10px] -mt-0.5 tracking-wider uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              Computer Solutions
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.path);
            const parentActive = isParentActive(item);
            const exactActive = isExactActive(item.path);

            return (
              <div key={item.path}>
                {hasSubItems ? (
                  <>
                    <div
                      onClick={() => toggleMenu(item.path)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                        parentActive
                          ? theme === 'dark' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/10 text-emerald-400' 
                            : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/5 text-emerald-600'
                          : theme === 'dark' 
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {parentActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-r-full" />
                      )}
                      <Link to={item.path} onClick={(e) => { e.stopPropagation(); setMobileSidebarOpen(false); }}>
                        <Icon className={`w-5 h-5 ${parentActive ? 'text-emerald-500' : ''}`} />
                      </Link>
                      <Link 
                        to={item.path} 
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); setMobileSidebarOpen(false); }}
                      >
                        {item.label}
                      </Link>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      } ${parentActive ? 'text-emerald-500' : ''}`} />
                    </div>
                    
                    {/* Sub Items */}
                    {isExpanded && (
                      <div className={`ml-4 mt-1 pl-4 border-l-2 space-y-1 ${
                        theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                      }`}>
                        {item.subItems?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const subActive = isActive(subItem.path);
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setMobileSidebarOpen(false)}
                              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                subActive
                                  ? theme === 'dark' 
                                    ? 'bg-emerald-500/10 text-emerald-400' 
                                    : 'bg-emerald-50 text-emerald-600'
                                  : theme === 'dark' 
                                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/30' 
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              {subActive && (
                                <div className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500`} />
                              )}
                              <SubIcon className={`w-4 h-4 ${subActive ? 'text-emerald-500' : ''}`} />
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                      exactActive
                        ? theme === 'dark' 
                          ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/10 text-emerald-400' 
                          : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/5 text-emerald-600'
                        : theme === 'dark' 
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {exactActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-r-full" />
                    )}
                    <Icon className={`w-5 h-5 ${exactActive ? 'text-emerald-500' : ''}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
          
          <div className={`my-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`} />
          
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  active
                    ? theme === 'dark' 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/10 text-emerald-400' 
                      : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/5 text-emerald-600'
                    : theme === 'dark' 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-emerald-500' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0f1a]' : 'bg-slate-100'}`}>
      {/* Ambient background effects - only in dark mode */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Sidebar */}
      {isMobile && <MobileSidebar />}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${!isMobile ? (sidebarCollapsed ? 'ml-20' : 'ml-72') : 'ml-0'}`}>
        {/* Top Header */}
        <header className={`sticky top-0 z-30 h-16 border-b backdrop-blur-xl transition-colors duration-300 ${
          theme === 'dark' ? 'border-slate-800/50 bg-[#0a0f1a]/80' : 'border-slate-200 bg-white/90'
        }`}>
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              
              {/* Search Bar */}
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-slate-800/30 border-slate-700/50' 
                  : 'bg-white border-slate-200'
              }`}>
                <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search products, invoices..."
                  className={`bg-transparent border-none outline-none w-64 text-sm ${
                    theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Pro Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Pro</span>
              </div>

              {/* Notifications */}
              <button className={`relative p-2.5 rounded-xl border transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50 text-slate-400' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}>
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`relative p-2.5 rounded-xl border transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Sun className={`w-5 h-5 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <Moon className={`w-5 h-5 text-blue-400 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setProfileDropdownOpen(!profileDropdownOpen); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Admin</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Ecotec</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-xl overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Admin User</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>admin@ecotec.lk</p>
                    </div>
                    <div className="py-2">
                      <Link to="/settings" className={`flex items-center gap-3 px-4 py-2 text-sm ${
                        theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                      }`}>
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <Link to="/help" className={`flex items-center gap-3 px-4 py-2 text-sm ${
                        theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                      }`}>
                        <HelpCircle className="w-4 h-4" />
                        Help & Support
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
