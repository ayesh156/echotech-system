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
  // Pricing - Enhanced for GRN integration
  price: number; // Current selling price (for backward compatibility)
  sellingPrice?: number; // Current selling price (optional, defaults to price)
  costPrice?: number; // Current cost/purchase price from latest GRN
  lastCostPrice?: number; // Previous cost price for comparison
  profitMargin?: number; // Calculated profit margin percentage
  // Stock management
  stock: number;
  reservedStock?: number; // Stock reserved for pending orders
  availableStock?: number; // stock - reservedStock
  // Identifiers
  serialNumber: string;
  barcode?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  image?: string; // Base64 or URL of product image
  warranty?: string; // Warranty period (e.g., "6 months", "1 year")
  lowStockThreshold?: number; // Custom low stock threshold (default: 10)
  // Stock & Price History
  stockMovements?: StockMovement[];
  priceHistory?: PriceHistory[];
  // GRN & Invoice References
  lastGRNId?: string; // Last GRN that updated this product
  lastGRNDate?: string;
  totalPurchased?: number; // Total quantity ever purchased via GRN
  totalSold?: number; // Total quantity sold via invoices
}

// Stock Movement - Track all stock in/out movements
export interface StockMovement {
  id: string;
  productId: string;
  type: 'grn_in' | 'invoice_out' | 'adjustment' | 'return' | 'damaged';
  quantity: number; // Positive for in, negative for out
  previousStock: number;
  newStock: number;
  referenceId?: string; // GRN ID or Invoice ID
  referenceNumber?: string; // GRN-2026-0001 or INV-2026-0001
  unitPrice?: number; // Price at the time of movement
  notes?: string;
  createdAt: string;
  createdBy?: string;
}

// Price History - Track all price changes
export interface PriceHistory {
  id: string;
  productId: string;
  changeType: 'cost_update' | 'selling_update' | 'both';
  previousCostPrice?: number;
  newCostPrice?: number;
  previousSellingPrice?: number;
  newSellingPrice?: number;
  reason?: string; // 'grn_purchase' | 'manual_adjustment' | 'promotion'
  referenceId?: string; // GRN ID if from GRN
  createdAt: string;
  createdBy?: string;
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
  // Credit-Invoice linking
  creditInvoices?: string[]; // IDs of invoices contributing to credit balance
}

// Customer Payment History
export interface CustomerPayment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string; // ISO date with time
  paymentMethod: 'cash' | 'bank' | 'card' | 'cheque';
  notes?: string;
  // Source tracking for bi-directional sync
  source: 'invoice' | 'customer'; // Where payment was initiated
  appliedToInvoices?: { invoiceId: string; amount: number }[]; // How payment was distributed
}

// Credit Payment Transaction - For tracking credit settlements between invoice and customer
export interface CreditTransaction {
  id: string;
  customerId: string;
  invoiceId?: string; // Optional: direct invoice payment
  type: 'invoice_payment' | 'customer_payment' | 'warranty_credit' | 'adjustment';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  transactionDate: string;
  paymentMethod: 'cash' | 'bank' | 'card' | 'cheque';
  notes?: string;
  recordedBy?: string;
}

// Warranty Credit - When warranty replacement reduces customer debt
export interface WarrantyCredit {
  id: string;
  warrantyClaimId: string;
  customerId: string;
  invoiceId: string;
  originalAmount: number;
  creditAmount: number; // Amount credited back to customer
  reason: 'full_refund' | 'partial_refund' | 'replacement_discount' | 'repair_credit';
  processedDate: string;
  notes?: string;
}

// ==========================================
// SERVICES SYSTEM - Computer Shop Services
// ==========================================

// Service Status Types
export type ServiceStatus = 'active' | 'inactive' | 'discontinued';

// Service Category Types for Sri Lankan Computer Shops
export type ServiceCategory = 
  | 'repair' 
  | 'maintenance' 
  | 'installation' 
  | 'upgrade' 
  | 'data_recovery' 
  | 'networking' 
  | 'software' 
  | 'consultation' 
  | 'cleaning' 
  | 'other';

// Service Interface
export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  // Pricing
  basePrice: number; // Base service charge
  minPrice?: number; // Minimum price (for variable pricing)
  maxPrice?: number; // Maximum price (for variable pricing)
  priceType: 'fixed' | 'variable' | 'hourly' | 'quote'; // Pricing model
  hourlyRate?: number; // For hourly services
  // Timing
  estimatedDuration: string; // e.g., "1-2 hours", "2-3 days"
  turnaroundTime?: string; // Expected completion time
  // Status & Availability
  status: ServiceStatus;
  isPopular: boolean; // Mark as popular/featured service
  // Additional Info
  warranty?: string; // Service warranty if any
  requirements?: string; // What customer needs to bring/provide
  notes?: string; // Internal notes
  // Tracking
  totalCompleted: number; // Total times service was provided
  totalRevenue: number; // Total revenue from this service
  lastPerformed?: string; // Last date service was performed
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  image?: string; // Service icon/image
}

// Service Categories Configuration
export const serviceCategories: { value: ServiceCategory; label: string; icon: string; description: string }[] = [
  { value: 'repair', label: 'Repair Services', icon: '🔧', description: 'Hardware and software repairs' },
  { value: 'maintenance', label: 'Maintenance', icon: '🛠️', description: 'Regular system maintenance' },
  { value: 'installation', label: 'Installation', icon: '💻', description: 'Software and hardware installation' },
  { value: 'upgrade', label: 'Upgrades', icon: '⬆️', description: 'System and component upgrades' },
  { value: 'data_recovery', label: 'Data Recovery', icon: '💾', description: 'Lost data recovery services' },
  { value: 'networking', label: 'Networking', icon: '🌐', description: 'Network setup and configuration' },
  { value: 'software', label: 'Software Services', icon: '📀', description: 'OS installation, virus removal' },
  { value: 'consultation', label: 'Consultation', icon: '💡', description: 'Technical advice and planning' },
  { value: 'cleaning', label: 'Cleaning', icon: '✨', description: 'Hardware cleaning services' },
  { value: 'other', label: 'Other Services', icon: '📦', description: 'Miscellaneous services' },
];

// Mock Services Data for Sri Lankan Computer Shop
export const mockServices: Service[] = [
  // REPAIR SERVICES
  {
    id: 'srv-001',
    name: 'Laptop Screen Replacement',
    category: 'repair',
    description: 'Professional laptop screen replacement for all brands. Includes screen + labor.',
    basePrice: 15000,
    minPrice: 12000,
    maxPrice: 45000,
    priceType: 'variable',
    estimatedDuration: '1-2 days',
    turnaroundTime: '24-48 hours',
    status: 'active',
    isPopular: true,
    warranty: '3 months',
    requirements: 'Bring laptop with power adapter',
    totalCompleted: 156,
    totalRevenue: 2340000,
    lastPerformed: '2026-01-13',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-002',
    name: 'Desktop PC Repair',
    category: 'repair',
    description: 'Comprehensive desktop computer diagnostics and repair. Hardware and software issues.',
    basePrice: 2500,
    minPrice: 1500,
    maxPrice: 15000,
    priceType: 'variable',
    estimatedDuration: '1-3 days',
    turnaroundTime: '48-72 hours',
    status: 'active',
    isPopular: true,
    warranty: '1 month',
    requirements: 'Bring CPU unit only (no monitor/peripherals unless needed)',
    totalCompleted: 423,
    totalRevenue: 1057500,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-003',
    name: 'Keyboard Replacement (Laptop)',
    category: 'repair',
    description: 'Laptop keyboard replacement service. Compatible keyboards sourced for all models.',
    basePrice: 8000,
    minPrice: 5000,
    maxPrice: 20000,
    priceType: 'variable',
    estimatedDuration: '2-4 hours',
    turnaroundTime: '24 hours',
    status: 'active',
    isPopular: false,
    warranty: '3 months',
    totalCompleted: 89,
    totalRevenue: 712000,
    lastPerformed: '2026-01-12',
    createdAt: '2025-02-15T00:00:00Z',
  },
  {
    id: 'srv-004',
    name: 'Power Jack Repair',
    category: 'repair',
    description: 'Laptop charging port / DC jack repair and replacement.',
    basePrice: 3500,
    minPrice: 2500,
    maxPrice: 6000,
    priceType: 'variable',
    estimatedDuration: '2-4 hours',
    turnaroundTime: '24 hours',
    status: 'active',
    isPopular: true,
    warranty: '3 months',
    requirements: 'Bring laptop with original charger',
    totalCompleted: 201,
    totalRevenue: 703500,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-005',
    name: 'Motherboard Repair',
    category: 'repair',
    description: 'Advanced motherboard repair for laptops and desktops. Chip-level repairs available.',
    basePrice: 5000,
    minPrice: 3000,
    maxPrice: 25000,
    priceType: 'variable',
    estimatedDuration: '3-7 days',
    turnaroundTime: '5-7 business days',
    status: 'active',
    isPopular: false,
    warranty: '1 month',
    notes: 'Complex repairs may require additional time',
    totalCompleted: 67,
    totalRevenue: 335000,
    lastPerformed: '2026-01-10',
    createdAt: '2025-01-01T00:00:00Z',
  },

  // MAINTENANCE SERVICES
  {
    id: 'srv-006',
    name: 'Full System Service',
    category: 'maintenance',
    description: 'Complete PC/Laptop servicing: cleaning, thermal paste, OS optimization, virus scan.',
    basePrice: 2000,
    priceType: 'fixed',
    estimatedDuration: '2-4 hours',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: true,
    warranty: '1 week service warranty',
    requirements: 'Bring device with charger',
    totalCompleted: 892,
    totalRevenue: 1784000,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-007',
    name: 'Thermal Paste Replacement',
    category: 'maintenance',
    description: 'CPU/GPU thermal paste replacement to fix overheating issues.',
    basePrice: 1500,
    priceType: 'fixed',
    estimatedDuration: '1-2 hours',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: true,
    warranty: '6 months',
    totalCompleted: 345,
    totalRevenue: 517500,
    lastPerformed: '2026-01-13',
    createdAt: '2025-01-01T00:00:00Z',
  },

  // INSTALLATION SERVICES
  {
    id: 'srv-008',
    name: 'Windows Installation',
    category: 'software',
    description: 'Fresh Windows 10/11 installation with drivers and basic software setup.',
    basePrice: 1500,
    priceType: 'fixed',
    estimatedDuration: '2-3 hours',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: true,
    warranty: '1 week',
    notes: 'Customer provides license or we can arrange',
    totalCompleted: 567,
    totalRevenue: 850500,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-009',
    name: 'SSD/HDD Installation',
    category: 'installation',
    description: 'Hard drive or SSD installation with data migration and OS setup.',
    basePrice: 1000,
    priceType: 'fixed',
    estimatedDuration: '2-4 hours',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: true,
    warranty: 'Hardware warranty applicable',
    requirements: 'Purchase drive from us or bring your own',
    totalCompleted: 234,
    totalRevenue: 234000,
    lastPerformed: '2026-01-13',
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'srv-010',
    name: 'RAM Upgrade Installation',
    category: 'upgrade',
    description: 'RAM module installation and compatibility check.',
    basePrice: 500,
    priceType: 'fixed',
    estimatedDuration: '30 mins',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: false,
    totalCompleted: 456,
    totalRevenue: 228000,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },

  // DATA RECOVERY SERVICES
  {
    id: 'srv-011',
    name: 'Data Recovery - Basic',
    category: 'data_recovery',
    description: 'Data recovery from accessible drives with logical issues.',
    basePrice: 3000,
    minPrice: 2000,
    maxPrice: 5000,
    priceType: 'variable',
    estimatedDuration: '1-2 days',
    turnaroundTime: '24-48 hours',
    status: 'active',
    isPopular: true,
    notes: 'No charge if recovery unsuccessful',
    totalCompleted: 123,
    totalRevenue: 369000,
    lastPerformed: '2026-01-12',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-012',
    name: 'Data Recovery - Advanced',
    category: 'data_recovery',
    description: 'Advanced data recovery from damaged/clicking drives. Clean room service available.',
    basePrice: 15000,
    minPrice: 10000,
    maxPrice: 50000,
    priceType: 'quote',
    estimatedDuration: '5-14 days',
    turnaroundTime: '1-2 weeks',
    status: 'active',
    isPopular: false,
    notes: 'Diagnosis fee applies, waived if recovery successful',
    totalCompleted: 34,
    totalRevenue: 510000,
    lastPerformed: '2026-01-08',
    createdAt: '2025-01-01T00:00:00Z',
  },

  // NETWORKING SERVICES
  {
    id: 'srv-013',
    name: 'Home WiFi Setup',
    category: 'networking',
    description: 'Home WiFi router setup, configuration, and security optimization.',
    basePrice: 1500,
    priceType: 'fixed',
    estimatedDuration: '1-2 hours',
    turnaroundTime: 'Same day (on-site)',
    status: 'active',
    isPopular: true,
    warranty: '1 month support',
    totalCompleted: 178,
    totalRevenue: 267000,
    lastPerformed: '2026-01-11',
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'srv-014',
    name: 'Office Network Setup',
    category: 'networking',
    description: 'Complete office network infrastructure setup with cabling.',
    basePrice: 25000,
    minPrice: 15000,
    maxPrice: 100000,
    priceType: 'quote',
    hourlyRate: 2500,
    estimatedDuration: '1-5 days',
    turnaroundTime: 'Based on scope',
    status: 'active',
    isPopular: false,
    warranty: '6 months',
    notes: 'Site survey required before quote',
    totalCompleted: 23,
    totalRevenue: 575000,
    lastPerformed: '2026-01-05',
    createdAt: '2025-01-01T00:00:00Z',
  },

  // SOFTWARE SERVICES
  {
    id: 'srv-015',
    name: 'Virus Removal',
    category: 'software',
    description: 'Complete virus, malware, and adware removal with system optimization.',
    basePrice: 1500,
    priceType: 'fixed',
    estimatedDuration: '2-4 hours',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: true,
    warranty: '1 month protection guarantee',
    totalCompleted: 445,
    totalRevenue: 667500,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-016',
    name: 'Software Installation Package',
    category: 'software',
    description: 'Installation of essential software: Office, Browsers, Media players, etc.',
    basePrice: 1000,
    priceType: 'fixed',
    estimatedDuration: '1-2 hours',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: false,
    totalCompleted: 312,
    totalRevenue: 312000,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },

  // CLEANING SERVICES
  {
    id: 'srv-017',
    name: 'Deep Cleaning - Laptop',
    category: 'cleaning',
    description: 'Comprehensive internal and external cleaning, dust removal, thermal paste.',
    basePrice: 2500,
    priceType: 'fixed',
    estimatedDuration: '2-3 hours',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: true,
    warranty: 'Workmanship guaranteed',
    totalCompleted: 567,
    totalRevenue: 1417500,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-018',
    name: 'Deep Cleaning - Desktop',
    category: 'cleaning',
    description: 'Full desktop PC cleaning including all components, fans, and filters.',
    basePrice: 2000,
    priceType: 'fixed',
    estimatedDuration: '1-2 hours',
    turnaroundTime: 'Same day',
    status: 'active',
    isPopular: false,
    totalCompleted: 234,
    totalRevenue: 468000,
    lastPerformed: '2026-01-13',
    createdAt: '2025-01-01T00:00:00Z',
  },

  // CONSULTATION SERVICES
  {
    id: 'srv-019',
    name: 'PC Build Consultation',
    category: 'consultation',
    description: 'Expert advice on custom PC builds based on budget and requirements.',
    basePrice: 0,
    priceType: 'fixed',
    estimatedDuration: '30-60 mins',
    turnaroundTime: 'Walk-in available',
    status: 'active',
    isPopular: true,
    notes: 'Free with any purchase, Rs. 500 otherwise',
    totalCompleted: 234,
    totalRevenue: 0,
    lastPerformed: '2026-01-14',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-020',
    name: 'Corporate IT Consultation',
    category: 'consultation',
    description: 'On-site IT infrastructure assessment and recommendations for businesses.',
    basePrice: 5000,
    hourlyRate: 3000,
    priceType: 'hourly',
    estimatedDuration: '2-4 hours',
    turnaroundTime: 'By appointment',
    status: 'active',
    isPopular: false,
    totalCompleted: 45,
    totalRevenue: 225000,
    lastPerformed: '2026-01-10',
    createdAt: '2025-04-01T00:00:00Z',
  },
];

// Generate Service ID
export const generateServiceId = () => `srv-${String(Date.now()).slice(-6)}`;

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

// ==========================================
// GRN (Goods Received Note) System
// ==========================================

// GRN Status types
export type GRNStatus = 'pending' | 'inspecting' | 'partial' | 'completed' | 'rejected';
export type GRNItemStatus = 'pending' | 'accepted' | 'rejected' | 'partial';

// GRN Item - Individual product in a GRN
export interface GRNItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitPrice: number; // Cost price (what we're paying)
  originalUnitPrice?: number; // Original price before discount
  discountType?: 'percentage' | 'fixed'; // Type of discount
  discountValue?: number; // Discount amount/percentage
  sellingPrice?: number; // Retail price we'll sell at
  totalAmount: number; // acceptedQuantity * unitPrice
  status: GRNItemStatus;
  rejectionReason?: string;
  qualityNotes?: string;
  batchNumber?: string;
  expiryDate?: string;
  serialNumbers?: string[]; // For serialized items
}

// Main GRN Interface
export interface GoodsReceivedNote {
  id: string;
  grnNumber: string; // GRN-2026-0001 format
  supplierId: string;
  supplierName: string;
  purchaseOrderId?: string; // Reference to PO if exists
  // Dates
  orderDate: string;
  expectedDeliveryDate: string;
  receivedDate: string;
  // Items
  items: GRNItem[];
  // Totals
  totalOrderedQuantity: number;
  totalReceivedQuantity: number;
  totalAcceptedQuantity: number;
  totalRejectedQuantity: number;
  subtotal: number; // Before discounts
  totalDiscount?: number; // Item-level discounts total (optional for backward compatibility)
  discountAmount: number; // Additional overall discount
  taxAmount: number;
  totalAmount: number; // Final amount to pay
  // Payment
  paymentMethod?: 'cash' | 'bank' | 'card' | 'credit' | 'cheque';
  paymentStatus?: 'paid' | 'unpaid' | 'partial';
  paidAmount?: number;
  // Status & Workflow
  status: GRNStatus;
  inspectedBy?: string;
  inspectionDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  // Receiving info
  receivedBy: string;
  deliveryNote?: string;
  vehicleNumber?: string;
  driverName?: string;
  // Payment linking
  linkedPurchaseId?: string;
  // Notes
  notes?: string;
  internalNotes?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
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

// Invoice Payment History - for tracking partial/credit payments
export interface InvoicePayment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string; // ISO date with time
  paymentMethod: 'cash' | 'card' | 'bank' | 'cheque';
  notes?: string;
  recordedBy?: string; // Staff who recorded the payment
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
  // Payment history tracking
  payments?: InvoicePayment[];
  lastPaymentDate?: string; // Last payment date
  // Credit linking fields
  creditContribution?: number; // How much of this invoice is on credit
  creditSettlements?: { paymentId: string; amount: number; date: string }[]; // Credit payments applied to this invoice
  warrantyCredits?: { warrantyClaimId: string; amount: number; date: string }[]; // Credits from warranty claims
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
  // Financial impact - Credit/Refund handling
  financialImpact?: {
    type: 'no_impact' | 'full_refund' | 'partial_refund' | 'credit_note' | 'free_replacement' | 'paid_replacement';
    originalItemValue: number;
    creditAmount?: number; // Amount credited to customer
    additionalCharges?: number; // If paid replacement with price difference
    creditTransactionId?: string; // Link to CreditTransaction
    processedDate?: string;
  };
  // Workflow tracking
  workflow?: {
    stage: 'received' | 'inspecting' | 'awaiting_parts' | 'repairing' | 'testing' | 'ready' | 'completed';
    history: { stage: string; date: string; notes?: string; updatedBy?: string }[];
    estimatedCompletionDate?: string;
    priorityLevel: 'normal' | 'high' | 'urgent';
  };
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
  { id: '1', name: 'AMD Ryzen 9 7950X', category: 'Processors', brand: 'AMD', price: 185000, sellingPrice: 185000, costPrice: 155000, profitMargin: 16.2, stock: 12, serialNumber: '70451234', barcode: '4938271650123', createdAt: '2026-01-01T08:00:00', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 8, totalPurchased: 25, totalSold: 13 },
  { id: '2', name: 'Intel Core i9-14900K', category: 'Processors', brand: 'Intel', price: 195000, sellingPrice: 195000, costPrice: 165000, profitMargin: 15.4, stock: 8, serialNumber: '70452345', barcode: '4938271650124', createdAt: '2026-01-02T09:30:00', warranty: '3 years', lowStockThreshold: 6, totalPurchased: 18, totalSold: 10 },
  { id: '3', name: 'NVIDIA GeForce RTX 4090', category: 'Graphics Cards', brand: 'NVIDIA', price: 620000, sellingPrice: 620000, costPrice: 520000, profitMargin: 16.1, stock: 5, serialNumber: '70453456', barcode: '4938271650125', createdAt: '2026-01-03T10:15:00', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 3, totalPurchased: 10, totalSold: 5 },
  { id: '4', name: 'NVIDIA GeForce RTX 4070 Ti', category: 'Graphics Cards', brand: 'NVIDIA', price: 280000, sellingPrice: 280000, costPrice: 235000, profitMargin: 16.1, stock: 15, serialNumber: '70454567', barcode: '4938271650126', createdAt: '2026-01-04T11:45:00', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=500&q=60', warranty: '3 years', totalPurchased: 30, totalSold: 15 },
  { id: '5', name: 'AMD Radeon RX 7900 XTX', category: 'Graphics Cards', brand: 'AMD', price: 350000, sellingPrice: 350000, costPrice: 295000, profitMargin: 15.7, stock: 7, serialNumber: '70455678', barcode: '4938271650127', createdAt: '2026-01-05T12:20:00', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=60', warranty: '2 years', lowStockThreshold: 5, totalPurchased: 15, totalSold: 8 },
  { id: '6', name: 'Samsung 990 Pro 2TB NVMe SSD', category: 'Storage', brand: 'Samsung', price: 75000, sellingPrice: 75000, costPrice: 62000, profitMargin: 17.3, stock: 30, serialNumber: '70456789', barcode: '4938271650128', createdAt: '2026-01-06T13:30:00', warranty: '5 years', totalPurchased: 60, totalSold: 30 },
  { id: '7', name: 'WD Black SN850X 1TB', category: 'Storage', brand: 'Western Digital', price: 42000, sellingPrice: 42000, costPrice: 34000, profitMargin: 19.0, stock: 45, serialNumber: '70457890', barcode: '4938271650129', createdAt: '2026-01-07T14:00:00', warranty: '5 years', totalPurchased: 80, totalSold: 35 },
  { id: '8', name: 'Corsair Vengeance DDR5 32GB (2x16GB)', category: 'Memory', brand: 'Corsair', price: 48000, sellingPrice: 48000, costPrice: 40000, profitMargin: 16.7, stock: 25, serialNumber: '70458901', barcode: '4938271650130', createdAt: '2026-01-08T15:15:00', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=60', warranty: 'Lifetime', totalPurchased: 50, totalSold: 25 },
  { id: '9', name: 'G.Skill Trident Z5 64GB DDR5', category: 'Memory', brand: 'G.Skill', price: 95000, sellingPrice: 95000, costPrice: 78000, profitMargin: 17.9, stock: 10, serialNumber: '70459012', barcode: '4938271650131', createdAt: '2026-01-09T16:45:00', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=60', warranty: 'Lifetime', totalPurchased: 20, totalSold: 10 },
  { id: '10', name: 'ASUS ROG Maximus Z790 Hero', category: 'Motherboards', brand: 'ASUS', price: 185000, sellingPrice: 185000, costPrice: 155000, profitMargin: 16.2, stock: 6, serialNumber: '70460123', barcode: '4938271650132', createdAt: '2026-01-10T17:00:00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 4, totalPurchased: 12, totalSold: 6 },
  { id: '11', name: 'MSI MEG Z790 ACE', category: 'Motherboards', brand: 'MSI', price: 165000, sellingPrice: 165000, costPrice: 138000, profitMargin: 16.4, stock: 8, serialNumber: '70461234', barcode: '4938271650133', createdAt: '2026-01-15T08:30:00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=60', warranty: '3 years', totalPurchased: 15, totalSold: 7 },
  { id: '12', name: 'Corsair RM1000x 1000W PSU', category: 'Power Supply', brand: 'Corsair', price: 55000, sellingPrice: 55000, costPrice: 45000, profitMargin: 18.2, stock: 20, serialNumber: '70462345', barcode: '4938271650134', createdAt: '2026-01-16T09:00:00', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=60', warranty: '10 years', totalPurchased: 35, totalSold: 15 },
  { id: '13', name: 'NZXT Kraken X73 RGB', category: 'Cooling', brand: 'NZXT', price: 75000, sellingPrice: 75000, costPrice: 62000, profitMargin: 17.3, stock: 18, serialNumber: '70463456', barcode: '4938271650135', createdAt: '2026-01-17T10:15:00', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=60', warranty: '6 years', totalPurchased: 30, totalSold: 12 },
  { id: '14', name: 'Lian Li O11 Dynamic EVO', category: 'Cases', brand: 'Lian Li', price: 58000, sellingPrice: 58000, costPrice: 48000, profitMargin: 17.2, stock: 12, serialNumber: '70464567', barcode: '4938271650136', createdAt: '2026-01-20T11:30:00', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=500&q=60', warranty: '2 years', totalPurchased: 22, totalSold: 10 },
  { id: '15', name: 'LG UltraGear 27GP950-B 4K Monitor', category: 'Monitors', brand: 'LG', price: 195000, sellingPrice: 195000, costPrice: 165000, profitMargin: 15.4, stock: 6, serialNumber: '70465678', barcode: '4938271650137', createdAt: '2026-01-22T12:45:00', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 4, totalPurchased: 14, totalSold: 8 },
  { id: '16', name: 'Samsung Odyssey G9 49" Monitor', category: 'Monitors', brand: 'Samsung', price: 380000, sellingPrice: 380000, costPrice: 320000, profitMargin: 15.8, stock: 3, serialNumber: '70466789', barcode: '4938271650138', createdAt: '2026-01-24T13:20:00', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 2, totalPurchased: 6, totalSold: 3 },
  { id: '17', name: 'Logitech G Pro X Superlight 2', category: 'Peripherals', brand: 'Logitech', price: 52000, sellingPrice: 52000, costPrice: 42000, profitMargin: 19.2, stock: 35, serialNumber: '70467890', barcode: '4938271650139', createdAt: '2026-01-25T14:00:00', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=60', warranty: '2 years', totalPurchased: 60, totalSold: 25 },
  { id: '18', name: 'Razer Huntsman V3 Pro', category: 'Peripherals', brand: 'Razer', price: 68000, sellingPrice: 68000, costPrice: 55000, profitMargin: 19.1, stock: 20, serialNumber: '70468901', barcode: '4938271650140', createdAt: '2026-01-27T15:00:00', warranty: '2 years', totalPurchased: 35, totalSold: 15 },
  { id: '19', name: 'SteelSeries Arctis Nova Pro', category: 'Peripherals', brand: 'SteelSeries', price: 95000, sellingPrice: 95000, costPrice: 78000, profitMargin: 17.9, stock: 15, serialNumber: '70469012', barcode: '4938271650141', createdAt: '2026-01-28T16:30:00', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=60', warranty: '1 year', totalPurchased: 28, totalSold: 13 },
  { id: '20', name: 'Seagate Exos 18TB HDD', category: 'Storage', brand: 'Seagate', price: 125000, sellingPrice: 125000, costPrice: 105000, profitMargin: 16.0, stock: 8, serialNumber: '70470123', barcode: '4938271650142', createdAt: '2026-01-31T17:15:00', warranty: '5 years', totalPurchased: 15, totalSold: 7 },
];

// Export the helper function for use in other files
export { generateSerialNumber };

// Customers with credit management - creditInvoices links to invoices contributing to credit
export const mockCustomers: Customer[] = [
  { id: '1', name: 'Kasun Perera', email: 'kasun@gmail.com', phone: '078-3233760', address: 'No. 12, Galle Road, Colombo', totalSpent: 580000, totalOrders: 5, lastPurchase: '2024-01-15', creditBalance: 0, creditLimit: 100000, creditStatus: 'clear', creditInvoices: [] },
  { id: '2', name: 'Nimali Fernando', email: 'nimali@email.com', phone: '078-3233760', address: '12A, Kandy Rd, Kurunegala', totalSpent: 320000, totalOrders: 3, lastPurchase: '2024-01-10', creditBalance: 148500, creditLimit: 200000, creditDueDate: '2026-01-20', creditStatus: 'active', creditInvoices: ['10250012'] }, // 103500 unpaid from invoice 10250012 + 45000 previous
  { id: '3', name: 'Tech Solutions Ltd', email: 'info@techsol.lk', phone: '078-3233760', address: 'No. 45, Industrial Estate, Colombo 15', totalSpent: 2500000, totalOrders: 18, lastPurchase: '2024-01-18', creditBalance: 488000, creditLimit: 1000000, creditDueDate: '2026-01-05', creditStatus: 'overdue', creditInvoices: ['10250010'] }, // remaining on 10250010 (1288000 - 800000)
  { id: '4', name: 'Dilshan Silva', email: 'dilshan.s@hotmail.com', phone: '078-3233760', address: '78/2, Hill Street, Kandy', totalSpent: 185000, totalOrders: 2, lastPurchase: '2024-01-05', creditBalance: 72500, creditLimit: 100000, creditDueDate: '2026-02-01', creditStatus: 'active', creditInvoices: ['10240006'] }, // 172500 - 100000 paid = 72500
  { id: '5', name: 'GameZone Café', email: 'contact@gamezone.lk', phone: '078-3233760', address: 'Shop 5, Arcade Mall, Colombo', totalSpent: 3200000, totalOrders: 25, lastPurchase: '2024-01-20', creditBalance: 1231250, creditLimit: 1500000, creditDueDate: '2026-02-15', creditStatus: 'active', creditInvoices: ['10240003'] }, // 2731250 - 1500000 paid = 1231250
  { id: '6', name: 'Priya Jayawardena', email: 'priya.j@yahoo.com', phone: '078-3233760', address: 'No. 7, Lake Road, Galle', totalSpent: 95000, totalOrders: 1, lastPurchase: '2024-01-12', creditBalance: 0, creditLimit: 50000, creditStatus: 'clear', creditInvoices: [] },
  { id: '7', name: 'Creative Studios', email: 'studio@creative.lk', phone: '078-3233760', address: 'Studio 3, Art Lane, Colombo', totalSpent: 1850000, totalOrders: 12, lastPurchase: '2024-01-16', creditBalance: 1322500, creditLimit: 1500000, creditDueDate: '2026-01-25', creditStatus: 'active', creditInvoices: ['10240005'] }, // Full invoice unpaid
  { id: '8', name: 'Sanjay Mendis', email: 'sanjay.m@gmail.com', phone: '078-3233760', address: 'No. 21, Thotalanga Road, Colombo', totalSpent: 420000, totalOrders: 4, lastPurchase: '2024-01-08', creditBalance: 0, creditLimit: 100000, creditStatus: 'clear', creditInvoices: [] },
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

// ==========================================
// Mock GRN Data
// ==========================================
export const mockGRNs: GoodsReceivedNote[] = [
  {
    id: 'grn-001',
    grnNumber: 'GRN-2026-0001',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    orderDate: '2026-01-05',
    expectedDeliveryDate: '2026-01-08',
    receivedDate: '2026-01-08',
    items: [
      {
        id: 'grn-item-001',
        productId: '1',
        productName: 'AMD Ryzen 9 7950X',
        category: 'Processors',
        orderedQuantity: 10,
        receivedQuantity: 10,
        acceptedQuantity: 10,
        rejectedQuantity: 0,
        originalUnitPrice: 170000,
        unitPrice: 165000,
        discountType: 'fixed',
        discountValue: 5000,
        totalAmount: 1650000,
        status: 'accepted',
        batchNumber: 'BATCH-AMD-2026-001',
      },
      {
        id: 'grn-item-002',
        productId: '8',
        productName: 'Corsair Vengeance DDR5 32GB',
        category: 'Memory',
        orderedQuantity: 20,
        receivedQuantity: 18,
        acceptedQuantity: 18,
        rejectedQuantity: 0,
        originalUnitPrice: 45000,
        unitPrice: 42000,
        discountType: 'percentage',
        discountValue: 6.67,
        totalAmount: 756000,
        status: 'partial',
        qualityNotes: '2 units short delivery - supplier will send next week',
      }
    ],
    totalOrderedQuantity: 30,
    totalReceivedQuantity: 28,
    totalAcceptedQuantity: 28,
    totalRejectedQuantity: 0,
    subtotal: 2460000,
    totalDiscount: 104000,
    discountAmount: 50000,
    taxAmount: 0,
    totalAmount: 2356000,
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    paidAmount: 2356000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2026-01-08',
    approvedBy: 'Manager',
    approvalDate: '2026-01-08',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-TZ-2026-0045',
    vehicleNumber: 'WP CAB-1234',
    driverName: 'Sunil Fernando',
    linkedPurchaseId: 'sp-001',
    notes: 'Bulk order received in good condition',
    createdAt: '2026-01-08T09:30:00',
    updatedAt: '2026-01-08T14:45:00',
  },
  {
    id: 'grn-002',
    grnNumber: 'GRN-2026-0002',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    orderDate: '2026-01-10',
    expectedDeliveryDate: '2026-01-12',
    receivedDate: '2026-01-12',
    items: [
      {
        id: 'grn-item-003',
        productId: '3',
        productName: 'NVIDIA GeForce RTX 4090',
        category: 'Graphics Cards',
        orderedQuantity: 5,
        receivedQuantity: 5,
        acceptedQuantity: 4,
        rejectedQuantity: 1,
        unitPrice: 550000,
        totalAmount: 2200000,
        status: 'partial',
        rejectionReason: 'Box damage - one unit has visible dent',
        qualityNotes: 'Rejected unit returned to supplier for replacement',
        serialNumbers: ['RTX4090-SN001', 'RTX4090-SN002', 'RTX4090-SN003', 'RTX4090-SN004'],
      }
    ],
    totalOrderedQuantity: 5,
    totalReceivedQuantity: 5,
    totalAcceptedQuantity: 4,
    totalRejectedQuantity: 1,
    subtotal: 2200000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 2200000,
    paymentMethod: 'credit',
    paymentStatus: 'unpaid',
    paidAmount: 0,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2026-01-12',
    approvedBy: 'Manager',
    approvalDate: '2026-01-12',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-PPL-2026-0112',
    notes: '1 unit rejected due to damage, replacement expected',
    createdAt: '2026-01-12T10:15:00',
    updatedAt: '2026-01-12T16:30:00',
  },
  {
    id: 'grn-003',
    grnNumber: 'GRN-2026-0003',
    supplierId: '3',
    supplierName: 'Digital Hub Pvt Ltd',
    orderDate: '2026-01-13',
    expectedDeliveryDate: '2026-01-14',
    receivedDate: '',
    items: [
      {
        id: 'grn-item-004',
        productId: '5',
        productName: 'Samsung 980 PRO 2TB NVMe SSD',
        category: 'Storage',
        orderedQuantity: 15,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: 65000,
        totalAmount: 0,
        status: 'pending',
      },
      {
        id: 'grn-item-005',
        productId: '12',
        productName: 'Corsair RM1000x 1000W PSU',
        category: 'Power Supply',
        orderedQuantity: 10,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: 48000,
        totalAmount: 0,
        status: 'pending',
      }
    ],
    totalOrderedQuantity: 25,
    totalReceivedQuantity: 0,
    totalAcceptedQuantity: 0,
    totalRejectedQuantity: 0,
    subtotal: 1455000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 1455000,
    status: 'pending',
    receivedBy: '',
    notes: 'Awaiting delivery - expected today',
    createdAt: '2026-01-13T11:00:00',
    updatedAt: '2026-01-13T11:00:00',
  },
  {
    id: 'grn-004',
    grnNumber: 'GRN-2026-0004',
    supplierId: '4',
    supplierName: 'Memory World',
    orderDate: '2026-01-11',
    expectedDeliveryDate: '2026-01-13',
    receivedDate: '2026-01-13',
    items: [
      {
        id: 'grn-item-006',
        productId: '6',
        productName: 'G.Skill Trident Z5 RGB 64GB DDR5',
        category: 'Memory',
        orderedQuantity: 12,
        receivedQuantity: 12,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: 85000,
        totalAmount: 0,
        status: 'pending',
        batchNumber: 'GSKILL-2026-B045',
      }
    ],
    totalOrderedQuantity: 12,
    totalReceivedQuantity: 12,
    totalAcceptedQuantity: 0,
    totalRejectedQuantity: 0,
    subtotal: 1020000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 1020000,
    status: 'inspecting',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-MW-2026-0089',
    vehicleNumber: 'WP KA-5678',
    notes: 'Quality inspection in progress',
    createdAt: '2026-01-13T14:00:00',
    updatedAt: '2026-01-14T09:00:00',
  },
  {
    id: 'grn-005',
    grnNumber: 'GRN-2026-0005',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    orderDate: '2025-12-28',
    expectedDeliveryDate: '2025-12-30',
    receivedDate: '2025-12-30',
    items: [
      {
        id: 'grn-item-007',
        productId: '2',
        productName: 'Intel Core i9-14900K',
        category: 'Processors',
        orderedQuantity: 8,
        receivedQuantity: 8,
        acceptedQuantity: 8,
        rejectedQuantity: 0,
        originalUnitPrice: 190000,
        unitPrice: 185000,
        discountType: 'fixed',
        discountValue: 5000,
        totalAmount: 1480000,
        status: 'accepted',
        batchNumber: 'INTEL-2025-B089',
      }
    ],
    totalOrderedQuantity: 8,
    totalReceivedQuantity: 8,
    totalAcceptedQuantity: 8,
    totalRejectedQuantity: 0,
    subtotal: 1520000,
    totalDiscount: 70000,
    discountAmount: 30000,
    taxAmount: 0,
    totalAmount: 1450000,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    paidAmount: 1450000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-12-30',
    approvedBy: 'Manager',
    approvalDate: '2025-12-30',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-TZ-2025-0298',
    vehicleNumber: 'WP CAB-1234',
    notes: 'Year-end stock replenishment',
    createdAt: '2025-12-30T10:00:00',
    updatedAt: '2025-12-30T15:30:00',
  },
  {
    id: 'grn-006',
    grnNumber: 'GRN-2026-0006',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    orderDate: '2026-01-02',
    expectedDeliveryDate: '2026-01-04',
    receivedDate: '2026-01-04',
    items: [
      {
        id: 'grn-item-008',
        productId: '4',
        productName: 'AMD Radeon RX 7900 XTX',
        category: 'Graphics Cards',
        orderedQuantity: 6,
        receivedQuantity: 6,
        acceptedQuantity: 6,
        rejectedQuantity: 0,
        unitPrice: 385000,
        totalAmount: 2310000,
        status: 'accepted',
        serialNumbers: ['RX7900-SN001', 'RX7900-SN002', 'RX7900-SN003', 'RX7900-SN004', 'RX7900-SN005', 'RX7900-SN006'],
      }
    ],
    totalOrderedQuantity: 6,
    totalReceivedQuantity: 6,
    totalAcceptedQuantity: 6,
    totalRejectedQuantity: 0,
    subtotal: 2310000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 2310000,
    paymentMethod: 'cheque',
    paymentStatus: 'partial',
    paidAmount: 1500000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2026-01-04',
    approvedBy: 'Manager',
    approvalDate: '2026-01-04',
    receivedBy: 'Sunil Fernando',
    deliveryNote: 'DN-PPL-2026-0015',
    vehicleNumber: 'WP KS-9876',
    notes: 'GPU stock received in perfect condition',
    createdAt: '2026-01-04T09:00:00',
    updatedAt: '2026-01-04T14:00:00',
  },
  {
    id: 'grn-007',
    grnNumber: 'GRN-2026-0007',
    supplierId: '3',
    supplierName: 'Digital Hub Pvt Ltd',
    orderDate: '2026-01-07',
    expectedDeliveryDate: '2026-01-09',
    receivedDate: '2026-01-09',
    items: [
      {
        id: 'grn-item-009',
        productId: '7',
        productName: 'ASUS ROG Strix Z790-E Gaming',
        category: 'Motherboards',
        orderedQuantity: 10,
        receivedQuantity: 10,
        acceptedQuantity: 9,
        rejectedQuantity: 1,
        originalUnitPrice: 130000,
        unitPrice: 125000,
        discountType: 'percentage',
        discountValue: 3.85,
        totalAmount: 1125000,
        status: 'partial',
        rejectionReason: 'One unit has bent CPU socket pins',
      },
      {
        id: 'grn-item-010',
        productId: '9',
        productName: 'MSI MEG Z790 ACE',
        category: 'Motherboards',
        orderedQuantity: 5,
        receivedQuantity: 5,
        acceptedQuantity: 5,
        rejectedQuantity: 0,
        originalUnitPrice: 180000,
        unitPrice: 175000,
        discountType: 'fixed',
        discountValue: 5000,
        totalAmount: 875000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 15,
    totalReceivedQuantity: 15,
    totalAcceptedQuantity: 14,
    totalRejectedQuantity: 1,
    subtotal: 2070000,
    totalDiscount: 120000,
    discountAmount: 50000,
    taxAmount: 0,
    totalAmount: 1950000,
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    paidAmount: 1950000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2026-01-09',
    approvedBy: 'Manager',
    approvalDate: '2026-01-09',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-DH-2026-0078',
    vehicleNumber: 'WP CAD-4567',
    notes: 'Motherboard bulk order - 1 unit rejected',
    createdAt: '2026-01-09T11:00:00',
    updatedAt: '2026-01-09T16:00:00',
  },
  {
    id: 'grn-008',
    grnNumber: 'GRN-2026-0008',
    supplierId: '4',
    supplierName: 'Memory World',
    orderDate: '2026-01-06',
    expectedDeliveryDate: '2026-01-08',
    receivedDate: '2026-01-08',
    items: [
      {
        id: 'grn-item-011',
        productId: '10',
        productName: 'Kingston Fury Beast 32GB DDR5',
        category: 'Memory',
        orderedQuantity: 20,
        receivedQuantity: 20,
        acceptedQuantity: 20,
        rejectedQuantity: 0,
        originalUnitPrice: 40000,
        unitPrice: 38000,
        discountType: 'percentage',
        discountValue: 5,
        totalAmount: 760000,
        status: 'accepted',
        batchNumber: 'KFB-2026-001',
      }
    ],
    totalOrderedQuantity: 20,
    totalReceivedQuantity: 20,
    totalAcceptedQuantity: 20,
    totalRejectedQuantity: 0,
    subtotal: 800000,
    totalDiscount: 60000,
    discountAmount: 20000,
    taxAmount: 0,
    totalAmount: 740000,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    paidAmount: 740000,
    status: 'completed',
    inspectedBy: 'Sunil Fernando',
    inspectionDate: '2026-01-08',
    approvedBy: 'Manager',
    approvalDate: '2026-01-08',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-MW-2026-0056',
    vehicleNumber: 'WP KH-2345',
    notes: 'Memory modules - all passed quality check',
    createdAt: '2026-01-08T10:30:00',
    updatedAt: '2026-01-08T14:30:00',
  },
  {
    id: 'grn-009',
    grnNumber: 'GRN-2026-0009',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    orderDate: '2026-01-10',
    expectedDeliveryDate: '2026-01-12',
    receivedDate: '',
    items: [
      {
        id: 'grn-item-012',
        productId: '11',
        productName: 'Seagate Barracuda 4TB HDD',
        category: 'Storage',
        orderedQuantity: 30,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: 28000,
        totalAmount: 0,
        status: 'pending',
      },
      {
        id: 'grn-item-013',
        productId: '5',
        productName: 'Samsung 980 PRO 2TB NVMe SSD',
        category: 'Storage',
        orderedQuantity: 25,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: 65000,
        totalAmount: 0,
        status: 'pending',
      }
    ],
    totalOrderedQuantity: 55,
    totalReceivedQuantity: 0,
    totalAcceptedQuantity: 0,
    totalRejectedQuantity: 0,
    subtotal: 2465000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 2465000,
    status: 'pending',
    receivedBy: '',
    notes: 'Storage bulk order - awaiting shipment',
    createdAt: '2026-01-10T09:00:00',
    updatedAt: '2026-01-10T09:00:00',
  },
  {
    id: 'grn-010',
    grnNumber: 'GRN-2026-0010',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    orderDate: '2026-01-09',
    expectedDeliveryDate: '2026-01-11',
    receivedDate: '2026-01-11',
    items: [
      {
        id: 'grn-item-014',
        productId: '13',
        productName: 'NZXT Kraken X73 RGB AIO',
        category: 'Cooling',
        orderedQuantity: 15,
        receivedQuantity: 15,
        acceptedQuantity: 15,
        rejectedQuantity: 0,
        originalUnitPrice: 70000,
        unitPrice: 68000,
        discountType: 'fixed',
        discountValue: 2000,
        totalAmount: 1020000,
        status: 'accepted',
      },
      {
        id: 'grn-item-015',
        productId: '14',
        productName: 'Corsair iCUE H150i Elite LCD',
        category: 'Cooling',
        orderedQuantity: 8,
        receivedQuantity: 8,
        acceptedQuantity: 8,
        rejectedQuantity: 0,
        originalUnitPrice: 90000,
        unitPrice: 85000,
        discountType: 'percentage',
        discountValue: 5.56,
        totalAmount: 680000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 23,
    totalReceivedQuantity: 23,
    totalAcceptedQuantity: 23,
    totalRejectedQuantity: 0,
    subtotal: 1770000,
    totalDiscount: 110000,
    discountAmount: 40000,
    taxAmount: 0,
    totalAmount: 1660000,
    paymentMethod: 'credit',
    paymentStatus: 'partial',
    paidAmount: 1000000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2026-01-11',
    approvedBy: 'Manager',
    approvalDate: '2026-01-11',
    receivedBy: 'Sunil Fernando',
    deliveryNote: 'DN-PPL-2026-0098',
    vehicleNumber: 'WP KS-9876',
    notes: 'AIO coolers order - all units verified',
    createdAt: '2026-01-11T10:00:00',
    updatedAt: '2026-01-11T15:00:00',
  },
  {
    id: 'grn-011',
    grnNumber: 'GRN-2026-0011',
    supplierId: '3',
    supplierName: 'Digital Hub Pvt Ltd',
    orderDate: '2026-01-12',
    expectedDeliveryDate: '2026-01-14',
    receivedDate: '2026-01-14',
    items: [
      {
        id: 'grn-item-016',
        productId: '15',
        productName: 'Lian Li O11 Dynamic EVO',
        category: 'Cases',
        orderedQuantity: 10,
        receivedQuantity: 10,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: 55000,
        totalAmount: 0,
        status: 'pending',
      }
    ],
    totalOrderedQuantity: 10,
    totalReceivedQuantity: 10,
    totalAcceptedQuantity: 0,
    totalRejectedQuantity: 0,
    subtotal: 550000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 550000,
    status: 'inspecting',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-DH-2026-0102',
    vehicleNumber: 'WP CAD-4567',
    notes: 'PC cases - inspection in progress',
    createdAt: '2026-01-14T08:00:00',
    updatedAt: '2026-01-14T10:00:00',
  },
  {
    id: 'grn-012',
    grnNumber: 'GRN-2026-0012',
    supplierId: '4',
    supplierName: 'Memory World',
    orderDate: '2025-12-20',
    expectedDeliveryDate: '2025-12-22',
    receivedDate: '2025-12-22',
    items: [
      {
        id: 'grn-item-017',
        productId: '8',
        productName: 'Corsair Vengeance DDR5 32GB',
        category: 'Memory',
        orderedQuantity: 30,
        receivedQuantity: 30,
        acceptedQuantity: 28,
        rejectedQuantity: 2,
        unitPrice: 42000,
        totalAmount: 1176000,
        status: 'partial',
        rejectionReason: '2 units failed memory test',
        batchNumber: 'CORS-2025-B456',
      }
    ],
    totalOrderedQuantity: 30,
    totalReceivedQuantity: 30,
    totalAcceptedQuantity: 28,
    totalRejectedQuantity: 2,
    subtotal: 1176000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 1176000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-12-22',
    approvedBy: 'Manager',
    approvalDate: '2025-12-22',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-MW-2025-0289',
    vehicleNumber: 'WP KH-2345',
    notes: 'December RAM order - 2 units failed QC',
    createdAt: '2025-12-22T09:00:00',
    updatedAt: '2025-12-22T16:00:00',
  },
  {
    id: 'grn-013',
    grnNumber: 'GRN-2026-0013',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    orderDate: '2026-01-08',
    expectedDeliveryDate: '2026-01-10',
    receivedDate: '2026-01-10',
    items: [
      {
        id: 'grn-item-018',
        productId: '16',
        productName: 'Logitech G Pro X Superlight',
        category: 'Peripherals',
        orderedQuantity: 25,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 25,
        unitPrice: 42000,
        totalAmount: 0,
        status: 'rejected',
        rejectionReason: 'Wrong model received - returned to supplier',
      }
    ],
    totalOrderedQuantity: 25,
    totalReceivedQuantity: 25,
    totalAcceptedQuantity: 0,
    totalRejectedQuantity: 25,
    subtotal: 1050000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    status: 'rejected',
    inspectedBy: 'Sunil Fernando',
    inspectionDate: '2026-01-10',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-TZ-2026-0067',
    vehicleNumber: 'WP CAB-1234',
    notes: 'Entire order rejected - wrong product sent',
    createdAt: '2026-01-10T14:00:00',
    updatedAt: '2026-01-10T16:00:00',
  },
  {
    id: 'grn-014',
    grnNumber: 'GRN-2026-0014',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    orderDate: '2026-01-13',
    expectedDeliveryDate: '2026-01-15',
    receivedDate: '',
    items: [
      {
        id: 'grn-item-019',
        productId: '17',
        productName: 'EVGA SuperNOVA 1000 G6',
        category: 'Power Supply',
        orderedQuantity: 12,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: 52000,
        totalAmount: 0,
        status: 'pending',
      },
      {
        id: 'grn-item-020',
        productId: '18',
        productName: 'Seasonic Focus GX-850',
        category: 'Power Supply',
        orderedQuantity: 15,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: 38000,
        totalAmount: 0,
        status: 'pending',
      }
    ],
    totalOrderedQuantity: 27,
    totalReceivedQuantity: 0,
    totalAcceptedQuantity: 0,
    totalRejectedQuantity: 0,
    subtotal: 1194000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 1194000,
    status: 'pending',
    receivedBy: '',
    notes: 'PSU order - expected tomorrow',
    createdAt: '2026-01-13T16:00:00',
    updatedAt: '2026-01-13T16:00:00',
  },
  {
    id: 'grn-015',
    grnNumber: 'GRN-2026-0015',
    supplierId: '3',
    supplierName: 'Digital Hub Pvt Ltd',
    orderDate: '2025-12-15',
    expectedDeliveryDate: '2025-12-17',
    receivedDate: '2025-12-17',
    items: [
      {
        id: 'grn-item-021',
        productId: '3',
        productName: 'NVIDIA GeForce RTX 4090',
        category: 'Graphics Cards',
        orderedQuantity: 3,
        receivedQuantity: 3,
        acceptedQuantity: 3,
        rejectedQuantity: 0,
        originalUnitPrice: 570000,
        unitPrice: 550000,
        discountType: 'fixed',
        discountValue: 20000,
        totalAmount: 1650000,
        status: 'accepted',
        serialNumbers: ['RTX4090-DH-001', 'RTX4090-DH-002', 'RTX4090-DH-003'],
      }
    ],
    totalOrderedQuantity: 3,
    totalReceivedQuantity: 3,
    totalAcceptedQuantity: 3,
    totalRejectedQuantity: 0,
    subtotal: 1710000,
    totalDiscount: 110000,
    discountAmount: 50000,
    taxAmount: 0,
    totalAmount: 1600000,
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    paidAmount: 1600000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-12-17',
    approvedBy: 'Manager',
    approvalDate: '2025-12-17',
    receivedBy: 'Sunil Fernando',
    deliveryNote: 'DN-DH-2025-0256',
    vehicleNumber: 'WP CAD-4567',
    notes: 'December GPU order - premium models',
    createdAt: '2025-12-17T11:00:00',
    updatedAt: '2025-12-17T15:00:00',
  },
  {
    id: 'grn-016',
    grnNumber: 'GRN-2025-0016',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    orderDate: '2025-12-10',
    expectedDeliveryDate: '2025-12-12',
    receivedDate: '2025-12-12',
    items: [
      {
        id: 'grn-item-022',
        productId: '1',
        productName: 'AMD Ryzen 9 7950X',
        category: 'Processors',
        orderedQuantity: 15,
        receivedQuantity: 15,
        acceptedQuantity: 15,
        rejectedQuantity: 0,
        originalUnitPrice: 170000,
        unitPrice: 165000,
        discountType: 'percentage',
        discountValue: 2.94,
        totalAmount: 2475000,
        status: 'accepted',
        batchNumber: 'AMD-2025-B078',
      }
    ],
    totalOrderedQuantity: 15,
    totalReceivedQuantity: 15,
    totalAcceptedQuantity: 15,
    totalRejectedQuantity: 0,
    subtotal: 2550000,
    totalDiscount: 150000,
    discountAmount: 75000,
    taxAmount: 0,
    totalAmount: 2400000,
    paymentMethod: 'cheque',
    paymentStatus: 'paid',
    paidAmount: 2400000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-12-12',
    approvedBy: 'Manager',
    approvalDate: '2025-12-12',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-TZ-2025-0234',
    vehicleNumber: 'WP CAB-1234',
    notes: 'Year-end processor stock',
    createdAt: '2025-12-12T09:00:00',
    updatedAt: '2025-12-12T14:00:00',
  },
  {
    id: 'grn-017',
    grnNumber: 'GRN-2025-0017',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    orderDate: '2025-12-05',
    expectedDeliveryDate: '2025-12-07',
    receivedDate: '2025-12-07',
    items: [
      {
        id: 'grn-item-023',
        productId: '4',
        productName: 'NVIDIA GeForce RTX 4070 Ti',
        category: 'Graphics Cards',
        orderedQuantity: 8,
        receivedQuantity: 8,
        acceptedQuantity: 7,
        rejectedQuantity: 1,
        unitPrice: 280000,
        totalAmount: 1960000,
        status: 'partial',
        rejectionReason: 'One unit has faulty fan',
      }
    ],
    totalOrderedQuantity: 8,
    totalReceivedQuantity: 8,
    totalAcceptedQuantity: 7,
    totalRejectedQuantity: 1,
    subtotal: 1960000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 1960000,
    paymentMethod: 'credit',
    paymentStatus: 'unpaid',
    paidAmount: 0,
    status: 'completed',
    inspectedBy: 'Sunil Fernando',
    inspectionDate: '2025-12-07',
    approvedBy: 'Manager',
    approvalDate: '2025-12-07',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-PPL-2025-0198',
    vehicleNumber: 'WP KS-9876',
    notes: 'GPU mid-range order',
    createdAt: '2025-12-07T10:00:00',
    updatedAt: '2025-12-07T15:00:00',
  },
  {
    id: 'grn-018',
    grnNumber: 'GRN-2025-0018',
    supplierId: '3',
    supplierName: 'Digital Hub Pvt Ltd',
    orderDate: '2025-11-28',
    expectedDeliveryDate: '2025-11-30',
    receivedDate: '2025-11-30',
    items: [
      {
        id: 'grn-item-024',
        productId: '6',
        productName: 'Samsung 990 Pro 2TB NVMe SSD',
        category: 'Storage',
        orderedQuantity: 25,
        receivedQuantity: 25,
        acceptedQuantity: 25,
        rejectedQuantity: 0,
        originalUnitPrice: 78000,
        unitPrice: 75000,
        discountType: 'fixed',
        discountValue: 3000,
        totalAmount: 1875000,
        status: 'accepted',
        batchNumber: 'SAM-990-2025',
      },
      {
        id: 'grn-item-025',
        productId: '7',
        productName: 'WD Black SN850X 1TB',
        category: 'Storage',
        orderedQuantity: 30,
        receivedQuantity: 30,
        acceptedQuantity: 30,
        rejectedQuantity: 0,
        originalUnitPrice: 45000,
        unitPrice: 42000,
        discountType: 'percentage',
        discountValue: 6.67,
        totalAmount: 1260000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 55,
    totalReceivedQuantity: 55,
    totalAcceptedQuantity: 55,
    totalRejectedQuantity: 0,
    subtotal: 3300000,
    totalDiscount: 300000,
    discountAmount: 135000,
    taxAmount: 0,
    totalAmount: 3000000,
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    paidAmount: 3000000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-11-30',
    approvedBy: 'Manager',
    approvalDate: '2025-11-30',
    receivedBy: 'Sunil Fernando',
    deliveryNote: 'DN-DH-2025-0189',
    vehicleNumber: 'WP CAD-4567',
    notes: 'November SSD bulk order',
    createdAt: '2025-11-30T08:30:00',
    updatedAt: '2025-11-30T14:00:00',
  },
  {
    id: 'grn-019',
    grnNumber: 'GRN-2025-0019',
    supplierId: '4',
    supplierName: 'Memory World',
    orderDate: '2025-11-20',
    expectedDeliveryDate: '2025-11-22',
    receivedDate: '2025-11-22',
    items: [
      {
        id: 'grn-item-026',
        productId: '9',
        productName: 'G.Skill Trident Z5 64GB DDR5',
        category: 'Memory',
        orderedQuantity: 10,
        receivedQuantity: 10,
        acceptedQuantity: 10,
        rejectedQuantity: 0,
        originalUnitPrice: 100000,
        unitPrice: 95000,
        discountType: 'percentage',
        discountValue: 5,
        totalAmount: 950000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 10,
    totalReceivedQuantity: 10,
    totalAcceptedQuantity: 10,
    totalRejectedQuantity: 0,
    subtotal: 1000000,
    totalDiscount: 100000,
    discountAmount: 50000,
    taxAmount: 0,
    totalAmount: 900000,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    paidAmount: 900000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-11-22',
    approvedBy: 'Manager',
    approvalDate: '2025-11-22',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-MW-2025-0167',
    vehicleNumber: 'WP KH-2345',
    notes: 'High-end memory order',
    createdAt: '2025-11-22T09:00:00',
    updatedAt: '2025-11-22T13:00:00',
  },
  {
    id: 'grn-020',
    grnNumber: 'GRN-2025-0020',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    orderDate: '2025-11-15',
    expectedDeliveryDate: '2025-11-17',
    receivedDate: '2025-11-17',
    items: [
      {
        id: 'grn-item-027',
        productId: '10',
        productName: 'ASUS ROG Maximus Z790 Hero',
        category: 'Motherboards',
        orderedQuantity: 5,
        receivedQuantity: 5,
        acceptedQuantity: 5,
        rejectedQuantity: 0,
        originalUnitPrice: 195000,
        unitPrice: 185000,
        discountType: 'fixed',
        discountValue: 10000,
        totalAmount: 925000,
        status: 'accepted',
      },
      {
        id: 'grn-item-028',
        productId: '11',
        productName: 'MSI MEG Z790 ACE',
        category: 'Motherboards',
        orderedQuantity: 6,
        receivedQuantity: 6,
        acceptedQuantity: 6,
        rejectedQuantity: 0,
        originalUnitPrice: 175000,
        unitPrice: 165000,
        discountType: 'percentage',
        discountValue: 5.71,
        totalAmount: 990000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 11,
    totalReceivedQuantity: 11,
    totalAcceptedQuantity: 11,
    totalRejectedQuantity: 0,
    subtotal: 2025000,
    totalDiscount: 175000,
    discountAmount: 65000,
    taxAmount: 0,
    totalAmount: 1850000,
    paymentMethod: 'cheque',
    paymentStatus: 'partial',
    paidAmount: 1200000,
    status: 'completed',
    inspectedBy: 'Sunil Fernando',
    inspectionDate: '2025-11-17',
    approvedBy: 'Manager',
    approvalDate: '2025-11-17',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-TZ-2025-0145',
    vehicleNumber: 'WP CAB-1234',
    notes: 'Premium motherboard stock',
    createdAt: '2025-11-17T10:00:00',
    updatedAt: '2025-11-17T15:00:00',
  },
  {
    id: 'grn-021',
    grnNumber: 'GRN-2025-0021',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    orderDate: '2025-11-10',
    expectedDeliveryDate: '2025-11-12',
    receivedDate: '2025-11-12',
    items: [
      {
        id: 'grn-item-029',
        productId: '12',
        productName: 'Corsair RM1000x 1000W PSU',
        category: 'Power Supply',
        orderedQuantity: 15,
        receivedQuantity: 15,
        acceptedQuantity: 15,
        rejectedQuantity: 0,
        originalUnitPrice: 58000,
        unitPrice: 55000,
        discountType: 'fixed',
        discountValue: 3000,
        totalAmount: 825000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 15,
    totalReceivedQuantity: 15,
    totalAcceptedQuantity: 15,
    totalRejectedQuantity: 0,
    subtotal: 870000,
    totalDiscount: 70000,
    discountAmount: 25000,
    taxAmount: 0,
    totalAmount: 800000,
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    paidAmount: 800000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-11-12',
    approvedBy: 'Manager',
    approvalDate: '2025-11-12',
    receivedBy: 'Sunil Fernando',
    deliveryNote: 'DN-PPL-2025-0134',
    vehicleNumber: 'WP KS-9876',
    notes: 'PSU stock replenishment',
    createdAt: '2025-11-12T11:00:00',
    updatedAt: '2025-11-12T16:00:00',
  },
  {
    id: 'grn-022',
    grnNumber: 'GRN-2025-0022',
    supplierId: '3',
    supplierName: 'Digital Hub Pvt Ltd',
    orderDate: '2025-11-05',
    expectedDeliveryDate: '2025-11-07',
    receivedDate: '2025-11-07',
    items: [
      {
        id: 'grn-item-030',
        productId: '15',
        productName: 'LG UltraGear 27GP950-B 4K Monitor',
        category: 'Monitors',
        orderedQuantity: 8,
        receivedQuantity: 8,
        acceptedQuantity: 8,
        rejectedQuantity: 0,
        originalUnitPrice: 205000,
        unitPrice: 195000,
        discountType: 'percentage',
        discountValue: 4.88,
        totalAmount: 1560000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 8,
    totalReceivedQuantity: 8,
    totalAcceptedQuantity: 8,
    totalRejectedQuantity: 0,
    subtotal: 1640000,
    totalDiscount: 140000,
    discountAmount: 60000,
    taxAmount: 0,
    totalAmount: 1500000,
    paymentMethod: 'credit',
    paymentStatus: 'partial',
    paidAmount: 1000000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-11-07',
    approvedBy: 'Manager',
    approvalDate: '2025-11-07',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-DH-2025-0112',
    vehicleNumber: 'WP CAD-4567',
    notes: '4K gaming monitors',
    createdAt: '2025-11-07T09:30:00',
    updatedAt: '2025-11-07T14:30:00',
  },
  {
    id: 'grn-023',
    grnNumber: 'GRN-2025-0023',
    supplierId: '4',
    supplierName: 'Memory World',
    orderDate: '2025-10-28',
    expectedDeliveryDate: '2025-10-30',
    receivedDate: '2025-10-30',
    items: [
      {
        id: 'grn-item-031',
        productId: '8',
        productName: 'Corsair Vengeance DDR5 32GB (2x16GB)',
        category: 'Memory',
        orderedQuantity: 40,
        receivedQuantity: 40,
        acceptedQuantity: 38,
        rejectedQuantity: 2,
        originalUnitPrice: 50000,
        unitPrice: 48000,
        discountType: 'fixed',
        discountValue: 2000,
        totalAmount: 1824000,
        status: 'partial',
        rejectionReason: '2 kits failed XMP profile test',
        batchNumber: 'CORS-VEN-2025',
      }
    ],
    totalOrderedQuantity: 40,
    totalReceivedQuantity: 40,
    totalAcceptedQuantity: 38,
    totalRejectedQuantity: 2,
    subtotal: 1900000,
    totalDiscount: 100000,
    discountAmount: 24000,
    taxAmount: 0,
    totalAmount: 1800000,
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    paidAmount: 1800000,
    status: 'completed',
    inspectedBy: 'Sunil Fernando',
    inspectionDate: '2025-10-30',
    approvedBy: 'Manager',
    approvalDate: '2025-10-30',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-MW-2025-0098',
    vehicleNumber: 'WP KH-2345',
    notes: 'October DDR5 bulk order',
    createdAt: '2025-10-30T08:00:00',
    updatedAt: '2025-10-30T15:00:00',
  },
  {
    id: 'grn-024',
    grnNumber: 'GRN-2025-0024',
    supplierId: '1',
    supplierName: 'TechZone Distributors',
    orderDate: '2025-10-20',
    expectedDeliveryDate: '2025-10-22',
    receivedDate: '2025-10-22',
    items: [
      {
        id: 'grn-item-032',
        productId: '2',
        productName: 'Intel Core i9-14900K',
        category: 'Processors',
        orderedQuantity: 10,
        receivedQuantity: 10,
        acceptedQuantity: 10,
        rejectedQuantity: 0,
        originalUnitPrice: 200000,
        unitPrice: 195000,
        discountType: 'percentage',
        discountValue: 2.5,
        totalAmount: 1950000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 10,
    totalReceivedQuantity: 10,
    totalAcceptedQuantity: 10,
    totalRejectedQuantity: 0,
    subtotal: 2000000,
    totalDiscount: 100000,
    discountAmount: 50000,
    taxAmount: 0,
    totalAmount: 1900000,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    paidAmount: 1900000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-10-22',
    approvedBy: 'Manager',
    approvalDate: '2025-10-22',
    receivedBy: 'Sunil Fernando',
    deliveryNote: 'DN-TZ-2025-0089',
    vehicleNumber: 'WP CAB-1234',
    notes: 'Intel 14th gen stock',
    createdAt: '2025-10-22T10:00:00',
    updatedAt: '2025-10-22T14:00:00',
  },
  {
    id: 'grn-025',
    grnNumber: 'GRN-2025-0025',
    supplierId: '2',
    supplierName: 'PC Parts Lanka',
    orderDate: '2025-10-15',
    expectedDeliveryDate: '2025-10-17',
    receivedDate: '2025-10-17',
    items: [
      {
        id: 'grn-item-033',
        productId: '5',
        productName: 'AMD Radeon RX 7900 XTX',
        category: 'Graphics Cards',
        orderedQuantity: 5,
        receivedQuantity: 5,
        acceptedQuantity: 5,
        rejectedQuantity: 0,
        originalUnitPrice: 360000,
        unitPrice: 350000,
        discountType: 'fixed',
        discountValue: 10000,
        totalAmount: 1750000,
        status: 'accepted',
      }
    ],
    totalOrderedQuantity: 5,
    totalReceivedQuantity: 5,
    totalAcceptedQuantity: 5,
    totalRejectedQuantity: 0,
    subtotal: 1800000,
    totalDiscount: 100000,
    discountAmount: 50000,
    taxAmount: 0,
    totalAmount: 1700000,
    paymentMethod: 'cheque',
    paymentStatus: 'paid',
    paidAmount: 1700000,
    status: 'completed',
    inspectedBy: 'Kamal Perera',
    inspectionDate: '2025-10-17',
    approvedBy: 'Manager',
    approvalDate: '2025-10-17',
    receivedBy: 'Nimal Silva',
    deliveryNote: 'DN-PPL-2025-0076',
    vehicleNumber: 'WP KS-9876',
    notes: 'AMD flagship GPU order',
    createdAt: '2025-10-17T09:00:00',
    updatedAt: '2025-10-17T14:00:00',
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
    // Payment history for tracking partial payments
    payments: [
      { id: 'invpay-001', invoiceId: '10240003', amount: 500000, paymentDate: '2024-01-20T10:30:00', paymentMethod: 'cash', notes: 'Initial deposit payment' },
      { id: 'invpay-002', invoiceId: '10240003', amount: 500000, paymentDate: '2024-01-25T14:15:00', paymentMethod: 'bank', notes: 'Second installment' },
      { id: 'invpay-003', invoiceId: '10240003', amount: 500000, paymentDate: '2024-01-30T11:00:00', paymentMethod: 'card', notes: 'Third payment via credit card' },
    ],
    lastPaymentDate: '2024-01-30T11:00:00'
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
    // Payment history tracking
    payments: [
      { id: 'invpay-004', invoiceId: '10240006', amount: 50000, paymentDate: '2024-01-05T09:00:00', paymentMethod: 'cash', notes: 'Down payment at purchase' },
      { id: 'invpay-005', invoiceId: '10240006', amount: 50000, paymentDate: '2024-01-12T15:30:00', paymentMethod: 'bank', notes: 'Bank transfer installment' },
    ],
    lastPaymentDate: '2024-01-12T15:30:00'
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
    financialImpact: {
      type: 'free_replacement',
      originalItemValue: 96000,
      creditAmount: 0, // No credit - direct replacement
      processedDate: '2025-11-22T11:00:00'
    },
    workflow: {
      stage: 'completed',
      history: [
        { stage: 'received', date: '2025-11-20T14:00:00', notes: 'Claim received at store', updatedBy: 'Chamara Fernando' },
        { stage: 'inspecting', date: '2025-11-20T15:30:00', notes: 'Running memtest86', updatedBy: 'Chamara Fernando' },
        { stage: 'ready', date: '2025-11-22T10:00:00', notes: 'Replacement kit prepared', updatedBy: 'Chamara Fernando' },
        { stage: 'completed', date: '2025-11-22T11:00:00', notes: 'Delivered to customer', updatedBy: 'Chamara Fernando' }
      ],
      estimatedCompletionDate: '2025-11-22',
      priorityLevel: 'high'
    }
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
    workflow: {
      stage: 'inspecting',
      history: [
        { stage: 'received', date: '2025-12-01T09:45:00', notes: 'Customer brought headset with original box', updatedBy: 'Nuwan Silva' },
        { stage: 'inspecting', date: '2025-12-01T11:00:00', notes: 'Testing audio channels and connections', updatedBy: 'Nuwan Silva' }
      ],
      estimatedCompletionDate: '2025-12-05',
      priorityLevel: 'urgent'
    }
  },
];

// =====================================================
// Credit Transaction History - Tracks all credit movements
// =====================================================
export const mockCreditTransactions: CreditTransaction[] = [
  // GameZone Café payments on invoice 10240003
  {
    id: 'CT-001',
    customerId: '5',
    invoiceId: '10240003',
    type: 'invoice_payment',
    amount: 500000,
    balanceBefore: 2731250,
    balanceAfter: 2231250,
    transactionDate: '2024-01-20T10:30:00',
    paymentMethod: 'cash',
    notes: 'Initial deposit payment',
    recordedBy: 'Admin'
  },
  {
    id: 'CT-002',
    customerId: '5',
    invoiceId: '10240003',
    type: 'invoice_payment',
    amount: 500000,
    balanceBefore: 2231250,
    balanceAfter: 1731250,
    transactionDate: '2024-01-25T14:15:00',
    paymentMethod: 'bank',
    notes: 'Second installment',
    recordedBy: 'Admin'
  },
  {
    id: 'CT-003',
    customerId: '5',
    invoiceId: '10240003',
    type: 'invoice_payment',
    amount: 500000,
    balanceBefore: 1731250,
    balanceAfter: 1231250,
    transactionDate: '2024-01-30T11:00:00',
    paymentMethod: 'card',
    notes: 'Third payment via credit card',
    recordedBy: 'Admin'
  },
  // Dilshan Silva payment on invoice 10240006
  {
    id: 'CT-004',
    customerId: '4',
    invoiceId: '10240006',
    type: 'invoice_payment',
    amount: 50000,
    balanceBefore: 172500,
    balanceAfter: 122500,
    transactionDate: '2024-01-05T09:00:00',
    paymentMethod: 'cash',
    notes: 'Down payment at purchase',
    recordedBy: 'Admin'
  },
  {
    id: 'CT-005',
    customerId: '4',
    invoiceId: '10240006',
    type: 'invoice_payment',
    amount: 50000,
    balanceBefore: 122500,
    balanceAfter: 72500,
    transactionDate: '2024-01-12T15:30:00',
    paymentMethod: 'bank',
    notes: 'Bank transfer installment',
    recordedBy: 'Admin'
  },
  // Tech Solutions Ltd partial payment
  {
    id: 'CT-006',
    customerId: '3',
    invoiceId: '10250010',
    type: 'invoice_payment',
    amount: 800000,
    balanceBefore: 1288000,
    balanceAfter: 488000,
    transactionDate: '2025-04-25T10:00:00',
    paymentMethod: 'bank',
    notes: 'Partial payment on high-value order',
    recordedBy: 'Admin'
  },
];

// =====================================================
// Warranty Credits - Credits applied from warranty claims
// =====================================================
export const mockWarrantyCredits: WarrantyCredit[] = [
  {
    id: 'WC-001',
    warrantyClaimId: '25010004', // Rejected claim but offered discount
    customerId: '2',
    invoiceId: '10240004',
    originalAmount: 52000,
    creditAmount: 5000, // Goodwill gesture for repair
    reason: 'repair_credit',
    processedDate: '2025-07-10T14:00:00',
    notes: 'Goodwill credit offered for repair service despite rejected claim'
  }
];

// =====================================================
// HELPER FUNCTIONS FOR CREDIT-INVOICE MANAGEMENT
// =====================================================

/**
 * Calculate customer credit balance from linked invoices
 * This ensures consistency between invoice balances and customer credit
 */
export const calculateCustomerCreditFromInvoices = (customerId: string, invoices: Invoice[]): number => {
  const customerInvoices = invoices.filter(inv => inv.customerId === customerId);
  return customerInvoices.reduce((total, inv) => {
    const remaining = inv.total - (inv.paidAmount || 0);
    return total + (remaining > 0 ? remaining : 0);
  }, 0);
};

/**
 * Get all unpaid/partially paid invoices for a customer
 */
export const getCustomerCreditInvoices = (customerId: string, invoices: Invoice[]): Invoice[] => {
  return invoices.filter(inv => 
    inv.customerId === customerId && 
    inv.status !== 'fullpaid' &&
    (inv.total - (inv.paidAmount || 0)) > 0
  );
};

/**
 * Apply payment to invoices - Distributes payment across unpaid invoices
 * Returns updated invoices and payment distribution
 */
export const applyPaymentToInvoices = (
  customerId: string,
  paymentAmount: number,
  invoices: Invoice[],
  paymentMethod: 'cash' | 'bank' | 'card' | 'cheque',
  notes?: string
): { 
  updatedInvoices: Invoice[]; 
  distribution: { invoiceId: string; amount: number }[];
  remainingPayment: number;
} => {
  const creditInvoices = getCustomerCreditInvoices(customerId, invoices)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Pay oldest first
  
  let remaining = paymentAmount;
  const distribution: { invoiceId: string; amount: number }[] = [];
  const updatedInvoices = [...invoices];
  
  for (const invoice of creditInvoices) {
    if (remaining <= 0) break;
    
    const invoiceBalance = invoice.total - (invoice.paidAmount || 0);
    const paymentForThis = Math.min(remaining, invoiceBalance);
    
    if (paymentForThis > 0) {
      distribution.push({ invoiceId: invoice.id, amount: paymentForThis });
      remaining -= paymentForThis;
      
      // Update the invoice in our array
      const idx = updatedInvoices.findIndex(i => i.id === invoice.id);
      if (idx >= 0) {
        const newPaidAmount = (updatedInvoices[idx].paidAmount || 0) + paymentForThis;
        const newStatus = newPaidAmount >= updatedInvoices[idx].total ? 'fullpaid' : 'halfpay';
        
        updatedInvoices[idx] = {
          ...updatedInvoices[idx],
          paidAmount: newPaidAmount,
          status: newStatus,
          lastPaymentDate: new Date().toISOString(),
          payments: [
            ...(updatedInvoices[idx].payments || []),
            {
              id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              invoiceId: invoice.id,
              amount: paymentForThis,
              paymentDate: new Date().toISOString(),
              paymentMethod,
              notes
            }
          ],
          creditSettlements: [
            ...(updatedInvoices[idx].creditSettlements || []),
            {
              paymentId: `pay-${Date.now()}`,
              amount: paymentForThis,
              date: new Date().toISOString()
            }
          ]
        };
      }
    }
  }
  
  return { updatedInvoices, distribution, remainingPayment: remaining };
};

/**
 * Apply invoice payment to customer credit
 * When invoice payment is made, reduce customer credit balance
 */
export const applyInvoicePaymentToCustomerCredit = (
  customer: Customer,
  invoiceId: string,
  paymentAmount: number,
  paymentMethod: 'cash' | 'bank' | 'card' | 'cheque',
  notes?: string
): Customer => {
  const newCreditBalance = Math.max(0, customer.creditBalance - paymentAmount);
  const newStatus: 'clear' | 'active' | 'overdue' = newCreditBalance === 0 ? 'clear' : customer.creditStatus;
  
  const paymentEntry: CustomerPayment = {
    id: `CP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    invoiceId,
    amount: paymentAmount,
    paymentDate: new Date().toISOString(),
    paymentMethod,
    notes,
    source: 'invoice',
    appliedToInvoices: [{ invoiceId, amount: paymentAmount }]
  };
  
  return {
    ...customer,
    creditBalance: newCreditBalance,
    creditStatus: newStatus,
    paymentHistory: [...(customer.paymentHistory || []), paymentEntry],
    // Remove invoice from creditInvoices if fully paid
    creditInvoices: customer.creditInvoices?.filter(id => id !== invoiceId) || []
  };
};

/**
 * Apply warranty credit to customer and invoice
 * Reduces credit balance when warranty claim results in credit
 */
export const applyWarrantyCreditToCustomer = (
  customer: Customer,
  invoice: Invoice,
  warrantyClaim: WarrantyClaim,
  creditAmount: number
): { updatedCustomer: Customer; updatedInvoice: Invoice; warrantyCredit: WarrantyCredit } => {
  const warrantyCredit: WarrantyCredit = {
    id: `WC-${Date.now()}`,
    warrantyClaimId: warrantyClaim.id,
    customerId: customer.id,
    invoiceId: invoice.id,
    originalAmount: warrantyClaim.financialImpact?.originalItemValue || 0,
    creditAmount,
    reason: warrantyClaim.financialImpact?.type === 'full_refund' ? 'full_refund' : 'partial_refund',
    processedDate: new Date().toISOString(),
    notes: `Credit from warranty claim ${warrantyClaim.id}`
  };
  
  const updatedCustomer: Customer = {
    ...customer,
    creditBalance: Math.max(0, customer.creditBalance - creditAmount),
    creditStatus: customer.creditBalance - creditAmount <= 0 ? 'clear' : customer.creditStatus
  };
  
  const updatedInvoice: Invoice = {
    ...invoice,
    warrantyCredits: [
      ...(invoice.warrantyCredits || []),
      {
        warrantyClaimId: warrantyClaim.id,
        amount: creditAmount,
        date: new Date().toISOString()
      }
    ]
  };
  
  return { updatedCustomer, updatedInvoice, warrantyCredit };
};

/**
 * Get credit summary for a customer
 */
export const getCustomerCreditSummary = (customerId: string, invoices: Invoice[], transactions: CreditTransaction[]) => {
  const customerInvoices = invoices.filter(inv => inv.customerId === customerId);
  const customerTransactions = transactions.filter(t => t.customerId === customerId);
  
  const totalCreditUsed = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = customerInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const currentBalance = totalCreditUsed - totalPaid;
  
  const unpaidInvoices = customerInvoices.filter(inv => inv.status !== 'fullpaid');
  const overdueInvoices = unpaidInvoices.filter(inv => new Date(inv.dueDate) < new Date());
  
  return {
    totalCreditUsed,
    totalPaid,
    currentBalance,
    unpaidInvoiceCount: unpaidInvoices.length,
    overdueInvoiceCount: overdueInvoices.length,
    totalTransactions: customerTransactions.length,
    lastTransaction: customerTransactions.sort((a, b) => 
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    )[0] || null
  };
};

/**
 * Update customer credit status based on due dates
 */
export const updateCustomerCreditStatus = (customer: Customer, invoices: Invoice[]): Customer => {
  const creditInvoices = getCustomerCreditInvoices(customer.id, invoices);
  
  if (creditInvoices.length === 0) {
    return { ...customer, creditStatus: 'clear', creditBalance: 0 };
  }
  
  const hasOverdue = creditInvoices.some(inv => new Date(inv.dueDate) < new Date());
  const totalBalance = creditInvoices.reduce((sum, inv) => sum + (inv.total - (inv.paidAmount || 0)), 0);
  
  // Get earliest due date from unpaid invoices
  const earliestDueDate = creditInvoices
    .map(inv => inv.dueDate)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
  
  return {
    ...customer,
    creditBalance: totalBalance,
    creditStatus: hasOverdue ? 'overdue' : 'active',
    creditDueDate: earliestDueDate,
    creditInvoices: creditInvoices.map(inv => inv.id)
  };
};

/**
 * Get warranty workflow stage info
 */
export const getWarrantyWorkflowStageInfo = (stage: string): { label: string; color: string; icon: string } => {
  const stageInfo: Record<string, { label: string; color: string; icon: string }> = {
    'received': { label: 'Received', color: 'blue', icon: '📥' },
    'inspecting': { label: 'Inspecting', color: 'yellow', icon: '🔍' },
    'awaiting_parts': { label: 'Awaiting Parts', color: 'orange', icon: '📦' },
    'repairing': { label: 'Repairing', color: 'purple', icon: '🔧' },
    'testing': { label: 'Testing', color: 'cyan', icon: '🧪' },
    'ready': { label: 'Ready for Pickup', color: 'green', icon: '✅' },
    'completed': { label: 'Completed', color: 'emerald', icon: '🎉' }
  };
  return stageInfo[stage] || { label: stage, color: 'gray', icon: '❓' };
};

/**
 * Calculate financial impact options for warranty claim
 */
export const calculateWarrantyFinancialOptions = (
  warrantyClaim: WarrantyClaim,
  invoice: Invoice
): { type: string; amount: number; description: string }[] => {
  const invoiceItem = invoice.items[warrantyClaim.invoiceItemIndex || 0];
  const itemValue = invoiceItem?.total || 0;
  const invoiceBalance = invoice.total - (invoice.paidAmount || 0);
  
  const options = [
    { type: 'no_impact', amount: 0, description: 'No financial adjustment' },
    { type: 'full_refund', amount: itemValue, description: `Full refund: Rs. ${itemValue.toLocaleString()}` },
    { type: 'credit_note', amount: itemValue, description: `Credit note for future purchase: Rs. ${itemValue.toLocaleString()}` },
    { type: 'free_replacement', amount: 0, description: 'Free replacement (no credit adjustment)' },
  ];
  
  // Only show options up to invoice balance
  if (invoiceBalance > 0) {
    options.push({
      type: 'partial_refund',
      amount: Math.min(itemValue, invoiceBalance),
      description: `Apply to outstanding balance: Rs. ${Math.min(itemValue, invoiceBalance).toLocaleString()}`
    });
  }
  
  return options;
};
