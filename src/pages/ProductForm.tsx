import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../data/mockData';
import { mockProducts, generateSerialNumber } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { SearchableSelect } from '../components/ui/searchable-select';
import { 
  Package, Tag, DollarSign, Boxes, FileText, Save, ArrowLeft, 
  Building2, Layers, Hash, Barcode, RefreshCw 
} from 'lucide-react';

// Computer shop categories
const categoryOptions = [
  { value: 'Processors', label: 'Processors' },
  { value: 'Graphics Cards', label: 'Graphics Cards' },
  { value: 'Memory', label: 'Memory' },
  { value: 'Storage', label: 'Storage' },
  { value: 'Motherboards', label: 'Motherboards' },
  { value: 'Power Supply', label: 'Power Supply' },
  { value: 'Cooling', label: 'Cooling' },
  { value: 'Cases', label: 'Cases' },
  { value: 'Monitors', label: 'Monitors' },
  { value: 'Peripherals', label: 'Peripherals' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Software', label: 'Software' },
];

// Computer hardware brands
const brandOptions = [
  { value: 'AMD', label: 'AMD' },
  { value: 'Intel', label: 'Intel' },
  { value: 'NVIDIA', label: 'NVIDIA' },
  { value: 'ASUS', label: 'ASUS' },
  { value: 'MSI', label: 'MSI' },
  { value: 'Gigabyte', label: 'Gigabyte' },
  { value: 'Corsair', label: 'Corsair' },
  { value: 'Samsung', label: 'Samsung' },
  { value: 'Western Digital', label: 'Western Digital' },
  { value: 'Seagate', label: 'Seagate' },
  { value: 'G.Skill', label: 'G.Skill' },
  { value: 'NZXT', label: 'NZXT' },
  { value: 'Lian Li', label: 'Lian Li' },
  { value: 'LG', label: 'LG' },
  { value: 'Logitech', label: 'Logitech' },
  { value: 'Razer', label: 'Razer' },
  { value: 'SteelSeries', label: 'SteelSeries' },
];

interface ProductFormData {
  name: string;
  serialNumber: string;
  barcode: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
}

export const ProductForm: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Find existing product if editing
  const existingProduct = isEditing 
    ? mockProducts.find(p => p.id === id) 
    : undefined;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    serialNumber: generateSerialNumber(),
    barcode: '',
    category: '',
    brand: '',
    price: 0,
    stock: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        serialNumber: existingProduct.serialNumber,
        barcode: existingProduct.barcode || '',
        category: existingProduct.category,
        brand: existingProduct.brand,
        price: existingProduct.price,
        stock: existingProduct.stock,
        description: existingProduct.description || '',
      });
    }
  }, [existingProduct]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.brand) {
      newErrors.brand = 'Brand is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newProduct: Product = {
        id: existingProduct?.id || `prod-${Date.now()}`,
        name: formData.name,
        serialNumber: formData.serialNumber,
        barcode: formData.barcode || undefined,
        category: formData.category,
        brand: formData.brand,
        price: formData.price,
        stock: formData.stock,
        description: formData.description || undefined,
        createdAt: existingProduct?.createdAt || new Date().toISOString(),
      };
      
      // In a real app, this would save to a database/API
      console.log('Product saved:', newProduct);
      
      // Navigate back to products list
      navigate('/products');
    }
  };

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenerateSerialNumber = () => {
    setFormData(prev => ({ ...prev, serialNumber: generateSerialNumber() }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/products')}
            className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
              theme === 'dark' 
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className={`mt-0.5 sm:mt-1 text-sm sm:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {isEditing ? 'Update product information' : 'Add a new product to inventory'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className={`rounded-2xl border overflow-hidden ${
        theme === 'dark' 
          ? 'bg-slate-800/30 border-slate-700/50' 
          : 'bg-white border-slate-200'
      }`}>
        {/* Gradient Header */}
        <div className={`p-4 sm:p-6 text-white ${isEditing 
          ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500' 
          : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
        }`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold truncate">
                {isEditing ? existingProduct?.name : 'New Product'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100">
                {isEditing ? 'Editing product details' : 'Fill in the product details below'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <Tag className="w-4 h-4" />
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter product name"
              className={`${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                  : 'bg-white border-slate-200'
              } ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Serial Number & Barcode Row */}
          <div className="grid grid-cols-1 gap-4">
            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serialNumber" className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Hash className="w-4 h-4" />
                Serial Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => handleChange('serialNumber', e.target.value)}
                  placeholder="Enter serial number"
                  className={`flex-1 ${
                    theme === 'dark' 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                      : 'bg-white border-slate-200'
                  } ${errors.serialNumber ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={handleGenerateSerialNumber}
                  className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2 flex-shrink-0 ${
                    theme === 'dark'
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Generate new serial number"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Generate</span>
                </button>
              </div>
              {errors.serialNumber && <p className="text-xs text-red-500">{errors.serialNumber}</p>}
            </div>

            {/* Barcode */}
            <div className="space-y-2">
              <Label htmlFor="barcode" className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Barcode className="w-4 h-4" />
                Barcode <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>(optional)</span>
              </Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
                placeholder="Enter barcode (optional)"
                className={`${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Category & Brand Row */}
          <div className="grid grid-cols-1 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Layers className="w-4 h-4" />
                Category <span className="text-red-500">*</span>
              </Label>
              <SearchableSelect
                options={categoryOptions}
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
                placeholder="Select category..."
                searchPlaceholder="Search categories..."
                emptyMessage="No categories found"
                theme={theme}
              />
              {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Building2 className="w-4 h-4" />
                Brand <span className="text-red-500">*</span>
              </Label>
              <SearchableSelect
                options={brandOptions}
                value={formData.brand}
                onValueChange={(value) => handleChange('brand', value)}
                placeholder="Select brand..."
                searchPlaceholder="Search brands..."
                emptyMessage="No brands found"
                theme={theme}
              />
              {errors.brand && <p className="text-xs text-red-500">{errors.brand}</p>}
            </div>
          </div>

          {/* Price & Stock Row */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Price (LKR)</span>
                <span className="sm:hidden">Price</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                placeholder="Enter price"
                className={`${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200'
                } ${errors.price ? 'border-red-500' : ''}`}
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock" className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Boxes className="w-4 h-4" />
                <span className="hidden sm:inline">Stock Quantity</span>
                <span className="sm:hidden">Stock</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                placeholder="Enter stock"
                className={`${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200'
                } ${errors.stock ? 'border-red-500' : ''}`}
              />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <FileText className="w-4 h-4" />
              Description <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter product description (optional)"
              rows={3}
              className={`${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                  : 'bg-white border-slate-200'
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 order-1 sm:order-1"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors border order-2 sm:order-2 ${
                theme === 'dark'
                  ? 'bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600/50'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
