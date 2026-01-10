import './index.css';

import { Suspense, lazy } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminLayout } from './components/AdminLayout';

// Eager load Dashboard (landing page)
import { Dashboard } from './pages/Dashboard';

// Lazy load all other pages
const Invoices = lazy(() => import('./pages/Invoices').then(m => ({ default: m.Invoices })));
const CreateInvoice = lazy(() => import('./pages/CreateInvoice').then(m => ({ default: m.CreateInvoice })));
const ViewInvoice = lazy(() => import('./pages/ViewInvoice').then(m => ({ default: m.ViewInvoice })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const ProductForm = lazy(() => import('./pages/ProductForm').then(m => ({ default: m.ProductForm })));
const Categories = lazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));
const Brands = lazy(() => import('./pages/Brands').then(m => ({ default: m.Brands })));
const Customers = lazy(() => import('./pages/Customers').then(m => ({ default: m.Customers })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Help = lazy(() => import('./pages/Help').then(m => ({ default: m.Help })));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AdminLayout>
              <Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="text-emerald-500">Loading...</div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/invoices/create" element={<CreateInvoice />} />
                  <Route path="/invoices/:id" element={<ViewInvoice />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/add" element={<ProductForm />} />
                  <Route path="/products/edit/:id" element={<ProductForm />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/brands" element={<Brands />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<Help />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AdminLayout>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
