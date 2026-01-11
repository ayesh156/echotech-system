import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Building2, Layers, Hash, Barcode, RefreshCw, ImageIcon, Upload, X, Shield, AlertCircle, Clipboard, CheckCircle2
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

// Warranty period options
const warrantyOptions = [
  { value: '', label: 'No Warranty' },
  { value: '3 months', label: '3 Months' },
  { value: '6 months', label: '6 Months' },
  { value: '1 year', label: '1 Year' },
  { value: '2 years', label: '2 Years' },
  { value: '3 years', label: '3 Years' },
  { value: '5 years', label: '5 Years' },
  { value: 'lifetime', label: 'Lifetime' },
];

// Image compression utility
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

interface ProductFormData {
  name: string;
  serialNumber: string;
  barcode: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  warranty: string;
  lowStockThreshold: number;
}

export const ProductForm: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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
    image: '',
    warranty: '',
    lowStockThreshold: 10,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);

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
        image: existingProduct.image || '',
        warranty: existingProduct.warranty || '',
        lowStockThreshold: existingProduct.lowStockThreshold || 10,
      });
    }
  }, [existingProduct]);

  // Handle image upload with compression and progress
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, image: 'Image must be less than 10MB' }));
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrors(prev => ({ ...prev, image: '' }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      // Compress the image
      const compressedImage = await compressImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setFormData(prev => ({ ...prev, image: compressedImage }));
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    } catch {
      setErrors(prev => ({ ...prev, image: 'Failed to process image' }));
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle paste from clipboard (Google image paste)
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);
          handleImageUpload(file);
        }
        break;
      }
    }
  }, [handleImageUpload]);

  // Add paste event listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Remove image
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        image: formData.image || undefined,
        warranty: formData.warranty || undefined,
        lowStockThreshold: formData.lowStockThreshold || 10,
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

          {/* Warranty & Low Stock Threshold Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Warranty */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Shield className="w-4 h-4" />
                Warranty Period
              </Label>
              <SearchableSelect
                options={warrantyOptions}
                value={formData.warranty}
                onValueChange={(value) => handleChange('warranty', value)}
                placeholder="Select warranty..."
                searchPlaceholder="Search warranty..."
                emptyMessage="No options found"
                theme={theme}
              />
            </div>

            {/* Low Stock Threshold */}
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold" className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <AlertCircle className="w-4 h-4" />
                Low Stock Alert
              </Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value) || 10)}
                placeholder="Alert when stock below..."
                className={`${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200'
                }`}
              />
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Show warning when stock falls below this number
              </p>
            </div>
          </div>

          {/* Product Image Upload */}
          <div className="space-y-2">
            <Label className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <ImageIcon className="w-4 h-4" />
              Product Image
              {pasteSuccess && (
                <span className="flex items-center gap-1 text-xs text-emerald-500 ml-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Image pasted!
                </span>
              )}
            </Label>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {formData.image ? (
              /* Image Preview */
              <div className={`relative rounded-xl border-2 border-dashed overflow-hidden ${
                theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
              }`}>
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="w-full h-48 object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className={`absolute bottom-0 left-0 right-0 px-3 py-2 text-xs ${
                  theme === 'dark' ? 'bg-slate-900/80 text-slate-300' : 'bg-white/80 text-slate-600'
                }`}>
                  Click the X to remove and upload a new image
                </div>
              </div>
            ) : (
              /* Upload Drop Zone */
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : theme === 'dark' 
                      ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800' 
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isUploading ? (
                  /* Upload Progress */
                  <div className="space-y-3">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                      theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-50'
                    }`}>
                      <Upload className="w-6 h-6 text-emerald-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Compressing & Uploading...
                      </p>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${
                        theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                      }`}>
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {Math.round(uploadProgress)}% complete
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Upload Instructions */
                  <div className="space-y-3">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                    }`}>
                      <Upload className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Drop image here or click to upload
                      </p>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        PNG, JPG up to 10MB. Images will be compressed automatically.
                      </p>
                    </div>
                    <div className={`flex items-center justify-center gap-2 pt-2 border-t ${
                      theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      <Clipboard className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={`text-xs ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        Pro tip: Copy image from Google and press Ctrl+V to paste
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
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
