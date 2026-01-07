import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { productBrands, mockProducts } from '../data/mockData';
import { BrandFormModal } from '../components/modals/BrandFormModal';
import type { Brand } from '../components/modals/BrandFormModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { Building2, Plus, Edit, Trash2, Search } from 'lucide-react';

export const Brands: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Convert productBrands to Brand objects with counts
  const initialBrands: Brand[] = productBrands.map((name, index) => ({
    id: `brand-${index + 1}`,
    name,
    description: `${name} brand products`,
    productCount: mockProducts.filter(p => p.brand === name).length,
  }));

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  
  // Local brands state for demo
  const [brands, setBrands] = useState<Brand[]>(initialBrands);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleAddBrand = () => {
    setSelectedBrand(null);
    setIsFormModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBrand = (brand: Brand) => {
    if (selectedBrand) {
      setBrands(prev => prev.map(b => b.id === brand.id ? brand : b));
    } else {
      setBrands(prev => [...prev, brand]);
    }
  };

  const handleConfirmDelete = () => {
    if (brandToDelete) {
      setBrands(prev => prev.filter(b => b.id !== brandToDelete.id));
      setIsDeleteModalOpen(false);
      setBrandToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Brands
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage product brands
          </p>
        </div>
        <button 
          onClick={handleAddBrand}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Brand
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
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`bg-transparent border-none outline-none flex-1 ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBrands.map((brand) => (
          <div 
            key={brand.id}
            className={`group rounded-2xl border p-6 transition-all hover:shadow-lg ${
              theme === 'dark' 
                ? 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30' 
                : 'bg-white border-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <Building2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditBrand(brand)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(brand)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {brand.name}
            </h3>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {brand.productCount} products
            </p>
          </div>
        ))}
      </div>

      {/* Results count */}
      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        Showing {filteredBrands.length} of {brands.length} brands
      </p>

      {/* Modals */}
      <BrandFormModal
        isOpen={isFormModalOpen}
        brand={selectedBrand}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveBrand}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Brand"
        message="Are you sure you want to delete this brand? Products with this brand will need to be reassigned."
        itemName={brandToDelete?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
