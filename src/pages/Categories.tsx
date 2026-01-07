import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { productCategories, mockProducts } from '../data/mockData';
import { CategoryFormModal } from '../components/modals/CategoryFormModal';
import type { Category } from '../components/modals/CategoryFormModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { FolderTree, Plus, Edit, Trash2, Search } from 'lucide-react';

export const Categories: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Convert productCategories to Category objects with counts
  const initialCategories: Category[] = productCategories.map((name, index) => ({
    id: `cat-${index + 1}`,
    name,
    description: `All ${name.toLowerCase()} products`,
    productCount: mockProducts.filter(p => p.category === name).length,
  }));

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  // Local categories state for demo
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCategory = (category: Category) => {
    if (selectedCategory) {
      setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    } else {
      setCategories(prev => [...prev, category]);
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Categories
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Organize your products by categories
          </p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Category
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
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`bg-transparent border-none outline-none flex-1 ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <div 
            key={category.id}
            className={`group rounded-2xl border p-6 transition-all hover:shadow-lg ${
              theme === 'dark' 
                ? 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30' 
                : 'bg-white border-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <FolderTree className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditCategory(category)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(category)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {category.name}
            </h3>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {category.productCount} products
            </p>
          </div>
        ))}
      </div>

      {/* Results count */}
      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        Showing {filteredCategories.length} of {categories.length} categories
      </p>

      {/* Modals */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        category={selectedCategory}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCategory}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products in this category will need to be reassigned."
        itemName={categoryToDelete?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
