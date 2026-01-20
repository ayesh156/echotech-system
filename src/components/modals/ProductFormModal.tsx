import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Product } from '../../data/mockData';
import { useTheme } from '../../contexts/ThemeContext';
import { geminiService } from '../../services/geminiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { SearchableSelect } from '../ui/searchable-select';
import { Package, Tag, DollarSign, Boxes, FileText, Save, Plus, Building2, Layers, ImageIcon, Upload, X, Shield, AlertCircle, Clipboard, CheckCircle2, Search, Sparkles, Brain, Loader2, Wand2, Globe, TrendingUp, Zap } from 'lucide-react';

// Computer shop categories
const categoryOptions = [
  { value: 'processors', label: 'Processors' },
  { value: 'graphics-cards', label: 'Graphics Cards' },
  { value: 'memory', label: 'Memory' },
  { value: 'storage', label: 'Storage' },
  { value: 'motherboards', label: 'Motherboards' },
  { value: 'power-supply', label: 'Power Supply' },
  { value: 'cooling', label: 'Cooling' },
  { value: 'cases', label: 'Cases' },
  { value: 'monitors', label: 'Monitors' },
  { value: 'peripherals', label: 'Peripherals' },
  { value: 'networking', label: 'Networking' },
  { value: 'software', label: 'Software' },
];

// Computer hardware brands
const brandOptions = [
  { value: 'amd', label: 'AMD' },
  { value: 'intel', label: 'Intel' },
  { value: 'nvidia', label: 'NVIDIA' },
  { value: 'asus', label: 'ASUS' },
  { value: 'msi', label: 'MSI' },
  { value: 'gigabyte', label: 'Gigabyte' },
  { value: 'corsair', label: 'Corsair' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'wd', label: 'Western Digital' },
  { value: 'seagate', label: 'Seagate' },
  { value: 'gskill', label: 'G.Skill' },
  { value: 'nzxt', label: 'NZXT' },
  { value: 'lianli', label: 'Lian Li' },
  { value: 'lg', label: 'LG' },
  { value: 'logitech', label: 'Logitech' },
  { value: 'razer', label: 'Razer' },
  { value: 'steelseries', label: 'SteelSeries' },
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

interface ProductFormModalProps {
  isOpen: boolean;
  product?: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  warranty: string;
  lowStockThreshold: number;
}

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

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
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
  
  // AI Features State
  const [suggestions, setSuggestions] = useState<Array<{ name: string; brand: string; category: string; estimatedPrice?: number }>>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [aiAutoFillSuccess, setAiAutoFillSuccess] = useState(false);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.serialNumber,
        category: product.category.toLowerCase().replace(/ /g, '-'),
        brand: product.brand.toLowerCase().replace(/ /g, '-'),
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        image: product.image || '',
        warranty: product.warranty || '',
        lowStockThreshold: product.lowStockThreshold || 10,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        brand: '',
        price: 0,
        stock: 0,
        description: '',
        image: '',
        warranty: '',
        lowStockThreshold: 10,
      });
    }
    setErrors({});
    setUploadProgress(0);
    setIsUploading(false);
  }, [product, isOpen]);

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
        
        // Trigger AI image analysis if API key is available
        if (geminiService.hasApiKey()) {
          handleAIImageAnalysis(compressedImage);
        }
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
    if (isOpen) {
      document.addEventListener('paste', handlePaste);
      return () => document.removeEventListener('paste', handlePaste);
    }
  }, [isOpen, handlePaste]);

  // Handle product name change with AI suggestions
  const handleNameChange = useCallback(async (value: string) => {
    setFormData(prev => ({ ...prev, name: value }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }

    // Clear previous timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Only search if query is at least 2 characters
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce the search
    suggestionTimeoutRef.current = setTimeout(async () => {
      if (!geminiService.hasApiKey()) return;
      
      setIsSearchingSuggestions(true);
      setShowSuggestions(true);
      
      try {
        const results = await geminiService.suggestProducts(value);
        setSuggestions(results);
      } catch (error) {
        console.error('Suggestion error:', error);
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 400); // 400ms debounce
  }, [errors.name]);

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((suggestion: { name: string; brand: string; category: string; estimatedPrice?: number }) => {
    // Map category to our category options
    const categoryMap: Record<string, string> = {
      'processors': 'processors',
      'cpu': 'processors',
      'graphics-cards': 'graphics-cards',
      'gpu': 'graphics-cards',
      'memory': 'memory',
      'ram': 'memory',
      'storage': 'storage',
      'ssd': 'storage',
      'hdd': 'storage',
      'motherboards': 'motherboards',
      'motherboard': 'motherboards',
      'power-supply': 'power-supply',
      'psu': 'power-supply',
      'cooling': 'cooling',
      'cases': 'cases',
      'case': 'cases',
      'monitors': 'monitors',
      'monitor': 'monitors',
      'peripherals': 'peripherals',
      'networking': 'networking',
      'software': 'software',
      'laptops': 'peripherals',
      'laptop': 'peripherals',
      'smartphones': 'peripherals',
      'phone': 'peripherals',
      'tablets': 'peripherals',
      'accessories': 'peripherals',
    };

    // Map brand to our brand options
    const brandMap: Record<string, string> = {
      'amd': 'amd',
      'intel': 'intel',
      'nvidia': 'nvidia',
      'asus': 'asus',
      'msi': 'msi',
      'gigabyte': 'gigabyte',
      'corsair': 'corsair',
      'samsung': 'samsung',
      'western digital': 'wd',
      'wd': 'wd',
      'seagate': 'seagate',
      'g.skill': 'gskill',
      'gskill': 'gskill',
      'nzxt': 'nzxt',
      'lian li': 'lianli',
      'lg': 'lg',
      'logitech': 'logitech',
      'razer': 'razer',
      'steelseries': 'steelseries',
    };

    const categoryKey = suggestion.category.toLowerCase().replace(/ /g, '-');
    const brandKey = suggestion.brand.toLowerCase();

    setFormData(prev => ({
      ...prev,
      name: suggestion.name,
      category: categoryMap[categoryKey] || 'peripherals',
      brand: brandMap[brandKey] || prev.brand,
      price: suggestion.estimatedPrice || prev.price,
    }));

    setSuggestions([]);
    setShowSuggestions(false);
    setAiAutoFillSuccess(true);
    setTimeout(() => setAiAutoFillSuccess(false), 3000);
  }, []);

  // Handle AI image analysis
  const handleAIImageAnalysis = useCallback(async (base64Image: string) => {
    if (!geminiService.hasApiKey()) return;

    setIsAnalyzingImage(true);
    
    try {
      const result = await geminiService.analyzeProductImage(base64Image);
      
      if (result) {
        // Map category
        const categoryMap: Record<string, string> = {
          'processors': 'processors',
          'graphics-cards': 'graphics-cards',
          'memory': 'memory',
          'storage': 'storage',
          'motherboards': 'motherboards',
          'power-supply': 'power-supply',
          'cooling': 'cooling',
          'cases': 'cases',
          'monitors': 'monitors',
          'peripherals': 'peripherals',
          'networking': 'networking',
          'software': 'software',
          'laptops': 'peripherals',
          'smartphones': 'peripherals',
          'tablets': 'peripherals',
          'accessories': 'peripherals',
        };

        // Map brand
        const brandMap: Record<string, string> = {
          'amd': 'amd',
          'intel': 'intel',
          'nvidia': 'nvidia',
          'asus': 'asus',
          'msi': 'msi',
          'gigabyte': 'gigabyte',
          'corsair': 'corsair',
          'samsung': 'samsung',
          'western digital': 'wd',
          'wd': 'wd',
          'seagate': 'seagate',
          'g.skill': 'gskill',
          'nzxt': 'nzxt',
          'lian li': 'lianli',
          'lg': 'lg',
          'logitech': 'logitech',
          'razer': 'razer',
          'steelseries': 'steelseries',
          'apple': 'peripherals',
          'dell': 'peripherals',
          'hp': 'peripherals',
          'lenovo': 'peripherals',
        };

        const categoryKey = result.category?.toLowerCase().replace(/ /g, '-') || '';
        const brandKey = result.brand?.toLowerCase() || '';

        // Build description from specs
        let description = result.description || '';
        if (result.specs && result.specs.length > 0) {
          description += '\n\nKey Specifications:\n• ' + result.specs.join('\n• ');
        }

        setFormData(prev => ({
          ...prev,
          name: result.name || prev.name,
          category: categoryMap[categoryKey] || prev.category,
          brand: brandMap[brandKey] || prev.brand,
          price: result.estimatedPrice || prev.price,
          description: description.trim(),
          warranty: result.warranty || prev.warranty,
        }));

        setAiAutoFillSuccess(true);
        setTimeout(() => setAiAutoFillSuccess(false), 3000);
      }
    } catch (error) {
      console.error('AI image analysis error:', error);
    } finally {
      setIsAnalyzingImage(false);
    }
  }, []);

  // Generate AI description
  const handleGenerateDescription = useCallback(async () => {
    if (!geminiService.hasApiKey() || !formData.name) return;

    setIsGeneratingDescription(true);
    
    try {
      const categoryLabel = categoryOptions.find(c => c.value === formData.category)?.label || formData.category;
      const brandLabel = brandOptions.find(b => b.value === formData.brand)?.label || formData.brand;
      
      const description = await geminiService.generateProductDescription(
        formData.name,
        brandLabel,
        categoryLabel
      );
      
      if (description) {
        setFormData(prev => ({ ...prev, description }));
      }
    } catch (error) {
      console.error('Description generation error:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  }, [formData.name, formData.category, formData.brand]);

  // Auto-generate SKU
  const handleGenerateSKU = useCallback(() => {
    const brandLabel = brandOptions.find(b => b.value === formData.brand)?.label || formData.brand;
    const categoryLabel = categoryOptions.find(c => c.value === formData.category)?.label || formData.category;
    
    // Create SKU from brand, category and random number
    const brandPrefix = (brandLabel || 'PRD').slice(0, 3).toUpperCase();
    const catPrefix = (categoryLabel || 'GEN').slice(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    
    const sku = `${brandPrefix}-${catPrefix}-${dateStr}-${randomNum}`;
    setFormData(prev => ({ ...prev, sku }));
    
    if (errors.sku) {
      setErrors(prev => ({ ...prev, sku: '' }));
    }
  }, [formData.brand, formData.category, errors.sku]);

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
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
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
      const categoryLabel = categoryOptions.find(c => c.value === formData.category)?.label || formData.category;
      const brandLabel = brandOptions.find(b => b.value === formData.brand)?.label || formData.brand;
      
      const newProduct: Product = {
        id: product?.id || `prod-${Date.now()}`,
        name: formData.name,
        serialNumber: formData.sku,
        category: categoryLabel,
        brand: brandLabel,
        price: formData.price,
        stock: formData.stock,
        description: formData.description,
        createdAt: product?.createdAt || new Date().toISOString(),
        image: formData.image || undefined,
        warranty: formData.warranty || undefined,
        lowStockThreshold: formData.lowStockThreshold || 10,
      };
      onSave(newProduct);
      onClose();
    }
  };

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isEditing = !!product;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto p-0 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'
      }`}>
        <DialogHeader className="sr-only">
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update product information' : 'Add a new product to inventory'}
          </DialogDescription>
        </DialogHeader>

        {/* Gradient Header */}
        <div className={`p-6 text-white ${isEditing 
          ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500' 
          : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
        }`} aria-hidden="true">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              {isEditing ? <Package className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-emerald-100">
                {isEditing ? 'Update product information' : 'Add a new product to inventory'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* AI Auto-Fill Success Banner */}
          {aiAutoFillSuccess && (
            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30' 
                : 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200'
            }`}>
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  AI Auto-Fill Complete!
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Product details have been automatically filled. Please review and adjust as needed.
                </p>
              </div>
            </div>
          )}

          {/* Product Name with AI Suggestions */}
          <div className="space-y-2 relative">
            <Label htmlFor="name" className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <Tag className="w-4 h-4" />
              Product Name <span className="text-red-500">*</span>
              {geminiService.hasApiKey() && (
                <span className={`flex items-center gap-1 text-xs ml-auto ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                  <Globe className="w-3 h-3" />
                  AI Global Search
                </span>
              )}
            </Label>
            <div className="relative">
              <Input
                ref={nameInputRef}
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Start typing to search global products..."
                className={`${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200'
                } ${errors.name ? 'border-red-500' : ''} pr-10`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearchingSuggestions ? (
                  <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                ) : (
                  <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                )}
              </div>
            </div>
            
            {/* AI Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className={`px-3 py-2 border-b flex items-center gap-2 ${
                  theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    AI Suggestions from Global Database
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={`w-full text-left px-4 py-3 transition-colors border-b last:border-b-0 ${
                        theme === 'dark' 
                          ? 'hover:bg-slate-700/50 border-slate-700/50' 
                          : 'hover:bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {suggestion.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {suggestion.brand}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {suggestion.category}
                            </span>
                          </div>
                        </div>
                        {suggestion.estimatedPrice && (
                          <div className="text-right flex-shrink-0">
                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                              Rs. {suggestion.estimatedPrice.toLocaleString()}
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Est. Price
                            </p>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className={`px-3 py-2 border-t ${
                  theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    💡 Click to auto-fill • Prices are estimates in LKR
                  </p>
                </div>
              </div>
            )}
            
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sku" className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <FileText className="w-4 h-4" />
                SKU <span className="text-red-500">*</span>
              </Label>
              <button
                type="button"
                onClick={handleGenerateSKU}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 text-emerald-400'
                    : 'bg-gradient-to-r from-emerald-100 to-blue-100 hover:from-emerald-200 hover:to-blue-200 text-emerald-700'
                }`}
              >
                <Zap className="w-3 h-3" />
                Auto Generate
              </button>
            </div>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              placeholder="Enter SKU code or click 'Auto Generate'"
              className={`${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                  : 'bg-white border-slate-200'
              } ${errors.sku ? 'border-red-500' : ''}`}
            />
            {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
          </div>

          {/* Category & Brand Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
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
              <Label className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <DollarSign className="w-4 h-4" />
                Price (LKR) <span className="text-red-500">*</span>
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
              <Label htmlFor="stock" className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Boxes className="w-4 h-4" />
                Stock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                placeholder="Enter stock quantity"
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
              <Label className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
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
              <Label htmlFor="lowStockThreshold" className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
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
            <Label className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
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
                
                {/* AI Analyzing Overlay */}
                {isAnalyzingImage && (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-900/90' : 'bg-white/90'
                  }`}>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                      <Brain className="w-6 h-6 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className={`mt-3 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      AI Scanning Product...
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Identifying name, brand, specs & price
                    </p>
                  </div>
                )}
                
                <div className={`absolute bottom-0 left-0 right-0 px-3 py-2 text-xs ${
                  theme === 'dark' ? 'bg-slate-900/80 text-slate-300' : 'bg-white/80 text-slate-600'
                }`}>
                  {isAnalyzingImage ? 'AI is analyzing the image...' : 'Click the X to remove and upload a new image'}
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
                    
                    {/* AI Feature Highlight */}
                    {geminiService.hasApiKey() && (
                      <div className={`flex items-center justify-center gap-2 pt-2 border-t ${
                        theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                      }`}>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          <span className={`text-xs font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                            AI Auto-Fill: Upload image → Get product details instantly!
                          </span>
                        </div>
                      </div>
                    )}
                    
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
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <FileText className="w-4 h-4" />
                Description
              </Label>
              {geminiService.hasApiKey() && formData.name && (
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isGeneratingDescription
                      ? 'bg-slate-500/50 cursor-not-allowed text-slate-400'
                      : theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-400'
                        : 'bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700'
                  }`}
                >
                  {isGeneratingDescription ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3" />
                      AI Generate
                    </>
                  )}
                </button>
              )}
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter product description (optional) or click 'AI Generate' for auto-generated description"
              rows={3}
              className={`${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                  : 'bg-white border-slate-200'
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-3 pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors border ${
                theme === 'dark'
                  ? 'bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600/50'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
