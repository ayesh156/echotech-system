import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { mockProducts, productCategories, productBrands } from '../data/mockData';
import type { Product } from '../data/mockData';
import { ProductFormModal } from '../components/modals/ProductFormModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { SearchableSelect } from '../components/ui/searchable-select';
import { 
  Package, Search, Plus, Edit, Trash2,
  Cpu, Monitor, HardDrive, MemoryStick, Keyboard
} from 'lucide-react';

export const Products: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Local products state for demo
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

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

  // Handlers
  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      // Add new product
      setProducts(prev => [...prev, product]);
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Products
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your computer shop inventory
          </p>
        </div>
        <button 
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className={`flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border ${
        theme === 'dark' 
          ? 'bg-slate-800/30 border-slate-700/50' 
          : 'bg-white border-slate-200'
      }`}>
        {/* Search */}
        <div className={`flex items-center gap-2 flex-1 px-4 py-2 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent border-none outline-none flex-1 ${
              theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Category Filter - Searchable Select */}
        <div className="w-full sm:w-56">
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

        {/* Brand Filter - Searchable Select */}
        <div className="w-full sm:w-56">
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
      </div>

      {/* Products Table */}
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
                  Product
                </th>
                <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  SKU
                </th>
                <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Category
                </th>
                <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Brand
                </th>
                <th className={`text-right px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Price
                </th>
                <th className={`text-right px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Stock
                </th>
                <th className={`text-right px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id}
                  className={`border-b transition-colors ${
                    theme === 'dark' 
                      ? 'border-slate-700/30 hover:bg-slate-800/30' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                      }`}>
                        {getProductIcon(product.category)}
                      </div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {product.sku}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      theme === 'dark' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {product.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {product.brand}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
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
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        product={selectedProduct}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
      />

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
