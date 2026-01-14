// Mock data for Ecotec Computer Shop

// WhatsApp Message Settings
export interface WhatsAppSettings {
  paymentReminderTemplate: string;
  overdueReminderTemplate: string;
  enabled: boolean;
}

// Default WhatsApp message templates with placeholders - English Modern Templates
export const mockWhatsAppSettings: WhatsAppSettings = {
  paymentReminderTemplate: `Hello {{customerName}}! 👋

Greetings from *EchoTech Computer Shop*!

This is a friendly reminder about your pending payment:

📄 *Invoice:* #{{invoiceId}}
💰 *Total Amount:* Rs. {{totalAmount}}
✅ *Paid:* Rs. {{paidAmount}}
⏳ *Balance Due:* Rs. {{dueAmount}}
📅 *Due Date:* {{dueDate}}

We kindly request you to settle your outstanding balance at your earliest convenience.

If you've already made the payment, please disregard this message.

Thank you for your continued trust! 🙏
*EchoTech Computer Shop*
📞 011-2345678
🌐 www.echotech.lk`,
  overdueReminderTemplate: `⚠️ *URGENT: Payment Overdue Notice*

Dear {{customerName}},

We regret to inform you that your payment is now *OVERDUE*.

📄 *Invoice:* #{{invoiceId}}
📅 *Due Date:* {{dueDate}}
⏰ *Days Overdue:* {{daysOverdue}} days
💰 *Outstanding Amount:* Rs. {{dueAmount}}

*Immediate action is required.* Please settle this payment as soon as possible to avoid service interruption.

For payment options or queries, please contact us.

Thank you for your prompt attention.

*EchoTech Computer Shop*
📞 011-2345678
🌐 www.echotech.lk`,
  enabled: true
};

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  serialNumber: string;
  barcode?: string;
  description?: string;
  createdAt: string;
  image?: string; // Base64 or URL of product image
  warranty?: string; // Warranty period (e.g., "6 months", "1 year")
  lowStockThreshold?: number; // Custom low stock threshold (default: 10)
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  totalSpent: number;
  totalOrders: number;
  lastPurchase?: string;
  // Credit management fields
  creditBalance: number; // Outstanding credit amount (naya)
  creditLimit: number; // Maximum credit allowed
  creditDueDate?: string; // Due date for credit payment
  creditStatus: 'clear' | 'active' | 'overdue'; // Credit status
  // Payment history
  paymentHistory?: CustomerPayment[];
}

// Customer Payment History
export interface CustomerPayment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string; // ISO date with time
  paymentMethod: 'cash' | 'bank' | 'card' | 'cheque';
  notes?: string;
}

// Supplier interface for managing suppliers with credit tracking
export interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  // Financial tracking
  totalPurchases: number; // Total value purchased from supplier
  totalOrders: number; // Number of purchase orders
  lastOrder?: string; // Last order date
  // Credit management
  creditBalance: number; // Outstanding amount owed to supplier (naya)
  creditLimit: number; // Maximum credit limit from supplier
  creditDueDate?: string; // Due date for payment
  creditStatus: 'clear' | 'active' | 'overdue'; // Payment status
  // Additional info
  bankDetails?: string;
  notes?: string;
  rating: number; // 1-5 supplier rating
  categories: string[]; // Product categories they supply
}

// Supplier Purchase interface for tracking products bought from suppliers
export interface SupplierPurchase {
  id: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number; // Price per unit from supplier
  totalAmount: number; // quantity * unitPrice
  purchaseDate: string; // When we bought from supplier
  // Payment tracking
  paidAmount: number; // How much we've paid
  paymentStatus: 'unpaid' | 'partial' | 'fullpaid'; // Payment status
  paymentPercentage: number; // Percentage paid (0-100)
  lastPaymentDate?: string; // Last payment made
  // Payment history
  payments: SupplierPayment[];
  // Stock tracking
  soldQuantity: number; // How many sold to customers
  inStock: number; // Remaining in stock (quantity - soldQuantity)
  // Notes
  notes?: string;
}

export interface SupplierPayment {
  id: string;
  purchaseId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank' | 'card' | 'cheque';
  notes?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'unpaid' | 'fullpaid' | 'halfpay';
  paidAmount?: number; // Amount paid so far (for halfpay tracking)
  date: string;
  dueDate: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'credit';
  salesChannel?: 'on-site' | 'online';
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  originalPrice?: number; // Original price before discount
  total: number;
  warrantyDueDate?: string;
}

// Sales History for tracking product sales
export interface SaleRecord {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage discount
  discountAmount: number; // calculated discount amount
  finalPrice: number; // price after discount
  total: number; // quantity * finalPrice
  saleDate: string; // ISO date with time
}

// Warranty Claim for tracking warranty issues and replacements
export interface WarrantyClaim {
  id: string;
  invoiceId: string;
  invoiceItemIndex?: number; // Index of the item in invoice items array
  productId: string;
  productName: string;
  productSerialNumber?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  claimDate: string; // ISO date with time when claim was filed
  warrantyExpiryDate: string; // Original warranty expiry date
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'replaced' | 'repaired';
  issueDescription: string;
  issueCategory: 'defective' | 'damaged' | 'not-working' | 'performance' | 'other';
  resolution?: string;
  resolutionDate?: string; // ISO date with time when resolved
  // Replacement tracking
  isReplacement: boolean;
  replacementProductId?: string;
  replacementProductName?: string;
  replacementSerialNumber?: string;
  replacementDate?: string; // ISO date with time
  // Additional metadata
  notes?: string;
  attachments?: string[]; // URLs or file paths
  handledBy?: string; // Staff member who handled the claim
}

// Helper function to generate unique 8-digit numeric serial number based on timestamp
// Uses last 8 digits of timestamp in milliseconds for uniqueness
const generateSerialNumber = () => {
  return Date.now().toString().slice(-8);
};

// Helper function to generate unique 8-digit invoice number
export const generateInvoiceNumber = () => {
  return Date.now().toString().slice(-8);
};

// Computer Shop Products
export const mockProducts: Product[] = [
  { id: '1', name: 'AMD Ryzen 9 7950X', category: 'Processors', brand: 'AMD', price: 185000, stock: 12, serialNumber: '70451234', barcode: '4938271650123', createdAt: '2026-01-01T08:00:00', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 8 },
  { id: '2', name: 'Intel Core i9-14900K', category: 'Processors', brand: 'Intel', price: 195000, stock: 8, serialNumber: '70452345', barcode: '4938271650124', createdAt: '2026-01-02T09:30:00', warranty: '3 years', lowStockThreshold: 6 },
  { id: '3', name: 'NVIDIA GeForce RTX 4090', category: 'Graphics Cards', brand: 'NVIDIA', price: 620000, stock: 5, serialNumber: '70453456', barcode: '4938271650125', createdAt: '2026-01-03T10:15:00', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 3 },
  { id: '4', name: 'NVIDIA GeForce RTX 4070 Ti', category: 'Graphics Cards', brand: 'NVIDIA', price: 280000, stock: 15, serialNumber: '70454567', barcode: '4938271650126', createdAt: '2026-01-04T11:45:00', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=500&q=60', warranty: '3 years' },
  { id: '5', name: 'AMD Radeon RX 7900 XTX', category: 'Graphics Cards', brand: 'AMD', price: 350000, stock: 7, serialNumber: '70455678', barcode: '4938271650127', createdAt: '2026-01-05T12:20:00', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=60', warranty: '2 years', lowStockThreshold: 5 },
  { id: '6', name: 'Samsung 990 Pro 2TB NVMe SSD', category: 'Storage', brand: 'Samsung', price: 75000, stock: 30, serialNumber: '70456789', barcode: '4938271650128', createdAt: '2026-01-06T13:30:00', warranty: '5 years' },
  { id: '7', name: 'WD Black SN850X 1TB', category: 'Storage', brand: 'Western Digital', price: 42000, stock: 45, serialNumber: '70457890', barcode: '4938271650129', createdAt: '2026-01-07T14:00:00', warranty: '5 years' },
  { id: '8', name: 'Corsair Vengeance DDR5 32GB (2x16GB)', category: 'Memory', brand: 'Corsair', price: 48000, stock: 25, serialNumber: '70458901', barcode: '4938271650130', createdAt: '2026-01-08T15:15:00', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=60', warranty: 'Lifetime' },
  { id: '9', name: 'G.Skill Trident Z5 64GB DDR5', category: 'Memory', brand: 'G.Skill', price: 95000, stock: 10, serialNumber: '70459012', barcode: '4938271650131', createdAt: '2026-01-09T16:45:00', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=60', warranty: 'Lifetime' },
  { id: '10', name: 'ASUS ROG Maximus Z790 Hero', category: 'Motherboards', brand: 'ASUS', price: 185000, stock: 6, serialNumber: '70460123', barcode: '4938271650132', createdAt: '2026-01-10T17:00:00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 4 },
  { id: '11', name: 'MSI MEG Z790 ACE', category: 'Motherboards', brand: 'MSI', price: 165000, stock: 8, serialNumber: '70461234', barcode: '4938271650133', createdAt: '2026-01-15T08:30:00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=60', warranty: '3 years' },
  { id: '12', name: 'Corsair RM1000x 1000W PSU', category: 'Power Supply', brand: 'Corsair', price: 55000, stock: 20, serialNumber: '70462345', barcode: '4938271650134', createdAt: '2026-01-16T09:00:00', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=60', warranty: '10 years' },
  { id: '13', name: 'NZXT Kraken X73 RGB', category: 'Cooling', brand: 'NZXT', price: 75000, stock: 18, serialNumber: '70463456', barcode: '4938271650135', createdAt: '2026-01-17T10:15:00', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=60', warranty: '6 years' },
  { id: '14', name: 'Lian Li O11 Dynamic EVO', category: 'Cases', brand: 'Lian Li', price: 58000, stock: 12, serialNumber: '70464567', barcode: '4938271650136', createdAt: '2026-01-20T11:30:00', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=500&q=60', warranty: '2 years' },
  { id: '15', name: 'LG UltraGear 27GP950-B 4K Monitor', category: 'Monitors', brand: 'LG', price: 195000, stock: 6, serialNumber: '70465678', barcode: '4938271650137', createdAt: '2026-01-22T12:45:00', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 4 },
  { id: '16', name: 'Samsung Odyssey G9 49" Monitor', category: 'Monitors', brand: 'Samsung', price: 380000, stock: 3, serialNumber: '70466789', barcode: '4938271650138', createdAt: '2026-01-24T13:20:00', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 2 },
  { id: '17', name: 'Logitech G Pro X Superlight 2', category: 'Peripherals', brand: 'Logitech', price: 52000, stock: 35, serialNumber: '70467890', barcode: '4938271650139', createdAt: '2026-01-25T14:00:00', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=60', warranty: '2 years' },
  { id: '18', name: 'Razer Huntsman V3 Pro', category: 'Peripherals', brand: 'Razer', price: 68000, stock: 20, serialNumber: '70468901', barcode: '4938271650140', createdAt: '2026-01-27T15:00:00', warranty: '2 years' },
  { id: '19', name: 'SteelSeries Arctis Nova Pro', category: 'Peripherals', brand: 'SteelSeries', price: 95000, stock: 15, serialNumber: '70469012', barcode: '4938271650141', createdAt: '2026-01-28T16:30:00', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=60', warranty: '1 year' },
  { id: '20', name: 'Seagate Exos 18TB HDD', category: 'Storage', brand: 'Seagate', price: 125000, stock: 8, serialNumber: '70470123', barcode: '4938271650142', createdAt: '2026-01-31T17:15:00', warranty: '5 years' },
];

// Export the helper function for use in other files
export { generateSerialNumber };

// Customers with credit management
export const mockCustomers: Customer[] = [
  { id: '1', name: 'Kasun Perera', email: 'kasun@gmail.com', phone: '078-3233760', address: 'No. 12, Galle Road, Colombo', totalSpent: 580000, totalOrders: 5, lastPurchase: '2024-01-15', creditBalance: 0, creditLimit: 100000, creditStatus: 'clear' },
  { id: '2', name: 'Nimali Fernando', email: 'nimali@email.com', phone: '078-3233760', address: '12A, Kandy Rd, Kurunegala', totalSpent: 320000, totalOrders: 3, lastPurchase: '2024-01-10', creditBalance: 45000, creditLimit: 150000, creditDueDate: '2026-01-20', creditStatus: 'active' },
  { id: '3', name: 'Tech Solutions Ltd', email: 'info@techsol.lk', phone: '078-3233760', address: 'No. 45, Industrial Estate, Colombo 15', totalSpent: 2500000, totalOrders: 18, lastPurchase: '2024-01-18', creditBalance: 350000, creditLimit: 500000, creditDueDate: '2026-01-05', creditStatus: 'overdue' },
  { id: '4', name: 'Dilshan Silva', email: 'dilshan.s@hotmail.com', phone: '078-3233760', address: '78/2, Hill Street, Kandy', totalSpent: 185000, totalOrders: 2, lastPurchase: '2024-01-05', creditBalance: 0, creditLimit: 50000, creditStatus: 'clear' },
  { id: '5', name: 'GameZone Café', email: 'contact@gamezone.lk', phone: '078-3233760', address: 'Shop 5, Arcade Mall, Colombo', totalSpent: 3200000, totalOrders: 25, lastPurchase: '2024-01-20', creditBalance: 420000, creditLimit: 800000, creditDueDate: '2026-02-15', creditStatus: 'active' },
  { id: '6', name: 'Priya Jayawardena', email: 'priya.j@yahoo.com', phone: '078-3233760', address: 'No. 7, Lake Road, Galle', totalSpent: 95000, totalOrders: 1, lastPurchase: '2024-01-12', creditBalance: 15000, creditLimit: 30000, creditDueDate: '2026-01-08', creditStatus: 'overdue' },
  { id: '7', name: 'Creative Studios', email: 'studio@creative.lk', phone: '078-3233760', address: 'Studio 3, Art Lane, Colombo', totalSpent: 1850000, totalOrders: 12, lastPurchase: '2024-01-16', creditBalance: 180000, creditLimit: 300000, creditDueDate: '2026-01-25', creditStatus: 'active' },
  { id: '8', name: 'Sanjay Mendis', email: 'sanjay.m@gmail.com', phone: '078-3233760', address: 'No. 21, Thotalanga Road, Colombo', totalSpent: 420000, totalOrders: 4, lastPurchase: '2024-01-08', creditBalance: 0, creditLimit: 75000, creditStatus: 'clear' },
];

// Suppliers with credit management
export const mockSuppliers: Supplier[] = [
  { 
    id: '1', 
    name: 'Rohan Silva', 
    company: 'TechZone Distributors', 
    email: 'rohan@techzone.lk', 
    phone: '078-3233760', 
    address: 'No. 78, Industrial Zone, Colombo 15',
    totalPurchases: 4500000, 
    totalOrders: 45,
    lastOrder: '2026-01-10',
    creditBalance: 850000,
    creditLimit: 2000000,
    creditDueDate: '2026-01-25',
    creditStatus: 'active',
    bankDetails: 'BOC - 1234567890',
    rating: 5,
    categories: ['Processors', 'Motherboards', 'Memory']
  },
  { 
    id: '2', 
    name: 'Chamara Perera', 
    company: 'PC Parts Lanka', 
    email: 'chamara@pcparts.lk', 
    phone: '078-3233760', 
    address: '45/B, Pettah Market, Colombo',
    totalPurchases: 3200000, 
    totalOrders: 38,
    lastOrder: '2026-01-08',
    creditBalance: 420000,
    creditLimit: 1500000,
    creditDueDate: '2026-01-05',
    creditStatus: 'overdue',
    bankDetails: 'Sampath - 9876543210',
    rating: 4,
    categories: ['Graphics Cards', 'Power Supply', 'Cases']
  },
  { 
    id: '3', 
    name: 'Nuwan Fernando', 
    company: 'GPU World', 
    email: 'nuwan@gpuworld.lk', 
    phone: '078-3233760', 
    address: 'Unity Plaza, Colombo 4',
    totalPurchases: 8500000, 
    totalOrders: 62,
    lastOrder: '2026-01-12',
    creditBalance: 0,
    creditLimit: 3000000,
    creditStatus: 'clear',
    bankDetails: 'HNB - 5432167890',
    rating: 5,
    categories: ['Graphics Cards', 'Monitors']
  },
  { 
    id: '4', 
    name: 'Malith Gunasekara', 
    company: 'Storage Solutions', 
    email: 'malith@storage.lk', 
    phone: '078-3233760', 
    address: 'No. 23, High Level Road, Nugegoda',
    totalPurchases: 2100000, 
    totalOrders: 28,
    lastOrder: '2026-01-06',
    creditBalance: 180000,
    creditLimit: 800000,
    creditDueDate: '2026-02-01',
    creditStatus: 'active',
    bankDetails: 'Commercial - 1122334455',
    rating: 4,
    categories: ['Storage', 'Memory']
  },
  { 
    id: '5', 
    name: 'Kamal Jayasuriya', 
    company: 'Peripheral Hub', 
    email: 'kamal@peripheralhub.lk', 
    phone: '078-3233760', 
    address: 'Shop 12, Majestic City, Colombo 4',
    totalPurchases: 1800000, 
    totalOrders: 52,
    lastOrder: '2026-01-11',
    creditBalance: 95000,
    creditLimit: 500000,
    creditDueDate: '2026-01-02',
    creditStatus: 'overdue',
    bankDetails: 'NTB - 6677889900',
    rating: 3,
    categories: ['Peripherals', 'Cooling']
  },
  { 
    id: '6', 
    name: 'Dinesh Rathnayake', 
    company: 'Monitor Masters', 
    email: 'dinesh@monitormaster.lk', 
    phone: '078-3233760', 
    address: 'No. 56, Duplication Road, Colombo 3',
    totalPurchases: 5600000, 
    totalOrders: 35,
    lastOrder: '2026-01-09',
    creditBalance: 720000,
    creditLimit: 2500000,
    creditDueDate: '2026-01-30',
    creditStatus: 'active',
    bankDetails: 'Seylan - 9988776655',
    rating: 5,
    categories: ['Monitors']
  },
  { 
    id: '7', 
    name: 'Asanka Mendis', 
    company: 'Cooler Pro Lanka', 
    email: 'asanka@coolerpro.lk', 
    phone: '078-3233760', 
    address: 'No. 89, Galle Road, Dehiwala',
    totalPurchases: 1250000, 
    totalOrders: 22,
    lastOrder: '2026-01-05',
    creditBalance: 0,
    creditLimit: 600000,
    creditStatus: 'clear',
    bankDetails: 'NSB - 3344556677',
    rating: 4,
    categories: ['Cooling', 'Cases']
  },
  { 
    id: '8', 
    name: 'Pradeep Wickrama', 
    company: 'Power Elite Systems', 
    email: 'pradeep@powerelite.lk', 
    phone: '078-3233760', 
    address: '78/A, Kandy Road, Kadawatha',
    totalPurchases: 3800000, 
    totalOrders: 41,
    lastOrder: '2026-01-11',
    creditBalance: 560000,
    creditLimit: 1800000,
    creditDueDate: '2026-02-10',
    creditStatus: 'active',
    bankDetails: 'DFCC - 7788990011',
    rating: 5,
    categories: ['Power Supply', 'Cases', 'Cooling']
  },
  { 
    id: '9', 
    name: 'Tharaka Bandara', 
    company: 'RAM Kingdom', 
    email: 'tharaka@ramkingdom.lk', 
    phone: '078-3233760', 
    address: 'Level 2, Liberty Plaza, Colombo 3',
    totalPurchases: 2900000, 
    totalOrders: 33,
    lastOrder: '2026-01-03',
    creditBalance: 385000,
    creditLimit: 1200000,
    creditDueDate: '2025-12-28',
    creditStatus: 'overdue',
    bankDetails: 'Peoples - 2233445566',
    rating: 3,
    categories: ['Memory', 'Storage']
  },
  { 
    id: '10', 
    name: 'Lahiru de Silva', 
    company: 'Gaming Gear LK', 
    email: 'lahiru@gaminggear.lk', 
    phone: '078-3233760', 
    address: 'Unity Plaza, Colombo 4',
    totalPurchases: 4200000, 
    totalOrders: 55,
    lastOrder: '2026-01-12',
    creditBalance: 0,
    creditLimit: 2000000,
    creditStatus: 'clear',
    bankDetails: 'BOC - 5566778899',
    rating: 5,
    categories: ['Peripherals', 'Monitors', 'Cooling']
  },
  { 
    id: '11', 
    name: 'Chathura Herath', 
    company: 'SSD Express', 
    email: 'chathura@ssdexpress.lk', 
    phone: '078-3233760', 
    address: 'No. 34, Main Street, Negombo',
    totalPurchases: 6100000, 
    totalOrders: 48,
    lastOrder: '2026-01-08',
    creditBalance: 920000,
    creditLimit: 2800000,
    creditDueDate: '2026-01-20',
    creditStatus: 'active',
    bankDetails: 'Sampath - 1122334466',
    rating: 4,
    categories: ['Storage', 'Memory']
  },
  { 
    id: '12', 
    name: 'Ruwan Pathirana', 
    company: 'CPU Masters', 
    email: 'ruwan@cpumasters.lk', 
    phone: '078-3233760', 
    address: '56/1, High Level Road, Maharagama',
    totalPurchases: 7500000, 
    totalOrders: 58,
    lastOrder: '2026-01-10',
    creditBalance: 1250000,
    creditLimit: 3500000,
    creditDueDate: '2026-01-15',
    creditStatus: 'active',
    bankDetails: 'HNB - 9988776644',
    rating: 5,
    categories: ['Processors', 'Motherboards']
  },
  { 
    id: '13', 
    name: 'Sanath Jayawardena', 
    company: 'Case & Chassis LK', 
    email: 'sanath@caseandchassis.lk', 
    phone: '078-3233760', 
    address: 'No. 12, Station Road, Moratuwa',
    totalPurchases: 980000, 
    totalOrders: 18,
    lastOrder: '2025-12-20',
    creditBalance: 145000,
    creditLimit: 400000,
    creditDueDate: '2025-12-25',
    creditStatus: 'overdue',
    bankDetails: 'Commercial - 5544332211',
    rating: 2,
    categories: ['Cases', 'Cooling']
  },
  { 
    id: '14', 
    name: 'Nihal Fernando', 
    company: 'Graphics Pro', 
    email: 'nihal@graphicspro.lk', 
    phone: '078-3233760', 
    address: 'Unity Plaza, Level 3, Colombo 4',
    totalPurchases: 9200000, 
    totalOrders: 72,
    lastOrder: '2026-01-12',
    creditBalance: 0,
    creditLimit: 4000000,
    creditStatus: 'clear',
    bankDetails: 'Seylan - 4455667788',
    rating: 5,
    categories: ['Graphics Cards', 'Monitors']
  },
];

// Supplier Purchases - Products bought from suppliers
export const mockSupplierPurchases: SupplierPurchase[] = [
  // TechZone Distributors purchases (Supplier 1)
  {
    id: 'sp-001',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    productId: '1',
    productName: 'AMD Ryzen 9 7950X',
    category: 'Processors',
    quantity: 20,
    unitPrice: 165000,
    totalAmount: 3300000,
    purchaseDate: '2025-12-15',
    paidAmount: 3300000,
    paymentStatus: 'fullpaid',
    paymentPercentage: 100,
    lastPaymentDate: '2026-01-05',
    payments: [
      { id: 'pay-001', purchaseId: 'sp-001', amount: 1650000, paymentDate: '2025-12-20', paymentMethod: 'bank' },
      { id: 'pay-002', purchaseId: 'sp-001', amount: 1650000, paymentDate: '2026-01-05', paymentMethod: 'bank' },
    ],
    soldQuantity: 8,
    inStock: 12,
    notes: 'Bulk order - got 10% discount'
  },
  {
    id: 'sp-002',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    productId: '10',
    productName: 'ASUS ROG Maximus Z790 Hero',
    category: 'Motherboards',
    quantity: 10,
    unitPrice: 165000,
    totalAmount: 1650000,
    purchaseDate: '2026-01-02',
    paidAmount: 800000,
    paymentStatus: 'partial',
    paymentPercentage: 48.5,
    lastPaymentDate: '2026-01-10',
    payments: [
      { id: 'pay-003', purchaseId: 'sp-002', amount: 500000, paymentDate: '2026-01-05', paymentMethod: 'cash' },
      { id: 'pay-004', purchaseId: 'sp-002', amount: 300000, paymentDate: '2026-01-10', paymentMethod: 'bank' },
    ],
    soldQuantity: 4,
    inStock: 6,
  },
  {
    id: 'sp-003',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    productId: '8',
    productName: 'Corsair Vengeance DDR5 32GB (2x16GB)',
    category: 'Memory',
    quantity: 30,
    unitPrice: 42000,
    totalAmount: 1260000,
    purchaseDate: '2026-01-08',
    paidAmount: 0,
    paymentStatus: 'unpaid',
    paymentPercentage: 0,
    payments: [],
    soldQuantity: 5,
    inStock: 25,
  },
  // PC Parts Lanka purchases (Supplier 2)
  {
    id: 'sp-004',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    productId: '3',
    productName: 'NVIDIA GeForce RTX 4090',
    category: 'Graphics Cards',
    quantity: 8,
    unitPrice: 550000,
    totalAmount: 4400000,
    purchaseDate: '2025-12-20',
    paidAmount: 3980000,
    paymentStatus: 'partial',
    paymentPercentage: 90.5,
    lastPaymentDate: '2026-01-08',
    payments: [
      { id: 'pay-005', purchaseId: 'sp-004', amount: 2200000, paymentDate: '2025-12-25', paymentMethod: 'bank' },
      { id: 'pay-006', purchaseId: 'sp-004', amount: 1780000, paymentDate: '2026-01-08', paymentMethod: 'bank' },
    ],
    soldQuantity: 3,
    inStock: 5,
  },
  {
    id: 'sp-005',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    productId: '12',
    productName: 'Corsair RM1000x 1000W PSU',
    category: 'Power Supply',
    quantity: 25,
    unitPrice: 48000,
    totalAmount: 1200000,
    purchaseDate: '2026-01-05',
    paidAmount: 780000,
    paymentStatus: 'partial',
    paymentPercentage: 65,
    lastPaymentDate: '2026-01-12',
    payments: [
      { id: 'pay-007', purchaseId: 'sp-005', amount: 400000, paymentDate: '2026-01-08', paymentMethod: 'cash' },
      { id: 'pay-008', purchaseId: 'sp-005', amount: 380000, paymentDate: '2026-01-12', paymentMethod: 'cheque' },
    ],
    soldQuantity: 5,
    inStock: 20,
  },
  // GPU World purchases (Supplier 3 - Fully paid)
  {
    id: 'sp-006',
    supplierId: '3',
    supplierName: 'GPU World',
    productId: '4',
    productName: 'NVIDIA GeForce RTX 4070 Ti',
    category: 'Graphics Cards',
    quantity: 15,
    unitPrice: 250000,
    totalAmount: 3750000,
    purchaseDate: '2025-12-10',
    paidAmount: 3750000,
    paymentStatus: 'fullpaid',
    paymentPercentage: 100,
    lastPaymentDate: '2025-12-28',
    payments: [
      { id: 'pay-009', purchaseId: 'sp-006', amount: 1875000, paymentDate: '2025-12-15', paymentMethod: 'bank' },
      { id: 'pay-010', purchaseId: 'sp-006', amount: 1875000, paymentDate: '2025-12-28', paymentMethod: 'bank' },
    ],
    soldQuantity: 0,
    inStock: 15,
    notes: 'Direct import - No credit pending'
  },
  {
    id: 'sp-007',
    supplierId: '3',
    supplierName: 'GPU World',
    productId: '15',
    productName: 'LG UltraGear 27GP950-B 4K Monitor',
    category: 'Monitors',
    quantity: 10,
    unitPrice: 175000,
    totalAmount: 1750000,
    purchaseDate: '2026-01-03',
    paidAmount: 1750000,
    paymentStatus: 'fullpaid',
    paymentPercentage: 100,
    lastPaymentDate: '2026-01-10',
    payments: [
      { id: 'pay-011', purchaseId: 'sp-007', amount: 1750000, paymentDate: '2026-01-10', paymentMethod: 'bank' },
    ],
    soldQuantity: 4,
    inStock: 6,
  },
  // Storage Solutions purchases (Supplier 4)
  {
    id: 'sp-008',
    supplierId: '4',
    supplierName: 'Storage Solutions',
    productId: '6',
    productName: 'Samsung 990 Pro 2TB NVMe SSD',
    category: 'Storage',
    quantity: 40,
    unitPrice: 65000,
    totalAmount: 2600000,
    purchaseDate: '2026-01-01',
    paidAmount: 2420000,
    paymentStatus: 'partial',
    paymentPercentage: 93,
    lastPaymentDate: '2026-01-12',
    payments: [
      { id: 'pay-012', purchaseId: 'sp-008', amount: 1300000, paymentDate: '2026-01-05', paymentMethod: 'bank' },
      { id: 'pay-013', purchaseId: 'sp-008', amount: 1120000, paymentDate: '2026-01-12', paymentMethod: 'bank' },
    ],
    soldQuantity: 10,
    inStock: 30,
  },
  {
    id: 'sp-009',
    supplierId: '4',
    supplierName: 'Storage Solutions',
    productId: '9',
    productName: 'G.Skill Trident Z5 64GB DDR5',
    category: 'Memory',
    quantity: 15,
    unitPrice: 85000,
    totalAmount: 1275000,
    purchaseDate: '2026-01-06',
    paidAmount: 0,
    paymentStatus: 'unpaid',
    paymentPercentage: 0,
    payments: [],
    soldQuantity: 5,
    inStock: 10,
    notes: 'Payment due by Feb 1'
  },
  // Peripheral Hub purchases (Supplier 5 - Overdue)
  {
    id: 'sp-010',
    supplierId: '5',
    supplierName: 'Peripheral Hub',
    productId: '17',
    productName: 'Logitech G Pro X Superlight 2',
    category: 'Peripherals',
    quantity: 50,
    unitPrice: 45000,
    totalAmount: 2250000,
    purchaseDate: '2025-12-01',
    paidAmount: 2155000,
    paymentStatus: 'partial',
    paymentPercentage: 95.8,
    lastPaymentDate: '2026-01-02',
    payments: [
      { id: 'pay-014', purchaseId: 'sp-010', amount: 1125000, paymentDate: '2025-12-10', paymentMethod: 'bank' },
      { id: 'pay-015', purchaseId: 'sp-010', amount: 1030000, paymentDate: '2026-01-02', paymentMethod: 'bank' },
    ],
    soldQuantity: 15,
    inStock: 35,
  },
  {
    id: 'sp-011',
    supplierId: '5',
    supplierName: 'Peripheral Hub',
    productId: '13',
    productName: 'NZXT Kraken X73 RGB',
    category: 'Cooling',
    quantity: 20,
    unitPrice: 68000,
    totalAmount: 1360000,
    purchaseDate: '2026-01-05',
    paidAmount: 0,
    paymentStatus: 'unpaid',
    paymentPercentage: 0,
    payments: [],
    soldQuantity: 2,
    inStock: 18,
    notes: 'OVERDUE - Need to pay immediately'
  },
  // Monitor Masters purchases (Supplier 6)
  {
    id: 'sp-012',
    supplierId: '6',
    supplierName: 'Monitor Masters',
    productId: '16',
    productName: 'Samsung Odyssey G9 49" Monitor',
    category: 'Monitors',
    quantity: 5,
    unitPrice: 340000,
    totalAmount: 1700000,
    purchaseDate: '2026-01-08',
    paidAmount: 980000,
    paymentStatus: 'partial',
    paymentPercentage: 57.6,
    lastPaymentDate: '2026-01-12',
    payments: [
      { id: 'pay-016', purchaseId: 'sp-012', amount: 500000, paymentDate: '2026-01-10', paymentMethod: 'bank' },
      { id: 'pay-017', purchaseId: 'sp-012', amount: 480000, paymentDate: '2026-01-12', paymentMethod: 'cash' },
    ],
    soldQuantity: 2,
    inStock: 3,
  },
];

// Invoices
export const mockInvoices: Invoice[] = [
  {
    id: '10240001',
    customerId: '1',
    customerName: 'Kasun Perera',
    items: [
      { productId: '1', productName: 'AMD Ryzen 9 7950X', quantity: 1, unitPrice: 185000, total: 185000, warrantyDueDate: '2027-01-15' },
      { productId: '8', productName: 'Corsair Vengeance DDR5 32GB', quantity: 2, unitPrice: 48000, total: 96000 },
    ],
    subtotal: 281000,
    tax: 42150,
    total: 323150,
    status: 'fullpaid',
    paidAmount: 323150,
    date: '2024-01-15',
    dueDate: '2024-01-30',
    paymentMethod: 'card',
    salesChannel: 'on-site',
  },
  {
    id: '10240002',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    items: [
      { productId: '3', productName: 'NVIDIA GeForce RTX 4090', quantity: 2, unitPrice: 620000, total: 1240000, warrantyDueDate: '2027-01-18' },
      { productId: '10', productName: 'ASUS ROG Maximus Z790 Hero', quantity: 2, unitPrice: 185000, total: 370000, warrantyDueDate: '2027-01-18' },
      { productId: '12', productName: 'Corsair RM1000x 1000W PSU', quantity: 2, unitPrice: 55000, total: 110000, warrantyDueDate: '2034-01-18' },
    ],
    subtotal: 1720000,
    tax: 258000,
    total: 1978000,
    status: 'fullpaid',
    paidAmount: 1978000,
    date: '2024-01-18',
    dueDate: '2024-02-02',
    paymentMethod: 'bank_transfer',
    salesChannel: 'on-site',
  },
  {
    id: '10240003',
    customerId: '5',
    customerName: 'GameZone Café',
    items: [
      { productId: '4', productName: 'NVIDIA GeForce RTX 4070 Ti', quantity: 5, unitPrice: 280000, total: 1400000, warrantyDueDate: '2027-01-20' },
      { productId: '15', productName: 'LG UltraGear 27GP950-B 4K Monitor', quantity: 5, unitPrice: 195000, total: 975000, warrantyDueDate: '2027-01-20' },
    ],
    subtotal: 2375000,
    tax: 356250,
    total: 2731250,
    status: 'halfpay',
    paidAmount: 1500000,
    date: '2024-01-20',
    dueDate: '2024-02-04',
    paymentMethod: 'credit',
    salesChannel: 'online',
  },
  {
    id: '10240004',
    customerId: '2',
    customerName: 'Nimali Fernando',
    items: [
      { productId: '17', productName: 'Logitech G Pro X Superlight 2', quantity: 1, unitPrice: 52000, total: 52000, warrantyDueDate: '2026-01-10' },
      { productId: '18', productName: 'Razer Huntsman V3 Pro', quantity: 1, unitPrice: 68000, total: 68000, warrantyDueDate: '2026-01-10' },
    ],
    subtotal: 120000,
    tax: 18000,
    total: 138000,
    status: 'fullpaid',
    paidAmount: 138000,
    date: '2024-01-10',
    dueDate: '2024-01-25',
    paymentMethod: 'cash',
    salesChannel: 'on-site',
  },
  {
    id: '10240005',
    customerId: '7',
    customerName: 'Creative Studios',
    items: [
      { productId: '16', productName: 'Samsung Odyssey G9 49" Monitor', quantity: 2, unitPrice: 380000, total: 760000, warrantyDueDate: '2027-01-02' },
      { productId: '2', productName: 'Intel Core i9-14900K', quantity: 2, unitPrice: 195000, total: 390000, warrantyDueDate: '2027-01-02' },
    ],
    subtotal: 1150000,
    tax: 172500,
    total: 1322500,
    status: 'unpaid',
    paidAmount: 0,
    date: '2024-01-02',
    dueDate: '2024-01-17',
    paymentMethod: 'credit',
    salesChannel: 'on-site',
  },
  {
    id: '10240006',
    customerId: '4',
    customerName: 'Dilshan Silva',
    items: [
      { productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', quantity: 1, unitPrice: 75000, total: 75000, warrantyDueDate: '2029-01-05' },
      { productId: '13', productName: 'NZXT Kraken X73 RGB', quantity: 1, unitPrice: 75000, total: 75000, warrantyDueDate: '2030-01-05' },
    ],
    subtotal: 150000,
    tax: 22500,
    total: 172500,
    status: 'halfpay',
    paidAmount: 100000,
    date: '2024-01-05',
    dueDate: '2024-01-20',
    paymentMethod: 'cash',
    salesChannel: 'on-site',
  },
  // More invoices with warranty data for testing
  {
    id: '10250007',
    customerId: '1',
    customerName: 'Kasun Perera',
    items: [
      { productId: '19', productName: 'SteelSeries Arctis Nova Pro', quantity: 1, unitPrice: 95000, total: 95000, warrantyDueDate: '2026-01-20' },
    ],
    subtotal: 95000,
    tax: 14250,
    total: 109250,
    status: 'fullpaid',
    paidAmount: 109250,
    date: '2025-01-20',
    dueDate: '2025-02-04',
    paymentMethod: 'card',
    salesChannel: 'on-site',
  },
  {
    id: '10250008',
    customerId: '8',
    customerName: 'Sanjay Mendis',
    items: [
      { productId: '5', productName: 'AMD Radeon RX 7900 XTX', quantity: 1, unitPrice: 350000, total: 350000, warrantyDueDate: '2027-02-10' },
      { productId: '7', productName: 'WD Black SN850X 1TB', quantity: 2, unitPrice: 42000, total: 84000, warrantyDueDate: '2030-02-10' },
    ],
    subtotal: 434000,
    tax: 65100,
    total: 499100,
    status: 'fullpaid',
    paidAmount: 499100,
    date: '2025-02-10',
    dueDate: '2025-02-25',
    paymentMethod: 'bank_transfer',
    salesChannel: 'online',
  },
  {
    id: '10250009',
    customerId: '6',
    customerName: 'Priya Jayawardena',
    items: [
      { productId: '14', productName: 'Lian Li O11 Dynamic EVO', quantity: 1, unitPrice: 58000, total: 58000, warrantyDueDate: '2027-03-15' },
      { productId: '9', productName: 'G.Skill Trident Z5 64GB DDR5', quantity: 1, unitPrice: 95000, total: 95000 },
    ],
    subtotal: 153000,
    tax: 22950,
    total: 175950,
    status: 'fullpaid',
    paidAmount: 175950,
    date: '2025-03-15',
    dueDate: '2025-03-30',
    paymentMethod: 'cash',
    salesChannel: 'on-site',
  },
  {
    id: '10250010',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    items: [
      { productId: '11', productName: 'MSI MEG Z790 ACE', quantity: 3, unitPrice: 165000, total: 495000, warrantyDueDate: '2028-04-20' },
      { productId: '20', productName: 'Seagate Exos 18TB HDD', quantity: 5, unitPrice: 125000, total: 625000, warrantyDueDate: '2030-04-20' },
    ],
    subtotal: 1120000,
    tax: 168000,
    total: 1288000,
    status: 'halfpay',
    paidAmount: 800000,
    date: '2025-04-20',
    dueDate: '2025-05-05',
    paymentMethod: 'credit',
    salesChannel: 'on-site',
  },
  {
    id: '10250011',
    customerId: '5',
    customerName: 'GameZone Café',
    items: [
      { productId: '17', productName: 'Logitech G Pro X Superlight 2', quantity: 10, unitPrice: 52000, originalPrice: 55000, total: 520000, warrantyDueDate: '2027-05-10' },
      { productId: '18', productName: 'Razer Huntsman V3 Pro', quantity: 10, unitPrice: 65000, originalPrice: 68000, total: 650000, warrantyDueDate: '2027-05-10' },
    ],
    subtotal: 1170000,
    tax: 175500,
    total: 1345500,
    status: 'fullpaid',
    paidAmount: 1345500,
    date: '2025-05-10',
    dueDate: '2025-05-25',
    paymentMethod: 'bank_transfer',
    salesChannel: 'online',
  },
  {
    id: '10250012',
    customerId: '2',
    customerName: 'Nimali Fernando',
    items: [
      { productId: '8', productName: 'Corsair Vengeance DDR5 32GB', quantity: 2, unitPrice: 45000, originalPrice: 48000, total: 90000 },
    ],
    subtotal: 90000,
    tax: 13500,
    total: 103500,
    status: 'unpaid',
    paidAmount: 0,
    date: '2025-06-01',
    dueDate: '2025-06-16',
    paymentMethod: 'credit',
    salesChannel: 'on-site',
  },
];

// Sales History - tracks all product sales with discounts
export const mockSalesHistory: SaleRecord[] = [
  // AMD Ryzen 9 7950X sales (Product ID: 1) - Many sales for scrolling demo
  { id: 'SALE-001', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0001', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2024-01-15T10:30:00' },
  { id: 'SALE-002', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0007', quantity: 2, unitPrice: 185000, discount: 5, discountAmount: 18500, finalPrice: 175750, total: 351500, saleDate: '2024-01-22T14:15:00' },
  { id: 'SALE-003', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0010', quantity: 1, unitPrice: 185000, discount: 3, discountAmount: 5550, finalPrice: 179450, total: 179450, saleDate: '2025-12-28T09:45:00' },
  { id: 'SALE-026', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0019', quantity: 3, unitPrice: 185000, discount: 8, discountAmount: 44400, finalPrice: 170200, total: 510600, saleDate: '2024-02-10T11:20:00' },
  { id: 'SALE-027', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0020', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2024-03-05T14:00:00' },
  { id: 'SALE-028', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '2', customerName: 'Nimali Fernando', invoiceId: 'INV-2024-0021', quantity: 1, unitPrice: 185000, discount: 2, discountAmount: 3700, finalPrice: 181300, total: 181300, saleDate: '2024-04-12T16:30:00' },
  { id: 'SALE-029', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0022', quantity: 5, unitPrice: 185000, discount: 12, discountAmount: 111000, finalPrice: 162800, total: 814000, saleDate: '2024-05-20T10:15:00' },
  { id: 'SALE-030', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '6', customerName: 'Priya Jayawardena', invoiceId: 'INV-2024-0023', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2024-06-08T09:00:00' },
  { id: 'SALE-031', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0024', quantity: 2, unitPrice: 185000, discount: 5, discountAmount: 18500, finalPrice: 175750, total: 351500, saleDate: '2024-07-15T13:45:00' },
  { id: 'SALE-032', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0025', quantity: 2, unitPrice: 185000, discount: 6, discountAmount: 22200, finalPrice: 173900, total: 347800, saleDate: '2024-08-22T15:20:00' },
  { id: 'SALE-033', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0026', quantity: 1, unitPrice: 185000, discount: 3, discountAmount: 5550, finalPrice: 179450, total: 179450, saleDate: '2024-09-10T11:00:00' },
  { id: 'SALE-034', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0027', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2024-10-18T14:30:00' },
  { id: 'SALE-035', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0028', quantity: 4, unitPrice: 185000, discount: 10, discountAmount: 74000, finalPrice: 166500, total: 666000, saleDate: '2024-11-25T10:45:00' },
  { id: 'SALE-036', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0029', quantity: 2, unitPrice: 185000, discount: 7, discountAmount: 25900, finalPrice: 172050, total: 344100, saleDate: '2025-01-08T16:00:00' },
  { id: 'SALE-037', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0030', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2025-02-14T12:30:00' },
  
  // Intel Core i9-14900K sales
  { id: 'SALE-004', productId: '2', productName: 'Intel Core i9-14900K', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0005', quantity: 2, unitPrice: 195000, discount: 0, discountAmount: 0, finalPrice: 195000, total: 390000, saleDate: '2024-01-02T11:20:00' },
  { id: 'SALE-005', productId: '2', productName: 'Intel Core i9-14900K', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0008', quantity: 3, unitPrice: 195000, discount: 8, discountAmount: 46800, finalPrice: 179400, total: 538200, saleDate: '2025-11-15T16:00:00' },
  
  // NVIDIA GeForce RTX 4090 sales (Product ID: 3) - Many sales for scrolling demo
  { id: 'SALE-006', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0002', quantity: 2, unitPrice: 620000, discount: 0, discountAmount: 0, finalPrice: 620000, total: 1240000, saleDate: '2024-01-18T09:00:00' },
  { id: 'SALE-007', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0009', quantity: 1, unitPrice: 620000, discount: 10, discountAmount: 62000, finalPrice: 558000, total: 558000, saleDate: '2025-12-20T13:30:00' },
  { id: 'SALE-038', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0031', quantity: 2, unitPrice: 620000, discount: 5, discountAmount: 62000, finalPrice: 589000, total: 1178000, saleDate: '2024-02-28T10:00:00' },
  { id: 'SALE-039', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0032', quantity: 1, unitPrice: 620000, discount: 3, discountAmount: 18600, finalPrice: 601400, total: 601400, saleDate: '2024-03-15T14:45:00' },
  { id: 'SALE-040', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0033', quantity: 3, unitPrice: 620000, discount: 12, discountAmount: 223200, finalPrice: 545600, total: 1636800, saleDate: '2024-04-22T11:30:00' },
  { id: 'SALE-041', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0034', quantity: 4, unitPrice: 620000, discount: 15, discountAmount: 372000, finalPrice: 527000, total: 2108000, saleDate: '2024-05-10T16:15:00' },
  { id: 'SALE-042', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0035', quantity: 1, unitPrice: 620000, discount: 0, discountAmount: 0, finalPrice: 620000, total: 620000, saleDate: '2024-06-05T09:30:00' },
  { id: 'SALE-043', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0036', quantity: 1, unitPrice: 620000, discount: 5, discountAmount: 31000, finalPrice: 589000, total: 589000, saleDate: '2024-07-20T13:00:00' },
  { id: 'SALE-044', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0037', quantity: 2, unitPrice: 620000, discount: 8, discountAmount: 99200, finalPrice: 570400, total: 1140800, saleDate: '2024-08-12T15:45:00' },
  { id: 'SALE-045', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0038', quantity: 2, unitPrice: 620000, discount: 7, discountAmount: 86800, finalPrice: 576600, total: 1153200, saleDate: '2024-09-28T10:20:00' },
  { id: 'SALE-046', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0039', quantity: 1, unitPrice: 620000, discount: 0, discountAmount: 0, finalPrice: 620000, total: 620000, saleDate: '2024-10-15T14:10:00' },
  { id: 'SALE-047', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0040', quantity: 2, unitPrice: 620000, discount: 10, discountAmount: 124000, finalPrice: 558000, total: 1116000, saleDate: '2024-11-08T11:00:00' },
  
  // NVIDIA GeForce RTX 4070 Ti sales
  { id: 'SALE-008', productId: '4', productName: 'NVIDIA GeForce RTX 4070 Ti', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0003', quantity: 5, unitPrice: 280000, discount: 0, discountAmount: 0, finalPrice: 280000, total: 1400000, saleDate: '2024-01-20T15:45:00' },
  { id: 'SALE-009', productId: '4', productName: 'NVIDIA GeForce RTX 4070 Ti', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0011', quantity: 1, unitPrice: 280000, discount: 5, discountAmount: 14000, finalPrice: 266000, total: 266000, saleDate: '2025-12-05T10:20:00' },
  
  // Samsung 990 Pro 2TB sales (Product ID: 6) - Many sales for scrolling demo
  { id: 'SALE-010', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0006', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-01-05T12:00:00' },
  { id: 'SALE-011', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0012', quantity: 5, unitPrice: 75000, discount: 12, discountAmount: 45000, finalPrice: 66000, total: 330000, saleDate: '2025-11-28T14:30:00' },
  { id: 'SALE-012', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '2', customerName: 'Nimali Fernando', invoiceId: 'INV-2024-0013', quantity: 2, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 150000, saleDate: '2026-01-03T11:15:00' },
  { id: 'SALE-048', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0041', quantity: 2, unitPrice: 75000, discount: 5, discountAmount: 7500, finalPrice: 71250, total: 142500, saleDate: '2024-02-18T10:00:00' },
  { id: 'SALE-049', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0042', quantity: 4, unitPrice: 75000, discount: 8, discountAmount: 24000, finalPrice: 69000, total: 276000, saleDate: '2024-03-25T14:20:00' },
  { id: 'SALE-050', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0043', quantity: 10, unitPrice: 75000, discount: 15, discountAmount: 112500, finalPrice: 63750, total: 637500, saleDate: '2024-04-08T09:45:00' },
  { id: 'SALE-051', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0044', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-05-15T16:30:00' },
  { id: 'SALE-052', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0045', quantity: 8, unitPrice: 75000, discount: 10, discountAmount: 60000, finalPrice: 67500, total: 540000, saleDate: '2024-06-22T11:15:00' },
  { id: 'SALE-053', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '6', customerName: 'Priya Jayawardena', invoiceId: 'INV-2024-0046', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-07-10T13:00:00' },
  { id: 'SALE-054', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0047', quantity: 6, unitPrice: 75000, discount: 7, discountAmount: 31500, finalPrice: 69750, total: 418500, saleDate: '2024-08-28T15:45:00' },
  { id: 'SALE-055', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0048', quantity: 3, unitPrice: 75000, discount: 5, discountAmount: 11250, finalPrice: 71250, total: 213750, saleDate: '2024-09-12T10:30:00' },
  { id: 'SALE-056', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0049', quantity: 2, unitPrice: 75000, discount: 3, discountAmount: 4500, finalPrice: 72750, total: 145500, saleDate: '2024-10-20T14:15:00' },
  { id: 'SALE-057', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0050', quantity: 5, unitPrice: 75000, discount: 8, discountAmount: 30000, finalPrice: 69000, total: 345000, saleDate: '2024-11-05T09:00:00' },
  { id: 'SALE-058', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0051', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-12-18T16:00:00' },
  { id: 'SALE-059', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0052', quantity: 4, unitPrice: 75000, discount: 6, discountAmount: 18000, finalPrice: 70500, total: 282000, saleDate: '2025-01-10T11:30:00' },
  
  // Corsair Vengeance DDR5 sales
  { id: 'SALE-013', productId: '8', productName: 'Corsair Vengeance DDR5 32GB (2x16GB)', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0001', quantity: 2, unitPrice: 48000, discount: 0, discountAmount: 0, finalPrice: 48000, total: 96000, saleDate: '2024-01-15T10:30:00' },
  { id: 'SALE-014', productId: '8', productName: 'Corsair Vengeance DDR5 32GB (2x16GB)', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0014', quantity: 4, unitPrice: 48000, discount: 7, discountAmount: 13440, finalPrice: 44640, total: 178560, saleDate: '2025-12-10T09:00:00' },
  
  // ASUS ROG Maximus Z790 Hero sales
  { id: 'SALE-015', productId: '10', productName: 'ASUS ROG Maximus Z790 Hero', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0002', quantity: 2, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 370000, saleDate: '2024-01-18T09:00:00' },
  
  // Corsair RM1000x PSU sales
  { id: 'SALE-016', productId: '12', productName: 'Corsair RM1000x 1000W PSU', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0002', quantity: 2, unitPrice: 55000, discount: 0, discountAmount: 0, finalPrice: 55000, total: 110000, saleDate: '2024-01-18T09:00:00' },
  { id: 'SALE-017', productId: '12', productName: 'Corsair RM1000x 1000W PSU', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0015', quantity: 3, unitPrice: 55000, discount: 5, discountAmount: 8250, finalPrice: 52250, total: 156750, saleDate: '2026-01-05T16:45:00' },
  
  // NZXT Kraken X73 RGB sales
  { id: 'SALE-018', productId: '13', productName: 'NZXT Kraken X73 RGB', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0006', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-01-05T12:00:00' },
  
  // LG UltraGear Monitor sales
  { id: 'SALE-019', productId: '15', productName: 'LG UltraGear 27GP950-B 4K Monitor', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0003', quantity: 5, unitPrice: 195000, discount: 0, discountAmount: 0, finalPrice: 195000, total: 975000, saleDate: '2024-01-20T15:45:00' },
  { id: 'SALE-020', productId: '15', productName: 'LG UltraGear 27GP950-B 4K Monitor', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0016', quantity: 2, unitPrice: 195000, discount: 10, discountAmount: 39000, finalPrice: 175500, total: 351000, saleDate: '2026-01-08T10:30:00' },
  
  // Samsung Odyssey G9 Monitor sales
  { id: 'SALE-021', productId: '16', productName: 'Samsung Odyssey G9 49" Monitor', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0005', quantity: 2, unitPrice: 380000, discount: 0, discountAmount: 0, finalPrice: 380000, total: 760000, saleDate: '2024-01-02T11:20:00' },
  
  // Logitech Mouse sales (Product ID: 17) - Many sales for scrolling demo
  { id: 'SALE-022', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '2', customerName: 'Nimali Fernando', invoiceId: 'INV-2024-0004', quantity: 1, unitPrice: 52000, discount: 0, discountAmount: 0, finalPrice: 52000, total: 52000, saleDate: '2024-01-10T13:00:00' },
  { id: 'SALE-023', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0017', quantity: 10, unitPrice: 52000, discount: 15, discountAmount: 78000, finalPrice: 44200, total: 442000, saleDate: '2025-12-15T14:00:00' },
  { id: 'SALE-060', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0053', quantity: 1, unitPrice: 52000, discount: 0, discountAmount: 0, finalPrice: 52000, total: 52000, saleDate: '2024-02-05T10:30:00' },
  { id: 'SALE-061', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0054', quantity: 3, unitPrice: 52000, discount: 5, discountAmount: 7800, finalPrice: 49400, total: 148200, saleDate: '2024-03-12T15:15:00' },
  { id: 'SALE-062', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0055', quantity: 8, unitPrice: 52000, discount: 10, discountAmount: 41600, finalPrice: 46800, total: 374400, saleDate: '2024-04-20T11:00:00' },
  { id: 'SALE-063', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0056', quantity: 5, unitPrice: 52000, discount: 8, discountAmount: 20800, finalPrice: 47840, total: 239200, saleDate: '2024-05-28T14:45:00' },
  { id: 'SALE-064', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0057', quantity: 1, unitPrice: 52000, discount: 0, discountAmount: 0, finalPrice: 52000, total: 52000, saleDate: '2024-06-15T09:20:00' },
  { id: 'SALE-065', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '6', customerName: 'Priya Jayawardena', invoiceId: 'INV-2024-0058', quantity: 1, unitPrice: 52000, discount: 3, discountAmount: 1560, finalPrice: 50440, total: 50440, saleDate: '2024-07-22T16:30:00' },
  { id: 'SALE-066', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0059', quantity: 6, unitPrice: 52000, discount: 12, discountAmount: 37440, finalPrice: 45760, total: 274560, saleDate: '2024-08-10T12:00:00' },
  { id: 'SALE-067', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0060', quantity: 2, unitPrice: 52000, discount: 5, discountAmount: 5200, finalPrice: 49400, total: 98800, saleDate: '2024-09-18T10:45:00' },
  { id: 'SALE-068', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0061', quantity: 4, unitPrice: 52000, discount: 7, discountAmount: 14560, finalPrice: 48360, total: 193440, saleDate: '2024-10-25T15:30:00' },
  { id: 'SALE-069', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0062', quantity: 1, unitPrice: 52000, discount: 0, discountAmount: 0, finalPrice: 52000, total: 52000, saleDate: '2024-11-12T13:15:00' },
  { id: 'SALE-070', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0063', quantity: 10, unitPrice: 52000, discount: 15, discountAmount: 78000, finalPrice: 44200, total: 442000, saleDate: '2024-12-05T11:00:00' },
  
  // Razer Keyboard sales
  { id: 'SALE-024', productId: '18', productName: 'Razer Huntsman V3 Pro', customerId: '2', customerName: 'Nimali Fernando', invoiceId: 'INV-2024-0004', quantity: 1, unitPrice: 68000, discount: 0, discountAmount: 0, finalPrice: 68000, total: 68000, saleDate: '2024-01-10T13:00:00' },
  { id: 'SALE-025', productId: '18', productName: 'Razer Huntsman V3 Pro', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0018', quantity: 5, unitPrice: 68000, discount: 10, discountAmount: 34000, finalPrice: 61200, total: 306000, saleDate: '2026-01-02T11:30:00' },
];

// Categories for Computer Shop
export const productCategories = [
  'Processors',
  'Graphics Cards',
  'Motherboards',
  'Memory',
  'Storage',
  'Power Supply',
  'Cooling',
  'Cases',
  'Monitors',
  'Peripherals',
];

// Brands
export const productBrands = [
  'AMD',
  'Intel',
  'NVIDIA',
  'ASUS',
  'MSI',
  'Corsair',
  'G.Skill',
  'Samsung',
  'Western Digital',
  'Seagate',
  'NZXT',
  'Lian Li',
  'LG',
  'Logitech',
  'Razer',
  'SteelSeries',
];

// Brand logos (Updated with working URLs)
export const brandLogos: Record<string, string> = {
  'Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/120px-Apple_logo_black.svg.png',
  'Samsung': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/200px-Samsung_Logo.svg.png',
  'HP': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/150px-HP_logo_2012.svg.png',
  'Dell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/150px-Dell_Logo.svg.png',
  'Lenovo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/200px-Lenovo_logo_2015.svg.png',
  'ASUS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Asus_logo.svg/200px-Asus_logo.svg.png',
  'Acer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/200px-Acer_2011.svg.png',
  'MSI': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/MSI_Logo.svg/200px-MSI_Logo.svg.png',
  'LG': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/LG_symbol.svg/150px-LG_symbol.svg.png',
  'Sony': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/200px-Sony_logo.svg.png',
  'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png',
  'Google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png',
  'Intel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/200px-Intel_logo_%282006-2020%29.svg.png',
  'AMD': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/200px-AMD_Logo.svg.png',
  'NVIDIA': 'https://upload.wikimedia.org/wikipedia/sco/thumb/2/21/Nvidia_logo.svg/200px-Nvidia_logo.svg.png',
  'Corsair': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Corsair_logo_horizontal.svg/200px-Corsair_logo_horizontal.svg.png',
  'Logitech': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Logitech_logo.svg/200px-Logitech_logo.svg.png',
  'Razer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Razer_wordmark.svg/200px-Razer_wordmark.svg.png',
  'Kingston': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kingston_Technology_logo.svg/200px-Kingston_Technology_logo.svg.png',
  'SanDisk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/SanDisk_Logo_2007.svg/200px-SanDisk_Logo_2007.svg.png',
  'Western Digital': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Western_Digital_logo.svg/200px-Western_Digital_logo.svg.png',
  'Seagate': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Seagate_Technology_logo.svg/200px-Seagate_Technology_logo.svg.png',
  'Crucial': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Crucial_logo.svg/200px-Crucial_logo.svg.png',
  'TP-Link': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/TP-Link_logo_2.svg/200px-TP-Link_logo_2.svg.png',
  'Netgear': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/NETGEAR_Logo.svg/200px-NETGEAR_Logo.svg.png',
  'D-Link': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/D-Link_logo.svg/200px-D-Link_logo.svg.png',
  'Canon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Canon_wordmark.svg/200px-Canon_wordmark.svg.png',
  'Epson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Epson_logo.svg/200px-Epson_logo.svg.png',
  'Brother': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Brother_logo.svg/200px-Brother_logo.svg.png',
  'Xiaomi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Xiaomi_logo.svg/200px-Xiaomi_logo.svg.png',
  'Huawei': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Huawei_Logo.svg/200px-Huawei_Logo.svg.png',
  'OnePlus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/OnePlus_logo.svg/200px-OnePlus_logo.svg.png',
  'Realme': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Realme_logo.svg/200px-Realme_logo.svg.png',
  'OPPO': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/OPPO_LOGO_2019.svg/200px-OPPO_LOGO_2019.svg.png',
  'Vivo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Vivo_logo_2019.svg/200px-Vivo_logo_2019.svg.png',
  'Gigabyte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Gigabyte_Technology_logo_20080107.svg/200px-Gigabyte_Technology_logo_20080107.svg.png',
  'Cooler Master': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cooler_Master_Logo_Black.svg/200px-Cooler_Master_Logo_Black.svg.png',
  'NZXT': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/NZXT_logo.svg/200px-NZXT_logo.svg.png',
  'Thermaltake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Thermaltake_logo.svg/200px-Thermaltake_logo.svg.png',
  'EVGA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/EVGA_logo.svg/200px-EVGA_logo.svg.png',
  'Zotac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Zotac_logo.svg/200px-Zotac_logo.svg.png',
  'BenQ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/BenQ_Logo.svg/200px-BenQ_Logo.svg.png',
  'AOC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/AOC_International_logo.svg/200px-AOC_International_logo.svg.png',
  'ViewSonic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/ViewSonic-Logo.svg/200px-ViewSonic-Logo.svg.png',
  'G.Skill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/G.SKILL_logo.svg/200px-G.SKILL_logo.svg.png',
  'SteelSeries': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/SteelSeries_Logo.svg/200px-SteelSeries_Logo.svg.png',
  'Lian Li': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Lian_Li_logo.svg/200px-Lian_Li_logo.svg.png',
};

// Category images (Unsplash)
export const categoryImages: Record<string, string> = {
  'Processors': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
  'Graphics Cards': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80',
  'Motherboards': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
  'Memory': 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80',
  'Power Supply': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
  'Cooling': 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80',
  'Cases': 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=500&q=80',
  'Monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80',
  'Peripherals': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80',
  'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
  'Desktops': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=500&q=80',
  'Keyboards': 'https://images.unsplash.com/photo-1587829741301-3e4b75eb6274?auto=format&fit=crop&w=500&q=80',
  'Mice': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80',
  'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
  'Speakers': 'https://images.unsplash.com/photo-1545459720-aac3e5ca9678?auto=format&fit=crop&w=500&q=80',
  'Networking': 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&w=500&q=80',
  'Printers': 'https://images.unsplash.com/photo-1612815154858-60aa4c469a63?auto=format&fit=crop&w=500&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1629810775960-9dc3845bba54?auto=format&fit=crop&w=500&q=80',
  'Software': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=500&q=80',
  'Phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
  'Gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80',
};

// Generate 8-digit claim number
export const generateClaimNumber = (): string => {
  return Date.now().toString().slice(-8);
};

// Warranty Claims - tracks all warranty issues and replacements
export const mockWarrantyClaims: WarrantyClaim[] = [
  {
    id: '25010001',
    invoiceId: '10240001',
    invoiceItemIndex: 0,
    productId: '1',
    productName: 'AMD Ryzen 9 7950X',
    productSerialNumber: '70451234',
    customerId: '1',
    customerName: 'Kasun Perera',
    customerPhone: '078-3233760',
    claimDate: '2025-06-15T10:30:00',
    warrantyExpiryDate: '2027-01-15',
    status: 'replaced',
    issueDescription: 'Processor not booting, multiple diagnostic tests failed. System shows no POST with this CPU.',
    issueCategory: 'defective',
    resolution: 'One-to-one replacement provided. Original unit sent to AMD for RMA.',
    resolutionDate: '2025-06-18T14:45:00',
    isReplacement: true,
    replacementProductId: '1',
    replacementProductName: 'AMD Ryzen 9 7950X',
    replacementSerialNumber: '70981234',
    replacementDate: '2025-06-18T14:45:00',
    notes: 'Customer brought the original box and all accessories. Quick replacement processed.',
    handledBy: 'Nuwan Silva',
  },
  {
    id: '25010002',
    invoiceId: '10240002',
    invoiceItemIndex: 0,
    productId: '3',
    productName: 'NVIDIA GeForce RTX 4090',
    productSerialNumber: '70453456',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    customerPhone: '078-3233760',
    claimDate: '2025-05-20T09:15:00',
    warrantyExpiryDate: '2027-01-18',
    status: 'under-review',
    issueDescription: 'Artifacting on screen during heavy GPU load. Thermal throttling observed even with adequate cooling.',
    issueCategory: 'performance',
    isReplacement: false,
    notes: 'Sent to NVIDIA service center for evaluation. Awaiting diagnostic report.',
    handledBy: 'Chamara Fernando',
  },
  {
    id: '25010003',
    invoiceId: '10240003',
    invoiceItemIndex: 1,
    productId: '15',
    productName: 'LG UltraGear 27GP950-B 4K Monitor',
    customerId: '5',
    customerName: 'GameZone Café',
    customerPhone: '078-3233760',
    claimDate: '2025-04-10T11:00:00',
    warrantyExpiryDate: '2027-01-20',
    status: 'approved',
    issueDescription: 'Dead pixels appeared in the center of screen. Count exceeds acceptable limit per LG policy.',
    issueCategory: 'defective',
    resolution: 'Approved for replacement. Waiting for replacement unit from LG.',
    resolutionDate: '2025-04-12T16:30:00',
    isReplacement: false,
    handledBy: 'Nuwan Silva',
  },
  {
    id: '25010004',
    invoiceId: '10240004',
    invoiceItemIndex: 0,
    productId: '17',
    productName: 'Logitech G Pro X Superlight 2',
    customerId: '2',
    customerName: 'Nimali Fernando',
    customerPhone: '078-3233760',
    claimDate: '2025-07-05T14:20:00',
    warrantyExpiryDate: '2026-01-10',
    status: 'rejected',
    issueDescription: 'Mouse scroll wheel not working properly after 6 months of use.',
    issueCategory: 'not-working',
    resolution: 'Claim rejected - Physical damage found on scroll wheel mechanism consistent with liquid damage.',
    resolutionDate: '2025-07-08T10:00:00',
    isReplacement: false,
    notes: 'Customer admitted to accidental coffee spill. Offered repair at discounted rate.',
    handledBy: 'Chamara Fernando',
  },
  {
    id: '25010005',
    invoiceId: '10250008',
    invoiceItemIndex: 0,
    productId: '5',
    productName: 'AMD Radeon RX 7900 XTX',
    productSerialNumber: '70455678',
    customerId: '8',
    customerName: 'Sanjay Mendis',
    customerPhone: '078-3233760',
    claimDate: '2025-08-01T16:45:00',
    warrantyExpiryDate: '2027-02-10',
    status: 'repaired',
    issueDescription: 'Fan noise excessive, one fan not spinning at correct RPM.',
    issueCategory: 'damaged',
    resolution: 'Fan assembly replaced. Card tested and returned to customer.',
    resolutionDate: '2025-08-05T11:30:00',
    isReplacement: false,
    notes: 'Repair completed in-house. New fan assembly sourced from AMD.',
    handledBy: 'Nuwan Silva',
  },
  {
    id: '25010006',
    invoiceId: '10240006',
    invoiceItemIndex: 0,
    productId: '6',
    productName: 'Samsung 990 Pro 2TB NVMe SSD',
    productSerialNumber: '70456789',
    customerId: '4',
    customerName: 'Dilshan Silva',
    customerPhone: '078-3233760',
    claimDate: '2025-09-10T09:00:00',
    warrantyExpiryDate: '2029-01-05',
    status: 'pending',
    issueDescription: 'SSD showing SMART errors, health at 85% after only 8 months of normal use.',
    issueCategory: 'performance',
    isReplacement: false,
    notes: 'Waiting for customer to bring the drive for diagnostic.',
    handledBy: 'Chamara Fernando',
  },
  {
    id: '25010007',
    invoiceId: '10240002',
    invoiceItemIndex: 2,
    productId: '12',
    productName: 'Corsair RM1000x 1000W PSU',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    customerPhone: '078-3233760',
    claimDate: '2025-03-25T13:15:00',
    warrantyExpiryDate: '2034-01-18',
    status: 'replaced',
    issueDescription: 'PSU making clicking noise and occasionally shuts down under load.',
    issueCategory: 'defective',
    resolution: 'Immediate replacement provided due to safety concerns. Defective unit returned to Corsair.',
    resolutionDate: '2025-03-25T15:00:00',
    isReplacement: true,
    replacementProductId: '12',
    replacementProductName: 'Corsair RM1000x 1000W PSU',
    replacementSerialNumber: '70995678',
    replacementDate: '2025-03-25T15:00:00',
    notes: 'Same-day replacement due to potential fire hazard.',
    handledBy: 'Nuwan Silva',
  },
  {
    id: '25010008',
    invoiceId: '10250011',
    invoiceItemIndex: 1,
    productId: '18',
    productName: 'Razer Huntsman V3 Pro',
    customerId: '5',
    customerName: 'GameZone Café',
    customerPhone: '078-3233760',
    claimDate: '2025-10-15T10:30:00',
    warrantyExpiryDate: '2027-05-10',
    status: 'pending',
    issueDescription: 'Multiple keys (W, A, S) not registering consistently during gameplay.',
    issueCategory: 'not-working',
    isReplacement: false,
    notes: 'Customer uses keyboard in gaming café environment. Heavy daily usage.',
  },
  {
    id: '25010009',
    invoiceId: '10240001',
    invoiceItemIndex: 1,
    productId: '8',
    productName: 'Corsair Vengeance DDR5 32GB (2x16GB)',
    customerId: '1',
    customerName: 'Kasun Perera',
    customerPhone: '078-3233760',
    claimDate: '2025-11-20T14:00:00',
    warrantyExpiryDate: '2099-12-31', // Lifetime warranty
    status: 'replaced',
    issueDescription: 'One memory stick causing random BSODs and memtest86 errors.',
    issueCategory: 'defective',
    resolution: 'Full kit replaced under lifetime warranty.',
    resolutionDate: '2025-11-22T11:00:00',
    isReplacement: true,
    replacementProductId: '8',
    replacementProductName: 'Corsair Vengeance DDR5 32GB (2x16GB)',
    replacementSerialNumber: '70998765',
    replacementDate: '2025-11-22T11:00:00',
    notes: 'Lifetime warranty - no questions asked replacement.',
    handledBy: 'Chamara Fernando',
  },
  {
    id: '25010010',
    invoiceId: '10250007',
    invoiceItemIndex: 0,
    productId: '19',
    productName: 'SteelSeries Arctis Nova Pro',
    customerId: '1',
    customerName: 'Kasun Perera',
    customerPhone: '078-3233760',
    claimDate: '2025-12-01T09:45:00',
    warrantyExpiryDate: '2026-01-20',
    status: 'under-review',
    issueDescription: 'Left ear cup audio cutting out intermittently. Cable connection seems loose.',
    issueCategory: 'not-working',
    isReplacement: false,
    notes: 'Warranty expiring soon. Prioritized for quick evaluation.',
    handledBy: 'Nuwan Silva',
  },
];
